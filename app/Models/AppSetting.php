<?php

namespace App\Models;

use App\Observers\AppSettingObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([AppSettingObserver::class])]
class AppSetting extends Model
{
    protected $fillable = [
        'app_name',
        'app_logo',
        'whatsapp_number',
        'email',
        'address',
        'instagram',
        'description',
    ];
}
