<?php

namespace Database\Factories;

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
            'title' => $this->faker->sentence,
            'image_path' => 'banners/' . $this->faker->uuid . '.jpg',
            'image_url' => $this->faker->imageUrl(800, 300, 'fashion', true),
            'is_active' => true,
        ];
    }
}
