<?php

namespace App\Models;

use App\Models\Brand;
use App\Observers\ProductObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

#[ObservedBy([ProductObserver::class])]
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cover_image',
        'brand_id',
        'code',
        'color_id',
        'type_id',
        'additional_ribbon',
        'branch_id',
        'ownership',
        'rent_periode',
        'upload_at',
        'description',
        'images',
    ];

    protected $casts = [
        'upload_at' => 'datetime',
        'images' => 'array',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class)->withDefault([
            'name' => '--- Brand data has been deleted ---',
        ]);
    }

    public function types()
    {
        return $this->belongsToMany(Type::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class)->withDefault([
            'name' => '--- Color data has been deleted ---',
        ]);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class)->withDefault([
            'name' => '--- Branch data has been deleted ---',
        ]);
    }

    public function priceDetail()
    {
        return $this->hasOne(PriceDetail::class);
    }

    public function sizes()
    {
        return $this->hasMany(Size::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

     /**
     *
     * @param string $startDate
     * @param string $endDate
     * @return int
     */
    public function getAvailableStockBreakdownForPeriod($startDate, $endDate)
    {
        // 1. Ambil semua ukuran untuk produk ini yang ditandai 'available' (Kode ini sudah benar)
        $availableSizes = $this->sizes()->where('availability', true)->get();

        // 2. Hitung jumlah yang disewa untuk setiap ukuran dalam satu query
        $rentedCountsBySize = $this->orderItems()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['process', 'shipped']);
            })
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('estimated_delivery_date', '<=', $endDate)
                    ->where('estimated_return_date', '>=', $startDate);
            })
            // ✅ FIX: Gabungkan dengan tabel 'sizes' berdasarkan 'size_id'
            ->join('sizes', 'order_items.size_id', '=', 'sizes.id')
            
            // ✅ FIX: Pilih dan kelompokkan berdasarkan 'sizes.size' dari tabel yang sudah di-join
            ->select('sizes.size', DB::raw('count(*) as total'))
            ->groupBy('sizes.size')
            ->pluck('total', 'sizes.size');

        $stockBreakdown = [];

        // 3. Iterasi dan hitung sisa stok (Kode ini sudah benar)
        foreach ($availableSizes as $size) {
            $totalStockForSize = $size->quantity;
            $rentedCountForSize = $rentedCountsBySize->get($size->size, 0);
            $remainingStock = $totalStockForSize - $rentedCountForSize;

            if ($remainingStock > 0) {
                $stockBreakdown[] = [
                    'size' => $size->size,
                    'stock' => $remainingStock
                ];
            }
        }
            
        return $stockBreakdown;
    }
}
