<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function showStockAvailable(Product $product, Request $request)
    {
        $product->load(['brand', 'types', 'color', 'branch', 'priceDetail', 'sizes']);

        $params = $this->constructParamsFromRequest($request);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $stockBreakdown = $product->getAvailableStockBreakdownForPeriod($startDate, $endDate);

        $productData = $product->toArray();
        $productData['stock_breakdown'] = $stockBreakdown;

        return response()->json($productData);
    }

    // for auto complete @search field
    public function show(Request $request)
    { 
        $params = $this->constructParamsFromRequest($request);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $availableProducts = Product::query()
            ->whereDoesntHave('orderItems', function ($query) use ($startDate, $endDate) {
                $query->whereHas('order', function ($subQuery) {
                    $subQuery->whereIn('status', ['process', 'shipped']);
                })
                ->where(function ($subQuery) use ($startDate, $endDate) {
                    $subQuery->where('estimated_delivery_date', '<=', $endDate)
                        ->where('estimated_return_date', '>=', $startDate);
                });
            })
            ->select('name')
            ->get();

        return response()->json($availableProducts);
    }

    public function getAvailableProducts(Request $request)
    {
        $params = $this->constructParamsFromRequest($request);
        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $products = Product::query()
            ->when($request->query('city'), fn($q) => $q->where('branch_id', $request->query('city')))
            ->when($request->query('duration'), fn($q) =>
                $q->where('rent_periode', '>=', $request->query('duration'))
            )
            ->whereRaw('
                (
                    COALESCE((
                        SELECT SUM(sz.quantity)
                        FROM sizes sz
                        WHERE sz.product_id = products.id
                    ), 0)
                    -
                    COALESCE((
                        SELECT COALESCE(SUM(oi.quantity), 0)
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
            ', ['approved', 'shipped', $endDate, $startDate])
            ->whereHas('sizes', fn($q) => $q->where('availability', true)) // Ensure at least one size is available
            ->with(['brand', 'sizes', 'types'])
            ->get();

        return response()->json($products);
    }

    private function constructParamsFromRequest(Request $request)
    {
        $useByDateStr = $request->query('useByDate', now()->addDays(2)->format('d-m-Y'));
        $duration = (int) $request->query('duration', 1);
        $shippingType = $request->query('shippingType');

        $useByDate = Carbon::createFromFormat('d-m-Y', $useByDateStr);
        $startDate = $useByDate->copy();

        if ($shippingType) {
            $startDate = match ($shippingType) {
                'Next day' => $useByDate->copy()->subDays(2),
                'Same day' => $useByDate->copy()->subDay(),
                default => $useByDate->copy(),
            };
        }

        if ($startDate->lessThan(Carbon::today())) {
            $startDate = Carbon::today();
        }

        $endDate = $useByDate->copy()->addDays($duration);

        return [
            'startDate' => $startDate->format('Y-m-d'),
            'endDate'   => $endDate->format('Y-m-d'),
        ];
    }
}
