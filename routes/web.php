<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\HomeController;

// Route::get('/schedule', [ScheduleController::class, 'form'])->name('schedule.form');
// Route::post('/schedule', [ScheduleController::class, 'submit'])->name('schedule.submit');

Route::get('/', [HomeController::class, 'index'])->name('home.index');


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
