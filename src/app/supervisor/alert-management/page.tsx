"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bus, 
  Wrench,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  MessageSquare,
  Phone,
  MapPin,
  Activity,
  Shield,
  Filter,
  Search
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface Alert {
  id: string
  type: 'delay' | 'maintenance' | 'emergency' | 'passenger-issue' | 'system' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  bus: string
  driver: string
  location: string
  time: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  actionRequired: boolean
  passengers?: number
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'delay',
    severity: 'medium',
    title: 'Bus CA 5678 Delayed',
    description: 'Bus is running 15 minutes behind schedule due to heavy traffic in Nasr City area',
    bus: 'CA 5678',
    driver: 'Mohamed Ali',
    location: 'Nasr City',
    time: '5 min ago',
    resolved: false,
    actionRequired: true,
    passengers: 25
  },
  {
    id: '2',
    type: 'maintenance',
    severity: 'high',
    title: 'Maintenance Required - CA 9012',
    description: 'Bus CA 9012 needs scheduled maintenance within 100km. Engine performance degrading.',
    bus: 'CA 9012',
    driver: 'Sara Mahmoud',
    location: 'Heliopolis',
    time: '1 hour ago',
    resolved: false,
    actionRequired: true,
    passengers: 12
  },
  {
    id: '3',
    type: 'passenger-issue',
    severity: 'medium',
    title: 'Passenger Complaint - Overcrowding',
    description: 'Passengers reporting overcrowding on Bus CA 1234. Capacity exceeded by 5 passengers.',
    bus: 'CA 1234',
    driver: 'Ahmed Hassan',
    location: 'Tahrir Square',
    time: '30 min ago',
    resolved: false,
    actionRequired: true,
    passengers: 35
  },
  {
    id: '4',
    type: 'emergency',
    severity: 'critical',
    title: 'Medical Emergency - Bus CA 3456',
    description: 'Passenger experiencing medical emergency. Bus stopped at current location.',
    bus: 'CA 3456',
    driver: 'Khalid Omar',
    location: 'Maadi Station',
    time: '2 min ago',
    resolved: false,
    actionRequired: true,
    passengers: 18
  },
  {
    id: '5',
    type: 'system',
    severity: 'low',
    title: 'GPS Signal Lost',
    description: 'GPS signal temporarily lost for Bus CA 7890. Last known location: Admin Capital.',
    bus: 'CA 7890',
    driver: 'Nadia Ahmed',
    location: 'Admin Capital',
    time: '15 min ago',
    resolved: true,
    resolvedBy: 'System',
    resolvedAt: '10 min ago',
    actionRequired: false,
    passengers: 20
  }
]

export default function AlertManagement() {
  const { t, isRTL } = useLanguage()
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'critical': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delay': return 'bg-yellow-100 text-yellow-700'
      case 'maintenance': return 'bg-orange-100 text-orange-700'
      case 'emergency': return 'bg-red-100 text-red-700'
      case 'passenger-issue': return 'bg-purple-100 text-purple-700'
      case 'system': return 'bg-blue-100 text-blue-700'
      case 'security': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'emergency': return <AlertTriangle className="h-5 w-5" />
      case 'passenger-issue': return <Users className="h-5 w-5" />
      case 'system': return <Activity className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Low'
      case 'medium': return 'Medium'
      case 'high': return 'High'
      case 'critical': return 'Critical'
      default: return severity
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'delay': return t('delay') || 'Delay'
      case 'maintenance': return t('maintenance') || 'Maintenance'
      case 'emergency': return 'Emergency'
      case 'passenger-issue': return 'Passenger Issue'
      case 'system': return 'System'
      case 'security': return 'Security'
      default: return type
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity
    const typeMatch = filterType === 'all' || alert.type === filterType
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'resolved' && alert.resolved) || 
      (filterStatus === 'unresolved' && !alert.resolved)
    
    return severityMatch && typeMatch && statusMatch
  })

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved).length
  const highAlerts = alerts.filter(alert => alert.severity === 'high' && !alert.resolved).length
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium' && !alert.resolved).length
  const totalUnresolved = alerts.filter(alert => !alert.resolved).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('supervisor')} - {t('alertManagement') || 'Alert Management'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-green-600 text-white">AS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('alertManagement') || 'Alert Management'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('monitorAndResolveAlerts') || 'Monitor and resolve system alerts and incidents'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('criticalAlerts') || 'Critical Alerts'}</p>
                    <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('highAlerts') || 'High Alerts'}</p>
                    <p className="text-2xl font-bold text-gray-900">{highAlerts}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('mediumAlerts') || 'Medium Alerts'}</p>
                    <p className="text-2xl font-bold text-gray-900">{mediumAlerts}</p>
                  </div>
                </div>
                <TrendingDown className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalUnresolved') || 'Total Unresolved'}</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUnresolved}</p>
                  </div>
                </div>
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{t('filters') || 'Filters'}</span>
              </div>
              
              <select 
                value={filterSeverity} 
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">{t('allSeverities') || 'All Severities'}</option>
                <option value="critical">{t('critical') || 'Critical'}</option>
                <option value="high">{t('high') || 'High'}</option>
                <option value="medium">{t('medium') || 'Medium'}</option>
                <option value="low">{t('low') || 'Low'}</option>
              </select>

              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">{t('allTypes') || 'All Types'}</option>
                <option value="delay">{t('delay') || 'Delay'}</option>
                <option value="maintenance">{t('maintenance') || 'Maintenance'}</option>
                <option value="emergency">{t('emergency') || 'Emergency'}</option>
                <option value="passenger-issue">{t('passengerIssue') || 'Passenger Issue'}</option>
                <option value="system">{t('system') || 'System'}</option>
              </select>

              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">{t('allStatuses') || 'All Statuses'}</option>
                <option value="unresolved">{t('unresolved') || 'Unresolved'}</option>
                <option value="resolved">{t('resolved') || 'Resolved'}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`hover:shadow-lg transition-shadow ${alert.resolved ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {getSeverityText(alert.severity)}
                        </Badge>
                        <Badge className={`text-xs ${getTypeColor(alert.type)}`}>
                          {getTypeText(alert.type)}
                        </Badge>
                        {alert.resolved && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            {t('resolved') || 'Resolved'}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{alert.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t('bus') || 'Bus'}</span>
                          <div className="font-medium">{alert.bus}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('driver') || 'Driver'}</span>
                          <div className="font-medium">{alert.driver}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('location') || 'Location'}</span>
                          <div className="font-medium">{alert.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('time') || 'Time'}</span>
                          <div className="font-medium">{alert.time}</div>
                        </div>
                      </div>

                      {alert.passengers && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">{t('passengersAffected') || 'Passengers Affected'}</span>
                          <div className="font-medium">{alert.passengers}</div>
                        </div>
                      )}

                      {alert.resolved && alert.resolvedBy && (
                        <div className="mt-2 text-sm text-green-600">
                          {t('resolvedBy') || 'Resolved by'} {alert.resolvedBy} {t('at') || 'at'} {alert.resolvedAt}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {!alert.resolved && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('viewDetails') || 'View Details'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {alert.severity === 'critical' && (
                          <Button variant="destructive" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            {t('emergencyContact') || 'Emergency'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('noAlertsFound') || 'No alerts found'}
              </h3>
              <p className="text-gray-500">
                {t('noAlertsMatchFilters') || 'No alerts match the selected filters'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}