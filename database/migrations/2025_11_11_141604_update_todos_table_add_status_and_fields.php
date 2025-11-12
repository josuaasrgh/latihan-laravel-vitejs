<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            // tambahkan kolom jika belum ada
            if (!Schema::hasColumn('todos', 'status')) {
                $table->enum('status', ['open', 'in_progress', 'done'])->default('open');
            }
            if (!Schema::hasColumn('todos', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            }
            if (!Schema::hasColumn('todos', 'note')) {
                $table->text('note')->nullable();
            }
            if (!Schema::hasColumn('todos', 'cover_path')) {
                $table->string('cover_path')->nullable();
            }
            if (!Schema::hasColumn('todos', 'due_date')) {
                $table->date('due_date')->nullable();
            }
            if (!Schema::hasColumn('todos', 'completed_at')) {
                $table->timestamp('completed_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropColumn(['status', 'priority', 'note', 'cover_path', 'due_date', 'completed_at']);
        });
    }
};
