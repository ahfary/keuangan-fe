    "use client";

    import { useState } from "react";
    import { Dialog } from "@headlessui/react";
    import { Button } from "@/components/ui/button";

    interface BulkEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (kelas?: string, jurusan?: string) => void | Promise<void>;
    selectedCount: number;
    }

    export default function BulkEditModal({
    isOpen,
    onClose,
    onSave,
    selectedCount,
    }: BulkEditModalProps) {
    const [kelas, setKelas] = useState("");
    const [jurusan, setJurusan] = useState("");

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold text-center">
                Edit Banyak Santri
            </Dialog.Title>
            <p className="text-center text-gray-400 mb-6">
                ({selectedCount} santri terpilih)
            </p>

            <div className="space-y-4">
                <div>
                <label className="text-sm block mb-1">Kelas:</label>
                <select
                    className="w-full p-2 rounded-md bg-gray-700"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                >
                    <option value="">Pilih kelas ...</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                </select>
                </div>

                <div>
                <label className="text-sm block mb-1">Jurusan:</label>
                <select
                    className="w-full p-2 rounded-md bg-gray-700"
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                >
                    <option value="">Pilih jurusan ...</option>
                    <option value="RPL">RPL</option>
                    <option value="TKJ">TKJ</option>
                </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline" onClick={onClose}>
                Batal
                </Button>
                <Button
                onClick={() => onSave(kelas || undefined, jurusan || undefined)}
                >
                Lanjut
                </Button>
            </div>
            </Dialog.Panel>
        </div>
        </Dialog>
    );
    }
