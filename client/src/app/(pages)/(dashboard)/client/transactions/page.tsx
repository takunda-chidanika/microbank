// src/app/(dashboard)/transactions/page.tsx
// This page displays a simple table for transaction history with a modal for details.

'use client'; // This component uses client-side hooks for modal state.

import { useState } from 'react';
import {TransactionResponseDto} from "@/dtos/transaction.dto";
import {TransactionType} from "@/types/enums"; // Import useState for managing modal state

export default function TransactionsPage() {
    // Static dummy data for demonstration purposes
    const transactions: TransactionResponseDto[] = [
        {
            id: 'tx_12345abc',
            accountNumber: '1234567890',
            amount: '500.00',
            type: TransactionType.DEPOSIT,
            createdAt: '2025-07-08T10:30:00Z',
        },
        {
            id: 'tx_67890def',
            accountNumber: '1234567890',
            amount: '75.50',
            type: TransactionType.WITHDRAWAL,
            createdAt: '2025-07-07T15:45:00Z',
        },
        {
            id: 'tx_abcde123',
            accountNumber: '1234567890',
            amount: '120.00',
            type: TransactionType.TRANSFER,
            createdAt: '2025-07-06T09:00:00Z',
        },
        {
            id: 'tx_fghij456',
            accountNumber: '1234567890',
            amount: '200.00',
            type: TransactionType.DEPOSIT,
            createdAt: '2025-07-05T11:20:00Z',
        },
    ];

    // State to manage modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to store the currently selected transaction for modal display
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponseDto | null>(null);

    // Function to open the modal and set the selected transaction
    const openModal = (transaction: TransactionResponseDto) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null); // Clear selected transaction when closing
    };

    return (
        <div className="space-y-6">
            {/* All Transactions Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Transaction History</h2>

                {transactions.length === 0 ? (
                    <p className="text-gray-600">No transactions found for this account.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((tx: TransactionResponseDto) => (
                                <tr key={tx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tx.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tx.type}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                            tx.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'
                                        }`}
                                    >
                                        ${tx.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => openModal(tx)} // Call openModal on button click
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {isModalOpen && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">Transaction Details</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
                            >
                                &times; {/* Close icon */}
                            </button>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p><strong>ID:</strong> {selectedTransaction.id}</p>
                            <p><strong>Account Number:</strong> {selectedTransaction.accountNumber}</p>
                            <p><strong>Type:</strong> {selectedTransaction.type}</p>
                            <p><strong>Amount:</strong> ${selectedTransaction.amount}</p>
                            <p><strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                            {/* Add more details here if your TransactionResponseDto had them */}
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
