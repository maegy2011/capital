'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Search,
  Plus,
  X
} from 'lucide-react'
import { useSupervisorSocket } from '@/hooks/useSupervisorSocket'

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

export default function AlertManagement() {
  const { alerts: realTimeAlerts, createAlert } = useSupervisorSocket()
  const [alerts, setAlerts] = useState<Alert[]>([
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
  ])

  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  // Merge real-time alerts with existing alerts
  useEffect(() => {
    const newAlertsFromSocket = realTimeAlerts.map(alert => ({
      id: alert.timestamp,
      type: alert.type as Alert['type'],
      severity: alert.severity as Alert['severity'],
      title: alert.title,
      description: alert.description,
      bus: alert.busId || 'Unknown',
      driver: 'Unknown',
      location: alert.location || 'Unknown',
      time: 'Just now',
      resolved: false,
      actionRequired: true
    }))
    
    setAlerts(prev => [...newAlertsFromSocket, ...prev])
  }, [realTimeAlerts])

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
      case 'delay': return 'Delay'
      case 'maintenance': return 'Maintenance'
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

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            resolved: true, 
            resolvedBy: 'Current User', 
            resolvedAt: 'Just now' 
          } 
        : alert
    ))
  }

  const handleCreateAlert = (data: any) => {
    createAlert(data)
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
          <p className="text-gray-600">Monitor and resolve system alerts and incidents</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Create a new system alert for monitoring and tracking
                </DialogDescription>
              </DialogHeader>
              <CreateAlertForm onSubmit={handleCreateAlert} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Critical Alerts</p>
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
                  <p className="text-sm text-gray-500">High Alerts</p>
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
                  <p className="text-sm text-gray-500">Medium Alerts</p>
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
                  <p className="text-sm text-gray-500">Total Unresolved</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUnresolved}</p>
                </div>
              </div>
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>
            
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="delay">Delay</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
              <option value="passenger-issue">Passenger Issue</option>
              <option value="system">System</option>
              <option value="security">Security</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
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
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Bus</span>
                        <div className="font-medium">{alert.bus}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Driver</span>
                        <div className="font-medium">{alert.driver}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Location</span>
                        <div className="font-medium">{alert.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Time</span>
                        <div className="font-medium">{alert.time}</div>
                      </div>
                    </div>

                    {alert.resolved && alert.resolvedBy && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          <strong>Resolved by:</strong> {alert.resolvedBy}
                          {alert.resolvedAt && <span> at {alert.resolvedAt}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {getTypeIcon(selectedAlert.type)}
                <span className="ml-2">{selectedAlert.title}</span>
              </DialogTitle>
              <DialogDescription>
                Alert details and resolution information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {getSeverityText(selectedAlert.severity)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge className={getTypeColor(selectedAlert.type)}>
                    {getTypeText(selectedAlert.type)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bus</Label>
                  <p className="text-sm">{selectedAlert.bus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Driver</Label>
                  <p className="text-sm">{selectedAlert.driver}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedAlert.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm">{selectedAlert.time}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedAlert.description}</p>
              </div>

              {selectedAlert.passengers && (
                <div>
                  <Label className="text-sm font-medium">Passengers Affected</Label>
                  <p className="text-sm mt-1">{selectedAlert.passengers}</p>
                </div>
              )}

              {selectedAlert.resolved && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <Label className="text-sm font-medium text-green-800">Resolution Information</Label>
                  <p className="text-sm text-green-700 mt-1">
                    Resolved by {selectedAlert.resolvedBy}
                    {selectedAlert.resolvedAt && ` at ${selectedAlert.resolvedAt}`}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
              {!selectedAlert.resolved && (
                <Button 
                  onClick={() => {
                    resolveAlert(selectedAlert.id)
                    setSelectedAlert(null)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Resolve Alert
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreateAlertForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    type: 'system',
    severity: 'medium',
    title: '',
    description: '',
    busId: '',
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Alert Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delay">Delay</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="passenger-issue">Passenger Issue</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="severity">Severity</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="busId">Bus ID (optional)</Label>
        <Input
          id="busId"
          value={formData.busId}
          onChange={(e) => setFormData(prev => ({ ...prev, busId: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onSubmit(null)}>
          Cancel
        </Button>
        <Button type="submit">Create Alert</Button>
      </DialogFooter>
    </form>
  )
}