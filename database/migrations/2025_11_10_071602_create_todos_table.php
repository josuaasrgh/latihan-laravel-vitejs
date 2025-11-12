<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('todos', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->string('title');
      $table->text('note')->nullable();          // untuk Trix
      $table->date('due_date')->nullable();
      $table->enum('priority', ['low','medium','high'])->default('medium');
      $table->enum('status', ['open','in_progress','done'])->default('open');
      $table->string('cover_path')->nullable();  // path file cover
      $table->timestamp('completed_at')->nullable();
      $table->timestamps();

      $table->index(['user_id','status','due_date']);
    });
  }
  public function down(): void { Schema::dropIfExists('todos'); }
};