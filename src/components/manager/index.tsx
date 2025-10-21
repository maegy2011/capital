"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Power
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'
import QuickAccess from './QuickAccess'
import SystemHealth from './SystemHealth'
import KeyMetrics from './KeyMetrics'
import UsersTab from './UsersTab'
import AnalyticsTab from './AnalyticsTab'

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

interface User {
  id: string
  name: string
  email: string
  role: 'PASSENGER' | 'SUPERVISOR' | 'ADMIN'
  createdAt: string
  updatedAt: string
  isActive?: boolean
  bookings?: Array<{
    id: string
  }>
  wallets?: Array<{
    id: string
    balance: number
  }>
}

interface SystemLog {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: string
  user: string
  severity: 'low' | 'medium' | 'high'
}

export default function ManagerDashboard() {
  const { t, isRTL } = useLanguage()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'analytics' | 'logs' | 'settings'>('overview')
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/users')
        ])

        const analyticsData = await analyticsRes.json()
        const usersData = await usersRes.json()

        setSystemStats(analyticsData.stats)
        setUsers(usersData)

        // Mock system logs for now - in a real app, this would come from a logs API
        setSystemLogs([
          {
            id: '1',
            type: 'info',
            message: 'System analytics fetched successfully',
            timestamp: 'Just now',
            user: 'System',
            severity: 'low'
          },
          {
            id: '2',
            type: 'success',
            message: 'Database connection established',
            timestamp: '1 minute ago',
            user: 'System',
            severity: 'low'
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'PASSENGER': return 'bg-blue-100 text-blue-700'
      case 'SUPERVISOR': return 'bg-green-100 text-green-700'
      case 'ADMIN': return 'bg-purple-100 text-purple-700'
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

  const getRoleText = (role: string) => {
    switch (role) {
      case 'PASSENGER': return t('passenger')
      case 'SUPERVISOR': return t('supervisor')
      case 'ADMIN': return t('manager')
      default: return role
    }
  }

  const getStatusColor = (isActive?: boolean) => {
    const active = isActive !== undefined ? isActive : true
    return active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }

  const getStatusText = (isActive?: boolean) => {
    const active = isActive !== undefined ? isActive : true
    return active ? (t('active') || 'Active') : (t('inactive') || 'Inactive')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

        <QuickAccess />
        <SystemHealth />
        <KeyMetrics systemStats={systemStats} />

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
              <BarChart3 className="h-4 w-4" />
              <span>{t('analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>{t('systemLogs')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>{t('settings')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsTab systemStats={systemStats} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTab 
              users={users}
              getRoleColor={getRoleColor}
              getRoleText={getRoleText}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab systemStats={systemStats} />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  Monitor system events and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${getLogColor(log.type)}`}>
                        {getLogIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{log.message}</h4>
                          <span className="text-sm text-gray-500">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600">By {log.user}</p>
                      </div>
                      <Badge variant="outline">{log.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system parameters and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Auto-backup</span>
                          <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Maintenance mode</span>
                          <Badge className="bg-red-100 text-red-700">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Two-factor authentication</span>
                          <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Session timeout</span>
                          <span>30 minutes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Password policy</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}