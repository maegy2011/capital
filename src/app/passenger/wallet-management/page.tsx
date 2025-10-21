"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  Download, 
  Upload,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  BanknoteIcon,
  Smartphone,
  QrCode,
  History,
  Settings,
  Eye,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  time: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  method: 'wallet' | 'card' | 'bank' | 'cash'
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'wallet'
  name: string
  lastFour: string
  expiryDate?: string
  isDefault: boolean
  status: 'active' | 'expired' | 'inactive'
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'debit',
    amount: 50,
    description: 'Ticket Purchase - Tahrir to Admin Capital',
    date: '2024-01-15',
    time: '08:30',
    status: 'completed',
    reference: 'TXN-001',
    method: 'wallet'
  },
  {
    id: '2',
    type: 'credit',
    amount: 200,
    description: 'Wallet Top-up',
    date: '2024-01-14',
    time: '14:20',
    status: 'completed',
    reference: 'TXN-002',
    method: 'card'
  },
  {
    id: '3',
    type: 'debit',
    amount: 35,
    description: 'Ticket Purchase - Nasr City to Admin Capital',
    date: '2024-01-13',
    time: '09:15',
    status: 'completed',
    reference: 'TXN-003',
    method: 'wallet'
  },
  {
    id: '4',
    type: 'credit',
    amount: 100,
    description: 'Refund - Cancelled Trip',
    date: '2024-01-12',
    time: '16:45',
    status: 'completed',
    reference: 'TXN-004',
    method: 'wallet'
  },
  {
    id: '5',
    type: 'debit',
    amount: 45,
    description: 'Ticket Purchase - Maadi to Tahrir Square',
    date: '2024-01-11',
    time: '07:00',
    status: 'pending',
    reference: 'TXN-005',
    method: 'card'
  }
]

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa Card',
    lastFour: '4242',
    expiryDate: '12/25',
    isDefault: true,
    status: 'active'
  },
  {
    id: '2',
    type: 'bank',
    name: 'National Bank of Egypt',
    lastFour: '1234',
    isDefault: false,
    status: 'active'
  },
  {
    id: '3',
    type: 'wallet',
    name: 'Mobile Wallet',
    lastFour: '5678',
    isDefault: false,
    status: 'active'
  }
]

export default function WalletManagement() {
  const { t, isRTL } = useLanguage()
  const [currentBalance, setCurrentBalance] = useState(250)
  const [addAmount, setAddAmount] = useState('')
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'methods'>('overview')

  const getTransactionTypeColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const getTransactionTypeIcon = (type: string) => {
    return type === 'credit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('completed') || 'Completed'
      case 'pending': return t('pending') || 'Pending'
      case 'failed': return t('failed') || 'Failed'
      default: return status
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />
      case 'bank': return <BanknoteIcon className="h-4 w-4" />
      case 'wallet': return <Wallet className="h-4 w-4" />
      case 'cash': return <DollarSign className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />
      case 'bank': return <BanknoteIcon className="h-5 w-5" />
      case 'wallet': return <Smartphone className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  const totalSpent = transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const totalAdded = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length

  const handleAddFunds = () => {
    if (addAmount && parseFloat(addAmount) > 0) {
      setCurrentBalance(prev => prev + parseFloat(addAmount))
      setAddAmount('')
      // In a real app, this would process the payment
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('passenger')} - {t('walletManagement') || 'Wallet Management'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('walletManagement') || 'Wallet Management'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('manageYourWallet') || 'Manage your wallet, add funds, and track transactions'}
          </p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{t('walletBalance') || 'Wallet Balance'}</h3>
                <p className="text-blue-100">{t('availableFunds') || 'Available funds for travel'}</p>
              </div>
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div className="text-4xl font-bold mb-4">EGP {currentBalance}</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-blue-100">{t('activeAccount') || 'Active Account'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-blue-100">{t('lastUpdated') || 'Last updated'} 2 min ago</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalAdded') || 'Total Added'}</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {totalAdded}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <ArrowDownRight className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalSpent') || 'Total Spent'}</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {totalSpent}</p>
                  </div>
                </div>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('pendingTransactions') || 'Pending Transactions'}</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingTransactions}</p>
                  </div>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('paymentMethods') || 'Payment Methods'}</p>
                    <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Funds Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-green-600" />
              {t('addFunds') || 'Add Funds'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('enterAmount') || 'Enter Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">EGP</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 px-8"
                onClick={handleAddFunds}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addFunds')}
              </Button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">{t('quickAmounts') || 'Quick Amounts'}</p>
              <div className="flex flex-wrap gap-2">
                {[50, 100, 200, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amount.toString())}
                  >
                    EGP {amount}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'overview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedTab('overview')}
            >
              {t('overview') || 'Overview'}
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'transactions' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedTab('transactions')}
            >
              {t('transactions') || 'Transactions'}
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'methods' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedTab('methods')}
            >
              {t('paymentMethods') || 'Payment Methods'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  {t('recentTransactions') || 'Recent Transactions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <div className={getTransactionTypeColor(transaction.type)}>
                            {getTransactionTypeIcon(transaction.type)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{transaction.description}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}EGP {transaction.amount}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                  {t('paymentMethods') || 'Payment Methods'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>****{method.lastFour}</span>
                            {method.expiryDate && (
                              <>
                                <span>•</span>
                                <span>{method.expiryDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge className="text-xs bg-blue-100 text-blue-700">
                            {t('default') || 'Default'}
                          </Badge>
                        )}
                        <Badge className={`text-xs ${
                          method.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {method.status === 'active' ? t('active') || 'Active' : method.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-blue-600" />
                {t('allTransactions') || 'All Transactions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <div className={getTransactionTypeColor(transaction.type)}>
                          {getTransactionTypeIcon(transaction.type)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {transaction.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {transaction.time}
                          </span>
                          <span className="flex items-center">
                            {getMethodIcon(transaction.method)}
                            {transaction.method}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type === 'credit' ? '+' : '-'}EGP {transaction.amount}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">{transaction.reference}</span>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'methods' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                {t('paymentMethods') || 'Payment Methods'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div className="flex space-x-1">
                          {method.isDefault && (
                            <Badge className="text-xs bg-blue-100 text-blue-700">
                              {t('default') || 'Default'}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${
                            method.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {method.status === 'active' ? t('active') || 'Active' : method.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{method.name}</h4>
                      <p className="text-sm text-gray-500 mb-4">****{method.lastFour}</p>
                      {method.expiryDate && (
                        <p className="text-xs text-gray-400 mb-4">{t('expires') || 'Expires'} {method.expiryDate}</p>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('view') || 'View'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Payment Method */}
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">{t('addPaymentMethod') || 'Add Payment Method'}</h4>
                    <p className="text-sm text-gray-500 mb-4">{t('addNewCardOrBank') || 'Add new card or bank account'}</p>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('add') || 'Add'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}