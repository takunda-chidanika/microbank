// src/app/(dashboard)/withdraw/page.tsx
// This page provides an interface for clients to make withdrawals.

'use client'; // This is a Client Component as it will use client-side state and services.

import { useState, useCallback } from 'react';
// Import services and DTOs when implementing full functionality
// import { transactionService } from '@/services/transactionService';
// import { ApiError } from '@/lib/apiUtils';
// import { CreateTransactionRequestDto, TransactionType } from '@/dtos/transaction.dto';
// import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState(''); // Amount as string to handle BigDecimal precision
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    // const router = useRouter(); // Uncomment when implementing redirection

    // Placeholder for account number. In a real application, this would be pre-filled
    // from user context or a dropdown if the client has multiple accounts.

    const handleWithdraw = useCallback(async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation (will be expanded with actual service calls)
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

        // --- Placeholder for actual withdrawal logic ---
        // In a full implementation, you would:
        // 1. Prepare the request DTO (CreateTransactionRequestDto with type: TransactionType.WITHDRAWAL)
        // 2. Call transactionService.createTransaction(request)
        // 3. Handle success and error responses from the API (e.g., overdraft errors)
        // 4. Update state (successMessage, error)
        // 5. Clear form fields
        // 6. Optionally redirect

        console.log('Simulating withdrawal:', { accountNumber, amount });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

        // Simulate success or error
        if (parsedAmount > 1000) { // Example: simulate overdraft or limit error
            setError('Simulated: Insufficient funds or withdrawal limit exceeded.');
        } else {
            setSuccessMessage(`Simulated: Withdrawal of $${amount} from account ${accountNumber} successful!`);
            setAccountNumber('');
            setAmount('');
        }

        setLoading(false);
    }, [accountNumber, amount]); // Dependencies for useCallback

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Make a Withdrawal</h1>

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

            <form onSubmit={handleWithdraw} className="space-y-4">
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
                        placeholder="e.g., 50.00"
                        step="0.01" // Allow decimal inputs
                        min="0.01" // Minimum positive amount
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing Withdrawal...' : 'Withdraw Funds'}
                </button>
            </form>
        </div>
    );
}
