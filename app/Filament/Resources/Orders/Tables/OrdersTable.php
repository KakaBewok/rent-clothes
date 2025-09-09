<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Exports\OrdersExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Maatwebsite\Excel\Facades\Excel;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Customer Name')
                    ->searchable(),
                TextColumn::make('first_product_name')
                    ->label('Catalogue Name')
                    ->limit(30),
                TextColumn::make('phone_number'),
                TextColumn::make('total_rent_price')
                    ->label('Omzet')
                    ->money('idr', true)
                    ->sortable(),
                TextColumn::make('total_deposit')
                    ->label('Deposit')
                    ->money('idr', true),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'primary' => 'approved',
                        'info'    => 'shipped',
                        'success' => 'returned',
                        'danger'  => 'cancelled',
                    ])
                    ->formatStateUsing(fn($state) => ucfirst($state)),
            ])->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Order Status')
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'shipped'   => 'Shipped',
                        'returned'  => 'Returned',
                        'cancelled' => 'Cancelled',
                    ]),

                SelectFilter::make('expedition')
                    ->label('Shipping Service')
                    ->options([
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
                Filter::make('estimated_return_date')
                    ->schema([
                        DatePicker::make('return_from'),
                        DatePicker::make('return_until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query->whereHas('items', function ($q) use ($data) {
                            $q->when($data['return_from'], fn($sub) => $sub->whereDate('estimated_return_date', '>=', $data['return_from']))
                                ->when($data['return_until'], fn($sub) => $sub->whereDate('estimated_return_date', '<=', $data['return_until']));
                        });
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
                Action::make('exportExcel')
                    ->label('Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(fn() => Excel::download(new OrdersExport, 'orders-' . now()->format('Y-m-d') . '.xlsx')),
            ]);
    }
}
