// src/app/(dashboard)/deposit/page.tsx
// This page provides an interface for clients to make deposits.

'use client'; // This is a Client Component as it uses useState, useEffect, and client-side services.

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {CreateTransactionRequestDto} from "@/dtos/transaction.dto";
import {TransactionType} from "@/types/enums";
import {transactionService} from "@/services/transaction.service";
import {ApiError} from "@/services/api.utils"; // For redirection or navigation after deposit

export default function DepositPage() {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState(''); // Amount as string to handle BigDecimal precision
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    // In a real application, the account number might be pre-filled from user context
    // or a dropdown if the client has multiple accounts.
    // For this example, it's a manual input.

    const handleDeposit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation
        if (!accountNumber.trim() || !amount.trim()) {
            setError('Account number and amount are required.');
            setLoading(false);
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid positive amount.');
            setLoading(false);
            return;
        }

        // Prepare the request DTO
        const request: CreateTransactionRequestDto = {
            accountNumber: accountNumber.trim(),
            amount: amount.trim(), // Send amount as string to backend for BigDecimal
            type: TransactionType.DEPOSIT,
        };

        try {
            const response = await transactionService.createTransaction(request);
            setSuccessMessage(`Deposit of $${response.amount} to account ${response.accountNumber} successful! Transaction ID: ${response.id}`);
            setAccountNumber(''); // Clear form
            setAmount(''); // Clear form
            // Optionally redirect to transactions history or dashboard after success
            // router.push('/dashboard/transactions');
        } catch (err: any) {
            console.error('Deposit error:', err);
            if (err instanceof ApiError) {
                if (err.status === 401 || err.status === 403) {
                    setError('Unauthorized: Please log in to make a deposit.');
                    router.push('/login?redirectedFrom=/dashboard/deposit'); // Redirect to login
                } else if (err.status === 400) {
                    setError(err.data?.message || 'Invalid deposit request. Please check your input.');
                } else if (err.status === 404) {
                    setError('Account not found. Please verify the account number.');
                } else {
                    setError(err.data?.message || err.message || `An API error occurred (Status: ${err.status})`);
                }
            } else {
                setError('An unexpected error occurred during deposit. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [accountNumber, amount, router]); // Dependencies for useCallback

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Make a Deposit</h1>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline ml-2">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                    </label>
                    <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="shadow-sm block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 1234567890"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Amount ($)
                    </label>
                    <input
                        type="number" // Use type="number" for UI, but handle value as string
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="shadow-sm block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 100.00"
                        step="0.01" // Allow decimal inputs
                        min="0.01" // Minimum positive amount
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing Deposit...' : 'Deposit Funds'}
                </button>
            </form>
        </div>
    );
}
