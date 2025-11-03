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
        $availableSizes = $this->sizes()->where('availability', true)->get();

        $rentedCountsBySize = $this->orderItems()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['process', 'shipped']);
            })
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('estimated_delivery_date', '<=', $endDate)
                    ->where('estimated_return_date', '>=', $startDate);
            })
            ->join('sizes', 'order_items.size_id', '=', 'sizes.id')
            
            ->select('sizes.id as size_id', DB::raw('COALESCE(SUM(order_items.quantity),0) as total'))
            ->groupBy('sizes.id')
            ->pluck('total', 'size_id');

        $stockBreakdown = [];

        foreach ($availableSizes as $size) {
            $totalStockForSize = $size->quantity;
            $rentedCountForSize = (int) $rentedCountsBySize->get($size->id, 0);
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
