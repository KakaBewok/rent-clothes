<?php

namespace Database\Factories;

use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PriceDetail>
 */
class PriceDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $rentPrice = $this->faker->numberBetween(50000, 500000);
        $discount = $this->faker->randomElement([0, 5, 10, 20]);
        $deposit = $this->faker->numberBetween(20000, 100000);

        return [
            'rent_price' => $rentPrice,
            'deposit' => $deposit,
            'discount' => $discount,
            'price_after_discount' => $rentPrice - ($rentPrice * $discount / 100),
            'additional_time_price' => $this->faker->numberBetween(10000, 30000),
            'additional_ribbon' => $this->faker->randomElement(["1", "2", "3"]),
            'type_id' => Type::factory(),
        ];
    }
}
