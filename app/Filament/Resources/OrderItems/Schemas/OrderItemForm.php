<?php

namespace App\Filament\Resources\OrderItems\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('size_id')
                    ->required()
                    ->numeric(),
                TextInput::make('shipping')
                    ->required(),
                TextInput::make('rent_periode')
                    ->required()
                    ->numeric(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric(),
                TextInput::make('rent_price')
                    ->numeric(),
                TextInput::make('deposit')
                    ->numeric(),
                DatePicker::make('use_by_date')
                    ->required(),
                DatePicker::make('estimated_delivery_date'),
                DatePicker::make('estimated_return_date'),
                TextInput::make('type'),
            ]);
    }
}
