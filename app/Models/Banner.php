<?php

namespace App\Models;

use App\Models\BannerImage;
use App\Observers\BannerObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([BannerObserver::class])]
class Banner extends Model
{
    /** @use HasFactory<\Database\Factories\BannerFactory> */
    use HasFactory;

    protected $fillable = ['title', 'is_active', 'images'];

    protected $casts = [
        'images' => 'array',
    ];
}
