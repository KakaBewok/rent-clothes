<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Banner;
use App\Models\Branch;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $firstBranch = Branch::first();
        $defaultParams = [
                'useByDate'     => Carbon::now()->addDays(2)->format('d-m-Y'),
                'duration'      => 1,
                'city'          => $firstBranch ? $firstBranch->id : null,
                'shippingType'  => 'Next day',
        ];

        if (!$request->has(array_keys($defaultParams))) {
            return redirect()->route('home.index', $defaultParams)->with('showModal', true);
        }

        $filter = $request->only(array_keys($defaultParams));

        $products = $this->getProductsByFilters($filter);
        $banners = Banner::where('is_active', true)->get();
        $appSetting = AppSetting::first();
        $branchs = Branch::all();
        
        $showModal = session('showModal', false);

        return Inertia::render('front-end/home-page', compact('branchs', 'products', 'banners', 'appSetting', 'showModal', 'filter'));
    }

    private function getProductsByFilters(array $filters)
    {
        $params = $this->constructPrams($filters);

        $startDate = $params['startDate'];
        $endDate = $params['endDate'];

        $query =   Product::query()
            ->when($filters['city'], fn($q) => $q->where('branch_id', $filters['city']))
            ->whereRaw("
                NOT EXISTS (
                    SELECT 1
                    FROM order_items oi
                    JOIN orders o ON o.id = oi.order_id
                    WHERE oi.product_id = products.id
                    AND o.status IN ('process','shipped')
                    AND (
                        (oi.estimated_delivery_date BETWEEN ? AND ?)
                        OR (oi.estimated_return_date   BETWEEN ? AND ?)
                        OR (oi.estimated_delivery_date <= ? AND oi.estimated_return_date >= ?)
                    )
                )
            ", [$startDate, $endDate, $startDate, $endDate, $startDate, $endDate])
            ->with([
                'brand',
                'types',
                'priceDetail',
                'sizes',
            ])
            ->orderByDesc('upload_at');

            $products = $query->paginate(4);

            return [
                'data' => $products->items(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page'    => $products->lastPage(),
                    'per_page'     => $products->perPage(),
                    'total'        => $products->total(),
                ],
            ];
    }

    private function constructPrams(array $filters){
        $startDate = !empty($filters['useByDate'])
            ? Carbon::createFromFormat('d-m-Y', $filters['useByDate'])
            : null;

        if ($startDate && !empty($filters['shippingType'])) {
            $deliveryDate = $filters['shippingType'] === 'Next day' ? $startDate->copy()->subDays(2) : $startDate->copy()->subDay();
            $startDate = $deliveryDate;
        }

        if ($startDate && $startDate->lessThan(Carbon::today())) {
            $startDate = Carbon::today();
        }

        $endDate = $startDate && !empty($filters['duration'])
            ? $startDate->copy()->addDays((int) $filters['duration'])
            : null;

        return [
            'startDate' => $startDate,
            'endDate' => $endDate
        ];
    }
}