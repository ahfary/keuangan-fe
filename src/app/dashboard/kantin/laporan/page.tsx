import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LaporanHarianPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Laporan Harian (Jurnal)</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="report-date">Pilih Tanggal Laporan</Label>
          <Input type="date" id="report-date" defaultValue={new Date().toISOString().substring(0, 10)} />
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-200">Rp 1.250.000</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-200">Rp 300.000</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">Laba Bersih</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">Rp 950.000</p>
        </div>
      </div>
      
      {/* Detail Jurnal */}
      {/* Tabel Pemasukan dan Pengeluaran bisa ditambahkan di sini */}

    </div>
  );
}