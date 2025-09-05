<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Product;
use App\Models\Size;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Information')
                    ->icon('heroicon-m-identification')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('phone_number')
                            ->numeric()
                            ->prefixIcon('heroicon-m-phone')
                            ->maxLength(20),

                        FileUpload::make('identity_image')
                            ->label('Identity Document (KTP/SIM Card)')
                            ->image()
                            ->disk('public')
                            ->directory('orders/identity')
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->imageEditor()
                            ->maxSize(config('uploads.images.max_size'))
                            ->acceptedFileTypes(config('uploads.images.accepted_types'))
                            ->helperText('Upload clear photo of ID card. Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                            ->required(),

                        Select::make('expedition')
                            ->label('Shipping Service')
                            ->required()
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
                            ])
                            ->searchable(),

                        TextInput::make('account_number')
                            ->numeric()
                            ->required()
                            ->maxLength(50),

                        Select::make('provider_name')
                            ->label('Bank Name/Provider')
                            ->required()
                            ->options([
                                'BCA' => 'BCA',
                                'Mandiri' => 'Mandiri',
                                'BNI' => 'BNI',
                                'BRI' => 'BRI',
                                'CIMB Niaga' => 'CIMB Niaga',
                                'Permata' => 'Permata',
                                'Danamon' => 'Danamon',
                                'Gopay' => 'Gopay',
                                'OVO' => 'OVO',
                                'DANA' => 'DANA',
                                'ShopeePay' => 'ShopeePay'
                            ])
                            ->searchable(),

                        Select::make('status')
                            ->label('Order Status')
                            ->options([
                                'pending'   => 'Pending',
                                'approved'  => 'Approved',
                                'shipped'   => 'Shipped',
                                'returned'  => 'Returned',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('pending')
                            ->required()
                            ->native(false),
                        Textarea::make('address')
                            ->label('Delivery Address')
                            ->required()
                            ->rows(3)
                            ->maxLength(500)
                            ->placeholder('Enter complete delivery address'),
                        Textarea::make('desc')
                            ->label('Additional Notes')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Any special instructions or notes...'),
                    ])
                    ->columns(2),

                Section::make('Order Items')
                    ->icon('heroicon-m-shopping-cart')
                    ->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->schema([
                                Select::make('product_id')
                                    ->label('Catalogue')
                                    ->relationship('product', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function (callable $set) {
                                        $set('size_id', null);
                                        $set('quantity', null);
                                    }),

                                Select::make('size_id')
                                    ->label('Size')
                                    ->relationship(
                                        name: 'size',
                                        titleAttribute: 'size',
                                        modifyQueryUsing: fn($query, callable $get) => $query->where('product_id', $get('product_id'))
                                    )
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->reactive()
                                    ->disabled(fn(callable $get) => !$get('product_id')),
                                TextInput::make('quantity')
                                    ->numeric()
                                    ->required()
                                    ->minValue(1)
                                    ->maxValue(function (callable $get) {
                                        $sizeId = $get('size_id');
                                        if ($sizeId) {
                                            $size = Size::find($sizeId);
                                            return $size?->quantity ?? null;
                                        }
                                        return null;
                                    })
                                    ->reactive()
                                    ->disabled(fn(callable $get) => !$get('product_id'))
                                    ->helperText(function (callable $get) {
                                        $sizeId = $get('size_id');
                                        if ($sizeId) {
                                            $size = Size::find($sizeId);
                                            if ($size && $size->availability) {
                                                return "Available stock for size {$size->size}: {$size->quantity} items";
                                            }
                                        }
                                        return 'Select size to see stock availability';
                                    }),
                                // ->rules([
                                //     function ($get) {
                                //         return function (string $attribute, $value, $fail) use ($get) {
                                //             $productId = $get('product_id');
                                //             $sizeId = $get('size_id');

                                //             if ($productId && $sizeId && $value) {
                                //                 $product = Product::with('sizes')->find($productId);

                                //                 if ($product) {
                                //                     $size = $product->sizes->firstWhere('id', $sizeId);

                                //                     if ($size && $value > $size->quantity) {
                                //                         $fail("Quantity cannot exceed {$size->quantity} for this size.");
                                //                     }
                                //                 }
                                //             }
                                //         };
                                //     }
                                // ]),
                                Select::make('shipping')
                                    ->options([
                                        "Same day" => "Same day",
                                        "Next day" => "Next day",
                                    ])
                                    ->required(),

                                TextInput::make('rent_periode')
                                    ->label('Rental Period')
                                    ->suffix('Day(s)')
                                    ->numeric()
                                    ->required()
                                    ->minValue(1)
                                    ->rules([
                                        function ($get) {
                                            return function (string $attribute, $value, $fail) use ($get) {
                                                $productId = $get('product_id');
                                                if ($productId && $value) {
                                                    $product = Product::find($productId);

                                                    if ($product && $value > $product->rent_periode) {
                                                        $fail("Rental period cannot exceed {$product->rent_periode} day(s) for this catalogue.");
                                                    }
                                                }
                                            };
                                        }
                                    ]),
                                TextInput::make('rent_price')
                                    ->label('Rent Price')
                                    ->numeric()
                                    ->prefix('Rp')
                                    ->required()
                                    ->dehydrated(false)
                                    ->helperText('Click "Calculate Rent Price" button to confirm the final price for this item'),
                                Actions::make([
                                    Action::make('calculate_rent_price')
                                        ->icon('heroicon-m-calculator')
                                        ->color('success')
                                        ->action(function (callable $set, callable $get) {
                                            $productId = $get('product_id');
                                            $days = (int) $get('rent_periode');
                                            $qty = (int) $get('quantity');

                                            if ($productId && $days && $qty) {
                                                $pricePerDay = Product::where('id', $productId)
                                                    ->with('priceDetail')
                                                    ->first()?->priceDetail?->rent_price;

                                                if ($pricePerDay) {
                                                    $total = $pricePerDay * $days * $qty;
                                                    $set('rent_price', $total);
                                                }
                                            }
                                        })
                                ]),
                                TextInput::make('deposit')
                                    ->numeric()
                                    ->prefix('Rp'),

                                DatePicker::make('use_by_date')
                                    ->label('Use By Date')
                                    ->prefixIcon('heroicon-o-calendar')
                                    ->required()
                                    ->native(false)
                                    ->displayFormat('d/m/Y')
                                    ->minDate(today())
                                    ->helperText('When the item will be used'),

                                DatePicker::make('estimated_delivery_date')
                                    ->label('Estimated Delivery')
                                    ->prefixIcon('heroicon-o-calendar')
                                    ->native(false)
                                    ->displayFormat('d/m/Y')
                                    ->minDate(today()),

                                DatePicker::make('estimated_return_date')
                                    ->label('Estimated Return')
                                    ->prefixIcon('heroicon-o-calendar')
                                    ->native(false)
                                    ->displayFormat('d/m/Y')
                                    ->after('estimated_delivery_date')
                            ])
                            ->columns(2)
                            ->collapsible()
                            ->collapsed(false)
                            ->deleteAction(
                                fn(Action $action) => $action->requiresConfirmation()
                            )
                            ->reorderable()
                            ->itemLabel(function (array $state): ?string {
                                if (!empty($state['product_id'])) {
                                    $product = Product::find($state['product_id']);
                                    $size = !empty($state['size_id']) ? Size::find($state['size_id']) : null;

                                    $label = $product?->name ?? 'Unknown Product';
                                    if ($size) {
                                        $label .= " ({$size->size})";
                                    }
                                    if (!empty($state['rent_price'])) {
                                        $label .= " - Rp " . number_format($state['rent_price'], 0, ',', '.');
                                    }

                                    return $label;
                                }

                                return 'New Item';
                            })
                            ->defaultItems(1)
                            ->minItems(1),
                    ])
                    ->columns(1),
            ])->columns(1);
    }
}
