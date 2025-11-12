<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index(Request $req)
    {
        // hapus atau nonaktifkan baris ini supaya tidak error 403
        // $this->authorize('viewAny', Todo::class);

        $query = Todo::query()->where('user_id', $req->user()->id);

        // search by title/note
        if ($s = $req->string('q')->toString()) {
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('note', 'like', "%{$s}%");
            });
        }

        // filter: status / priority / due_date range
        if ($status = $req->string('status')->toString()) {
            $query->where('status', $status);
        }
        if ($priority = $req->string('priority')->toString()) {
            $query->where('priority', $priority);
        }
        if ($from = $req->date('from')) {
            $query->whereDate('due_date', '>=', $from);
        }
        if ($to = $req->date('to')) {
            $query->whereDate('due_date', '<=', $to);
        }

        $todos = $query->latest()->paginate(20)->withQueryString();

        $stats = [
            'total' => (clone $query)->count(),
            'done'  => (clone $query)->where('status', 'done')->count(),
            'open'  => (clone $query)->where('status', 'open')->count(),
        ];

        return Inertia::render('todos/Index', [
            'todos' => $todos,
            'filters' => $req->only(['q', 'status', 'priority', 'from', 'to']),
            'stats' => $stats,
        ]);
    }

    public function store(StoreTodoRequest $req)
    {
        // tidak perlu authorize di sini, user_id sudah otomatis terisi
        $todo = $req->user()->todos()->create($req->validated());
        return back()->with('flash', ['ok' => true, 'msg' => 'Todo dibuat']);
    }

    public function update(UpdateTodoRequest $req, Todo $todo)
    {
        // tambahkan pengecekan manual agar tetap aman
        if ($req->user()->id !== $todo->user_id) {
            abort(403, 'Kamu tidak berhak mengedit todo ini.');
        }

        $todo->update($req->validated());
        return back()->with('flash', ['ok' => true, 'msg' => 'Todo diubah']);
    }

    public function destroy(Request $req, Todo $todo)
    {
        if ($req->user()->id !== $todo->user_id) {
            abort(403, 'Kamu tidak berhak menghapus todo ini.');
        }

        $todo->delete();
        return back()->with('flash', ['ok' => true, 'msg' => 'Todo dihapus']);
    }

    public function updateCover(Request $req, Todo $todo)
    {
        if ($req->user()->id !== $todo->user_id) {
            abort(403, 'Kamu tidak berhak mengubah cover todo ini.');
        }

        $data = $req->validate([
            'cover' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($todo->cover_path) {
            Storage::disk('public')->delete($todo->cover_path);
        }

        $path = $req->file('cover')->store('todos', 'public');
        $todo->update(['cover_path' => $path]);

        return back()->with('flash', ['ok' => true, 'msg' => 'Cover diperbarui']);
    }
}
