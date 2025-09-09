<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Size;
use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HelperService
{
    public static function getAvailableStock($productId, $sizeId, $startDate, $endDate, $excludeOrderId = null): int
    {
        try {
            return DB::transaction(function () use ($productId, $sizeId, $startDate, $endDate, $excludeOrderId) {
                if (empty($productId) || empty($sizeId) || empty($startDate) || empty($endDate)) {
                    throw new \InvalidArgumentException('Missing required parameters for stock calculation');
                }

                $sql = "
                    SELECT 
                        s.id, 
                        s.quantity AS fix_stock,
                        s.quantity - COALESCE(SUM(
                            CASE 
                                WHEN o.status IN ('pending', 'approved', 'shipped')
                                    AND oi.use_by_date <= :endDate
                                    AND COALESCE(oi.estimated_return_date, DATE_ADD(oi.use_by_date, INTERVAL o.rent_periode DAY)) >= :startDate
                                    AND (:excludeOrderIdCheck IS NULL OR o.id != :excludeOrderId)
                                THEN 
                                    oi.quantity
                                ELSE 0
                            END
                        ), 0) AS available_stock
                    FROM 
                        sizes s
                    LEFT JOIN 
                        order_items oi ON oi.size_id = s.id
                    LEFT JOIN 
                        orders o ON o.id = oi.order_id
                    WHERE 
                        s.id = :sizeId
                    AND 
                        s.product_id = :productId
                    GROUP BY 
                        s.id, s.quantity
                    FOR UPDATE
                ";

                $result = DB::selectOne($sql, [
                    'productId' => $productId,
                    'sizeId'    => $sizeId,
                    'startDate' => $startDate,
                    'endDate'   => $endDate,
                    'excludeOrderId'     => $excludeOrderId,
                    'excludeOrderIdCheck' => $excludeOrderId,
                ]);

                if (!$result) {
                    Log::warning('Size not found for stock calculation', [
                        'product_id' => $productId,
                        'size_id' => $sizeId
                    ]);
                    return 0;
                }

                return max(0, (int) $result->available_stock);
            });
        } catch (\Exception $e) {
            Log::error('Error calculating available stock', [
                'product_id' => $productId,
                'size_id' => $sizeId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'error' => $e->getMessage()
            ]);

            return 0;
        }
    }

    public static function getStockDetails($productId, $sizeId): array
    {
        try {
            $result = DB::selectOne("
                SELECT s.id, s.quantity, p.name as product_name
                FROM sizes s
                JOIN products p ON p.id = s.product_id
                WHERE s.id = ? AND s.product_id = ?
            ", [$sizeId, $productId]);

            return $result ? (array) $result : [];
        } catch (\Exception $e) {
            Log::error('Error getting stock details', [
                'product_id' => $productId,
                'size_id' => $sizeId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    public static function calculateFinalPrice(callable $set, callable $get): void
    {
        $rentPrice = (float) $get('rent_price');
        $discount = (float) $get('discount');

        if ($discount > 0) {
            $priceAfter = $rentPrice - ($rentPrice * $discount / 100);
            $set('price_after_discount', $priceAfter);
        } else {
            $set('price_after_discount', $rentPrice);
        }
    }

    public static function rentPeriodRule(): Closure
    {
        return function ($get) {
            return function (string $attribute, $value, $fail) use ($get) {
                $productId = $get('product_id');

                if ($productId && $value) {
                    $product = Product::find($productId);

                    if ($product && $value > $product->rent_periode) {
                        $fail("Rental period cannot exceed {$product->rent_periode} day(s) for this catalogue.");
                    }
                }
            };
        };
    }

    public static function calculateOrderItemPrice(callable $set, callable $get): void
    {
        $productId = $get('product_id');
        $days = (int) $get('rent_periode');
        $qty = (int) $get('quantity');

        if (! $productId || ! $days || ! $qty) {
            return;
        }

        $product = Product::with('priceDetail')->find($productId);
        $pricePerDay = $product?->priceDetail?->rent_price;

        if ($pricePerDay) {
            $set('rent_price', $pricePerDay * $days * $qty);
        }
    }

    public static function formatOrderItemLabel(array $state): ?string
    {
        if (!empty($state['product_id'])) {
            $product = Product::find($state['product_id']);
            $size = !empty($state['size_id']) ? Size::find($state['size_id']) : null;

            $label = $product?->name ?? 'Unknown Product';

            if ($size) {
                $label .= " ({$size->size})";
            }

            if (!empty($state['rent_price'])) {
                $label .= " - Rp " . number_format($state['rent_price'], 0, ',', '.');
            }

            return $label;
        }

        return 'New Item';
    }
}
