<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // semua user boleh ubah todo miliknya
        return true;
    }

    public function rules(): array
    {
        return [
            'title'    => ['sometimes', 'string', 'max:255'],
            'note'     => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['sometimes', 'in:low,medium,high'],
            'status'   => ['sometimes', 'in:open,in_progress,done'],
            'completed_at' => ['nullable', 'date'],
        ];
    }
}
