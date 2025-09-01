<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                // Nama Produk
                TextColumn::make('name')
                    ->label('Dress Name')
                    ->searchable()
                    ->sortable(),

                // Brand Name (relasi)
                TextColumn::make('brand.name')
                    ->label('Brand')
                    ->sortable()
                    ->searchable(),

                // Kode Produk
                TextColumn::make('code')
                    ->label('Code')
                    ->searchable(),

                // Rent Price (ambil dari PriceDetail)
                TextColumn::make('priceDetail.rent_price')
                    ->label('Rent Price')
                    ->money('idr', true),

                // Final Price (misal ada diskon)
                TextColumn::make('priceDetail.discount')
                    ->label('Discount (%)')
                    ->formatStateUsing(fn($state) => $state ? $state . '%' : '-'),

                // Final Price (misal ada diskon)
                TextColumn::make('priceDetail.price_after_discount')
                    ->label('Final Price')
                    ->money('idr', true),

                // Cover image
                ImageColumn::make('cover_image')
                    ->label('Cover')
                    ->disk('public')
                    ->square()
                    ->imageSize(200),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
