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
use Filament\Schemas\Components\Grid;
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
                        Grid::make(1)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Full Name')
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('phone_number')
                                    ->tel()
                                    ->maxLength(20)
                            ]),

                        FileUpload::make('identity_image')
                            ->label('Identity Document (KTP/SIM Card)')
                            ->image()
                            ->directory('orders/identity')
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->imageEditor()
                            ->maxSize(3048)
                            ->acceptedFileTypes(['image/jpeg', 'image/png'])
                            ->required()
                            ->helperText('Upload clear photo of ID card (max 3MB, JPG/PNG only)'),

                        Grid::make(1)
                            ->schema([
                                Grid::make(1)
                                    ->schema([
                                        Select::make('expedition')
                                            ->label('Shipping Service')
                                            ->required()
                                            ->options([
                                                'JNE' => 'JNE',
                                                'Shopee Express' => 'Shopee Express'
                                            ])
                                            ->searchable(),

                                        TextInput::make('account_number')
                                            ->label('Account/Reference Number')
                                            ->numeric()
                                            ->required()
                                            ->maxLength(50)
                                            ->placeholder('Customer account or reference number'),

                                        Select::make('provider_name')
                                            ->label('Payment Provider')
                                            ->required()
                                            ->options([
                                                'BCA' => 'BCA',
                                                'Gopay' => 'Gopay'
                                            ])
                                            ->searchable(),
                                    ]),
                            ]),

                        Grid::make(1)
                            ->schema([
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

                            ]),
                    ])
                    ->columns(1),

                Section::make('Order Items')
                    ->icon('heroicon-m-shopping-cart')
                    ->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        Select::make('product_id')
                                            ->label('Product')
                                            ->relationship('product', 'name')
                                            ->searchable()
                                            ->preload()
                                            ->required()
                                            ->reactive()
                                            ->afterStateUpdated(fn(callable $set) => $set('size_id', null))
                                            ->placeholder('Select a product'),

                                        Select::make('size_id')
                                            ->label('Size')
                                            ->relationship('size', 'size')
                                            ->required()
                                            ->reactive()
                                            ->disabled(fn(callable $get) => !$get('product_id'))
                                            ->helperText(function (callable $get) {
                                                $sizeId = $get('size_id');
                                                if ($sizeId) {
                                                    $size = Size::find($sizeId);
                                                    if ($size) {
                                                        return "Available stock: {$size->quantity} units";
                                                    }
                                                }
                                                return 'Select size to see stock availability';
                                            }),

                                        TextInput::make('shipping')
                                            ->label('Shipping Cost')
                                            ->numeric()
                                            ->prefix('Rp')
                                            ->required()
                                            ->placeholder('0'),
                                    ]),

                                Grid::make(3)
                                    ->schema([
                                        TextInput::make('rent_periode')
                                            ->label('Rental Period (Days)')
                                            ->numeric()
                                            ->required()
                                            ->minValue(1)
                                            ->placeholder('Enter number of days')
                                            ->rules([
                                                function ($get) {
                                                    return function (string $attribute, $value, $fail) use ($get) {
                                                        $sizeId = $get('size_id');
                                                        if ($sizeId && $value) {
                                                            $size = Size::find($sizeId);
                                                            if ($size && $value > $size->quantity) {
                                                                $fail("Cannot book more than available stock ({$size->quantity} units).");
                                                            }
                                                        }
                                                    };
                                                }
                                            ]),

                                        TextInput::make('rent_price')
                                            ->label('Rental Price')
                                            ->numeric()
                                            ->prefix('Rp')
                                            ->required()
                                            ->placeholder('0')
                                            ->helperText('Price per rental period'),

                                        TextInput::make('deposit')
                                            ->label('Security Deposit')
                                            ->numeric()
                                            ->prefix('Rp')
                                            ->placeholder('0')
                                            ->helperText('Optional security deposit'),
                                    ]),

                                Grid::make(3)
                                    ->schema([
                                        DatePicker::make('use_by_date')
                                            ->label('Use By Date')
                                            ->required()
                                            ->native(false)
                                            ->displayFormat('d/m/Y')
                                            ->minDate(today())
                                            ->helperText('When the item will be used'),

                                        DatePicker::make('estimated_delivery_date')
                                            ->label('Estimated Delivery')
                                            ->native(false)
                                            ->displayFormat('d/m/Y')
                                            ->minDate(today())
                                            ->helperText('Expected delivery date'),

                                        DatePicker::make('estimated_return_date')
                                            ->label('Estimated Return')
                                            ->native(false)
                                            ->displayFormat('d/m/Y')
                                            ->after('estimated_delivery_date')
                                            ->helperText('Expected return date'),
                                    ]),
                            ])
                            ->columns(1)
                            ->collapsible()
                            ->collapsed(false)
                            ->addActionLabel('Add New Item')
                            ->deleteAction(
                                fn(Action $action) => $action->requiresConfirmation()
                            )
                            ->reorderableWithButtons()
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
            ]);

        // return $schema
        //     ->components([
        //         Section::make('Customer Info')
        //             ->schema([
        //                 TextInput::make('name')->required(),
        //                 TextInput::make('phone_number')->required(),
        //                 FileUpload::make('identity_image')
        //                     ->image()
        //                     ->directory('orders/identity')
        //                     ->required(),
        //                 Textarea::make('address')->required(),
        //                 TextInput::make('expedition')->required(),
        //                 TextInput::make('account_number')->required(),
        //                 TextInput::make('provider_name')->required(),
        //                 Select::make('status')
        //                     ->options([
        //                         'pending'   => 'Pending',
        //                         'approved'  => 'Approved',
        //                         'shipped'   => 'Shipped',
        //                         'returned'  => 'Returned',
        //                         'cancelled' => 'Cancelled',
        //                     ])
        //                     ->default('pending'),
        //                 Textarea::make('desc'),
        //             ])->columns(2),

        //         Section::make('Order Items')
        //             ->schema([
        //                 Repeater::make('items')
        //                     ->relationship()
        //                     ->schema([
        //                         Select::make('product_id')
        //                             ->relationship('product', 'name')
        //                             ->searchable()
        //                             ->required(),

        //                         Select::make('size_id')
        //                             ->relationship('size', 'size')
        //                             ->required()
        //                             ->reactive(),

        //                         TextInput::make('shipping')
        //                             ->required(),

        //                         TextInput::make('rent_periode')
        //                             ->numeric()
        //                             ->required()
        //                             ->rules([
        //                                 function (Forms\Get $get) {
        //                                     return function (string $attribute, $value, $fail) use ($get) {
        //                                         $sizeId = $get('size_id');
        //                                         if ($sizeId) {
        //                                             $size = Size::find($sizeId);
        //                                             if ($size && $value > $size->quantity) {
        //                                                 $fail("Cannot book more than available stock ({$size->quantity}).");
        //                                             }
        //                                         }
        //                                     };
        //                                 }
        //                             ]),

        //                         TextInput::make('rent_price')
        //                             ->numeric()
        //                             ->prefix('Rp')
        //                             ->required(),

        //                         TextInput::make('deposit')
        //                             ->numeric()
        //                             ->prefix('Rp'),

        //                         DatePicker::make('use_by_date')
        //                             ->required(),

        //                         DatePicker::make('estimated_delivery_date'),
        //                         DatePicker::make('estimated_return_date'),
        //                     ])
        //                     ->columns(3)
        //                     ->collapsible()
        //                     ->addActionLabel('Add Item'),
        //             ])
        //     ]);
    }
}
