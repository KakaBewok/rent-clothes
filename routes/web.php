<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Sitemap\SitemapGenerator;



// Route::get('/schedule', [ScheduleController::class, 'form'])->name('schedule.form');
// Route::post('/schedule', [ScheduleController::class, 'submit'])->name('schedule.submit');

Route::get('/generate-sitemap', function () {
    SitemapGenerator::create('https://qatiarent-development.site')
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
});
Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/api/products/{product}', [ProductController::class, 'show'])->name('api.products.show');


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
