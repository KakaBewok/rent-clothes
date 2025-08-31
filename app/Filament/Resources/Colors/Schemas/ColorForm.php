<?php

namespace App\Filament\Resources\Colors\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ColorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('hex_code'),
            ]);
    }
}
