<?php

namespace App\Observers;

use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerObserver
{
    public function deleted(Banner $banner): void
    {
        if (!empty($banner->images)) {
            foreach ($banner->images as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }

    public function updating(Banner $banner): void
    {
        if ($banner->isDirty('images')) {
            $oldImages = $banner->getOriginal('images') ?? [];
            $newImages = $banner->images ?? [];

            $deletedImages = array_diff($oldImages, $newImages);

            foreach ($deletedImages as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }
}
