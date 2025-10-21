"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, Wallet, Smartphone, Package, Clock, Star, Plus, Minus, CheckCircle } from 'lucide-react'

interface WalletData {
  balance: number
  currency: string
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

interface Subscription {
  id: string
  type: string
  name: string
  description: string
  tripsIncluded: number
  duration: string
  price: number
  isActive: boolean
  validUntil?: string
  tripsRemaining?: number
}

export default function PaymentSystem() {
  const [wallet, setWallet] = useState<WalletData>({
    balance: 150,
    currency: 'EGP',
    transactions: [
      {
        id: '1',
        type: 'credit',
        amount: 100,
        description: 'Wallet Top-up',
        date: '2024-01-15',
        status: 'completed'
      },
      {
        id: '2',
        type: 'debit',
        amount: 50,
        description: 'Trip to Administrative Capital',
        date: '2024-01-14',
        status: 'completed'
      },
      {
        id: '3',
        type: 'credit',
        amount: 200,
        description: 'Wallet Top-up',
        date: '2024-01-10',
        status: 'completed'
      }
    ]
  })

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      type: 'trip_package_5',
      name: '5 Trip Package',
      description: 'Perfect for occasional travelers',
      tripsIncluded: 5,
      duration: '30 days',
      price: 225,
      isActive: true,
      validUntil: '2024-02-15',
      tripsRemaining: 3
    }
  ])

  const [availableSubscriptions] = useState<Subscription[]>([
    {
      id: '2',
      type: 'trip_package_10',
      name: '10 Trip Package',
      description: 'Best value for regular commuters',
      tripsIncluded: 10,
      duration: '60 days',
      price: 400,
      isActive: false
    },
    {
      id: '3',
      type: 'trip_package_20',
      name: '20 Trip Package',
      description: 'Ultimate savings for frequent travelers',
      tripsIncluded: 20,
      duration: '90 days',
      price: 750,
      isActive: false
    },
    {
      id: '4',
      type: 'weekly_unlimited',
      name: 'Weekly Unlimited',
      description: 'Unlimited travel for 7 days',
      tripsIncluded: -1,
      duration: '7 days',
      price: 300,
      isActive: false
    },
    {
      id: '5',
      type: 'monthly_unlimited',
      name: 'Monthly Unlimited',
      description: 'Unlimited travel for 30 days',
      tripsIncluded: -1,
      duration: '30 days',
      price: 1000,
      isActive: false
    }
  ])

  const [topUpAmount, setTopUpAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState<Subscription | null>(null)

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return

    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const amount = parseFloat(topUpAmount)
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description: 'Wallet Top-up',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions]
    }))

    setTopUpAmount('')
    setIsProcessing(false)
  }

  const handlePurchaseSubscription = async (subscription: Subscription) => {
    if (wallet.balance < subscription.price) {
      alert('Insufficient balance. Please top up your wallet first.')
      return
    }

    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Deduct from wallet
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount: subscription.price,
      description: `Purchase: ${subscription.name}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - subscription.price,
      transactions: [newTransaction, ...prev.transactions]
    }))

    // Add subscription
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      isActive: true,
      validUntil: new Date(Date.now() + getDurationInMs(subscription.duration)).toISOString().split('T')[0],
      tripsRemaining: subscription.tripsIncluded > 0 ? subscription.tripsIncluded : undefined
    }

    setSubscriptions(prev => [...prev, newSubscription])
    setIsProcessing(false)
    setShowSubscriptionDialog(null)
  }

  const getDurationInMs = (duration: string): number => {
    const days = parseInt(duration)
    return days * 24 * 60 * 60 * 1000
  }

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />
  }

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-blue-600" />
            My Wallet
          </CardTitle>
          <CardDescription>
            Manage your wallet balance and view transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {wallet.balance.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">{wallet.currency}</div>
              <div className="text-xs text-gray-500 mt-1">Current Balance</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {subscriptions.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-xs text-gray-500 mt-1">Subscriptions</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {subscriptions.reduce((acc, sub) => acc + (sub.tripsRemaining || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="text-xs text-gray-500 mt-1">Trip Credits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-6">
          {/* Wallet Top-up */}
          <Card>
            <CardHeader>
              <CardTitle>Top-up Wallet</CardTitle>
              <CardDescription>
                Add funds to your wallet for booking trips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[50, 100, 200, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="h-16 flex flex-col"
                  >
                    <span className="text-lg font-semibold">EGP {amount}</span>
                    <span className="text-xs text-gray-500">Quick Add</span>
                  </Button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="custom-amount">Custom Amount</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleTopUp}
                    disabled={!topUpAmount || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? 'Processing...' : 'Top-up'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium">•••• •••• •••• 1234</div>
                    <div className="text-sm text-gray-600">Expires 12/25</div>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-medium">Mobile Wallet</div>
                    <div className="text-sm text-gray-600">•••• 5678</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Active Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                Your current subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.filter(s => s.isActive).length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.filter(s => s.isActive).map((subscription) => (
                    <div key={subscription.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{subscription.name}</h3>
                          <p className="text-sm text-gray-600">{subscription.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Valid Until:</span>
                          <div className="font-medium">{subscription.validUntil}</div>
                        </div>
                        {subscription.tripsRemaining && (
                          <div>
                            <span className="text-sm text-gray-600">Trips Remaining:</span>
                            <div className="font-medium">{subscription.tripsRemaining}</div>
                          </div>
                        )}
                      </div>
                      
                      {subscription.tripsRemaining && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Usage Progress</span>
                            <span>{subscription.tripsIncluded - (subscription.tripsRemaining || 0)} / {subscription.tripsIncluded}</span>
                          </div>
                          <Progress 
                            value={((subscription.tripsIncluded - (subscription.tripsRemaining || 0)) / subscription.tripsIncluded) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    You don't have any active subscriptions. Purchase a subscription plan to save on your trips.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Available Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Available Subscriptions</CardTitle>
              <CardDescription>
                Choose a subscription plan that fits your travel needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{subscription.name}</h3>
                        <p className="text-sm text-gray-600">{subscription.description}</p>
                      </div>
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{subscription.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Trips:</span>
                        <span>{subscription.tripsIncluded === -1 ? 'Unlimited' : subscription.tripsIncluded}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">EGP {subscription.price}</div>
                        <div className="text-xs text-gray-500">
                          {subscription.tripsIncluded > 0 ? `EGP ${(subscription.price / subscription.tripsIncluded).toFixed(1)} per trip` : 'Unlimited travel'}
                        </div>
                      </div>
                      <Button 
                        onClick={() => setShowSubscriptionDialog(subscription)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Purchase
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View your recent wallet transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)} bg-opacity-10`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'credit' ? '+' : '-'}EGP {transaction.amount}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subscription Purchase Dialog */}
      {showSubscriptionDialog && (
        <Dialog open={!!showSubscriptionDialog} onOpenChange={() => setShowSubscriptionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Subscription Purchase</DialogTitle>
              <DialogDescription>
                Are you sure you want to purchase {showSubscriptionDialog.name}?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{showSubscriptionDialog.name}</h4>
                <p className="text-sm text-gray-600">{showSubscriptionDialog.description}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{showSubscriptionDialog.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Trips:</span>
                    <span>{showSubscriptionDialog.tripsIncluded === -1 ? 'Unlimited' : showSubscriptionDialog.tripsIncluded}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>EGP {showSubscriptionDialog.price}</span>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertDescription>
                  This amount will be deducted from your wallet balance. Current balance: EGP {wallet.balance}
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubscriptionDialog(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handlePurchaseSubscription(showSubscriptionDialog)}
                disabled={isProcessing || wallet.balance < showSubscriptionDialog.price}
              >
                {isProcessing ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}