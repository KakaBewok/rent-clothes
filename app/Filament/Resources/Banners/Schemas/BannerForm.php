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
                FileUpload::make('images')
                    ->label('Banners')
                    ->image()
                    ->multiple()
                    ->maxFiles(10)
                    ->reorderable()
                    ->maxSize(config('uploads.images.max_size'))
                    ->acceptedFileTypes(config('uploads.images.accepted_types'))
                    ->helperText('Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                    ->disk('public')
                    ->directory('banners')
                    ->imageEditor()
                    ->imageEditorAspectRatios(['16:9', '4:3', '1:1']),
                Toggle::make('is_active')->label('Status')->hiddenOn(Operation::Create)->visibleOn(Operation::Edit)->default(true),
            ]);
    }
}
