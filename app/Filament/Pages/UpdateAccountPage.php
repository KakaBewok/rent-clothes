<?php

namespace App\Filament\Pages;

use Filament\Facades\Filament;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Hash;

class UpdateAccountPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.update-account-page';

    protected static bool $shouldRegisterNavigation = false;

    public function mount(): void
    {
        $this->email = Filament::auth()->user()->email;
        $this->current_password = null;
    }

    public $email;
    public $current_password;
    public $new_password;
    public $new_password_confirmation;

    public function getFormSchema(): array
    {
        return [
            TextInput::make('email')
                ->label('Update Email')
                ->email()
                ->default(fn() => Filament::auth()->user()->email),

            TextInput::make('current_password')
                ->label('Current Password')
                ->password()
                ->rules(['current_password'])
                ->revealable()
                ->required(),

            TextInput::make('new_password')
                ->label('New Password')
                ->password()
                ->required()
                ->revealable()
                ->confirmed(),

            TextInput::make('new_password_confirmation')
                ->label('Confirm New Password')
                ->password()
                ->revealable()
                ->required(),
        ];
    }

    public function save()
    {
        $this->validate();

        $user = Filament::auth()->user();

        $user->email = $this->email;

        if (!empty($this->new_password)) {
            $user->password = Hash::make($this->new_password);
        }

        $user->save();

        Notification::make()
            ->title('Account updated successfully!')
            ->success()
            ->send();

        $this->reset(['current_password', 'new_password', 'new_password_confirmation']);
    }
}
