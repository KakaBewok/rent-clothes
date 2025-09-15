<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

// class ScheduleController extends Controller
// {
//     public function form()
//     {
//         $branches = Branch::all(['id', 'name']);
//         return Inertia::render('front-end/schedule', compact('branches'));
//     }

//     public function submit(Request $request)
//     {
//         $request->validate([
//             'useByDate' => 'required|date',
//             'duration' => 'required|integer|min:1',
//             'city' => 'required',
//             'shippingType' => 'required|string',
//         ]);

//         return redirect()->route('home.index', $request->only([
//             'useByDate',
//             'duration',
//             'city',
//             'shippingType',
//         ]));
//     }
// }
