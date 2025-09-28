<?php

namespace App\Filament\Resources\AppSettings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AppSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('app_name'),
                ImageColumn::make('app_logo')
                    ->disk('public')
                    ->square()
                    ->imageSize(110),
                ImageColumn::make('instruction_image')
                    ->disk('public')
                   ->getStateUsing(fn($record) => collect($record->instruction_image)->take(3)->toArray())
                    ->circular()
                    ->stacked()
                    ->ring(2)
                    ->imageSize(80),
                ImageColumn::make('tnc_image')
                    ->disk('public')
                    ->getStateUsing(fn($record) => collect($record->tnc_image)->take(3)->toArray())
                    ->circular()
                    ->stacked()
                    ->ring(2)
                    ->imageSize(80),
                TextColumn::make('whatsapp_number')->label('WhatsApp'),
                TextColumn::make('email'),
                TextColumn::make('address'),
                TextColumn::make('instagram'),
                TextColumn::make('description')->limit(50),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make()->iconButton('heroicon-o-pencil'),
                DeleteAction::make()->iconButton('heroicon-o-trash'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
