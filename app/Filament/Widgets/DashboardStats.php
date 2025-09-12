<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    public static function sort(): int
    {
        return 0;
    }

    protected function getStats(): array
    {
        return [
            Stat::make('Total Order', Order::count()),
            Stat::make('Order Process', Order::where('status', 'approved')->count()),
            Stat::make('Order Returned', Order::where('status', 'returned')->count()),
        ];
    }
}
