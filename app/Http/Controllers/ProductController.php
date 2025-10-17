<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function showStockAvailable(Product $product, Request $request) // <-- Langkah 3: Tambahkan 'Request $request'
    {
        // 1. Load relasi dasar
        $product->load(['brand', 'types', 'color', 'branch', 'priceDetail', 'sizes']);

        // 2. Ambil dan hitung tanggal dari request
        // $useByDateStr = $request->query('useByDate', now()->addDays(2)->format('d-m-Y'));
        // $duration = (int) $request->query('duration', 1);
        // $useByDate = Carbon::createFromFormat('d-m-Y', $useByDateStr);
        // $startDate = $useByDate->copy()->format('Y-m-d');
        // $endDate = $useByDate->copy()->addDays($duration - 1)->format('Y-m-d');

        $params = $this->constructParamsFromRequest($request);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        // 3. Panggil method baru dari model untuk mendapatkan rincian stok
        $stockBreakdown = $product->getAvailableStockBreakdownForPeriod($startDate, $endDate);

        // 4. Ubah model menjadi array dan tambahkan properti baru 'stock_breakdown'
        $productData = $product->toArray();
        $productData['stock_breakdown'] = $stockBreakdown;
        
        // 5. Kembalikan sebagai JSON
        return response()->json($productData);
    }

    public function show(Request $request) // <-- Langkah 3: Tambahkan 'Request $request'
    { 
        $params = $this->constructParamsFromRequest($request);

        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        // 3. Panggil method baru dari model untuk mendapatkan rincian stok
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
        // $filters = [
        //     'useByDate' => $request->query('useByDate'),
        //     'shippingType' => $request->query('shippingType'),
        //     'duration' => $request->query('duration'),
        //     'city' => $request->query('city'),
        // ];

        $params = $this->constructParamsFromRequest($request);
        $startDate = $params['startDate'];
        $endDate   = $params['endDate'];

        $products = Product::query()
            ->when($request->query('city'), fn($q) => $q->where('branch_id', $request->query('city')))
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
            ', ['approved', 'shipped', $endDate, $startDate])
            // ->with(['brand', 'types', 'sizes'])
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
