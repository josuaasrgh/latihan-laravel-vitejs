// resources/js/Pages/Todos/Index.jsx
import { useForm, usePage, Link } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Chart from 'react-apexcharts'
import { route } from 'ziggy-js'


// ✅ import Trix
import 'trix/dist/trix.css'
import 'trix'

export default function Index({ todos, filters, stats }) {
  const { flash } = usePage().props

  // Form tambah todo
  const create = useForm({
    title: '',
    note: '',
    due_date: '',
    priority: 'medium',
    status: 'open',
  })

  // Form filter
  const filter = useForm({ ...filters })

  // ✅ SweetAlert flash message
  useEffect(() => {
    if (flash?.msg) {
      Swal.fire(flash.ok ? 'Berhasil' : 'Gagal', flash.msg, flash.ok ? 'success' : 'error')
    }
  }, [flash])

  // ✅ Buat todo baru
  const onCreate = (e) => {
    e.preventDefault()
    create.post(route('todos.store'), {
      onSuccess: () => {
        create.reset()
        const noteField = document.querySelector('trix-editor')
        if (noteField) noteField.value = ''
      },
    })
  }

  // ✅ Hapus todo
  const onDelete = (id) => {
    Swal.fire({
      title: "Hapus todo?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    }).then((res) => {
      if (res.isConfirmed) {
        router.delete(route("todos.destroy", id), {
          onSuccess: () =>
            Swal.fire("Terhapus", "Todo berhasil dihapus", "success"),
          onError: () =>
            Swal.fire("Gagal", "Tidak dapat menghapus todo", "error"),
        });
      }
    });
  };


  // ✅ Terapkan filter
  const onFilter = (e) => {
    e.preventDefault()

    
    const params = Object.fromEntries(
      Object.entries(filter.data()).filter(([_, v]) => v !== '' && v !== null)
    )

    router.get(route('todos.index'), params, { preserveState: true })
  }


  return (
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold">Todos</h1>

      {/* Statistik (ApexCharts) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-700 rounded-xl bg-gray-800">
          <Chart
            type="donut"
            series={[stats.done, stats.open, Math.max(stats.total - stats.done - stats.open, 0)]}
            options={{
              labels: ['Done', 'Open', 'In Progress'],
              colors: ['#22c55e', '#3b82f6', '#9ca3af'],
              legend: { position: 'bottom' },
            }}
          />
        </div>
        <div className="p-4 border border-gray-700 rounded-xl bg-gray-800 flex flex-col justify-center items-center">
          <div className="text-sm text-gray-400">Total Todo</div>
          <div className="text-4xl font-semibold">{stats.total}</div>
        </div>
      </div>

      {/* Form tambah */}
      <form onSubmit={onCreate} className="grid gap-3 p-4 border border-gray-700 rounded-xl bg-gray-800">
        <input
          className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
          placeholder="Judul"
          value={create.data.title}
          onChange={(e) => create.setData('title', e.target.value)}
          required
        />

        {/* ✅ Trix Editor (fixed) */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Catatan (opsional)</label>
          <input id="note" type="hidden" value={create.data.note} />
          <trix-editor
            input="note"
            className="trix-content border border-gray-600 rounded bg-gray-700 text-white p-2"
            onInput={(e) => {
              const value = e.target.innerHTML
              create.setData('note', value)
            }}
          ></trix-editor>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="date"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
            value={create.data.due_date ?? ''}
            onChange={(e) => create.setData('due_date', e.target.value)}
          />
          <select
            className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
            value={create.data.priority}
            onChange={(e) => create.setData('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
            value={create.data.status}
            onChange={(e) => create.setData('status', e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium transition">
          Tambah
        </button>
      </form>

      {/* Filter & search */}
      <form onSubmit={onFilter} className="grid md:grid-cols-5 gap-3 p-4 border border-gray-700 rounded-xl bg-gray-800">
        <input
          className="border border-gray-600 bg-gray-700 p-2 rounded md:col-span-2 text-white"
          placeholder="Cari judul/isi"
          value={filter.data.q ?? ''}
          onChange={(e) => filter.setData('q', e.target.value)}
        />
        <select
          className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
          value={filter.data.status ?? ''}
          onChange={(e) => filter.setData('status', e.target.value)}
        >
          <option value="">(Semua status)</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
          value={filter.data.priority ?? ''}
          onChange={(e) => filter.setData('priority', e.target.value)}
        >
          <option value="">(Semua prioritas)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
            value={filter.data.from ?? ''}
            onChange={(e) => filter.setData('from', e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
            value={filter.data.to ?? ''}
            onChange={(e) => filter.setData('to', e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
            Terapkan
          </button>
        </div>
      </form>

      {/* List + aksi */}
      <div className="space-y-4">
        {todos.data.map((t) => {
          const dueDate = t.due_date
            ? new Date(t.due_date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'Tidak ada tanggal'

          const statusColor =
            t.status === 'done'
              ? 'bg-green-200 text-green-900'
              : t.status === 'in_progress'
              ? 'bg-blue-200 text-blue-900'
              : 'bg-gray-200 text-gray-900'

          const priorityColor =
            t.priority === 'high'
              ? 'bg-red-200 text-red-900'
              : t.priority === 'medium'
              ? 'bg-yellow-200 text-yellow-900'
              : 'bg-green-200 text-green-900'

          return (
            <div
              key={t.id}
              className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800 text-gray-100 rounded-2xl shadow-md transition hover:shadow-lg"
            >
              {/* Cover Todo */}
              <div className="w-full md:w-1/4">
                {t.cover_path ? (
                  <img
                    src={`/storage/${t.cover_path}`}
                    alt="Cover"
                    className="rounded-xl w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                    Tidak ada cover
                  </div>
                )}
              </div>

              {/* Isi Todo */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{t.title}</h2>
                  <p className="text-sm text-gray-400 mb-2">
                    {dueDate} •{' '}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColor}`}>
                      {t.priority}
                    </span>{' '}
                    •{' '}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </p>
                  {t.note && <p className="text-gray-300 text-sm mb-3">{t.note}</p>}
                </div>

                {/* Tombol aksi */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {t.status !== 'done' ? (
                    <button
                      onClick={() =>
                        router.put(route('todos.update', t.id), { status: 'done' }, {
                          onSuccess: () => Swal.fire("Berhasil", "Todo ditandai selesai", "success"),
                          onError: () => Swal.fire("Gagal", "Terjadi kesalahan", "error"),
                        })
                      }
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm"
                    >
                      Tandai Selesai
                    </button>

                  ) : (
                    <button
                      onClick={() =>
                        router.put(route('todos.update', t.id), { status: 'open' }, {
                          onSuccess: () => Swal.fire("Berhasil", "Todo dibuka kembali", "success"),
                          onError: () => Swal.fire("Gagal", "Terjadi kesalahan", "error"),
                        })

                      }
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm"
                    >
                      Tandai Open
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(t.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                  >
                    Hapus
                  </button>

                  <label className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer text-sm">
                    Ubah Cover
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const form = new FormData()
                        form.append('cover', file)
                        router.post(route('todos.cover', t.id), form, {
                          onSuccess: () => Swal.fire("Berhasil", "Cover berhasil diperbarui", "success"),
                          onError: () => Swal.fire("Gagal", "Format tidak valid atau ukuran terlalu besar", "error"),
                        })

                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 items-center justify-center mt-4">
        {todos.links.map((l, i) => (
          <Link
            key={i}
            href={l.url || '#'}
            dangerouslySetInnerHTML={{ __html: l.label }}
            className={`px-3 py-1 border rounded ${
              l.active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
            } ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
