'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { TransactionService } from '@/services/transaction.service'
import { TransactionResponse, CreateTransactionRequest, TransactionType } from '@/types'

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    accountNumber: '',
    amount: 0,
    type: TransactionType.DEPOSIT,
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await TransactionService.getAllTransactions()
      setTransactions(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      await TransactionService.createTransaction(formData)
      setShowCreateForm(false)
      setFormData({ accountNumber: '', amount: 0, type: TransactionType.DEPOSIT })
      fetchTransactions()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreateLoading(false)
    }
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            New Transaction
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Transaction Form */}
        {showCreateForm && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Transaction</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  required
                  className="input"
                  placeholder="Enter account number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  required
                  min="0.01"
                  step="0.01"
                  className="input"
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})}
                  className="input"
                >
                  <option value={TransactionType.DEPOSIT}>Deposit</option>
                  <option value={TransactionType.WITHDRAWAL}>Withdrawal</option>
                  <option value={TransactionType.TRANSFER}>Transfer</option>
                </select>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="btn btn-primary"
                >
                  {createLoading ? 'Processing...' : 'Create Transaction'}
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

        {/* Transactions List */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Transactions</h3>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}