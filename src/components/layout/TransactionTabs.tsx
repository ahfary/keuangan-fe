    "use client";
    import React, { useState } from "react";
    import TransactionList from "./TransactionList";

    export default function TransactionTabs() {
    const [activeTab, setActiveTab] = useState<"Transfer" | "Stock" | "Piutang">("Transfer");

    const transactions = [
        { name: "Sodiklin", date: "05/08/2025", amount: "RP.2.000.000", highlight: true },
        { name: "Emorgan", date: "05/08/2025", amount: "RP.500.000" },
        { name: "Suprianto", date: "05/08/2025", amount: "RP.700.000" },
        { name: "Jokowo", date: "05/08/2025", amount: "RP.700.000" },
    ];

    return (
        <div className="bg-[#0F172A] p-6 rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-4">
            {["Transfer", "Stock", "Piutang"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-2 rounded-md border border-[#513CFA] ${
                activeTab === tab
                    ? "bg-[#513CFA] text-white"
                    : "bg-transparent text-white"
                }`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* List */}
        {activeTab === "Transfer" && <TransactionList transactions={transactions} />}
        {activeTab === "Stock" && (
            <div className="text-white mt-4">Belum ada data Stock</div>
        )}
        {activeTab === "Piutang" && (
            <div className="text-white mt-4">Belum ada data Piutang</div>
        )}
        </div>
    );
    }
