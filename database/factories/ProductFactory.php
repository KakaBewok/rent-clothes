<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\PriceDetail;
use App\Models\Type;
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
            'code' => strtoupper($this->faker->bothify('PRD-###')) . '-' . strtoupper($this->faker->bothify('???')),
            'color_id' => Color::factory(),
            'branch_id' => Branch::factory(),
            'ownership' => $this->faker->name,
            'rent_periode' => $this->faker->numberBetween(1, 7),
            'upload_at' => now(),
            'additional_ribbon' => $this->faker->randomElement(["New arrival", "Coming soon", "Hijab friendly", "Promo", "Most favorite"]),
            'description' => $this->faker->sentence,
            'images'            => [
                'products/' . $this->faker->uuid() . '.jpg',
                'products/' . $this->faker->uuid() . '.jpg',
            ],
        ];
    }
}
