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
    }

    public function deleted(AppSetting $setting): void
    {
        if ($setting->app_logo && Storage::disk('public')->exists($setting->app_logo)) {
            Storage::disk('public')->delete($setting->app_logo);
        }
    }
}
