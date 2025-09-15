<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductObserver
{
    public function updating(Product $product): void
    {
        // cover image
        if ($product->isDirty('cover_image')) {
            $oldImage = $product->getOriginal('cover_image');
            if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }
        }

        // multiple images
        if ($product->isDirty('images')) {
            $oldImages = $product->getOriginal('images') ?? [];
            $newImages = $product->images ?? [];

            $deletedImages = array_diff($oldImages, $newImages);

            foreach ($deletedImages as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }

    public function deleting(Product $product): void
    {
        if ($product->cover_image && Storage::disk('public')->exists($product->cover_image)) {
            Storage::disk('public')->delete($product->cover_image);
        }

        if (!empty($product->images)) {
            foreach ($product->images as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }
}
