# 🚀 Modern Web App: Laravel 12 + React + Inertia.js

Aplikasi web ini dibangun menggunakan stack modern yang menggabungkan keandalan backend **Laravel 12** dengan reaktivitas frontend **React 19** melalui **Inertia.js v2** (konsep *monolith* dengan rasa *Single Page Application*). Antarmuka pengguna (UI) dirancang agar responsif dan elegan menggunakan **Tailwind CSS v4** serta sistem komponen dari **shadcn/ui**.

## 🛠️ Tech Stack & Dependencies

**Backend (PHP ^8.2):**
* [Laravel v12](https://laravel.com/) - Framework PHP utama.
* [Inertia Laravel v2](https://inertiajs.com/) - Adapter backend untuk Inertia.
* [Ziggy v2.6](https://github.com/tighten/ziggy) - Menggunakan rute (routes) Laravel langsung di JavaScript/React.

**Frontend (Node.js):**
* [React v19](https://react.dev/) - Library UI frontend.
* [Inertia.js React v2](https://inertiajs.com/) - Menghubungkan React dengan Laravel tanpa perlu membuat REST API terpisah.
* [Tailwind CSS v4](https://tailwindcss.com/) - Framework CSS *utility-first* generasi terbaru.
* [Vite](https://vitejs.dev/) - *Module bundler* yang super cepat.

**UI Components & Ekstra:**
* **shadcn/ui** (via Radix UI, `class-variance-authority`, `clsx`, `tailwind-merge`) - Komponen UI *headless* yang siap pakai.
* [Lucide React](https://lucide.dev/) - Sistem ikon.
* [ApexCharts](https://apexcharts.com/) - Untuk visualisasi data dan grafik.
* [SweetAlert2](https://sweetalert2.github.io/) - Untuk *alert* dan *pop-up* interaktif.
* [Trix](https://trix-editor.org/) - Editor teks *Rich-Text* (WYSIWYG).

## 🚀 Cara Instalasi & Menjalankan Proyek

Pastikan di komputermu sudah ter-install **PHP (>= 8.2)**, **Composer**, dan **Node.js**.

1. **Clone repository ini:**
   ```bash
   git clone (https://github.com/josuaasrgh/latihan-laravel-vitejs)
   cd nama-repo-kamu
   ```

2. **Setup Dependencies & Environment (Cara Cepat):**
   Proyek ini sudah dilengkapi dengan *script* otomatis. Kamu cukup menjalankan perintah berikut untuk menginstal Composer, NPM, menyalin `.env`, men-generate *key*, dan menjalankan migrasi database:
   ```bash
   composer run setup
   ```

3. **Cara Manual (Jika script setup di atas gagal):**
   ```bash
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   ```

4. **Jalankan Server Development:**
   Proyek ini memiliki *script* khusus yang bisa menjalankan server Laravel, Vite, dan Queue Worker secara bersamaan dalam satu terminal! Cukup jalankan:
   ```bash
   composer run dev
   ```
   *Aplikasi sekarang bisa diakses melalui browser di `http://localhost:8000`.*

## 📁 Struktur Folder Utama Frontend

Berbeda dengan Laravel konvensional (Blade), pada arsitektur Inertia + React ini, pengerjaan tampilan (UI) berpusat di folder `resources`:
* `resources/js/Pages/` - Berisi komponen React yang berfungsi sebagai halaman utama aplikasi.
* `resources/js/Components/` - Berisi komponen React yang dapat digunakan ulang (*reusable*), termasuk komponen dari shadcn/ui.
* `routes/web.php` - Tempat mendaftarkan rute aplikasi (Backend mengirim data ke komponen React via `Inertia::render`).
