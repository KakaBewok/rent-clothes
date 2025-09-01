<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Dress Detail')
                    ->schema([
                        TextInput::make('name')->label("Dress Name")->required(),
                        TextInput::make('code')->placeholder('ABAYA-01')->required(),
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
                                TextInput::make('name')->label('Color Name')->required(),
                                TextInput::make('hex_code')->nullable(),
                            ]),
                        Select::make('branch_id')
                            ->relationship('branch', 'name')
                            ->searchable()
                            ->preload()
                            ->required()->createOptionForm([
                                TextInput::make('name')->label('Branch Name')
                                    ->required(),
                                TextInput::make('location')
                                    ->required(),
                                Textarea::make('desc')
                                    ->columnSpanFull()->nullable(),
                            ]),
                        TextInput::make('ownership')->nullable(),
                        TextInput::make('rent_periode')
                            ->label('Rent Periode')
                            ->prefix('Day')
                            ->numeric()
                            ->default(1)
                            ->required(),
                        DatePicker::make('upload_at')->helperText('Latest catalogue will be placed on the first page.')->required()->default(now()),
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
                Section::make('Price Detail')
                    ->schema([
                        TextInput::make('rent_price')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),

                        TextInput::make('deposit')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),

                        TextInput::make('discount')
                            ->suffix('%')
                            ->numeric(),

                        // TextInput::make('price_after_discount')
                        //     ->prefix('Rp')
                        //     ->numeric()
                        //     ->disabled()
                        //     ->dehydrated(false), 
                        TextInput::make('additional_time_price')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),

                        TextInput::make('additional_ribbon')
                            ->numeric(),

                        Select::make('type_id')
                            ->relationship('type', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')->label('Type Name')
                                    ->required(),
                                Textarea::make('desc')
                                    ->nullable(),
                            ])
                            ->required(),
                    ])->relationship('priceDetail')
                    ->columns(2),

                Section::make('Size & Quantity')
                    ->schema([
                        Repeater::make('sizes')
                            ->relationship()
                            ->schema([
                                Select::make('size')
                                    ->options([
                                        'XS' => 'Extra Small',
                                        'S'  => 'Small',
                                        'M'  => 'Medium',
                                        'L'  => 'Large',
                                        'XL' => 'Extra Large',
                                        'XXL' => 'Double Extra Large',
                                    ])
                                    ->required()
                                    ->searchable(),
                                TextInput::make('quantity')
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        if ($state >= 1) {
                                            $set('availability', true);
                                        } else {
                                            $set('availability', false);
                                        }
                                    })->numeric()->required(),
                                Toggle::make('availability')->label('Available'),
                            ])
                            ->minItems(1)->reorderable()->collapsible(),
                    ]),



                Section::make('Media')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->image()
                            ->maxSize(3072)
                            ->disk('public')
                            ->directory('products/covers')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                            ->imageEditor()
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->helperText('Upload an image file. Max file size: 3MB.')
                            ->required(),

                        Repeater::make('galleries')
                            ->relationship()
                            ->schema([
                                FileUpload::make('image_path')
                                    ->image()
                                    ->maxSize(3072)
                                    ->disk('public')
                                    ->directory('products/galleries')
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                                    ->helperText('Upload an image file. Max file size: 3MB.')
                                    ->imageEditor()
                                    ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                                    ->required(),
                            ])
                            ->minItems(1)->reorderable()->collapsible(),
                    ]),
            ]);
    }
}
