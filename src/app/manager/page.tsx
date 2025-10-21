"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Users, 
  Bus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  Settings,
  UserPlus,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronRight,
  Server,
  Database,
  Cog,
  UserCheck,
  Zap,
  Globe,
  ShieldCheck,
  Monitor,
  Wifi,
  Power,
  ArrowRight,
  CreditCard,
  Ticket,
  Wallet
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'
import Link from 'next/link'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalBuses: number
  activeBuses: number
  totalTrips: number
  todayTrips: number
  revenue: number
  todayRevenue: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

interface User {
  id: string
  name: string
  email: string
  role: 'passenger' | 'supervisor' | 'manager'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  trips: number
}

interface SystemLog {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: string
  user: string
  severity: 'low' | 'medium' | 'high'
}

const systemStats: SystemStats = {
  totalUsers: 15420,
  activeUsers: 3241,
  totalBuses: 45,
  activeBuses: 38,
  totalTrips: 1250,
  todayTrips: 89,
  revenue: 45680,
  todayRevenue: 3240,
  systemHealth: 'excellent'
}

const users: User[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@example.com',
    role: 'passenger',
    status: 'active',
    lastLogin: '2 hours ago',
    trips: 23
  },
  {
    id: '2',
    name: 'Mohamed Ali',
    email: 'mohamed.a@example.com',
    role: 'supervisor',
    status: 'active',
    lastLogin: '1 hour ago',
    trips: 0
  },
  {
    id: '3',
    name: 'Sara Mahmoud',
    email: 'sara.m@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '30 minutes ago',
    trips: 0
  },
  {
    id: '4',
    name: 'Fatima Ahmed',
    email: 'fatima.a@example.com',
    role: 'passenger',
    status: 'inactive',
    lastLogin: '2 days ago',
    trips: 45
  }
]

const systemLogs: SystemLog[] = [
  {
    id: '1',
    type: 'info',
    message: 'System backup completed successfully',
    timestamp: '5 minutes ago',
    user: 'System',
    severity: 'low'
  },
  {
    id: '2',
    type: 'warning',
    message: 'High memory usage detected on server 2',
    timestamp: '15 minutes ago',
    user: 'Monitor',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'success',
    message: 'New user registration: Ahmed Hassan',
    timestamp: '1 hour ago',
    user: 'System',
    severity: 'low'
  },
  {
    id: '4',
    type: 'error',
    message: 'Failed to connect to payment gateway',
    timestamp: '2 hours ago',
    user: 'System',
    severity: 'high'
  }
]

