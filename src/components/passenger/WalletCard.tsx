"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface WalletCardProps {
  wallet: Wallet
  onAddFunds: () => void
  onViewTransactions: () => void
}

export default function WalletCard({ wallet, onAddFunds, onViewTransactions }: WalletCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{t('walletBalance') || 'Wallet Balance'}</h3>
            <p className="text-blue-100">{t('availableFunds') || 'Available funds for travel'}</p>
          </div>
          <Wallet className="h-8 w-8 text-white" />
        </div>
        
        <div className="text-4xl font-bold mb-4">
          {wallet.currency} {wallet.balance.toFixed(2)}
        </div>
        
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
      
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Button 
            onClick={onAddFunds}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addFunds') || 'Add Funds'}
          </Button>
          <Button 
            onClick={onViewTransactions}
            variant="outline"
            className="flex-1"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {t('transactions') || 'Transactions'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}