<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Sitemap\SitemapGenerator;


Route::get('/generate-sitemap', function () {
    SitemapGenerator::create('https://qatiarent-development.site')
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
});
Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/form/{product}', [OrderController::class, 'show'])->name('order.form.show');

//api
Route::get('/api/products/stock/{product}', [ProductController::class, 'showStockAvailable'])->name('api.products.show.stock.available');
Route::get('/api/products', [ProductController::class, 'show'])->name('api.products.show'); // avail product for auto complete @search field
Route::get('/api/products/available', [ProductController::class, 'getAvailableProducts']);

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
