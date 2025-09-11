{{-- <x-filament::page>
    {{ $this->form }}
    <x-filament::button wire:click="save" class="mt-4">
        Update Account
    </x-filament::button>
</x-filament::page> --}}
<x-filament-panels::page>
    <div class="space-y-6">
        {{ $this->form }}
    </div>
</x-filament-panels::page>
