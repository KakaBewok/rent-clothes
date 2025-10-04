<?php

namespace Database\Factories;

use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(100),
            'images'            => [
                'banners/' . $this->faker->uuid() . '.jpg',
                'banners/' . $this->faker->uuid() . '.jpg',
            ],
            'type_id' => Type::factory(),
        ];
    }
}
