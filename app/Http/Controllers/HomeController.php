<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Banner;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Product;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
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
        $extraFilters = $request->only([
            'sortBy',
            'direction',
            'minPrice',
            'maxPrice',
            'brand',
            'size',
            'color',
            'type',
            'search',
        ]); // 'stock'

        $products = $this->getProductsByFilters($baseFilters, $extraFilters, $request->boolean('available'));
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

    private function getProductsByFilters(array $filters, array $extraFilters = [], $isAvailable)
    {
        $params = $this->constructPrams($filters);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $query = Product::query()
            ->when($filters['city'], fn($q) => $q->where('branch_id', $filters['city']))
            ->whereRaw('
                (
                    COALESCE((
                        SELECT SUM(sz.quantity)
                        FROM sizes sz
                        WHERE sz.product_id = products.id
                    ), 0)
                    -
                    COALESCE((
                        SELECT COUNT(*)
                        FROM order_items oi
                        JOIN orders o ON o.id = oi.order_id
                        WHERE oi.product_id = products.id
                        AND o.status IN (?, ?)
                        AND (
                            DATE(oi.estimated_delivery_date) <= DATE(?) AND
                            DATE(oi.estimated_return_date) >= DATE(?)
                        )
                    ), 0)
                ) > 0
            ', ['process', 'shipped', $endDate, $startDate])
            ->with(['brand', 'types', 'priceDetail', 'sizes']);

        $this->getExtraFilters($query, $extraFilters, $isAvailable);

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

    private function getExtraFilters($query, array $extraFilters = [], $isAvailable)
    {
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
        if (!empty($extraFilters['color'])) {
            $colors = is_array($extraFilters['color'])
                ? $extraFilters['color']
                : explode(',', $extraFilters['color']);

            $query->whereIn('color_id', $colors);
        }
        if (!empty($extraFilters['type'])) {
            $types = is_array($extraFilters['type'])
                ? $extraFilters['type']
                : explode(',', $extraFilters['type']);

            $query->whereHas('types', function ($q) use ($types) {
                $q->whereIn('types.id', $types);
            });
        }
        if (!empty($extraFilters['size'])) {
            $query->whereHas('sizes', function ($q) use ($extraFilters) {
                $q->where('sizes.size', $extraFilters['size']);
            });
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
        if ($isAvailable) {
            $query->whereHas('sizes', function ($q) {
                $q->where('availability', true);
            });
        }
        // sorting
        if (!empty($extraFilters['sortBy'])) {
            $direction = $extraFilters['direction'] ?? 'asc';
            switch ($extraFilters['sortBy']) {
                case 'price_after_discount':
                    $query->reorder()->join('price_details', 'products.id', '=', 'price_details.product_id')
                      ->select('products.*')
                      ->orderBy('price_details.price_after_discount', $direction);
                    break;
                case 'name':
                    $query->reorder()->orderBy('products.name', $direction);
                    break;
                case 'stock':
                    $targetStock = (int) $direction;
                    $query->reorder()
                        ->withSum(['sizes as available_stock_sum_quantity' => function ($q) {
                            $q->where('availability', true);
                        }], 'quantity')
                        ->orderByRaw('CASE WHEN available_stock_sum_quantity = ? THEN 0 ELSE 1 END ASC', [$targetStock])
                        ->orderByDesc('products.upload_at');
                    break;
                default:
                    $query->reorder()->orderByDesc('products.upload_at'); // fallback
                    break;
            }
        } else {
            $query->reorder()->orderByDesc('products.upload_at'); // default
        }
    }

    private function constructPrams(array $filters){
        $useByDate = !empty($filters['useByDate'])
            ? Carbon::createFromFormat('d-m-Y', $filters['useByDate'])
            : null;

        $startDate = $useByDate;

        if ($useByDate && !empty($filters['shippingType'])) {
            $deliveryDate = $filters['shippingType'] === 'Next day'
                ? $useByDate->copy()->subDays(2)
                : $useByDate->copy()->subDay();
            $startDate = $deliveryDate;
        }

        if ($startDate && $startDate->lessThan(Carbon::today())) {
            $startDate = Carbon::today();
        }

        $endDate = $useByDate && !empty($filters['duration'])
            ? $useByDate->copy()->addDays((int) $filters['duration'])
            : null;

        return [
            'startDate' => $startDate?->format('Y-m-d'),
            'endDate'   => $endDate?->format('Y-m-d'),
        ];
    }
}

//old basic query
        // $query = Product::query()
        //     ->when($filters['city'], fn($q) => $q->where('branch_id', $filters['city']))
        //     ->whereRaw("
        //         NOT EXISTS (
        //             SELECT 1
        //             FROM order_items oi
        //             JOIN orders o ON o.id = oi.order_id
        //             WHERE oi.product_id = products.id
        //             AND o.status IN ('process','shipped')
        //             AND (
        //                 DATE(oi.estimated_delivery_date) <= DATE(?)
        //                 AND DATE(oi.estimated_return_date) >= DATE(?)
        //             )
        //         )
        //     ", [$endDate, $startDate])
        //     ->with(['brand', 'types', 'priceDetail', 'sizes']);

// blocking
// if (!empty($extraFilters['stock'])) {
//             $exactStock = $extraFilters['stock'];

//             $query->withSum(['sizes as available_sizes_sum_quantity' => function ($q) {
//                 $q->where('availability', true);
//             }], 'quantity')

//             ->having('available_sizes_sum_quantity', '=', $exactStock);
//         }

// old sort
// if (!empty($extraFilters['sortBy'])) {
//             $direction = $extraFilters['direction'] ?? 'asc';
//             switch ($extraFilters['sortBy']) {
//                 case 'price_after_discount':
//                     $query->reorder()->join('price_details', 'products.id', '=', 'price_details.product_id')
//                       ->select('products.*')
//                       ->orderBy('price_details.price_after_discount', $direction);
//                     break;

//                 case 'name':
//                     $query->reorder()->orderBy('products.name', $direction);
//                     break;

//                 case 'upload_at':
//                     $query->reorder()->orderBy('products.upload_at', $direction);
//                     break;

//                 default:
//                     $query->reorder()->orderByDesc('products.upload_at'); // fallback
//                     break;
//             }
//         } else {
//             $query->reorder()->orderByDesc('products.upload_at'); // default
//         }