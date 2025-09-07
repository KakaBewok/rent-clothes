<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cover_image');
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->foreignId('color_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->string('additional_ribbon')->nullable();
            $table->foreignId('type_id')->constrained()->cascadeOnDelete();
            $table->string('ownership')->nullable();
            $table->integer('rent_periode');
            $table->timestamp('upload_at')->useCurrent();
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
