<?php

namespace App\Models;

use App\Models\Brand;
use App\Observers\ProductObserver;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
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
    private function getStockBreakdownForPeriod($startDate, $endDate)
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

    private function getBookedDatesForPeriod($startDate, $endDate)
    {
        $availableSizes = $this->sizes()->where('availability', true)->get();

        $rentedItems = $this->orderItems()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['process', 'shipped']);
            })
            ->join('sizes', 'order_items.size_id', '=', 'sizes.id')
            ->select(
                'order_items.estimated_delivery_date',
                'order_items.estimated_return_date',
                'order_items.quantity',
                'sizes.id as size_id',
                'sizes.quantity as total_size_stock'
            )
            ->get();

        if ($rentedItems->isNotEmpty()) {
            $minDate = Carbon::parse($rentedItems->min('estimated_delivery_date'))->startOfDay();
            $maxDate = Carbon::parse($rentedItems->max('estimated_return_date'))->endOfDay();
        } else {
            $minDate = Carbon::parse($startDate)->startOfDay();
            $maxDate = Carbon::parse($endDate)->endOfDay();
        }

        $bookedDates = [];

        $period = CarbonPeriod::create($minDate, $maxDate);

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $totalAvailable = $availableSizes->sum('quantity');
            $totalRented = 0;

            foreach ($rentedItems as $item) {
                $delivery = Carbon::parse($item->estimated_delivery_date)->startOfDay();
                $return   = Carbon::parse($item->estimated_return_date)->endOfDay();

                if ($date->betweenIncluded($delivery, $return)) {
                    $totalRented += $item->quantity;
                }
            }

            if ($totalAvailable - $totalRented <= 0) {
                $bookedDates[] = $dateString;
            }
        }

        return collect($bookedDates)->unique()->values()->toArray();
    }

    public function getAvailabilityForPeriod($startDate, $endDate)
    {
        return [
            'stock_breakdown' => $this->getStockBreakdownForPeriod($startDate, $endDate),
            'booked_dates' => $this->getBookedDatesForPeriod($startDate, $endDate),
        ];
    }
}
