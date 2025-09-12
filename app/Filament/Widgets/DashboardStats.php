<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Order', Order::count()),
            Stat::make('Order Process', Order::whereIn('status', ['approved', 'pending', 'shipped'])->count()),
            Stat::make('Order Returned', Order::where('status', 'returned')->count()),
            Stat::make('Order Cancelled', Order::where('status', 'cancelled')->count()),
        ];
    }
}
