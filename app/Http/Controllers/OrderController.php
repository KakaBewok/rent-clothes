<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Mail\OrderFormSubmitted;
use App\Models\AppSetting;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function show(Product $product, Request $request)
    {
        $setting = AppSetting::first();

        return Inertia::render('front-end/order-page', 
            compact('product', 'setting')
        );
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        Log::info('Creating new order', [
            'user' => $validated['name'],
            'validated_data' => $validated,
        ]);

        DB::beginTransaction();

        try {
            $identityPath = null;
            if ($validated['identity_image'] instanceof UploadedFile) {
            // if ($request->hasFile('identity_image')) {
                $photoPath = $validated['identity_image']->store('orders/identity', 'public');
                $identityPath = $photoPath;
            }

            $order = Order::create([
                'name' => $validated['name'],
                'recipient' => $validated['recipient'],
                'social_media' => $validated['social_media'],
                'phone_number' => $validated['phone_number'],
                'identity_image' => $identityPath,
                'expedition' => $validated['expedition'],
                'account_number' => $validated['account_number'],
                'account_holder' => $validated['account_holder'],
                'provider_name' => $validated['provider_name'],
                'address' => $validated['address'],
                'desc' => $validated['desc'] ?? '-',
                'status' => 'pending',
                'created_by' => 'Customer',
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::with('priceDetail')->find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Product id {$item['product_id']} not found!");
                }

                $deposit = $product->priceDetail?->deposit ?? 0;
                $unitPrice = $product->priceDetail?->price_after_discount ?? 0;
                $rentPrice = $unitPrice * $item['quantity'];

                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'size_id' => $item['size_id'],
                    'type' => $item['type'] == 0 || $item['type'] == null ? null : $item['type'],
                    'quantity' => $item['quantity'],
                    'shipping' => $item['shipping'],
                    'rent_periode' => $item['rent_periode'],
                    'use_by_date' => $item['use_by_date'],
                    'estimated_delivery_date' => $item['estimated_delivery_date'],
                    'estimated_return_date' => $item['estimated_return_date'],
                    'rent_price' => $rentPrice,
                    'deposit' => $deposit
                ]);
            }

            // Start - Send notification email to admin
            try {
                // with queue. php artisan queue:work --stop-when-empty. QUEUE_CONNECTION=database
                // Mail::to(config('mail.admin_email'))
                //     ->queue(new OrderFormSubmitted($order));
                
                // without queue. QUEUE_CONNECTION=sync
                Log::info("Trying to send email to: " . config('mail.admin_email'));
                Mail::to(config('mail.admin_email'))
                    ->send(new OrderFormSubmitted($order));

                Log::info('Order notification email queued', [
                    'order_id' => $order->id,
                    'customer_name' => $order->name,
                    'admin_email' => config('mail.admin_email'),
                ]);
            } catch (\Exception $emailError) {
                // Email not sent, but order saved successfully
                Log::error('Failed to send order notification email', [
                    'order_id' => $order->id,
                    'customer_name' => $order->name,
                    'error' => $emailError->getMessage(),
                ]);
            }
            // End - Send notification email to admin

            DB::commit();

            Log::info('Order data successfully saved', [
                'user' => $validated['name'],
                'order_id' => $order->id,
                'total_items' => count($validated['items']),
            ]);

            return redirect()->route('order.form.show')->with('success', 'Order berhasil dibuat!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Failed saving order data', [
                'user' => $validated['name'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('order.form.show')->with('failed', 'Order Gagal dibuat!');
        }
    }
}
