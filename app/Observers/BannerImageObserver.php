<?php

namespace App\Observers;

use App\Models\BannerImage;
use Illuminate\Support\Facades\Storage;

class BannerImageObserver
{
    public function updating(BannerImage $image): void
    {
        if ($image->isDirty('image_path')) {
            $oldPath = $image->getOriginal('image_path');

            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }

    public function deleting(BannerImage $image): void
    {
        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }
    }
}
