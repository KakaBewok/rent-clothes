<?php

namespace App\Filament\Resources\OrderItems\Tables;

use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrderItemsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('product.name')
                    ->label('Catalogue Name')
                    ->limit(30)
                    ->searchable(),       
                TextColumn::make('order.name')
                    ->label('Customer Name')
                    ->searchable(),
                TextColumn::make('order.phone_number')->label('Phone Number'),
                 TextColumn::make('rent_price')
                    ->label('Omzet')
                    ->money('idr', true)
                    ->sortable(),
                TextColumn::make('deposit')
                    ->label('Deposit')
                    ->money('idr', true), 
                TextColumn::make('product.ownership')->label('Ownership')->searchable(),
                TextColumn::make('shipping'),
                TextColumn::make('order.expedition')->label('Expedition'),
                TextColumn::make('type')->label('Notes'),
                TextColumn::make('order.address')
                    ->label('Address')
                    ->limit(40)
                    ->tooltip(fn($record) => $record->order->address)
                    ->searchable(),
                TextColumn::make('use_by_date')->label('Use By Date')->date()->sortable(),
                TextColumn::make('estimated_delivery_date')->label('Estimated Delivery')->date()->sortable(),
                TextColumn::make('estimated_return_date')->label('Estimated Return')->date()->sortable(),
                TextColumn::make('created_at')->label('Transaction At')->dateTime('d M Y H:i')->sortable()
    ->timezone('Asia/Jakarta'),
                TextColumn::make('order.status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'primary' => 'process',
                        'info'    => 'shipped',
                        'success' => 'returned',
                        'danger'  => 'cancel',
                    ])
                    ->formatStateUsing(fn($state) => ucfirst($state)),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('order.status')
                    ->relationship('order', 'status')
                    ->label('Order Status')
                    ->options([
                       'process'  => 'Process',
                       'shipped'   => 'Shipped',
                       'returned'  => 'Returned',
                       'cancel' => 'Cancel',
                    ]),
                SelectFilter::make('order.expedition')
                    ->relationship('order', 'expedition')
                    ->label('Shipping Service')
                    ->options([
                        'Self Pickup' => 'Self Pickup',
                        'Paxel' => 'Paxel',
                        'JNE' => 'JNE',
                        'J&T Express' => 'J&T Express',
                        'TIKI' => 'TIKI',
                        'POS Indonesia' => 'POS Indonesia',
                        'SiCepat' => 'SiCepat',
                        'Lion Parcel' => 'Lion Parcel',
                        'AnterAja' => 'AnterAja',
                        'Shopee Express' => 'Shopee Express',
                        'Grab Express' => 'Grab Express',
                        'Gojek (GoSend)' => 'Gojek (GoSend)',
                    ]),
                Filter::make('date_range')
                    ->schema([
                        DatePicker::make('start_shipping')->label('Start Shipping'),
                        DatePicker::make('end_shipping')->label('End Shipping'),
                        DatePicker::make('start_transaction')->label('Start Transaction'),
                        DatePicker::make('end_transaction')->label('End Transaction'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                        ->when($data['start_shipping'], fn($q) => $q->whereDate('estimated_delivery_date', '>=', $data['start_shipping']))
                        ->when($data['end_shipping'], fn($q) => $q->whereDate('estimated_delivery_date', '<=', $data['end_shipping']))
                        ->when($data['start_transaction'], fn($q) => $q->whereDate('created_at', '>=', $data['start_transaction']))
                        ->when($data['end_transaction'], fn($q) => $q->whereDate('created_at', '<=', $data['end_transaction']));
                    }),
            ])
            ->recordActions([
                ViewAction::make()->iconButton('heroicon-o-eye')
            ])
            ->toolbarActions([
            ]);
    }
}
