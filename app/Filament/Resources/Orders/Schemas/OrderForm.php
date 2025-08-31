<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('phone_number')
                    ->tel()
                    ->required(),
                FileUpload::make('identity_image')
                    ->image()
                    ->required(),
                TextInput::make('expedition')
                    ->required(),
                TextInput::make('account_number')
                    ->required(),
                TextInput::make('provider_name')
                    ->required(),
                Textarea::make('address')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                Textarea::make('desc')
                    ->columnSpanFull(),
            ]);
    }
}
