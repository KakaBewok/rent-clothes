<?php

namespace App\Filament\Resources\Products\Tables;

use App\Exports\ProductsExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Maatwebsite\Excel\Facades\Excel;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Dress Name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('brand.name')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('code')
                    ->label('Code')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('priceDetail.rent_price')
                    ->label('Rent Price')
                    ->money('idr', false)
                    ->sortable()
                    ->searchable(),

                TextColumn::make('priceDetail.discount')
                    ->label('Discount (%)')
                    ->sortable()
                    ->searchable()
                    ->formatStateUsing(fn($state) => $state ? $state . '%' : '-'),

                TextColumn::make('priceDetail.price_after_discount')
                    ->label('Final Price')
                    ->money('idr', true)
                    ->sortable()
                    ->searchable(),

                ImageColumn::make('cover_image')
                    ->disk('public')
                    ->square()
                    ->imageSize(200),
            ])
            ->defaultSort('created_at', 'desc')
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
                Action::make('exportExcel')
                    ->label('Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(fn() => Excel::download(new ProductsExport, 'products-' . now()->format('Y-m-d') . '.xlsx')),
            ]);
    }
}
