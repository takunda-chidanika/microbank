'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { AccountService } from '@/services/account.service'
import { AccountResponse, CreateAccountRequest } from '@/types'
import { useAuthUser } from '@/hooks/useAuthUser'

export default function Accounts() {
  const { profile, clientId, isAuthenticated, isLoading: userLoading, error: userError } = useAuthUser()
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [formData, setFormData] = useState<CreateAccountRequest>({
    clientId: '',
    initialBalance: 0,
    authorisationCode: '',
  })

  useEffect(() => {
    if (isAuthenticated && clientId) {
      fetchAccounts()
    }
  }, [isAuthenticated, clientId])

  const fetchAccounts = async () => {
    try {
      if (!clientId) {
        setError('No client ID available')
        return
      }

      // Get accounts for this client using the database client ID
      const userAccounts = await AccountService.getAccountsByClient(clientId)
      setAccounts(userAccounts)
      
      // Auto-fill the client ID in the form
      setFormData(prev => ({ ...prev, clientId }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      await AccountService.createAccount(formData)
      setShowCreateForm(false)
      setFormData({ clientId: '', initialBalance: 0, authorisationCode: '' })
      fetchAccounts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (userError || !isAuthenticated) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{userError || 'Please log in to view your accounts'}</p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Account Form */}
        {showCreateForm && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  readOnly
                  className="input bg-gray-50"
                  placeholder="Auto-filled from your profile"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is automatically filled from your user profile
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance
                </label>
                <input
                  type="number"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({...formData, initialBalance: parseFloat(e.target.value) || 0})}
                  required
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="Enter initial balance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authorization Code
                </label>
                <input
                  type="text"
                  value={formData.authorisationCode}
                  onChange={(e) => setFormData({...formData, authorisationCode: e.target.value})}
                  required
                  className="input"
                  placeholder="Enter authorization code"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="btn btn-primary"
                >
                  {createLoading ? 'Creating...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts List */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Accounts</h3>
          
          {accounts.length === 0 ? (
            <p className="text-gray-500">No accounts found</p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Account #{account.accountNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Client ID: {account.clientId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      ${account.balance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Account ID: {account.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}