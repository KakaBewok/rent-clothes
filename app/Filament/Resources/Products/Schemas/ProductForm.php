<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Services\HelperService;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Dress Detail')
                    ->icon('heroicon-m-shopping-bag')
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
                            ->suffix('Day(s)')
                            ->numeric()
                            ->default(1)
                            ->required(),
                        Select::make('additional_ribbon')
                            ->options([
                                "New arrival" => "New arrival",
                                "Coming soon" => "Coming soon",
                                "Hijab friendly" => "Hijab friendly",
                                "Promo" => "Promo",
                                "Most favorite" => "Most favorite"
                            ])
                            ->searchable()
                            ->nullable(),


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
                        DatePicker::make('upload_at')->prefixIcon('heroicon-o-calendar')->helperText('Latest catalogue will be placed on the first page.')->required()->default(now()),
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
                    ->icon('heroicon-m-banknotes')
                    ->schema([
                        TextInput::make('rent_price')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),

                        TextInput::make('discount')
                            ->suffix('%')
                            ->numeric(),

                        TextInput::make('price_after_discount')
                            ->label('Final price')
                            ->prefix('Rp')
                            ->numeric()
                            ->disabled()->helperText('Click "Calculate Final Price" button to confirm the final price')
                            ->columnSpanFull()
                            ->dehydrated(false)->numeric(),

                        Actions::make([
                            Action::make('calculate_final_price')
                                ->icon('heroicon-m-calculator')
                                ->color('success')
                                ->action(fn($set, $get) => HelperService::calculateFinalPrice($set, $get))
                        ]),
                        TextInput::make('deposit')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),

                        TextInput::make('additional_time_price')
                            ->prefix('Rp')
                            ->numeric()
                            ->required(),
                    ])->relationship('priceDetail')
                    ->columns(1),

                Section::make('Size & Quantity')
                    ->icon('heroicon-m-tag')
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
                    ->icon('heroicon-m-photo')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->image()
                            ->maxSize(config('uploads.images.max_size'))
                            ->acceptedFileTypes(config('uploads.images.accepted_types'))
                            ->helperText('Upload an image file. Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                            ->disk('public')
                            ->directory('products/covers')
                            ->imageEditor()
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->required(),


                        FileUpload::make('images')
                            ->label('Galleries')
                            ->image()
                            ->multiple()
                            ->maxFiles(10)
                            ->maxSize(config('uploads.images.max_size'))
                            ->acceptedFileTypes(config('uploads.images.accepted_types'))
                            ->helperText('Upload an image file. Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                            ->disk('public')
                            ->directory('products/galleries')
                            ->imageEditor()
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->reorderable()
                            ->extraAttributes([
                                'class' => 'space-y-3',
                            ])
                            ->required()
                    ]),
            ]);
    }
}
