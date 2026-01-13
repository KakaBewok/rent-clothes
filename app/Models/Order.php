<?php

namespace App\Models;

use App\Models\OrderItem;
use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([OrderObserver::class])]
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'identity_image',
        'expedition',
        'account_number',
        'account_holder',
        'provider_name',
        'address',
        'status',
        'social_media', 
        'recipient',
        'desc',
        'created_by'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getTotalRentPriceAttribute()
    {
        return $this->items->sum('rent_price');
    }

    public function getTotalDepositAttribute()
    {
        return $this->items->sum('deposit');
    }

    public function getTotalItemsAttribute()
    {
        return $this->items->count();
    }

    public function getFirstProductNameAttribute(): ?string
    {
        return $this->items()
            ->with('product')
            ->first()
            ?->product
            ?->name;
    }
}
