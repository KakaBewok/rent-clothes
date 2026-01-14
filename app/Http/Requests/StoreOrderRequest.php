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
            // --- shipping info 
            // 'name' => ['nullable', 'string'],
            'name' => ['required', 'string', 'min:1'],
            // 'phone_number' => ['nullable', 'string'],
            'phone_number' => ['required', 'regex:/^(\+62|0)\d{9,13}$/'],
            'identity_image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // 2mb
            // 'address' => ['nullable', 'string'],
            'address' => ['required', 'string', 'min:1'],
            'expedition' => ['nullable', 'string'],
            'recipient' => ['nullable', 'string'], 
            // 'social_media' => ['nullable', 'string'],
            'social_media' => ['required', 'string', 'min:1'],

            // --- deposit return info 
            'account_number' => ['nullable', 'string'],
            'account_holder' => ['nullable', 'string'],
            'provider_name' => ['nullable', 'string'],

            // --- items
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

        //OLD VERSION
        // return [
        //     // --- shipping info ---
        //     'name' => ['required', 'string', 'min:3'],
        //     'phone_number' => ['required', 'regex:/^(\+62|0)\d{9,13}$/'],
        //     'identity_image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // 2MB
        //     'address' => ['required', 'string', 'min:10'],
        //     'expedition' => ['required', 'string', 'min:1'],
        //     'recipient' => ['nullable', 'string', 'min:3'],
        //     'social_media' => ['nullable', 'string', 'min:3'],

        //     // --- deposit return info ---
        //     'account_number' => ['required', 'string', 'min:5'],
        //     'provider_name' => ['required', 'string', 'min:1'],

        //     // --- items ---
        //     'items' => ['required', 'array', 'min:1'],
        //     'items.*.product_id' => ['required', 'integer', 'min:1', 'exists:products,id'],
        //     'items.*.size_id' => ['required', 'integer', 'min:1', 'exists:sizes,id'],
        //     'items.*.type' => ['nullable'],
        //     'items.*.quantity' => ['required', 'integer', 'min:1'],
        //     'items.*.rent_periode' => ['required', 'integer', 'min:1'],
        //     'items.*.shipping' => ['required', 'string', Rule::in(['Same day', 'Next day'])],

        //     // --- dates ---
        //     'items.*.use_by_date' => ['required', 'date', 'after_or_equal:tomorrow'],
        //     'items.*.estimated_delivery_date' => ['required', 'date'],
        //     'items.*.estimated_return_date' => ['required', 'date'],

        //     // --- others ---
        //     'desc' => ['nullable', 'string', 'max:500'],
        //     'agreement' => ['nullable', 'boolean'],
        // ];
    }

    // Prepare the data for validation. Set default values for nullable fields. (additional @revisi 1)
    protected function prepareForValidation()
    {
        $this->merge([
            'name'           => $this->name ?: '-',
            'phone_number'   => $this->phone_number ?: '-',
            'address'        => $this->address ?: '-',
            'expedition'     => $this->expedition ?: '-',
            'recipient'      => $this->recipient ?: '-',
            'social_media'   => $this->social_media ?: '-',
            'account_holder' => $this->account_holder ?: '-',
            'account_number' => $this->account_number ?: '-',
            'provider_name'  => $this->provider_name ?: '-',
        ]);
    }

    public function messages(): array
    {
        return [
            // 'phone_number.regex' => 'Format nomor telepon tidak valid. Contoh: 0812...',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',
            'items.*.size_id.exists' => 'Ukuran tidak ditemukan.',
            'items.*.use_by_date.after_or_equal' => 'Minimal digunakan untuk besok.',
        ];
    }
}
