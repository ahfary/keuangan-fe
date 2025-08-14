    "use client";

    import React, { useState, useRef, useEffect } from "react";
    import { Bell } from "lucide-react";

    export default function NotificationDropdown() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("Transfer");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const notifications = [
        { name: "Sodikin baru saja Transfer", date: "05/08/2025", amount: "RP.2.000.000", unread: true },
        { name: "Emorgan baru saja Transfer", date: "05/08/2025", amount: "RP.500.000", unread: false },
        { name: "Suprianto baru saja Transfer", date: "05/08/2025", amount: "RP.700.000", unread: false },
        { name: "Jokowo baru saja Transfer", date: "05/08/2025", amount: "RP.700.000", unread: false },
    ];

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
        {/* Tombol Bell */}
        <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 rounded-full hover:bg-gray-800"
        >
            <Bell className="w-6 h-6 text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {showDropdown && (
            <div
            className="absolute right-0 mt-2 w-[900px] bg-[#0f172a] border border-gray-700 rounded-lg shadow-lg z-50"
            >
            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-700 p-5">
                {["Transfer", "Stock", "Piutang"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-3 rounded-md font-medium text-lg transition ${
                    activeTab === tab
                        ? "bg-indigo-600 text-white"
                        : "border border-indigo-600 text-indigo-400"
                    }`}
                >
                    {tab}
                </button>
                ))}
            </div>

            {/* List Notifikasi */}
            <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
                {notifications.map((notif, idx) => (
                <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-700 rounded-lg px-6 py-5 relative"
                >
                    <p className="text-gray-200 text-lg font-medium">{notif.name}</p>
                    <div className="flex items-center space-x-8">
                    <span className="text-gray-400 text-base">{notif.date}</span>
                    <span className="text-gray-200 font-semibold text-lg">{notif.amount}</span>
                    </div>
                    {notif.unread && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    )}
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    );
    }
