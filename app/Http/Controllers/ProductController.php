<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //old
    // public function show(Product $product)
    // {
    //     $product->load([
    //         'brand',
    //         'types',
    //         'color',
    //         'branch',
    //         'priceDetail',
    //         'sizes',
    //     ]);
        
    //     return response()->json($product);
    // }

     /**
     * Menampilkan detail produk tunggal beserta sisa stoknya
     * berdasarkan rentang tanggal dari request.
     */
    public function show(Product $product, Request $request) // <-- Langkah 3: Tambahkan 'Request $request'
    {
        // 1. Load relasi dasar
        $product->load(['brand', 'types', 'color', 'branch', 'priceDetail', 'sizes']);

        // 2. Ambil dan hitung tanggal dari request
        $useByDateStr = $request->query('useByDate', now()->addDays(2)->format('d-m-Y'));
        $duration = (int) $request->query('duration', 1);
        $useByDate = Carbon::createFromFormat('d-m-Y', $useByDateStr);
        $startDate = $useByDate->copy()->format('Y-m-d');
        $endDate = $useByDate->copy()->addDays($duration - 1)->format('Y-m-d');

        // 3. Panggil method baru dari model untuk mendapatkan rincian stok
        $stockBreakdown = $product->getAvailableStockBreakdownForPeriod($startDate, $endDate);

        // 4. Ubah model menjadi array dan tambahkan properti baru 'stock_breakdown'
        $productData = $product->toArray();
        $productData['stock_breakdown'] = $stockBreakdown;
        
        // 5. Kembalikan sebagai JSON
        return response()->json($productData);
    }
}
