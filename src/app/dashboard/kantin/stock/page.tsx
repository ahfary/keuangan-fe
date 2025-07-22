"use client"; // Diperlukan untuk state dan interaktivitas

import React, { useState, useEffect } from 'react';
import { PlusCircle, FilePenLine, Trash2, X } from 'lucide-react';

// FIX: Memperbaiki path dan cara impor komponen UI
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/lable';

// Tipe data untuk Produk
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

// Tipe data untuk Form Produk
interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  stock: number | string;
  price: number | string;
}

// Data tiruan awal untuk produk
const initialProductList: Product[] = [
  { id: 'PD001', name: 'Indomie Goreng', category: 'Makanan Instan', stock: 100, price: 3500 },
  { id: 'PD002', name: 'Teh Pucuk Harum', category: 'Minuman Dingin', stock: 50, price: 4000 },
  { id: 'PD003', name: 'Buku Tulis Sidu', category: 'Alat Tulis', stock: 75, price: 5000 },
  { id: 'PD004', name: 'Chitato Sapi Panggang', category: 'Makanan Ringan', stock: 80, price: 10000 },
];


//=======================================================================================
// Komponen Modal Form Produk
//=======================================================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  productData: ProductFormData | null;
}

function ProductFormModal({ isOpen, onClose, onSave, productData }: ModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    stock: '',
    price: '',
  });

  const modalTitle = productData ? 'Edit Data Produk' : 'Tambah Produk Baru';

  useEffect(() => {
    if (productData) {
      setFormData(productData);
    } else {
      setFormData({ name: '', category: '', stock: '', price: '' });
    }
  }, [productData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={24} /></Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Nama Produk</Label>
              <Input type="text" id="name" name="name" placeholder="Contoh: Indomie Goreng" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Input type="text" id="category" name="category" placeholder="Contoh: Makanan Instan" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="stock">Stok</Label>
                    <Input type="number" id="stock" name="stock" placeholder="Contoh: 100" value={formData.stock} onChange={handleChange} required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="price">Harga Jual (Rp)</Label>
                    <Input type="number" id="price" name="price" placeholder="Contoh: 3500" value={formData.price} onChange={handleChange} required />
                </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-600">
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
//=======================================================================================


// Komponen Halaman Utama Gudang
export default function StokPage() { // Mengganti nama fungsi agar lebih sesuai
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = (dataToSave: ProductFormData) => {
    if (dataToSave.id) {
      setProductList(prevList =>
        prevList.map(p =>
          p.id === dataToSave.id ? { ...p, ...dataToSave, stock: Number(dataToSave.stock), price: Number(dataToSave.price) } : p
        )
      );
    } else {
      const newProduct: Product = {
        id: `PD${Date.now()}`,
        name: dataToSave.name,
        category: dataToSave.category,
        stock: Number(dataToSave.stock),
        price: Number(dataToSave.price),
      };
      setProductList(prevList => [newProduct, ...prevList]);
    }
    handleCloseModal();
  };
  
  const handleDeleteProduct = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        setProductList(prevList => prevList.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Stok Barang</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Produk
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nama Produk</th>
                <th scope="col" className="px-6 py-3">Kategori</th>
                <th scope="col" className="px-6 py-3">Stok</th>
                <th scope="col" className="px-6 py-3">Harga Jual</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</th>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)}><FilePenLine className="w-5 h-5 text-blue-600" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-5 h-5 text-red-600" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        productData={editingProduct}
      />
    </div>
  );
}