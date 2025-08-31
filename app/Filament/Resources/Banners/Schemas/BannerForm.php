<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                FileUpload::make('image_path')
                    ->image()
                    ->required(),
                FileUpload::make('image_url')
                    ->image()
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
