<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                FileUpload::make('cover_image')
                    ->image()
                    ->required(),
                TextInput::make('brand_id')
                    ->required()
                    ->numeric(),
                TextInput::make('code')
                    ->required(),
                TextInput::make('color_id')
                    ->required()
                    ->numeric(),
                TextInput::make('branch_id')
                    ->required()
                    ->numeric(),
                TextInput::make('ownership'),
                TextInput::make('rent_periode')
                    ->required()
                    ->numeric(),
                DateTimePicker::make('upload_at')
                    ->required(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('price_detail_id')
                    ->required()
                    ->numeric(),
            ]);
    }
}