export default function ManagerDashboard() {
  const { t, isRTL } = useLanguage()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'analytics' | 'logs' | 'settings'>('overview')

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'passenger': return 'bg-blue-100 text-blue-700'
      case 'supervisor': return 'bg-green-100 text-green-700'
      case 'manager': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'suspended': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info': return <Activity className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'error': return <AlertTriangle className="h-5 w-5" />
      case 'success': return <CheckCircle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'error': return 'bg-red-100 text-red-700'
      case 'success': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'passenger': return t('passenger')
      case 'supervisor': return t('supervisor')
      case 'manager': return t('manager')
      default: return role
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active') || 'Active'
      case 'inactive': return 'Inactive'
      case 'suspended': return 'Suspended'
      default: return status
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
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('manager')}</p>
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
            {t('managerDashboard') || 'System Manager Dashboard'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('administrativeControl') || 'Administrative control and system oversight'}
          </p>
        </div>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/manager/user-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('userManagement') || 'User Management'}</h3>
                    <p className="text-sm text-gray-500">{t('manageSystemUsers') || 'Manage users, roles, and permissions'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manager/system-health">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Monitor className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('systemHealth') || 'System Health'}</h3>
                    <p className="text-sm text-gray-500">{t('monitorSystemPerformance') || 'Monitor system performance and uptime'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manager/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('analytics') || 'Analytics'}</h3>
                    <p className="text-sm text-gray-500">{t('viewReportsAndInsights') || 'View reports and business insights'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* System Health */}
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
              <Badge className={`text-sm ${getSystemHealthColor(systemStats.systemHealth)}`}>
                {systemStats.systemHealth.toUpperCase()}
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalUsers')}</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12% {t('thisMonth')}</p>
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
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Bus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('activeBuses')}</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.activeBuses}/{systemStats.totalBuses}</p>
                    <p className="text-xs text-green-600">84% {t('utilization')}</p>
                  </div>
                </div>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('todayRevenue') || "Today's Revenue"}</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {systemStats.todayRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+8% {t('vsYesterday')}</p>
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
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('todayTrips')}</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.todayTrips}</p>
                    <p className="text-xs text-green-600">+15% {t('vsAverage')}</p>
                  </div>
                </div>
                <Zap className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{t('overview') || 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t('users')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{t('analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>{t('logs')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>{t('settings')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                    {t('recentUsers') || 'Recent Users'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                                {getRoleText(user.role)}
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                                {getStatusText(user.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{user.lastLogin}</div>
                          {user.role === 'passenger' && (
                            <div className="text-sm text-gray-900 mt-1">{user.trips} {t('trips') || 'trips'}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent System Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    {t('recentSystemLogs') || 'Recent System Logs'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${getLogColor(log.type)}`}>
                            {getLogIcon(log.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{log.message}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <span>{log.user}</span>
                              <span>•</span>
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-xs ${getLogColor(log.type)}`}>
                            {log.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  {t('userOverview') || 'User Overview'}
                </CardTitle>
                <CardDescription>
                  {t('manageAllSystemUsers') || 'Manage all system users and their permissions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-900">{systemStats.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-blue-700">{t('totalUsers')}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-900">{systemStats.activeUsers.toLocaleString()}</div>
                      <div className="text-sm text-green-700">{t('activeUsers')}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-900">+12%</div>
                      <div className="text-sm text-purple-700">{t('growthThisMonth')}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {getRoleText(user.role)}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                              {getStatusText(user.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{user.lastLogin}</div>
                        {user.role === 'passenger' && (
                          <div className="text-sm text-gray-900 mt-1">{user.trips} {t('trips') || 'trips'}</div>
                        )}
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  {t('analyticsOverview') || 'Analytics Overview'}
                </CardTitle>
                <CardDescription>
                  {t('systemPerformanceAndBusinessMetrics') || 'System performance and business metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('revenueOverview') || 'Revenue Overview'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('todayRevenue') || "Today's Revenue"}</span>
                          <span className="font-semibold">EGP {systemStats.todayRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('monthlyRevenue') || 'Monthly Revenue'}</span>
                          <span className="font-semibold">EGP {(systemStats.todayRevenue * 30).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('totalRevenue') || 'Total Revenue'}</span>
                          <span className="font-semibold">EGP {systemStats.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('tripStatistics') || 'Trip Statistics'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('todayTrips')}</span>
                          <span className="font-semibold">{systemStats.todayTrips}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('monthlyTrips') || 'Monthly Trips'}</span>
                          <span className="font-semibold">{(systemStats.todayTrips * 30).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('totalTrips')}</span>
                          <span className="font-semibold">{systemStats.totalTrips.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('performanceChart') || 'Performance Chart'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">{t('performanceChartPlaceholder') || 'Performance chart will be displayed here'}</p>
                        <p className="text-sm text-gray-400 mt-2">{t('showingKeyMetricsOverTime') || 'Showing key metrics over time'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  {t('systemLogs') || 'System Logs'}
                </CardTitle>
                <CardDescription>
                  {t('detailedSystemActivityLogs') || 'Detailed system activity and event logs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getLogColor(log.type)}`}>
                          {getLogIcon(log.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{log.message}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{log.user}</span>
                            <span>•</span>
                            <span>{log.timestamp}</span>
                            <span>•</span>
                            <span className="capitalize">{log.severity} {t('severity') || 'severity'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getLogColor(log.type)}`}>
                          {log.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  {t('systemSettings') || 'System Settings'}
                </CardTitle>
                <CardDescription>
                  {t('configureSystemParameters') || 'Configure system parameters and preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        {t('securitySettings') || 'Security Settings'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('twoFactorAuth') || 'Two-Factor Authentication'}</span>
                          <Badge className="text-xs bg-green-100 text-green-700">{t('enabled') || 'Enabled'}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('sessionTimeout') || 'Session Timeout'}</span>
                          <span className="text-sm font-medium">30 {t('minutes') || 'minutes'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('passwordPolicy') || 'Password Policy'}</span>
                          <Badge className="text-xs bg-blue-100 text-blue-700">{t('strict') || 'Strict'}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Database className="h-5 w-5 mr-2 text-blue-600" />
                        {t('dataSettings') || 'Data Settings'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('backupFrequency') || 'Backup Frequency'}</span>
                          <span className="text-sm font-medium">{t('daily') || 'Daily'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('dataRetention') || 'Data Retention'}</span>
                          <span className="text-sm font-medium">90 {t('days') || 'days'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('logRetention') || 'Log Retention'}</span>
                          <span className="text-sm font-medium">30 {t('days') || 'days'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Server className="h-5 w-5 mr-2 text-orange-600" />
                      {t('serverConfiguration') || 'Server Configuration'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('serverStatus') || 'Server Status'}</div>
                        <div className="font-semibold text-green-600">{t('online')}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('cpuUsage') || 'CPU Usage'}</div>
                        <div className="font-semibold text-blue-600">45%</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('memoryUsage') || 'Memory Usage'}</div>
                        <div className="font-semibold text-yellow-600">68%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}