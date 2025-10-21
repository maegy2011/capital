"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, Calendar, Users, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalBuses: number
  activeBuses: number
  totalTrips: number
  todayTrips: number
  totalRevenue: number
  todayRevenue: number
}

interface SystemStatsProps {
  systemStats: SystemStats | null
  loading: boolean
}

export default function SystemStats({ systemStats, loading }: SystemStatsProps) {
  const { t } = useLanguage()

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t('systemInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="animate-pulse bg-gray-200 rounded-full w-12 h-12 mx-auto mb-3"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-16 mx-auto mb-2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-6 w-12 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        ) : systemStats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('activeBuses')}
              </p>
              <p className="text-3xl font-bold text-blue-600">{systemStats.activeBuses}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('todayTrips')}
              </p>
              <p className="text-3xl font-bold text-green-600">{systemStats.todayTrips}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('activeUsers')}
              </p>
              <p className="text-3xl font-bold text-purple-600">{systemStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('systemStatus')}
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {t('online')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {t('errorLoadingData') || 'Error loading data'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}