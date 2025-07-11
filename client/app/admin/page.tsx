'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import { AdminService } from '@/services/admin.service'
import { ClientResponse } from '@/types'

export default function Admin() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await AdminService.getAllClients()
      setClients(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBlacklistClient = async (clientId: string) => {
    setActionLoading(clientId)
    try {
      await AdminService.blacklistClient(clientId)
      fetchClients()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnblacklistClient = async (clientId: string) => {
    setActionLoading(clientId)
    try {
      await AdminService.unblacklistClient(clientId)
      fetchClients()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Simple admin check - in a real app, this would be more robust
  const isAdmin = session?.user?.email === 'admin@microbank.com'

  if (!isAdmin) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin privileges required.
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage clients and system settings</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Clients</h3>
            <p className="text-3xl font-bold text-primary-600">
              {clients.length}
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Blacklisted Clients</h3>
            <p className="text-3xl font-bold text-red-600">
              {clients.filter(c => c.isBlacklisted).length}
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Clients</h3>
            <p className="text-3xl font-bold text-green-600">
              {clients.filter(c => !c.isBlacklisted).length}
            </p>
          </div>
        </div>

        {/* Clients Management */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Client Management</h3>
          
          {clients.length === 0 ? (
            <p className="text-gray-500">No clients found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(client.createAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          client.isBlacklisted
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {client.isBlacklisted ? 'Blacklisted' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {client.isBlacklisted ? (
                          <button
                            onClick={() => handleUnblacklistClient(client.id)}
                            disabled={actionLoading === client.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {actionLoading === client.id ? 'Processing...' : 'Unblacklist'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlacklistClient(client.id)}
                            disabled={actionLoading === client.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {actionLoading === client.id ? 'Processing...' : 'Blacklist'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Database Status</p>
              <p className="text-lg font-medium text-green-600">Connected</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}