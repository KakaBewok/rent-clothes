<?php

namespace App\Filament\Pages;

use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Support\Facades\Hash;

class UpdateAccountPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $title = 'Update Account';

    protected string $view = 'filament.pages.update-account-page';

    protected static bool $shouldRegisterNavigation = false;

    public $name;
    public $email;
    public $current_password;
    public $new_password;
    public $new_password_confirmation;

    public function mount(): void
    {
        $this->email = Filament::auth()->user()->email;
        $this->name = Filament::auth()->user()->name;
    }

    public function getFormSchema(): array
    {
        return [
            Tabs::make('Update Account')
                ->tabs([
                    Tab::make('Update Name & Email')
                        ->schema([
                            TextInput::make('name')
                                ->default(fn() => Filament::auth()->user()->name)
                                ->required(),

                            TextInput::make('email')
                                ->label('New Email')
                                ->email()
                                ->default(fn() => Filament::auth()->user()->email)
                                ->required(),

                            Actions::make([
                                Action::make('saveNameAndEmail')
                                    ->label('Update')
                                    ->action(fn() => $this->updateEmailAndName())
                                    ->color('primary')
                                    ->button(),
                            ])->alignEnd(),
                        ]),

                    Tab::make('Update Password')
                        ->schema([
                            TextInput::make('current_password')
                                ->label('Current Password')
                                ->password()
                                ->revealable()
                                ->required(),

                            TextInput::make('new_password')
                                ->label('New Password')
                                ->password()
                                ->revealable()
                                ->confirmed()
                                ->required(),

                            TextInput::make('new_password_confirmation')
                                ->label('Confirm New Password')
                                ->password()
                                ->revealable()
                                ->required(),

                            Actions::make([
                                Action::make('savePassword')
                                    ->label('Update')
                                    ->action(fn() => $this->updatePassword())
                                    ->color('primary')
                                    ->button(),
                            ])->alignEnd(),
                        ]),
                ]),
        ];
    }

    public function updateEmailAndName()
    {
        $this->validateOnly('email');
        $this->validateOnly('name');

        $user = Filament::auth()->user();
        $user->name = $this->name;
        $user->email = $this->email;
        $user->save();

        Notification::make()
            ->title('Profile updated successfully!')
            ->success()
            ->send();
    }

    public function updatePassword()
    {
        $this->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'confirmed'],
        ]);

        $user = Filament::auth()->user();

        if (!Hash::check($this->current_password, $user->password)) {
            Notification::make()
                ->title('Current password is incorrect.')
                ->danger()
                ->send();
            return;
        }

        $user->password = Hash::make($this->new_password);
        $user->save();

        Notification::make()
            ->title('Password updated successfully!')
            ->success()
            ->send();

        $this->reset(['current_password', 'new_password', 'new_password_confirmation']);
    }
}
