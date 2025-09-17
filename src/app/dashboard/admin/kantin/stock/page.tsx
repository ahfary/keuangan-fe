"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { PlusCircle, FilePenLine, Trash2, X, LoaderCircle, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getItems, createItem, updateItem, deleteItem } from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// --- Tipe Data Disesuaikan dengan Respons API ---
interface Kategori {
  id: number;
  nama: string;
}

interface Item {
  id: number;
  nama: string;
  harga: number;
  jumlah: number;
  kategori: Kategori | null; // FIX: Memungkinkan kategori bernilai null
  gambar?: string | null;
}

interface ItemFormData {
  id?: number;
  nama: string;
  harga: string;
  jumlah: string;
  kategori: string;
}

// --- Komponen-Komponen Tampilan ---

// Tampilan Tabel
const TableView = ({ items, onEdit, onDelete }: { items: Item[], onEdit: (item: Item) => void, onDelete: (item: Item) => void }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                <tr>
                    <th className="px-6 py-3">Nama Barang</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Jumlah (Stok)</th>
                    <th className="px-6 py-3">Harga Jual</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
                {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <td className="px-6 py-4 font-medium flex items-center">
                            <Image 
                                src={item.gambar || `https://placehold.co/40x40/E0E7FF/4338CA?text=${item.nama.charAt(0)}`} 
                                alt={item.nama}
                                width={40} height={40}
                                className="rounded-md mr-4 object-cover"
                                onError={(e) => { e.currentTarget.src = `https://placehold.co/40x40/E0E7FF/4338CA?text=${item.nama.charAt(0)}`; }}
                            />
                            {item.nama}
                        </td>
                        {/* FIX: Tambahkan pengecekan null untuk kategori */}
                        <td className="px-6 py-4">{item.kategori?.nama || 'Tanpa Kategori'}</td> 
                        <td className="px-6 py-4">{item.jumlah}</td>
                        <td className="px-6 py-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</td>
                        <td className="px-6 py-4 flex justify-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><FilePenLine className="w-5 h-5 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(item)}><Trash2 className="w-5 h-5 text-red-600" /></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Tampilan Grid
const GridView = ({ items, onEdit, onDelete }: { items: Item[], onEdit: (item: Item) => void, onDelete: (item: Item) => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group flex flex-col">
                <div className="relative">
                    <Image 
                        src={item.gambar || `https://placehold.co/400x300/E0E7FF/4338CA?text=Gambar`}
                        alt={item.nama}
                        width={400} height={300}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/E0E7FF/4338CA?text=Error`; }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" className="h-8 w-8 bg-white/80 hover:bg-white" onClick={() => onEdit(item)}><FilePenLine className="w-4 h-4 text-blue-600" /></Button>
                        <Button size="icon" className="h-8 w-8 bg-white/80 hover:bg-white" onClick={() => onDelete(item)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        {/* FIX: Tambahkan pengecekan null untuk kategori */}
                        <p className="text-xs text-indigo-500 font-semibold">{item.kategori?.nama || 'Tanpa Kategori'}</p> 
                        <h3 className="font-bold text-lg mt-1">{item.nama}</h3>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Stok: <span className="font-bold text-gray-800 dark:text-white">{item.jumlah}</span></p>
                        <p className="font-bold text-indigo-600 text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.harga)}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// --- Komponen Modal ---
const ItemFormModal = ({ isOpen, onClose, onSave, itemData }: { isOpen: boolean; onClose: () => void; onSave: (data: ItemFormData) => void; itemData: ItemFormData | null; }) => {
    const [formData, setFormData] = useState<ItemFormData>({ nama: '', harga: '', jumlah: '', kategori: '' });
    const modalTitle = itemData ? 'Edit Data Barang' : 'Tambah Barang Baru';

    useEffect(() => {
        if (itemData) setFormData(itemData);
        else setFormData({ nama: '', harga: '', jumlah: '', kategori: '' });
    }, [itemData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
                    <h2 className="text-xl font-semibold">{modalTitle}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={24} /></Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label htmlFor="nama">Nama Barang</Label><Input id="nama" name="nama" value={formData.nama} onChange={handleChange} required /></div>
                    <div><Label htmlFor="kategori">Kategori</Label><Input id="kategori" name="kategori" value={formData.kategori} onChange={handleChange} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="jumlah">Jumlah (Stok)</Label><Input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleChange} required /></div>
                        <div><Label htmlFor="harga">Harga Jual (Rp)</Label><Input id="harga" name="harga" type="number" value={formData.harga} onChange={handleChange} required /></div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Batal</Button><Button type="submit">Simpan</Button></div>
                </form>
            </div>
        </div>
    );
};

// --- Komponen Halaman Utama ---
export default function StokPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await getItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(`Gagal memuat data: ${error.message}`);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item: Item | null = null) => {
    if (item) {
        setEditingItem({ 
            ...item, 
            harga: String(item.harga), 
            jumlah: String(item.jumlah),
            kategori: item.kategori?.nama || '', // FIX: Menggunakan nama kategori dan handle jika null
        });
    } else {
        setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = async (formData: ItemFormData) => {
    const itemPayload = {
        nama: formData.nama,
        kategori: formData.kategori,
        harga: parseInt(formData.harga, 10),
        jumlah: parseInt(formData.jumlah, 10),
    };
    let promise;
    if (formData.id) {
        promise = updateItem(formData.id, itemPayload);
    } else {
        promise = createItem(itemPayload);
    }
    toast.promise(promise, {
        loading: 'Menyimpan data barang...',
        success: () => {
            setIsModalOpen(false);
            fetchItems();
            return formData.id ? 'Barang berhasil diperbarui!' : 'Barang baru berhasil ditambahkan!';
        },
        error: (err) => `Gagal: ${err.message}`
    });
  };

  const handleDeleteItem = (item: Item) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) return;
    const promise = deleteItem(item.id);
    toast.promise(promise, {
        loading: 'Menghapus barang...',
        success: () => {
            fetchItems();
            return `"${item.nama}" berhasil dihapus.`;
        },
        error: (err) => `Gagal: ${err.message}`
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manajemen Stok Barang</h1>
        <div className="flex items-center gap-2">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex">
                <button onClick={() => setView('grid')} className={cn("p-2 rounded-md", view === 'grid' && "bg-white dark:bg-gray-900 shadow")}>
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button onClick={() => setView('table')} className={cn("p-2 rounded-md", view === 'table' && "bg-white dark:bg-gray-900 shadow")}>
                    <List className="w-5 h-5" />
                </button>
            </div>
            <Button onClick={() => handleOpenModal()}>
                <PlusCircle className="w-5 h-5 mr-2" />
                Tambah Barang
            </Button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><LoaderCircle className="w-8 h-8 animate-spin" /></div>
        ) : (
            view === 'grid' 
                ? <GridView items={items} onEdit={handleOpenModal} onDelete={handleDeleteItem} />
                : <TableView items={items} onEdit={handleOpenModal} onDelete={handleDeleteItem} />
        )}
      </div>
      
      <ItemFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} itemData={editingItem} />
    </div>
  );
}