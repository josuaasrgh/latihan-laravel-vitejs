<?php

namespace App\Policies;

use App\Models\Todo;
use App\Models\User;

class TodoPolicy
{
    /**
     * Izinkan semua user untuk melihat daftar todo-nya sendiri
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Izinkan user melihat todo miliknya sendiri
     */
    public function view(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }

    /**
     * Izinkan semua user membuat todo baru
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Izinkan user mengubah todo miliknya sendiri
     */
    public function update(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }

    /**
     * Izinkan user menghapus todo miliknya sendiri
     */
    public function delete(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }

    public function restore(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }

    public function forceDelete(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }
}
