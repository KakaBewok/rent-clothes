<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use App\Services\HelperService;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $items = $this->data['items'] ?? [];

        foreach ($items as $item) {
            $useByDate = date('Y-m-d', strtotime($item['use_by_date']));
            $endDate   = date('Y-m-d', strtotime($item['estimated_return_date']));

            $available = HelperService::getAvailableStock(
                $item['product_id'],
                $item['size_id'],
                $useByDate,
                $endDate,
                $record->id
            );

            Log::info("Available stock (update): {$available}");

            if ($available < $item['quantity']) {
                $product = Product::find($item['product_id']);
                $size    = Size::find($item['size_id']);

                Notification::make()
                    ->title('Insufficient Stock')
                    ->danger()
                    ->persistent()
                    ->body("Product: {$product?->name} (Size: {$size?->size}) only has {$available} pcs available, but you requested {$item['quantity']}.")
                    ->send();

                $this->halt();
            }
        }

        $record->update($data);

        return $record;
    }
}
