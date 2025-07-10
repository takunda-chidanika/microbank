// src/app/admin/clients/page.tsx
// This page displays a basic list of clients for the administrator dashboard,
// with a modal for blacklisting and unblacklisting users.

'use client'; // This directive makes this a Client Component, as it uses client-side hooks.

import { useState } from 'react'; // Only useState is needed for this basic template
// Removed: useEffect, useCallback, useRouter, Link imports
// Removed: adminService, ApiError imports

// ConfirmationModal Component (reusable)
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onConfirm,
                                                                 title,
                                                                 message,
                                                                 confirmText,
                                                                 cancelText,
                                                                 confirmButtonClass = "bg-red-600 hover:bg-red-700",
                                                             }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
                <p className="text-gray-700 mb-6 text-center">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simplified ClientResponseDto for static data
interface ClientResponseDto {
    id: string;
    name: string;
    email: string;
    keycloakId: string;
    createAt: string;
    isBlacklisted: boolean;
}

export default function AdminClientsPage() {
    // Static dummy data for clients
    const [clients, setClients] = useState<ClientResponseDto[]>([
        { id: 'clt_001', name: 'Alice Smith', email: 'alice@example.com', keycloakId: 'kc_abc1', createAt: '2024-01-01T10:00:00Z', isBlacklisted: false },
        { id: 'clt_002', name: 'Bob Johnson', email: 'bob@example.com', keycloakId: 'kc_def2', createAt: '2024-02-15T11:30:00Z', isBlacklisted: true },
        { id: 'clt_003', name: 'Charlie Brown', email: 'charlie@example.com', keycloakId: 'kc_ghi3', createAt: '2024-03-20T14:00:00Z', isBlacklisted: false },
    ]);

    // State for blacklist/unblacklist confirmation modal
    const [isBlacklistConfirmModalOpen, setIsBlacklistConfirmModalOpen] = useState(false);
    const [clientToToggleBlacklist, setClientToToggleBlacklist] = useState<ClientResponseDto | null>(null);

    // Handler for opening blacklist/unblacklist confirmation modal
    const openBlacklistConfirmModal = (client: ClientResponseDto) => {
        setClientToToggleBlacklist(client);
        setIsBlacklistConfirmModalOpen(true);
    };

    // Handler for confirming blacklist/unblacklist action (simulated)
    const confirmBlacklistToggle = () => {
        if (clientToToggleBlacklist) {
            // Simulate updating the client's blacklist status
            setClients(prevClients =>
                prevClients.map(c =>
                    c.id === clientToToggleBlacklist.id
                        ? { ...c, isBlacklisted: !c.isBlacklisted }
                        : c
                )
            );
            setIsBlacklistConfirmModalOpen(false);
            setClientToToggleBlacklist(null);
            // In a real implementation, you would call adminService.blacklistClient or unblacklistClient here.
        }
    };

    // Render the list of clients
    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Administrator Dashboard - All Clients</h1>

            {clients.length === 0 ? (
                <div className="text-center text-gray-600 text-lg py-8">
                    <p>No clients found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Blacklisted Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {client.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {client.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {client.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {/* Blacklist/Unblacklist Toggle Button */}
                                    <button
                                        onClick={() => openBlacklistConfirmModal(client)} // Open modal on click
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            client.isBlacklisted
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        } transition-colors duration-200`}
                                    >
                                        {client.isBlacklisted ? 'Blacklisted' : 'Active'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {/* Action button for blacklist/unblacklist */}
                                    <button
                                        onClick={() => openBlacklistConfirmModal(client)}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                                            client.isBlacklisted
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                    >
                                        {client.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Blacklist/Unblacklist Confirmation Modal */}
            <ConfirmationModal
                isOpen={isBlacklistConfirmModalOpen}
                onClose={() => setIsBlacklistConfirmModalOpen(false)}
                onConfirm={confirmBlacklistToggle}
                title={clientToToggleBlacklist?.isBlacklisted ? "Confirm Unblacklist" : "Confirm Blacklist"}
                message={
                    clientToToggleBlacklist
                        ? clientToToggleBlacklist.isBlacklisted
                            ? `Are you sure you want to UNBLACKLIST client "${clientToToggleBlacklist.name}" (${clientToToggleBlacklist.email})? This will restore their access to banking services.`
                            : `Are you sure you want to BLACKLIST client "${clientToToggleBlacklist.name}" (${clientToToggleBlacklist.email})? This will restrict their access to banking services.`
                        : "Are you sure you want to change the blacklist status for this client?"
                }
                confirmText={clientToToggleBlacklist?.isBlacklisted ? "Unblacklist" : "Blacklist"}
                cancelText="Cancel"
                confirmButtonClass={
                    clientToToggleBlacklist?.isBlacklisted
                        ? "bg-green-600 hover:bg-green-700" // Green for unblacklist
                        : "bg-red-600 hover:bg-red-700"    // Red for blacklist
                }
            />
        </div>
    );
}
