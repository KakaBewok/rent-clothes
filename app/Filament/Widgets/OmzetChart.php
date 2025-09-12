<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class OmzetChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Omzet';

    protected bool $isCollapsible = true;

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = collect(DB::select("
            SELECT 
                MONTH(o.created_at) AS month,
                SUM(oi.rent_price) AS omzet
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            GROUP BY MONTH(o.created_at)
            ORDER BY month
        "))->pluck('omzet', 'month')->toArray();

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => array_values($data),
                ],
            ],
            'labels' => array_map(fn($m) => date("F", mktime(0, 0, 0, $m, 1)), array_keys($data)),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'min' => 0,
                    'suggestedMax' => 10_000_000,
                    'beginAtZero' => true,
                    'ticks' => [
                        'stepSize' => 1_000_000,
                    ]
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
