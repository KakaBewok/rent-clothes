<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // --- shipping info ---
            'name' => ['required', 'string', 'min:3'],
            'phone_number' => ['required', 'regex:/^(\+62|0)\d{9,13}$/'],
            'identity_image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // 2MB
            'address' => ['required', 'string', 'min:10'],
            'expedition' => ['required', 'string', 'min:1'],

            // --- deposit return info ---
            'account_number' => ['required', 'string', 'min:5'],
            'provider_name' => ['required', 'string', 'min:1'],

            // --- items ---
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'min:1', 'exists:products,id'],
            'items.*.size_id' => ['required', 'integer', 'min:1', 'exists:sizes,id'],
            'items.*.type' => ['nullable'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.rent_periode' => ['required', 'integer', 'min:1'],
            'items.*.shipping' => ['required', 'string', Rule::in(['Same day', 'Next day'])],

            // --- dates ---
            'items.*.use_by_date' => ['required', 'date', 'after_or_equal:tomorrow'],
            'items.*.estimated_delivery_date' => ['required', 'date'],
            'items.*.estimated_return_date' => ['required', 'date'],

            // --- others ---
            'desc' => ['nullable', 'string', 'max:500'],
            'agreement' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone_number.regex' => 'Format nomor telepon tidak valid. Contoh: 0812...',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',
            'items.*.size_id.exists' => 'Ukuran tidak ditemukan.',
            'items.*.use_by_date.after_or_equal' => 'Minimal digunakan untuk besok.',
        ];
    }
}
