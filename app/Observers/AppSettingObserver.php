<?php

namespace App\Observers;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Storage;

class AppSettingObserver
{
    public function updated(AppSetting $setting): void
    {
        if ($setting->isDirty('app_logo')) {
            $oldImage = $setting->getOriginal('app_logo');

            if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }
        }

         // instruction images
        if ($setting->isDirty('instruction_image')) {
            $oldImages = $setting->getOriginal('instruction_image') ?? [];
            $newImages = $setting->instruction_image ?? [];

            $deletedImages = array_diff($oldImages, $newImages);

            foreach ($deletedImages as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

         // tnc images
        if ($setting->isDirty('tnc_image')) {
            $oldImages = $setting->getOriginal('tnc_image') ?? [];
            $newImages = $setting->tnc_image ?? [];

            $deletedImages = array_diff($oldImages, $newImages);

            foreach ($deletedImages as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }

    public function deleted(AppSetting $setting): void
    {
        if ($setting->app_logo && Storage::disk('public')->exists($setting->app_logo)) {
            Storage::disk('public')->delete($setting->app_logo);
        }

         if (!empty($setting->instruction_image)) {
            foreach ($setting->instruction_image as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

         if (!empty($setting->tnc_image)) {
            foreach ($setting->tnc_image as $imagePath) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }
    }
}
