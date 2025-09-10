<?php

namespace App\Observers;

use App\Models\ProductGallery;
use Illuminate\Support\Facades\Storage;

class ProductGalleryObserver
{
    /**
     * Handle the ProductGallery "updated" event.
     */
    public function updated(ProductGallery $gallery): void
    {
        if ($gallery->isDirty('image_path')) {
            $oldPath = $gallery->getOriginal('image_path');

            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }

    /**
     * Handle the ProductGallery "deleted" event.
     */
    public function deleted(ProductGallery $gallery): void
    {
         if ($gallery->image_path && Storage::disk('public')->exists($gallery->image_path)) {
            Storage::disk('public')->delete($gallery->image_path);
        }
    }
}
