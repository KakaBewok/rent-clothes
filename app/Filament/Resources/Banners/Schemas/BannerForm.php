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
                TextInput::make('title')->nullable(),

                Repeater::make('images')
                    ->relationship('images')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Banner Image')
                            ->image()
                            ->maxSize(config('uploads.images.max_size'))
                            ->acceptedFileTypes(config('uploads.images.accepted_types'))
                            ->helperText('Upload an image file or use image URL below (not both). Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                            ->disk('public')
                            ->directory('banners')
                            ->imageEditor()
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
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
                            }),
                    ])->columnSpan('full')->collapsible()->label('Carousel Banner')->reorderable(),

                Toggle::make('is_active')->label('Status')->hiddenOn(Operation::Create)->visibleOn(Operation::Edit)->default(true),
            ]);
    }
}
