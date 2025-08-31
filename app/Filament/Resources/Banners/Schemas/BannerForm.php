<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Operation;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Toggle::make('is_active')->label('Status')->hiddenOn(Operation::Create)->visibleOn(Operation::Edit)->default(true),
                Repeater::make('images')
                    ->relationship('images')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Banner Image')
                            ->image()
                            ->maxSize(3072)
                            ->disk('public')
                            ->directory('banner')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                            ->helperText('Upload an image file OR use image URL below (not both).')
                            ->hintIcon('heroicon-m-exclamation-triangle')
                            ->hintColor('warning')
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $set('image_url', null);
                                }
                            }),

                        TextInput::make('image_url')
                            ->label('Banner URL')
                            ->url()
                            ->hintIcon('heroicon-m-exclamation-triangle')
                            ->hintColor('warning')
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $set('image_path', null);
                                }
                            })
                    ])->columnSpan('full')->collapsible()->label('Carousel Banner')->reorderable(),
            ]);
    }
}
