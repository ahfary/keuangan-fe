    "use client";
    import React from "react";

    interface Transaction {
    name: string;
    date: string;
    amount: string;
    highlight?: boolean;
    }

    export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="mt-4 space-y-3">
        {transactions.map((t, i) => (
            <div
            key={i}
            className="flex items-center justify-between bg-gray-700 rounded-md px-4 py-3 text-white relative"
            >
            <span>{t.name} baru saja Transfer</span>
            <div className="flex items-center space-x-8">
                <span className="text-gray-300">{t.date}</span>
                <span className="font-semibold">{t.amount}</span>
            </div>
            {t.highlight && (
                <span className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            </div>
        ))}
        </div>
    );
    }
