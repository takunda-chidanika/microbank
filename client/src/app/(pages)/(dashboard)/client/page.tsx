'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardOverviewPage() {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const handleDepositSubmit = (e) => {
        e.preventDefault();
        // Handle deposit logic here
        console.log('Deposit amount:', depositAmount);
        setDepositAmount('');
        setIsDepositModalOpen(false);
    };

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        // Handle withdraw logic here
        console.log('Withdraw amount:', withdrawAmount);
        setWithdrawAmount('');
        setIsWithdrawModalOpen(false);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Deposit Money
                </button>
                <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Withdraw Money
                </button>
            </div>

            {/* Account Balance Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">Current Balance</h2>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-600">
                        $XXXX.XX
                    </span>
                </div>
                <p className="text-gray-500 text-sm">Account Number: XXXXXXXXXX</p>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">Recent Transactions</h2>
                    <Link
                        href="/client/transactions"
                        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-300 self-start sm:self-auto"
                    >
                        View All Transactions &rarr;
                    </Link>
                </div>

                <p className="text-gray-600 mb-4 text-sm sm:text-base">Recent transactions will appear here.</p>

                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">DEPOSIT</span>
                            <span className="text-sm font-bold text-green-600">$100.00</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>ID: abc12345...</p>
                            <p>Date: 2025-07-10</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-500">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">WITHDRAWAL</span>
                            <span className="text-sm font-bold text-red-600">$50.00</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>ID: def67890...</p>
                            <p>Date: 2025-07-09</p>
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                abc12345...
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                DEPOSIT
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-green-600">
                                $100.00
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                2025-07-10
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                def67890...
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                WITHDRAWAL
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-red-600">
                                $50.00
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                2025-07-09
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Deposit Money</h3>
                                <button
                                    onClick={() => setIsDepositModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleDepositSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount to Deposit
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="depositAmount"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsDepositModalOpen(false)}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Deposit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Withdraw Money</h3>
                                <button
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleWithdrawSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount to Withdraw
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="withdrawAmount"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsWithdrawModalOpen(false)}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}