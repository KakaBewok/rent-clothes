<?php

namespace App\Models;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'identity_image',
        'expedition',
        'account_number',
        'provider_name',
        'address',
        'status',
        'desc',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
