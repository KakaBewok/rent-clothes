<?php

namespace Database\Factories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BannerImages>
 */
class BannerImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'banner_id' => Banner::factory(),
            'image_path' => $this->faker->imageUrl(800, 400, 'banners'),
            'image_url' => $this->faker->url(),
        ];
    }
}
