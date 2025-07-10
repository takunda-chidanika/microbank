// src/app/admin/layout.tsx
// This layout will wrap all pages within the /admin route,
// providing a consistent navigation and structure for the admin application.

'use client'; // This directive makes this a Client Component to allow client-side interactivity

import Link from 'next/link';
import { signOut } from 'next-auth/react'; // Assuming NextAuth.js for logout

// Define the AdminDashboardLayout component
export default function AdminDashboardLayout({
                                                 children, // This prop will contain the page content for the current admin route
                                             }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            {/* Admin Dashboard Header */}
            <header className="bg-white shadow-md p-4 md:p-6 flex justify-between items-center z-10">
                <Link href="/admin/clients" className="text-2xl font-bold text-red-700 hover:text-red-800 transition-colors duration-300">
                    MicroBank Admin
                </Link>
                <nav>
                    {/* Admin User actions/profile link - Placeholder */}
                    <Link href="/admin/profile" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300">
                        Admin Profile
                    </Link>
                    {/* Logout Button - Client-side logout using NextAuth.js */}
                    <button
                        onClick={async () => {
                            await signOut({ callbackUrl: '/' }); // Redirect to homepage after logout
                        }}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 ml-2"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* Main Content Area: Sidebar and Page Content */}
            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-red-700 text-white p-4 hidden md:flex flex-col shadow-lg">
                    <nav className="space-y-2">
                        <Link
                            href="/admin/clients"
                            className="flex items-center px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        >
                            <span className="mr-3">&#128100;</span> {/* User icon */}
                            Manage Clients
                        </Link>
                        {/* Add more admin-specific links here as needed */}
                        <Link
                            href="/admin/accounts"
                            className="flex items-center px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        >
                            <span className="mr-3">&#128179;</span> {/* Credit Card icon */}
                            Manage Accounts
                        </Link>
                        <Link
                            href="/admin/transactions"
                            className="flex items-center px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        >
                            <span className="mr-3">&#128184;</span> {/* Money with Wings icon */}
                            View All Transactions
                        </Link>
                    </nav>
                </aside>

                {/* Page Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children} {/* This is where the specific admin page content will be rendered */}
                </main>
            </div>
        </div>
    );
}
