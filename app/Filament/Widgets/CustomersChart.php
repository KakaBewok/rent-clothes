<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class CustomersChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Customers';

    protected bool $isCollapsible = true;

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = collect(DB::select("
            SELECT 
                MONTH(created_at) AS month,
                COUNT(DISTINCT name) AS customers
            FROM orders
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        "))->pluck('customers', 'month')
            ->toArray();

        return [
            'datasets' => [
                [
                    'label' => 'Customers',
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
                    'suggestedMax' => 250,
                    'beginAtZero' => true,
                    'ticks' => [
                        'stepSize' => 50,
                        'precision' => 0,
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
