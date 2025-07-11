'use client'

import { useState, useEffect } from 'react'
import { AccountService } from '@/services/account.service'
import { TransactionService } from '@/services/transaction.service'
import { AccountResponse, TransactionResponse } from '@/types'
import { useAuthUser } from '@/hooks/useAuthUser'

export default function UserDashboard() {
  const { profile, clientId, isAuthenticated, isLoading: userLoading, error: userError } = useAuthUser()
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated && clientId) {
      loadUserData()
    }
  }, [isAuthenticated, clientId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!clientId) {
        setError('No client ID available')
        return
      }

      // Load user accounts using the database client ID from Zustand store
      const userAccounts = await AccountService.getAccountsByClient(clientId)
      setAccounts(userAccounts)

      // Load recent transactions for the first account
      if (userAccounts.length > 0) {
        const recentTransactions = await TransactionService.getTransactionsByAccountNumber(
          userAccounts[0].accountNumber
        )
        setTransactions(recentTransactions.slice(0, 5)) // Show last 5 transactions
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (userError || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{userError || 'Please log in to view your dashboard'}</p>
          <button 
            onClick={() => window.location.href = '/auth/signin'}
            className="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your account overview and recent activity
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accounts.map((account) => (
            <div key={account.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {account.accountNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${account.balance.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Account ID: {account.id}</span>
                <span>Client ID: {account.clientId}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Transaction</h3>
                <p className="text-sm text-gray-600">Deposit or withdraw money</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Transfer Money</h3>
                <p className="text-sm text-gray-600">Send money to another account</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Statement</h3>
                <p className="text-sm text-gray-600">Download account statements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Start by making your first transaction</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      transaction.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.type}</p>
                      <p className="text-sm text-gray-500">
                        {/*{new Date(transaction.transactionDate).toLocaleDateString()}*/}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}