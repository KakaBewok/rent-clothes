<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'phone_number' => $this->faker->phoneNumber,
            'identity_image' => 'identity/' . $this->faker->uuid . '.jpg',
            'expedition' => $this->faker->company,
            'account_number' => $this->faker->bankAccountNumber,
            'provider_name' => $this->faker->company,
            'address' => $this->faker->address,
            'status' => $this->faker->randomElement(['process', 'shipped', 'returned', 'cancel']),
            'desc' => $this->faker->sentence,
        ];
    }
}
