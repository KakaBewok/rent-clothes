<?php

namespace App\Filament\Resources\AppSettings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AppSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('app_name')
                    ->required()
                    ->maxLength(255),

                FileUpload::make('app_logo')
                    ->image()
                    ->maxSize(config('uploads.images.max_size'))
                    ->acceptedFileTypes(config('uploads.images.accepted_types'))
                    ->helperText('Max file size: ' . (config('uploads.images.max_size') / 1000) . 'MB')
                    ->disk('public')
                    ->directory('settings/logo')
                    ->imageEditor()
                    ->imageEditorAspectRatios(['16:9', '4:3', '1:1']),

                TextInput::make('whatsapp_number')
                    ->tel()
                    ->placeholder('62812345678')
                    ->prefixIcon('heroicon-m-phone')
                    ->helperText('Customers will use this WhatsApp number to reach you for bookings and inquiries.')
                    ->maxLength(20),

                TextInput::make('email')
                    ->email()
                    ->helperText('This email will be displayed in the website footer for customer contact.'),
                Textarea::make('address')
                    ->rows(3)
                    ->maxLength(1000)
                    ->helperText('This address will appear in the website footer to inform customers of your location.'),
                TextInput::make('instagram')
                    ->prefix('@')
                    ->helperText('Your Instagram account will be displayed in the website footer for customers to follow.'),
                Textarea::make('description')
                    ->rows(3)
                    ->maxLength(1000)
                    ->placeholder('Selamat datang di Qatia Rent, perusahaan rental baju terkemuka yang siap membantu Anda tampil sempurna di acara istimewa Anda.
Kami memiliki koleksi baju berkualitas tinggi dari desainer terkenal untuk memenuhi kebutuhan Anda dalam acara pernikahan, lamaran, tunangan, pesta, dan acara formal lainnya. '),
            ]);
    }
}
