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
                TextColumn::make('phone_number'),
                TextColumn::make('first_product_name')
                    ->label('Catalogue Name')
                    ->limit(30)
                    ->searchable(query: function ($query, $search) {
                        $query->whereHas('items.product', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                    }),
                TextColumn::make('total_items'),
                TextColumn::make('total_rent_price')
                    ->label('Omzet')
                    ->money('idr', true)
                    ->sortable(),
                TextColumn::make('total_deposit')
                    ->label('Deposit')
                    ->money('idr', true),
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'gray' => 'process',
                        'info'    => 'shipped',
                        'success' => 'returned',
                        'danger'  => 'cancel',
                        'warning' => 'pending',
                    ])
                    ->formatStateUsing(fn($state) => ucfirst($state)),
            ])->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Order Status')
                    ->options([
                        'pending'   => 'Pending',
                        'process'   => 'Process',
                        'shipped'   => 'Shipped',
                        'returned'  => 'Returned',
                        'cancel' => 'Cancel',
                    ]),

                SelectFilter::make('expedition')
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
                            ->when($data['start_shipping'], fn($q) =>
                                $q->whereHas('items', fn($sub) =>
                                    $sub->whereDate('estimated_delivery_date', '>=', $data['start_shipping'])
                                )
                            )
                            ->when($data['end_shipping'], fn($q) =>
                                $q->whereHas('items', fn($sub) =>
                                    $sub->whereDate('estimated_delivery_date', '<=', $data['end_shipping'])
                                )
                            )
                            ->when($data['start_transaction'], fn($q) =>
                                $q->whereDate('created_at', '>=', $data['start_transaction'])
                            )
                            ->when($data['end_transaction'], fn($q) =>
                                $q->whereDate('created_at', '<=', $data['end_transaction'])
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['start_shipping'] ?? null) {
                            $indicators['start_shipping'] = 'Start Shipping: ' . \Carbon\Carbon::parse($data['start_shipping'])->format('d M Y');
                        }

                        if ($data['end_shipping'] ?? null) {
                            $indicators['end_shipping'] = 'End Shipping: ' . \Carbon\Carbon::parse($data['end_shipping'])->format('d M Y');
                        }

                        if ($data['start_transaction'] ?? null) {
                            $indicators['start_transaction'] = 'Start Transaction: ' . \Carbon\Carbon::parse($data['start_transaction'])->format('d M Y');
                        }

                        if ($data['end_transaction'] ?? null) {
                            $indicators['end_transaction'] = 'End Transaction: ' . \Carbon\Carbon::parse($data['end_transaction'])->format('d M Y');
                        }

                        return $indicators;
                    }),
                    // ->query(function ($query, array $data) {
                    //     return $query
                    //     ->when($data['start_shipping'], fn($q) => $q->whereDate('estimated_delivery_date', '>=', $data['start_shipping']))
                    //     ->when($data['end_shipping'], fn($q) => $q->whereDate('estimated_delivery_date', '<=', $data['end_shipping']))
                    //     ->when($data['start_transaction'], fn($q) => $q->whereDate('created_at', '>=', $data['start_transaction']))
                    //     ->when($data['end_transaction'], fn($q) => $q->whereDate('created_at', '<=', $data['end_transaction']));
                    // }),
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
                ->action(function ($livewire) {
                    $filteredQuery = $livewire->getFilteredTableQuery();

                    return Excel::download(
                        new OrdersExport($filteredQuery),
                        'orders-' . now()->format('Y-m-d') . '.xlsx'
                    );
                }),
            ]);
    }
}