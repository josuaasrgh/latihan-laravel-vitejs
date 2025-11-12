<?php

namespace App\Providers;

use App\Models\Todo;
use App\Policies\TodoPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Todo::class => TodoPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
