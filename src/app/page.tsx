// File: src/app/page.tsx
// Kode final dan lengkap untuk Landing Page SakuSantri

"use client"; 

import React, { useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- Mock Data Santri (akan diganti dengan API call) ---
const MOCK_SANTRI_DATA: { [key: string]: { name: string; class: string } } = {
    'ST001': { name: 'Ahmad Yusuf', class: '3 Aliyah' },
    'ST002': { name: 'Budi Santoso', class: '2 Tsanawiyah' },
    'ST003': { name: 'Citra Lestari', class: '1 Aliyah' },
};

// --- Tipe Data ---
interface SantriInfo {
    name: string;
    class: string;
}

// Komponen untuk FAQ Accordion
const FaqItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-200"
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 dark:text-gray-400">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};


export default function LandingPage() {
    // --- Refs for Smooth Scrolling ---
    const featuresRef = useRef<HTMLElement>(null);
    const howItWorksRef = useRef<HTMLElement>(null);
    const topUpRef = useRef<HTMLElement>(null);
    const faqRef = useRef<HTMLElement>(null);

    // --- State Management ---
    const [step, setStep] = useState(1);
    const [santriId, setSantriId] = useState('');
    const [searchError, setSearchError] = useState('');
    const [foundSantri, setFoundSantri] = useState<SantriInfo | null>(null);
    const [amount, setAmount] = useState('');
    const [isMidtransModalOpen, setIsMidtransModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    // --- Event Handlers ---
    const handleScrollTo = (ref: React.RefObject<HTMLElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        const santri = MOCK_SANTRI_DATA[santriId.trim().toUpperCase()];
        if (santri) {
            setFoundSantri(santri);
            setSearchError('');
            setStep(2);
        } else {
            setSearchError('Santri tidak ditemukan. Periksa kembali ID.');
            setFoundSantri(null);
        }
    };

    const handleTopUpSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsMidtransModalOpen(true);
    };
    
    const handleSimulateSuccess = () => {
        setIsMidtransModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccess = () => {
        setIsSuccessModalOpen(false);
        setStep(1);
        setSantriId('');
        setAmount('');
        setFoundSantri(null);
    };
    
    const faqData = [
        { q: "Apakah platform SakuSantri aman digunakan?", a: "Tentu. Kami menggunakan enkripsi standar industri dan bekerja sama dengan gerbang pembayaran terpercaya (Midtrans) untuk memastikan semua transaksi aman dan terlindungi." },
        { q: "Berapa biaya administrasi untuk setiap top-up?", a: "Biaya administrasi akan bervariasi tergantung pada metode pembayaran yang Anda pilih melalui Midtrans. Semua biaya akan ditampilkan secara transparan sebelum Anda menyelesaikan pembayaran." },
        { q: "Bagaimana jika saya salah transfer atau salah memasukkan ID Santri?", a: "Jika Anda salah memasukkan ID, sistem akan menolak transaksi. Jika Anda salah transfer, silakan segera hubungi pihak administrasi pondok dengan membawa bukti transfer untuk penanganan lebih lanjut." },
        { q: "Bagaimana saya bisa memantau pengeluaran anak saya?", a: "Setelah top-up pertama berhasil, Anda akan mendapatkan akses ke aplikasi mobile khusus orang tua. Di sana Anda bisa melihat saldo dan semua riwayat transaksi anak Anda secara real-time." },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-30 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SakuSantri</h1>
                    <nav className="hidden md:flex space-x-8">
                        <button onClick={() => handleScrollTo(featuresRef)} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">Fitur</button>
                        <button onClick={() => handleScrollTo(howItWorksRef)} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">Cara Kerja</button>
                        <button onClick={() => handleScrollTo(faqRef)} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">FAQ</button>
                    </nav>
                    <Link href="/auth/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                        Login Admin
                    </Link>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section id="hero" className="pt-32 pb-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Modernkan Uang Saku, <span className="text-indigo-600">Tenangkan Hati.</span>
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Kirim dan pantau uang jajan putra-putri Anda di pesantren dengan mudah, aman, dan transparan. Cukup dari rumah.
                            </p>
                            <div className="mt-8">
                                <button onClick={() => handleScrollTo(topUpRef)} className="inline-block px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-transform hover:scale-105">
                                    Top-Up Saldo Sekarang
                                </button>
                            </div>
                        </div>
                        <div>
                            <Image src="https://placehold.co/600x400/E9D5FF/4C1D95?text=Aplikasi+SakuSantri" alt="Ilustrasi Aplikasi SakuSantri" width={600} height={400} className="rounded-2xl shadow-2xl mx-auto" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section ref={featuresRef} id="features" className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-3xl font-bold">Kenapa SakuSantri?</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Platform terpadu untuk semua kebutuhan keuangan santri.</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <h4 className="mt-4 text-xl font-bold">Top-Up Mudah</h4>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kirim uang saku kapan saja melalui berbagai metode pembayaran online yang aman.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                               <h4 className="mt-4 text-xl font-bold">Transaksi Aman</h4>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Santri bertransaksi tanpa uang tunai (cashless) di lingkungan pondok, mengurangi risiko kehilangan.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <h4 className="mt-4 text-xl font-bold">Laporan Transparan</h4>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pantau semua riwayat pengeluaran anak Anda secara real-time melalui aplikasi khusus orang tua.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-3xl font-bold">Hanya 3 Langkah Mudah</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Proses cepat dan intuitif untuk kenyamanan Anda.</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 relative">
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2"></div>
                            <div className="relative z-10 bg-white dark:bg-gray-800 p-4"><div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800"><div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-300 font-bold text-2xl">1</div><h4 className="mt-4 text-xl font-bold">Isi Data & Nominal</h4><p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Masukkan ID santri dan jumlah uang yang ingin Anda kirim.</p></div></div>
                            <div className="relative z-10 bg-white dark:bg-gray-800 p-4"><div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800"><div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-300 font-bold text-2xl">2</div><h4 className="mt-4 text-xl font-bold">Lakukan Pembayaran</h4><p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pilih metode pembayaran yang paling nyaman bagi Anda via Midtrans.</p></div></div>
                            <div className="relative z-10 bg-white dark:bg-gray-800 p-4"><div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800"><div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-300 font-bold text-2xl">3</div><h4 className="mt-4 text-xl font-bold">Saldo Terkirim</h4><p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Setelah terverifikasi, saldo langsung masuk ke akun santri dan siap digunakan.</p></div></div>
                        </div>
                    </div>
                </section>

                {/* Top-Up Form Section */}
                <section ref={topUpRef} id="top-up" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6 max-w-2xl">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold">Formulir Top-Up Saldo Santri</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Ikuti langkah-langkah mudah di bawah ini untuk mengirim uang saku.</p>
                        </div>
                        <div className="mt-12 bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-2xl">
                            {step === 1 && (
                                <form onSubmit={handleSearchSubmit}>
                                    <label htmlFor="santri-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Masukkan ID Santri</label>
                                    <div className="mt-2 flex gap-3">
                                        <input type="text" id="santri-id" value={santriId} onChange={(e) => setSantriId(e.target.value)} placeholder="Contoh: ST001" className="flex-grow h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800" required />
                                        <button type="submit" className="h-12 px-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Cari</button>
                                    </div>
                                    {searchError && <p className="mt-2 text-sm text-red-500">{searchError}</p>}
                                </form>
                            )}
                            {step === 2 && foundSantri && (
                                <div>
                                    <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Mengirim untuk:</p>
                                        <p className="font-bold text-lg text-indigo-800 dark:text-indigo-200">{foundSantri.name}</p>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300">{foundSantri.class}</p>
                                    </div>
                                    <form onSubmit={handleTopUpSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="amount" className="block text-sm font-medium">Nominal Transfer (Rp)</label>
                                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Minimal Rp 10.000" className="mt-1 h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800" required />
                                            </div>
                                            <div>
                                                <label htmlFor="proof" className="block text-sm font-medium">Upload Bukti Transfer (Opsional)</label>
                                                <input type="file" id="proof" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-indigo-300 dark:hover:file:bg-gray-500" />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button type="submit" className="w-full h-12 px-6 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">Lanjutkan Pembayaran</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section ref={faqRef} id="faq" className="py-20">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold">Tanya Jawab</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Pertanyaan yang sering diajukan oleh para pengguna.</p>
                        </div>
                        <div className="mt-8">
                            {faqData.map((faq, index) => (
                                <FaqItem 
                                    key={index}
                                    question={faq.q}
                                    answer={faq.a}
                                    isOpen={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section id="testimonials" className="py-20">
                     <div className="container mx-auto px-6">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold">Apa Kata Mereka?</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Kami bangga dapat membantu memudahkan urusan keuangan di pesantren.</p>
                        </div>
                        <div className="mt-12 grid md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <p className="text-gray-600 dark:text-gray-300">"SakuSantri sangat membantu kami sebagai orang tua. Tidak perlu lagi repot-repot datang ke pondok hanya untuk memberi uang saku. Semuanya bisa dari rumah."</p>
                                <div className="mt-4 flex items-center">
                                    <Image src="https://placehold.co/48x48/E0E7FF/4338CA?text=B" alt="Testimoni" width={48} height={48} className="rounded-full" />
                                    <div className="ml-4">
                                        <p className="font-bold text-gray-900 dark:text-white">Bapak Hermawan</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Wali Santri Kelas 2 Tsanawiyah</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <p className="text-gray-600 dark:text-gray-300">"Dari sisi administrasi, aplikasi ini memotong banyak pekerjaan manual. Verifikasi transfer dan pencatatan jadi lebih cepat dan akurat. Sangat direkomendasikan."</p>
                                <div className="mt-4 flex items-center">
                                    <Image src="https://placehold.co/48x48/E0E7FF/4338CA?text=U" alt="Testimoni" width={48} height={48} className="rounded-full" />
                                    <div className="ml-4">
                                        <p className="font-bold text-gray-900 dark:text-white">Ustadz Abdullah</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Kepala Administrasi Keuangan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-xl font-bold text-white">SakuSantri</h4>
                            <p className="mt-2 text-sm text-gray-400">Memodernisasi keuangan di lingkungan pesantren untuk masa depan yang lebih baik.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Navigasi</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li><button onClick={() => handleScrollTo(featuresRef)} className="hover:text-indigo-400">Fitur</button></li>
                                <li><button onClick={() => handleScrollTo(howItWorksRef)} className="hover:text-indigo-400">Cara Kerja</button></li>
                                <li><button onClick={() => handleScrollTo(faqRef)} className="hover:text-indigo-400">FAQ</button></li>
                                <li><Link href="/auth/login" className="hover:text-indigo-400">Login Admin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Kontak</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>Email: <a href="mailto:info@sakusantri.com" className="hover:text-indigo-400">info@sakusantri.com</a></li>
                                <li>Telepon: (021) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} SakuSantri. Semua Hak Cipta Dilindungi.</p>
                    </div>
                </div>
            </footer>

            {/* Modals (Midtrans, Success) */}
            {isMidtransModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
                        <div className="p-4 border-b"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Simulasi Pembayaran</h3></div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">Di aplikasi nyata, jendela pembayaran Midtrans akan terbuka di sini.</p>
                            <button onClick={handleSimulateSuccess} className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simulasikan Pembayaran Berhasil</button>
                        </div>
                    </div>
                </div>
            )}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
                        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Top-Up Berhasil!</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Permintaan top-up Anda sedang diproses dan akan diverifikasi oleh admin pondok.</p>
                        <button onClick={handleCloseSuccess} className="mt-6 w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Selesai</button>
                    </div>
                </div>
            )}
        </div>
    );
}
