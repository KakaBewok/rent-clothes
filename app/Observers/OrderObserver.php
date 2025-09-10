<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Storage;

class OrderObserver
{

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->isDirty('identity_image')) {
            $oldImage = $order->getOriginal('identity_image');

            if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        if ($order->identity_image && Storage::disk('public')->exists($order->identity_image)) {
            Storage::disk('public')->delete($order->identity_image);
        }
    }
}
