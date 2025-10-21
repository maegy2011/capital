"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Shield, 
  Server, 
  Database, 
  Wifi, 
  Power,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  Cog,
  Monitor,
  BarChart3,
  RefreshCw,
  Settings,
  Eye,
  Clock,
  Users,
  Bus,
  DollarSign
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface SystemComponent {
  name: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
  uptime: number
  responseTime: number
  lastCheck: string
  description: string
  icon: React.ReactNode
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'normal' | 'warning' | 'critical'
}

const systemComponents: SystemComponent[] = [
  {
    name: 'Application Server',
    status: 'excellent',
    uptime: 99.9,
    responseTime: 45,
    lastCheck: '2 minutes ago',
    description: 'Main application server handling all user requests',
    icon: <Server className="h-5 w-5" />
  },
  {
    name: 'Database Server',
    status: 'good',
    uptime: 99.7,
    responseTime: 120,
    lastCheck: '1 minute ago',
    description: 'Primary database for user and trip data',
    icon: <Database className="h-5 w-5" />
  },
  {
    name: 'API Gateway',
    status: 'excellent',
    uptime: 100,
    responseTime: 25,
    lastCheck: '30 seconds ago',
    description: 'REST API gateway for mobile and web applications',
    icon: <Globe className="h-5 w-5" />
  },
  {
    name: 'Real-time Services',
    status: 'good',
    uptime: 98.5,
    responseTime: 80,
    lastCheck: '1 minute ago',
    description: 'WebSocket services for live tracking and notifications',
    icon: <Wifi className="h-5 w-5" />
  },
  {
    name: 'Payment Gateway',
    status: 'warning',
    uptime: 95.2,
    responseTime: 350,
    lastCheck: '5 minutes ago',
    description: 'External payment processing service',
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    name: 'Security Services',
    status: 'excellent',
    uptime: 100,
    responseTime: 15,
    lastCheck: '1 minute ago',
    description: 'Authentication, authorization, and security monitoring',
    icon: <Shield className="h-5 w-5" />
  }
]

const systemMetrics: SystemMetric[] = [
  { name: 'CPU Usage', value: 45, unit: '%', trend: 'stable', status: 'normal' },
  { name: 'Memory Usage', value: 68, unit: '%', trend: 'up', status: 'normal' },
  { name: 'Disk Usage', value: 82, unit: '%', trend: 'up', status: 'warning' },
  { name: 'Network I/O', value: 34, unit: 'Mbps', trend: 'stable', status: 'normal' },
  { name: 'Active Connections', value: 1250, unit: '', trend: 'up', status: 'normal' },
  { name: 'Response Time', value: 85, unit: 'ms', trend: 'down', status: 'normal' }
]

export default function SystemHealth() {
  const { t, isRTL } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent'
      case 'good': return 'Good'
      case 'warning': return 'Warning'
      case 'critical': return 'Critical'
      default: return status
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />
      case 'down': return <TrendingDown className="h-4 w-4" />
      case 'stable': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      case 'stable': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const overallHealth = 'excellent' // This would be calculated from all components
  const averageUptime = systemComponents.reduce((sum, comp) => sum + comp.uptime, 0) / systemComponents.length
  const averageResponseTime = systemComponents.reduce((sum, comp) => sum + comp.responseTime, 0) / systemComponents.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('manager')} - {t('systemHealth') || 'System Health'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-purple-600 text-white">SM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('systemHealth') || 'System Health Monitor'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('monitorSystemPerformance') || 'Monitor system performance, uptime, and component status'}
          </p>
        </div>

        {/* Overall Health Status */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{t('overallSystemHealth') || 'Overall System Health'}</h3>
                <p className="text-purple-100">{t('allSystemsOperational') || 'All systems operational'}</p>
              </div>
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center space-x-6 mb-4">
              <Badge className={`text-sm ${getStatusColor(overallHealth)}`}>
                {getStatusText(overallHealth).toUpperCase()}
              </Badge>
              <div className="flex items-center space-x-6 text-purple-100">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{averageUptime.toFixed(1)}% {t('uptime') || 'Uptime'}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  <span>{Math.round(averageResponseTime)}ms {t('responseTime') || 'Response Time'}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            </div>
          </div>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                  <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-gray-500">{metric.unit}</span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={metric.unit === '%' ? metric.value : Math.min(metric.value / 20 * 100, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{t('current') || 'Current'}</span>
                    <span className={getMetricStatusColor(metric.status)}>
                      {metric.status === 'normal' ? t('normal') : metric.status === 'warning' ? t('warning') : t('critical')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systemComponents.map((component, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${getStatusColor(component.status)}`}>
                      {component.icon}
                    </div>
                    {component.name}
                  </CardTitle>
                  <Badge className={`text-xs ${getStatusColor(component.status)}`}>
                    {getStatusText(component.status)}
                  </Badge>
                </div>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">{t('uptime') || 'Uptime'}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">{component.uptime}%</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{t('responseTime') || 'Response Time'}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">{component.responseTime}ms</span>
                        <Zap className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('lastCheck') || 'Last Check'}</span>
                      <span className="font-medium">{component.lastCheck}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('viewDetails') || 'View Details'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Trends */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              {t('healthTrends') || 'Health Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('healthChartPlaceholder') || 'Health trends chart will be displayed here'}</p>
                <p className="text-sm text-gray-400 mt-2">{t('showingSystemMetricsOverTime') || 'Showing system metrics over time'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}