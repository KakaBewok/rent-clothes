<?php

namespace App\Filament\Resources\Banners\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BannersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('images')
                    ->label('Banners ')
                    ->disk('public')
                    ->getStateUsing(fn($record) => collect($record->images)->take(5)->toArray())
                    ->circular()
                    ->imageSize(110)
                    ->stacked()
                    ->ring(2),
                TextColumn::make('title'),
                TextColumn::make('is_active')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn(bool $state): string => $state ? 'Active' : 'Not Active')
                    ->color(fn(bool $state): string => match ($state) {
                        true => 'success',
                        false => 'danger',
                    })
            ])->defaultSort('updated_at', 'desc')
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make()->iconButton('heroicon-o-eye'),
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
