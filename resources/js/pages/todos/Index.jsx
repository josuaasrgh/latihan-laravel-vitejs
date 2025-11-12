// resources/js/Pages/Todos/Index.jsx
import { useForm, usePage, Link } from '@inertiajs/react'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Chart from 'react-apexcharts'

// ✅ import Trix
import 'trix/dist/trix.css'
import 'trix'

export default function Index({ todos, filters, stats }) {
  const { flash } = usePage().props

  const create = useForm({
    title: '', note: '', due_date: '', priority: 'medium', status: 'open'
  })
  const filter = useForm({ ...filters })

  useEffect(() => {
    if (flash?.msg) {
      Swal.fire(flash.ok ? 'Berhasil' : 'Gagal', flash.msg, flash.ok ? 'success' : 'error')
    }
  }, [flash])

  const onCreate = (e) => {
    e.preventDefault()
    create.post(route('todos.store'), {
      onSuccess: () => {
        // ✅ Reset form state
        create.reset()

        // ✅ Pastikan textarea kosong (khusus catatan)
        const noteField = document.querySelector('textarea[name="note"]')
        if (noteField) noteField.value = ''
      },
    })
  }

  const onDelete = (id) => {
    Swal.fire({
      title: 'Hapus todo?',
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, hapus'
    }).then(res => { if (res.isConfirmed) window.router.delete(route('todos.destroy', id)) })
  }

  const onFilter = (e) => {
    e.preventDefault()
    window.router.get(route('todos.index'), filter.data())
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Todos</h1>

      {/* Statistik (ApexCharts) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-xl">
          <Chart
            type="donut"
            series={[stats.done, stats.open, Math.max(stats.total - stats.done - stats.open, 0)]}
            options={{ labels: ['Selesai', 'Open', 'Lainnya'] }}
          />
        </div>
        <div className="p-4 border rounded-xl">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-3xl font-semibold">{stats.total}</div>
        </div>
      </div>

      {/* Form tambah */}
      <form onSubmit={onCreate} className="grid gap-3 p-4 border rounded-xl">
        <input
          className="border p-2 rounded"
          placeholder="Judul"
          value={create.data.title}
          onChange={e => create.setData('title', e.target.value)}
          required
        />

        {/* ✅ NOTE: diganti pakai Trix Editor */}
        <div>
          <label className="block text-sm mb-1">Catatan (opsional)</label>
          <input id="note" type="hidden" value={create.data.note} />
          <trix-editor
            input="note"
            className="trix-content border rounded p-2"
            onChange={e => create.setData('note', e.target.value)}
          ></trix-editor>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="date"
            className="border p-2 rounded"
            value={create.data.due_date ?? ''}
            onChange={e => create.setData('due_date', e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={create.data.priority}
            onChange={e => create.setData('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="border p-2 rounded"
            value={create.data.status}
            onChange={e => create.setData('status', e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="px-4 py-2 rounded bg-black text-white">Tambah</button>
      </form>

      {/* Filter & search */}
      <form onSubmit={onFilter} className="grid md:grid-cols-5 gap-3 p-4 border rounded-xl">
        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Cari judul/isi"
          value={filter.data.q ?? ''}
          onChange={e => filter.setData('q', e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filter.data.status ?? ''}
          onChange={e => filter.setData('status', e.target.value)}
        >
          <option value="">(Semua status)</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          className="border p-2 rounded"
          value={filter.data.priority ?? ''}
          onChange={e => filter.setData('priority', e.target.value)}
        >
          <option value="">(Semua prioritas)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2 rounded"
            value={filter.data.from ?? ''}
            onChange={e => filter.setData('from', e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={filter.data.to ?? ''}
            onChange={e => filter.setData('to', e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <button className="px-4 py-2 rounded bg-gray-900 text-white">Terapkan</button>
        </div>
      </form>

      {/* List + aksi */}
      <div className="space-y-3">
        {todos.data.map(t => (
          <div key={t.id} className="p-4 border rounded-xl flex items-start gap-4">
            {t.cover_path && (
              <img src={`/storage/${t.cover_path}`} className="w-20 h-20 object-cover rounded" />
            )}
            <div className="flex-1">
              <div className="font-semibold">{t.title}</div>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: t.note?.slice(0, 120) }}
              ></div>
              <div className="text-xs mt-1">
                Due: {t.due_date ?? '-'} • {t.priority} • {t.status}
              </div>
              <div className="mt-2 flex gap-2">
                <Link
                  href={route('todos.update', t.id)}
                  method="put"
                  as="button"
                  data={{
                    status: t.status === 'done' ? 'open' : 'done',
                    completed_at: t.status === 'done' ? null : new Date().toISOString(),
                  }}
                  className="px-3 py-1 border rounded"
                >
                  {t.status === 'done' ? 'Tandai Open' : 'Tandai Selesai'}
                </Link>
                <button className="px-3 py-1 border rounded" onClick={() => onDelete(t.id)}>
                  Hapus
                </button>
                {/* Upload cover */}
                <label className="px-3 py-1 border rounded cursor-pointer">
                  Ubah Cover
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const form = new FormData()
                      form.append('cover', file)
                      window.router.post(route('todos.cover', t.id), form)
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (20/halaman) */}
      <div className="flex gap-2 items-center">
        {todos.links.map((l, i) => (
          <Link
            key={i}
            href={l.url || '#'}
            dangerouslySetInnerHTML={{ __html: l.label }}
            className={`px-3 py-1 border rounded ${
              l.active ? 'bg-black text-white' : ''
            } ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
