<?php

namespace App\Models;

use App\Models\Banner;
use App\Observers\BannerImageObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([BannerImageObserver::class])]
class BannerImage extends Model
{
    /** @use HasFactory<\Database\Factories\BannerImagesFactory> */
    use HasFactory;

    protected $fillable = ['banner_id', 'image_path', 'image_url'];

    public function getImageAttribute()
    {
        if ($this->image_url) {
            return $this->image_url;
        }

        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }

        return null;
    }

    public function banner()
    {
        return $this->belongsTo(Banner::class);
    }
}
