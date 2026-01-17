<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Mail\OrderFormSubmitted;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Sitemap\SitemapGenerator;

// email test
// Route::get('/email-test', function () {
//     Mail::raw('Email test successfuly', function ($message) {
//         $message->to('calarayaproject@gmail.com')
//                 ->subject('SMTP Test');
//     });
// });

// log viewer
Route::get('nenjologs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);

// mail template preview
Route::get('/mail-preview', function () {
    $order = Order::with(['items.product', 'items.size'])->latest()->first();
    return new OrderFormSubmitted($order);
});

Route::get('/generate-sitemap', function () {
    SitemapGenerator::create('https://qatiarent.com')
        ->writeToFile(public_path('sitemap.xml'));
    return 'Sitemap generated!';
});
Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/form', [OrderController::class, 'show'])->name('order.form.show');

//api
Route::get('/api/products/stock/{product}', [ProductController::class, 'showStockAvailable'])->name('api.products.show.stock.available');
Route::get('/api/products', [ProductController::class, 'show'])->name('api.products.show'); // avail product for auto complete @search field
Route::get('/api/products/available', [ProductController::class, 'getAvailableProducts']);
Route::post('/api/products/create', [OrderController::class, 'store'])->name('order.store');

// --- LARAVEL DEFAULT ROUTES --- //

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// --- LARAVEL DEFAULT ROUTES --- //

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
