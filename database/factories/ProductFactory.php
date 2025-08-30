<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\PriceDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->words(2, true)),
            'cover_image' => 'products/' . $this->faker->uuid . '.jpg',
            'brand_id' => Brand::factory(),
            'code' => strtoupper($this->faker->bothify('PRD-###')),
            'color_id' => Color::factory(),
            'branch_id' => Branch::factory(),
            'ownership' => $this->faker->name,
            'rent_periode' => $this->faker->numberBetween(1, 7),
            'upload_at' => now(),
            'description' => $this->faker->sentence,
            'price_detail_id' => PriceDetail::factory(),
        ];
    }
}
