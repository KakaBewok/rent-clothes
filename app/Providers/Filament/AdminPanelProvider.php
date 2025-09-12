<?php

namespace App\Providers\Filament;

use App\Filament\Pages\UpdateAccountPage;
use App\Filament\Resources\AppSettings\AppSettingResource;
use App\Filament\Widgets\CustomersChart;
use App\Filament\Widgets\DashboardStats;
use App\Filament\Widgets\OmzetChart;
use App\Models\AppSetting;
use Filament\Actions\Action;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Pink,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([DashboardStats::class, OmzetChart::class, CustomersChart::class])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->spa()
            ->userMenuItems([
                Action::make('settings')
                    ->label('General Settings')
                    ->url(fn(): string => AppSettingResource::getUrl())
                    ->icon('heroicon-o-cog-6-tooth'),
                Action::make('update_account')
                    ->url(fn(): string => UpdateAccountPage::getUrl())
                    ->icon('heroicon-o-user'),
            ])
            ->brandName(fn() => AppSetting::first()?->app_name ?? 'Qatia Rent')
            ->brandLogo(
                fn() =>
                AppSetting::first()?->app_logo
                    ? asset('storage/' . AppSetting::first()->app_logo)
                    : null
            );
    }
}
