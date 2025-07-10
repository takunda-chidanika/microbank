'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlacklistedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isUserBlacklisted, setIsUserBlacklisted] = useState(true);

    useEffect(() => {
        const checkBlacklistStatus = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        };

        checkBlacklistStatus();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[300px] p-4">
                <div className="text-base sm:text-lg text-gray-700">Checking account status...</div>
            </div>
        );
    }

    if (!isUserBlacklisted) {
        router.push('/dashboard');
        return null;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 max-w-2xl mx-auto text-center">
                <div className="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                    &#9888;
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Account Blacklisted</h1>
                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                    Your account has been blacklisted and you currently cannot access banking services.
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    If you believe this is an error, please contact support for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                    <button
                        onClick={() => alert('Contacting support... (functionality not implemented)')}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base font-medium"
                    >
                        Contact Support
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base font-medium"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
}