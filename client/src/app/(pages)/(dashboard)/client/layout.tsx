import React from 'react'
import Link from "next/link";
import SignOut from "@/components/sign-out";
import Header from "@/components/header";

export default function ClientLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-green-50 font-sans">
            {/* Dashboard Header */}
            <Header/>

            {/* Main Content Area: Sidebar and Page Content */}
            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <aside className="w-16 sm:w-20 md:w-64 bg-green-700 text-white flex flex-col shadow-lg">
                    <nav className="flex-1 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
                        <Link
                            href="/client"
                            className="flex items-center justify-center md:justify-start px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 group"
                        >
                            <span className="text-lg sm:text-xl md:text-base">&#128200;</span>
                            <span className="hidden md:inline md:ml-3 text-sm md:text-base">Overview</span>
                        </Link>
                        <Link
                            href="/client/transactions"
                            className="flex items-center justify-center md:justify-start px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 group"
                        >
                            <span className="text-lg sm:text-xl md:text-base">&#128179;</span>
                            <span className="hidden md:inline md:ml-3 text-sm md:text-base">Transactions</span>
                        </Link>
                        <Link
                            href="/client/deposit"
                            className="flex items-center justify-center md:justify-start px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 group"
                        >
                            <span className="text-lg sm:text-xl md:text-base">&#128184;</span>
                            <span className="hidden md:inline md:ml-3 text-sm md:text-base">Deposit</span>
                        </Link>
                        <Link
                            href="/client/withdraw"
                            className="flex items-center justify-center md:justify-start px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 group"
                        >
                            <span className="text-lg sm:text-xl md:text-base">&#128181;</span>
                            <span className="hidden md:inline md:ml-3 text-sm md:text-base">Withdraw</span>
                        </Link>
                    </nav>
                </aside>

                {/* Page Content Area */}
                <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-white m-2 sm:m-3 md:m-4 rounded-lg shadow-sm">
                    {children}
                </main>
            </div>
        </div>
    );
}