<?php

namespace App\Observers;

use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerObserver
{
    /**
     * Handle the Banner "deleted" event.
     */
    public function deleted(Banner $banner): void
    {
        if ($banner->images->isNotEmpty()) {
            foreach ($banner->images as $image) {
                if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
            }
        }
    }
}
