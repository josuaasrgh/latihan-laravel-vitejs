<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTodoRequest extends FormRequest
{
    /**
     * Izinkan semua user untuk menambah todo
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validasi input form tambah todo
     */
    public function rules(): array
    {
        return [
            'title'    => ['required', 'string', 'max:255'],
            'note'     => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['required', 'in:low,medium,high'],
            'status'   => ['required', 'in:open,in_progress,done'],
        ];
    }
}
