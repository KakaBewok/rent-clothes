<?php

namespace App\Filament\Resources\OrderItems\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderItemInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order Info')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('order.name')->label('Customer Name'),
                        TextEntry::make('order.phone_number')->label('Phone Number'),
                        TextEntry::make('order.status')->label('Status')->badge()
                        ->colors([
                            'primary' => 'process',
                            'info'    => 'shipped',
                            'success' => 'returned',
                            'danger'  => 'cancel',
                        ])
                        ->formatStateUsing(fn($state) => ucfirst($state)),
                        TextEntry::make('product.ownership')->label('Ownership'),
                        TextEntry::make('order.expedition')->label('Expedition'),
                        TextEntry::make('order.address')->label('Address')->columnSpan(2),
                    ]),

                Section::make('Item Info')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('product.name')->label('Item Name'),
                        TextEntry::make('rent_price')->label('Rent Price')->money('idr'),
                        TextEntry::make('deposit')->label('Deposit')->money('idr'),
                        TextEntry::make('shipping')->label('Shipping'),
                        TextEntry::make('type')->label('Notes'),
                        TextEntry::make('use_by_date')->label('Use By Date')->date(),
                        TextEntry::make('estimated_delivery_date')->label('Estimated Delivery')->date(),
                        TextEntry::make('estimated_return_date')->label('Estimated Return')->date(),
                        TextEntry::make('created_at')->label('Transaction At')->dateTime('d M Y H:i'),
                    ]),
            ]);
    }
}