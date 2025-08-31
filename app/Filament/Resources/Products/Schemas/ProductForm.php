<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Grouping\Group;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Dress Details')
                    ->schema([
                        TextInput::make('name')->label("Dress Name")->required(),
                        TextInput::make('code')->required(),
                        Select::make('brand_id')
                            ->relationship('brand', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->label('Brand Name')
                                    ->required(),
                                Textarea::make('desc')
                                    ->label('Description')->nullable(),
                            ]),
                        Select::make('color_id')
                            ->relationship('color', 'name')
                            ->searchable()
                            ->preload()
                            ->required()->createOptionForm([
                                TextInput::make('name')->required(),
                                TextInput::make('hex_code')->nullable(),
                            ]),
                        Select::make('branch_id')
                            ->relationship('branch', 'name')
                            ->searchable()
                            ->preload()
                            ->required()->createOptionForm([
                                TextInput::make('name')
                                    ->required(),
                                TextInput::make('location')
                                    ->required(),
                                Textarea::make('desc')
                                    ->columnSpanFull()->nullable(),
                            ]),
                        TextInput::make('ownership')->nullable(),
                        TextInput::make('rental_periode')
                            ->label('Rent Periode (Day)')
                            ->numeric()
                            ->default(1)
                            ->required(),
                        DatePicker::make('upload_at')->required()->default(now()),
                        RichEditor::make('description')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'link',
                                'blockquote',
                                'bulletList'
                            ])->columnSpanFull()
                    ])->columns(2),

                Section::make('Media')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->image()
                            ->directory('products/covers')
                            ->required(),

                        Repeater::make('galleries')
                            ->relationship()
                            ->schema([
                                FileUpload::make('image')
                                    ->image()
                                    ->directory('products/galleries'),
                            ])
                            ->minItems(1)->reorderable()->collapsible(),
                    ]),

                Section::make('Detail Harga')
                    ->relationship('priceDetail')
                    ->schema([
                        TextInput::make('rent_price')
                            ->label('Harga Sewa')
                            ->numeric()
                            ->required(),

                        TextInput::make('deposit')
                            ->label('Deposit')
                            ->numeric()
                            ->default(0),

                        TextInput::make('discount')
                            ->label('Diskon (%)')
                            ->numeric()
                            ->default(0),

                        TextInput::make('price_after_discount')
                            ->label('Harga Setelah Diskon')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false), // biar tidak disimpan manual, karena sudah dihitung di model

                        TextInput::make('additional_time_price')
                            ->label('Biaya Tambahan Waktu')
                            ->numeric()
                            ->default(0),

                        TextInput::make('additional_ribbon')
                            ->label('Tambahan Pita')
                            ->numeric()
                            ->default(0),

                        Select::make('type_id')
                            ->label('Tipe')
                            ->relationship('type', 'name')
                            ->searchable()
                            ->required(),

                    ])
                    ->columns(2),

                Section::make('Ukuran')
                    ->schema([
                        Repeater::make('sizes')
                            ->relationship()
                            ->schema([
                                TextInput::make('size')->required(), // XS, S, M, L
                                TextInput::make('quantity')->numeric()->required(),
                                Toggle::make('availability')->label('Available'),
                            ])
                            ->minItems(1)->reorderable()->collapsible(),
                    ]),
            ]);
    }
}
