<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Banner;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\PriceDetail;
use App\Models\Product;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // $firstBranch = Branch::first();
        // $defaultParams = [
        //         'useByDate'     => Carbon::now()->addDays(2)->format('d-m-Y'),
        //         'duration'      => 1,
        //         'city'          => $firstBranch ? $firstBranch->id : null,
        //         'shippingType'  => 'Next day',
        // ];

        // if (!$request->has(array_keys($defaultParams))) {
        //     return redirect()->route('home.index', $defaultParams)->with('showModal', true);
        // }

        // $filter = $request->only(array_keys($defaultParams));

        // $products = $this->getProductsByFilters($filter);
        // $banners = Banner::where('is_active', true)->get();
        // $appSetting = AppSetting::first();
        // $branchs = Branch::all();
        
        // $showModal = session('showModal', false);

        // return Inertia::render('front-end/home-page', compact('branchs', 'products', 'banners', 'appSetting', 'showModal', 'filter'));

        $firstBranch = Branch::first();
        $defaultParams = [
            'useByDate'    => Carbon::now()->addDays(2)->format('d-m-Y'),
            'duration'     => 1,
            'city'         => $firstBranch ? $firstBranch->id : null,
            'shippingType' => 'Next day',
        ];

        if (!$request->has(array_keys($defaultParams))) {
            return redirect()
                ->route('home.index', $defaultParams)
                ->with('showModal', true);
        }

        $baseFilters = $request->only(array_keys($defaultParams));
        // $extraFilters = $request->input('filters', []);
        $extraFilters = $request->only([
            'sortBy',
            'direction',
            'minPrice',
            'maxPrice',
            'brand',
            'size',
            'color',
            'type',
            'search'
        ]);

        $products = $this->getProductsByFilters($baseFilters, $extraFilters);
        $banners = Banner::where('is_active', true)->get();
        $appSetting = AppSetting::first();
        $branchs = Branch::all();
        $showModal = session('showModal', false);
        $brands = Brand::all();
        $colors = Color::all();
        $types = Type::all();

        return Inertia::render('front-end/home-page', 
            compact('branchs', 'products', 'banners', 'appSetting', 'showModal', 'baseFilters', 'brands', 'colors', 'types')
        );
    }

    private function getProductsByFilters(array $filters, array $extraFilters = [])
    {
        // $params = $this->constructPrams($filters);

        // $startDate = $params['startDate'];
        // $endDate = $params['endDate'];

        // $query =   Product::query()
        //     ->when($filters['city'], fn($q) => $q->where('branch_id', $filters['city']))
        //     ->whereRaw("
        //         NOT EXISTS (
        //             SELECT 1
        //             FROM order_items oi
        //             JOIN orders o ON o.id = oi.order_id
        //             WHERE oi.product_id = products.id
        //             AND o.status IN ('process','shipped')
        //             AND (
        //                 (oi.estimated_delivery_date BETWEEN ? AND ?)
        //                 OR (oi.estimated_return_date   BETWEEN ? AND ?)
        //                 OR (oi.estimated_delivery_date <= ? AND oi.estimated_return_date >= ?)
        //             )
        //         )
        //     ", [$startDate, $endDate, $startDate, $endDate, $startDate, $endDate])
        //     ->with([
        //         'brand',
        //         'types',
        //         'priceDetail',
        //         'sizes',
        //     ])
        //     ->orderByDesc('upload_at');

        //     $products = $query->paginate(4);

        //     return [
        //         'data' => $products->items(),
        //         'meta' => [
        //             'current_page' => $products->currentPage(),
        //             'last_page'    => $products->lastPage(),
        //             'per_page'     => $products->perPage(),
        //             'total'        => $products->total(),
        //         ],
        //     ];

        $params = $this->constructPrams($filters);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $query = Product::query()
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
            ->with(['brand', 'types', 'priceDetail', 'sizes']);

        //  Apply extra filters
        if (!empty($extraFilters['search'])) {
            $search = $extraFilters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('brand', function ($qb) use ($search) {
                        $qb->where('name', 'like', '%' . $search . '%');
                    });
            });
        }
        if (!empty($extraFilters['brand'])) {
            $query->where('brand_id', $extraFilters['brand']);
        }
        // todo: cek lebih lanjut
        if (!empty($extraFilters['size'])) {
            $query->whereHas('sizes', fn($q) => $q->where('sizes.id', $extraFilters['size']));
        }
        if (!empty($extraFilters['color'])) {
            $query->where('color_id', $extraFilters['color']);
        }
        if (!empty($extraFilters['minPrice']) || !empty($extraFilters['maxPrice'])) {
            $query->whereHas('priceDetail', function ($q) use ($extraFilters) {
                if (!empty($extraFilters['minPrice'])) {
                    $q->where('price_after_discount', '>=', $extraFilters['minPrice']);
                }
                if (!empty($extraFilters['maxPrice'])) {
                    $q->where('price_after_discount', '<=', $extraFilters['maxPrice']);
                }
            });
        }
        // tambah filter by type & 1 pcs ++
       // Sorting (masih masalah)
        if (!empty($extraFilters['sortBy'])) {
            $direction = $extraFilters['direction'] ?? 'asc';
            switch ($extraFilters['sortBy']) {
                case 'price_after_discount':
                    $query->orderBy(
                        PriceDetail::select('price_after_discount')
                            ->whereColumn('price_details.product_id', 'products.id'),
                        $direction
                    );
                    break;

                case 'name':
                    $query->orderBy('products.name', $direction);
                    break;

                case 'upload_at':
                    $query->orderBy('products.upload_at', $direction);
                    break;

                default:
                    $query->orderByDesc('products.upload_at'); // fallback
                    break;
            }
        } else {
            $query->orderByDesc('products.upload_at'); // default
        }

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
        // $startDate = !empty($filters['useByDate'])
        //     ? Carbon::createFromFormat('d-m-Y', $filters['useByDate'])
        //     : null;

        // if ($startDate && !empty($filters['shippingType'])) {
        //     $deliveryDate = $filters['shippingType'] === 'Next day' ? $startDate->copy()->subDays(2) : $startDate->copy()->subDay();
        //     $startDate = $deliveryDate;
        // }

        // if ($startDate && $startDate->lessThan(Carbon::today())) {
        //     $startDate = Carbon::today();
        // }

        // $endDate = $startDate && !empty($filters['duration'])
        //     ? $startDate->copy()->addDays((int) $filters['duration'])
        //     : null;

        // return [
        //     'startDate' => $startDate,
        //     'endDate' => $endDate
        // ];

        $startDate = !empty($filters['useByDate'])
            ? Carbon::createFromFormat('d-m-Y', $filters['useByDate'])
            : null;

        if ($startDate && !empty($filters['shippingType'])) {
            $deliveryDate = $filters['shippingType'] === 'Next day'
                ? $startDate->copy()->subDays(2)
                : $startDate->copy()->subDay();
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
            'endDate'   => $endDate,
        ];
    }
}