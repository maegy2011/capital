"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export default function SystemHealth() {
  const { t } = useLanguage()

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{t('systemHealth') || 'System Health'}</h3>
            <p className="text-purple-100">{t('allSystemsOperational') || 'All systems operational'}</p>
          </div>
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <Badge className="text-sm bg-green-100 text-green-700">
            EXCELLENT
          </Badge>
          <div className="flex items-center space-x-6 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>99.9% {t('uptime') || 'Uptime'}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>45ms {t('responseTime') || 'Response Time'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-purple-100 text-sm">{t('serverStatus') || 'Server Status'}</p>
            <p className="font-semibold">{t('online')}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-purple-100 text-sm">{t('database') || 'Database'}</p>
            <p className="font-semibold">{t('connected')}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-purple-100 text-sm">{t('apiStatus') || 'API Status'}</p>
            <p className="font-semibold">{t('operational')}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-purple-100 text-sm">{t('security') || 'Security'}</p>
            <p className="font-semibold">{t('secured')}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}