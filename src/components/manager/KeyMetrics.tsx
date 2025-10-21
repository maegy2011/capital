"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Users, Bus, DollarSign, Activity, TrendingUp, BarChart3, Zap } from 'lucide-react'
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

interface KeyMetricsProps {
  systemStats: SystemStats | null
}

export default function KeyMetrics({ systemStats }: KeyMetricsProps) {
  const { t } = useLanguage()

  const metrics = [
    {
      icon: Users,
      color: 'blue',
      title: t('totalUsers'),
      value: systemStats?.totalUsers?.toLocaleString() || '0',
      trend: '+12%',
      trendText: t('thisMonth')
    },
    {
      icon: Bus,
      color: 'green',
      title: t('activeBuses'),
      value: systemStats?.activeBuses && systemStats?.totalBuses ? `${systemStats.activeBuses}/${systemStats.totalBuses}` : '0/0',
      trend: '84%',
      trendText: t('utilization'),
      trendIcon: BarChart3
    },
    {
      icon: DollarSign,
      color: 'purple',
      title: t('todayRevenue') || "Today's Revenue",
      value: `EGP ${systemStats?.todayRevenue?.toLocaleString() || '0'}`,
      trend: '+8%',
      trendText: t('vsYesterday')
    },
    {
      icon: Activity,
      color: 'orange',
      title: t('todayTrips'),
      value: systemStats?.todayTrips || '0',
      trend: '+15%',
      trendText: t('vsAverage'),
      trendIcon: Zap
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`bg-${metric.color}-100 p-3 rounded-lg`}>
                  <metric.icon className="h-6 w-6 text-${metric.color}-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-green-600">{metric.trend} {metric.trendText}</p>
                </div>
              </div>
              <div>
                {metric.trendIcon ? (
                  <metric.trendIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}