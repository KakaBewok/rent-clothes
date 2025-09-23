<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Banner;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // if (!$request->has('useByDate')) {
        //     return redirect()->route('home.index', [
        //         'useByDate'     => Carbon::now()->format('d-m-Y'),
        //         'duration'      => 1,
        //         'city'          => '1',
        //         'shippingType'  => 'next-day',
        //     ]);
        // }

        // $filters = $request->only(['useByDate', 'duration', 'city', 'shippingType']);

        // $data = $this->getProductsByFilters($filters);

        // $isModalScheduleOpen = $request->hasAny(['useByDate', 'duration', 'city', 'shippingType']);

        // return Inertia::render('front-end/home-page', compact('data', 'filters', 'isModalScheduleOpen'));

        $products = Product::with(['brand', 'types', 'color', 'branch', 'priceDetail', 'sizes'])->get();
        $banners = Banner::where('is_active', true)->get();
        $appSetting = AppSetting::first();

        return Inertia::render('front-end/home-page', compact('products', 'banners', 'appSetting'));
    }

    private function getProductsByFilters(array $filters)
    {
        $startDate = !empty($filters['useByDate'])
            ? Carbon::createFromFormat('d-m-Y', $filters['useByDate'])
            : null;

        if ($startDate && !empty($filters['shippingType'])) {
            if ($filters['shippingType'] === 'nextday') {
                $startDate = $startDate->copy()->subDay();
            }
        }

        $endDate = $startDate && !empty($filters['duration'])
            ? $startDate->copy()->addDays((int) $filters['duration'])
            : null;

        return Product::query()
            ->when(
                $filters['city'] ?? null,
                fn($q, $city) => $q->where('city_id', $city)
            )
            ->when($startDate && $endDate, function ($q) use ($startDate, $endDate) {
                $q->whereDoesntHave('orderItems', function ($sub) use ($startDate, $endDate) {
                    $sub->whereHas('order', function ($order) {
                        $order->whereIn('status', ['approved', 'shipping']);
                    })
                        ->where(function ($cond) use ($startDate, $endDate) {
                            $cond->whereBetween('use_by_date', [$startDate, $endDate])
                                ->orWhereBetween('estimated_return_date', [$startDate, $endDate])
                                ->orWhere(function ($wrap) use ($startDate, $endDate) {
                                    $wrap->where('use_by_date', '<=', $startDate)
                                        ->where('estimated_return_date', '>=', $endDate);
                                });
                        });
                });
            })
            ->with(['brand', 'type', 'color', 'branch', 'priceDetail'])
            ->get();
    }
}
