export default function PenjualanPage() {
  const salesData = [
    { id: 'TRX001', time: '10:15', cashier: 'Kasir 1', items: 3, total: 25000 },
    { id: 'TRX002', time: '10:20', cashier: 'Kasir 1', items: 1, total: 5000 },
    { id: 'TRX003', time: '10:30', cashier: 'Kasir 2', items: 5, total: 55000 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Data Penjualan</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID Transaksi</th>
              <th scope="col" className="px-6 py-3">Waktu</th>
              <th scope="col" className="px-6 py-3">Kasir</th>
              <th scope="col" className="px-6 py-3">Total Item</th>
              <th scope="col" className="px-6 py-3">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{sale.id}</td>
                <td className="px-6 py-4">{sale.time}</td>
                <td className="px-6 py-4">{sale.cashier}</td>
                <td className="px-6 py-4">{sale.items}</td>
                <td className="px-6 py-4 font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(sale.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}