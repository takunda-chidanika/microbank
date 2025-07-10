// src/app/(dashboard)/profile/page.tsx
// This page displays a simple template for client profile information.

'use client'; // Keeping this as it might contain interactive elements in the future.

// Removed: useState, useEffect, useCallback, useRouter
// Removed: clientService, ApiError imports
// Removed: ClientResponseDto import

export default function UserProfilePage() {
    // Removed: State variables for clientProfile, loading, error
    // Removed: router initialization
    // Removed: CLIENT_ID_PLACEHOLDER
    // Removed: fetchProfile useCallback
    // Removed: useEffect hook
    // Removed: Loading and error conditional rendering blocks
    // Removed: No profile found conditional rendering block

    // Static placeholder data for the template
    const staticClientProfile = {
        id: 'clt_dummy_id_123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        keycloakId: 'kc_dummy_id_abc',
        createAt: '2024-01-15T10:00:00Z', // Example ISO string
        isBlacklisted: false,
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>

            <div className="space-y-4 text-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <strong className="text-lg">Name:</strong>
                    <span className="text-lg">{staticClientProfile.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <strong className="text-lg">Email:</strong>
                    <span className="text-lg">{staticClientProfile.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <strong className="text-lg">Client ID:</strong>
                    <span className="text-lg break-all">{staticClientProfile.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <strong className="text-lg">Keycloak ID:</strong>
                    <span className="text-lg break-all">{staticClientProfile.keycloakId}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <strong className="text-lg">Account Created:</strong>
                    <span className="text-lg">{new Date(staticClientProfile.createAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <strong className="text-lg">Blacklisted:</strong>
                    <span className={`text-lg font-semibold ${staticClientProfile.isBlacklisted ? 'text-red-600' : 'text-green-600'}`}>
            {staticClientProfile.isBlacklisted ? 'Yes' : 'No'}
          </span>
                </div>
            </div>

            {/* Optional: Add an "Edit Profile" button or other actions here */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => alert('Edit Profile functionality coming soon!')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
