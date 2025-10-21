'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  MapPin, 
  Bus,
  Users,
  TrendingUp,
  Phone,
  MessageSquare,
  Bell,
  Plus,
  Edit,
  Eye,
  Navigation,
  Activity,
  Zap
} from 'lucide-react'
import { useSupervisorSocket } from '@/hooks/useSupervisorSocket'

interface DelayReport {
  id: string
  tripId: string
  busPlate: string
  currentStation: string
  nextStation: string
  originalArrival: string
  newArrival: string
  delayMinutes: number
  reason: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'acknowledged' | 'resolved' | 'cancelled'
  reportedAt: string
  resolvedAt?: string
  affectedPassengers: number
  actions: string[]
  resolutionNotes?: string
  estimatedImpact: string
}

export default function DelayManagement() {
  const { delays: realTimeDelays, createDelay } = useSupervisorSocket()
  const [delays, setDelays] = useState<DelayReport[]>([
    {
      id: '1',
      tripId: 'trip-1',
      busPlate: 'CA 1234',
      currentStation: 'Tahrir Square',
      nextStation: 'Nasr City',
      originalArrival: '08:20',
      newArrival: '08:35',
      delayMinutes: 15,
      reason: 'Heavy traffic in downtown area',
      severity: 'medium',
      status: 'reported',
      reportedAt: '2024-01-15 08:15:00',
      affectedPassengers: 28,
      actions: ['Notify passengers', 'Update schedule'],
      estimatedImpact: 'Minor delay to connecting trips'
    },
    {
      id: '2',
      tripId: 'trip-2',
      busPlate: 'CA 5678',
      currentStation: 'Nasr City',
      nextStation: 'Heliopolis',
      originalArrival: '08:45',
      newArrival: '09:00',
      delayMinutes: 15,
      reason: 'Road construction on main route',
      severity: 'high',
      status: 'acknowledged',
      reportedAt: '2024-01-15 08:40:00',
      affectedPassengers: 32,
      actions: ['Notify passengers', 'Find alternative route', 'Contact supervisor'],
      estimatedImpact: 'Significant impact on morning rush hour'
    }
  ])

  const [showReportDialog, setShowReportDialog] = useState(false)
  const [selectedDelay, setSelectedDelay] = useState<DelayReport | null>(null)
  const [newDelay, setNewDelay] = useState({
    tripId: '',
    busId: '',
    delayMinutes: 0,
    reason: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    affectedStations: [] as string[]
  })

  // Merge real-time delays with existing delays
  useEffect(() => {
    const newDelaysFromSocket = realTimeDelays.map(delay => ({
      id: delay.timestamp,
      tripId: delay.tripId,
      busPlate: delay.busId || 'Unknown',
      currentStation: 'Unknown',
      nextStation: 'Unknown',
      originalArrival: 'Unknown',
      newArrival: 'Unknown',
      delayMinutes: delay.delayMinutes,
      reason: delay.reason,
      severity: 'high' as const,
      status: 'reported' as const,
      reportedAt: new Date(delay.timestamp).toISOString(),
      affectedPassengers: 0,
      actions: ['Auto-reported'],
      estimatedImpact: 'To be assessed'
    }))
    
    setDelays(prev => [...newDelaysFromSocket, ...prev])
  }, [realTimeDelays])

  const handleReportDelay = () => {
    if (!newDelay.reason || newDelay.delayMinutes <= 0) return

    const delay: DelayReport = {
      id: Date.now().toString(),
      tripId: newDelay.tripId || 'trip-1',
      busPlate: newDelay.busId || 'CA 1234',
      currentStation: 'Tahrir Square',
      nextStation: 'Nasr City',
      originalArrival: '08:20',
      newArrival: '08:20',
      delayMinutes: newDelay.delayMinutes,
      reason: newDelay.reason,
      severity: newDelay.severity,
      status: 'reported',
      reportedAt: new Date().toISOString(),
      affectedPassengers: 28,
      actions: ['Delay reported'],
      estimatedImpact: 'Assessment pending'
    }

    // Calculate new arrival time
    const originalTime = new Date(`2024-01-15 ${delay.originalArrival}`)
    originalTime.setMinutes(originalTime.getMinutes() + newDelay.delayMinutes)
    delay.newArrival = originalTime.toTimeString().slice(0, 5)

    setDelays(prev => [delay, ...prev])
    
    // Create delay via WebSocket
    createDelay({
      tripId: delay.tripId,
      busId: delay.busPlate,
      delayMinutes: delay.delayMinutes,
      reason: delay.reason,
      affectedStations: newDelay.affectedStations
    })
    
    setNewDelay({
      tripId: '',
      busId: '',
      delayMinutes: 0,
      reason: '',
      severity: 'medium',
      affectedStations: []
    })
    setShowReportDialog(false)
  }

  const handleAcknowledgeDelay = (delayId: string) => {
    setDelays(prev => prev.map(delay => 
      delay.id === delayId 
        ? { 
            ...delay, 
            status: 'acknowledged' as const,
            actions: [...delay.actions, 'Delay acknowledged by supervisor']
          }
        : delay
    ))
  }

  const handleResolveDelay = (delayId: string, resolutionNotes?: string) => {
    setDelays(prev => prev.map(delay => 
      delay.id === delayId 
        ? { 
            ...delay, 
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            actions: [...delay.actions, 'Delay resolved'],
            resolutionNotes
          }
        : delay
    ))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'acknowledged': return 'bg-blue-100 text-blue-800'
      case 'reported': return 'bg-orange-100 text-orange-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    totalDelays: delays.length,
    criticalSeverity: delays.filter(d => d.severity === 'critical').length,
    highSeverity: delays.filter(d => d.severity === 'high').length,
    resolvedDelays: delays.filter(d => d.status === 'resolved').length,
    totalAffectedPassengers: delays.reduce((acc, delay) => acc + delay.affectedPassengers, 0),
    avgResolutionTime: delays.filter(d => d.resolvedAt).reduce((acc, delay) => {
      const reported = new Date(delay.reportedAt)
      const resolved = new Date(delay.resolvedAt!)
      return acc + (resolved.getTime() - reported.getTime()) / (1000 * 60) // minutes
    }, 0) / delays.filter(d => d.resolvedAt).length
  }

  const activeDelays = delays.filter(d => d.status !== 'resolved' && d.status !== 'cancelled')
  const resolvedDelaysList = delays.filter(d => d.status === 'resolved')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delay Management</h2>
          <p className="text-gray-600">Monitor and manage trip delays in real-time</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Report Delay
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report New Delay</DialogTitle>
                <DialogDescription>
                  Report a new trip delay for monitoring and resolution
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tripId">Trip ID</Label>
                  <Input
                    id="tripId"
                    value={newDelay.tripId}
                    onChange={(e) => setNewDelay(prev => ({ ...prev, tripId: e.target.value }))}
                    placeholder="Enter trip ID"
                  />
                </div>
                <div>
                  <Label htmlFor="busId">Bus ID</Label>
                  <Input
                    id="busId"
                    value={newDelay.busId}
                    onChange={(e) => setNewDelay(prev => ({ ...prev, busId: e.target.value }))}
                    placeholder="Enter bus ID"
                  />
                </div>
                <div>
                  <Label htmlFor="delayMinutes">Delay Minutes</Label>
                  <Input
                    id="delayMinutes"
                    type="number"
                    value={newDelay.delayMinutes}
                    onChange={(e) => setNewDelay(prev => ({ ...prev, delayMinutes: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newDelay.severity} onValueChange={(value: any) => setNewDelay(prev => ({ ...prev, severity: value }))}>
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
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={newDelay.reason}
                    onChange={(e) => setNewDelay(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Describe the reason for the delay"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReportDelay} disabled={!newDelay.reason || newDelay.delayMinutes <= 0}>
                  Report Delay
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Delays</p>
                <p className="text-2xl font-bold">{stats.totalDelays}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalSeverity}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Severity</p>
                <p className="text-2xl font-bold text-orange-600">{stats.highSeverity}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedDelays}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Affected</p>
                <p className="text-2xl font-bold">{stats.totalAffectedPassengers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgResolutionTime || 0)}m</p>
              </div>
              <Timer className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Delays ({activeDelays.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedDelaysList.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDelays.length > 0 ? (
            <div className="space-y-4">
              {activeDelays.map((delay) => (
                <Card key={delay.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${
                          delay.severity === 'critical' ? 'bg-red-100' : 
                          delay.severity === 'high' ? 'bg-orange-100' :
                          delay.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            delay.severity === 'critical' ? 'text-red-600' : 
                            delay.severity === 'high' ? 'text-orange-600' :
                            delay.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">Bus {delay.busPlate}</h3>
                            <Badge className={getSeverityColor(delay.severity)}>
                              {delay.severity}
                            </Badge>
                            <Badge className={getStatusColor(delay.status)}>
                              {delay.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{delay.reason}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {delay.currentStation} → {delay.nextStation}
                            </span>
                            <span className="flex items-center">
                              <Timer className="h-4 w-4 mr-1" />
                              {delay.delayMinutes} min delay
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {delay.affectedPassengers} passengers
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          <div>Original: {delay.originalArrival}</div>
                          <div className="font-medium text-red-600">New: {delay.newArrival}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(delay.reportedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Impact Assessment</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Passenger Impact:</span>
                            <span className="font-medium">{delay.affectedPassengers} affected</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Impact:</span>
                            <span className="font-medium">{delay.estimatedImpact}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Actions Taken</h4>
                        <div className="space-y-1">
                          {delay.actions.map((action, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Status Timeline</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-blue-600" />
                            Reported: {new Date(delay.reportedAt).toLocaleTimeString()}
                          </div>
                          {delay.resolvedAt && (
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              Resolved: {new Date(delay.resolvedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {delay.status === 'reported' && (
                        <Button 
                          size="sm"
                          onClick={() => handleAcknowledgeDelay(delay.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Acknowledge
                        </Button>
                      )}
                      {delay.status === 'acknowledged' && (
                        <Button 
                          size="sm"
                          onClick={() => {
                            const resolutionNotes = prompt('Enter resolution notes:')
                            if (resolutionNotes) {
                              handleResolveDelay(delay.id, resolutionNotes)
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedDelay(delay)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Delays</h3>
                <p className="text-gray-600">All trips are running on schedule. Great job!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedDelaysList.length > 0 ? (
            <div className="space-y-4">
              {resolvedDelaysList.map((delay) => (
                <Card key={delay.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">Bus {delay.busPlate}</h3>
                          <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                          <Badge className={getSeverityColor(delay.severity)}>
                            {delay.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{delay.reason}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <div className="font-medium">{delay.delayMinutes} minutes</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Resolved:</span>
                            <div className="font-medium">
                              {delay.resolvedAt ? new Date(delay.resolvedAt).toLocaleString() : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Passengers:</span>
                            <div className="font-medium">{delay.affectedPassengers} affected</div>
                          </div>
                        </div>
                        {delay.resolutionNotes && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <strong>Resolution:</strong> {delay.resolutionNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDelay(delay)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resolved Delays Yet</h3>
                <p className="text-gray-600">Resolved delays will appear here once processed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delay Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical</span>
                    <span className="text-sm font-medium">{stats.criticalSeverity}</span>
                  </div>
                  <Progress value={(stats.criticalSeverity / stats.totalDelays) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High</span>
                    <span className="text-sm font-medium">{stats.highSeverity}</span>
                  </div>
                  <Progress value={(stats.highSeverity / stats.totalDelays) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium</span>
                    <span className="text-sm font-medium">{delays.filter(d => d.severity === 'medium').length}</span>
                  </div>
                  <Progress value={(delays.filter(d => d.severity === 'medium').length / stats.totalDelays) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low</span>
                    <span className="text-sm font-medium">{delays.filter(d => d.severity === 'low').length}</span>
                  </div>
                  <Progress value={(delays.filter(d => d.severity === 'low').length / stats.totalDelays) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round((stats.resolvedDelays / stats.totalDelays) * 100)}%
                    </span>
                  </div>
                  <Progress value={(stats.resolvedDelays / stats.totalDelays) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Resolution Time</span>
                    <span className="text-sm font-medium">{Math.round(stats.avgResolutionTime || 0)} minutes</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Passengers Affected</span>
                    <span className="text-sm font-medium">{stats.totalAffectedPassengers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delay Details Dialog */}
      {selectedDelay && (
        <Dialog open={!!selectedDelay} onOpenChange={() => setSelectedDelay(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Delay Details - Bus {selectedDelay.busPlate}</DialogTitle>
              <DialogDescription>
                Complete information about the delay and resolution process
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip ID:</span>
                      <span className="font-medium">{selectedDelay.tripId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus Plate:</span>
                      <span className="font-medium">{selectedDelay.busPlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{selectedDelay.currentStation} → {selectedDelay.nextStation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delay Duration:</span>
                      <span className="font-medium">{selectedDelay.delayMinutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <Badge className={getSeverityColor(selectedDelay.severity)}>
                        {selectedDelay.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Timing Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Arrival:</span>
                      <span className="font-medium">{selectedDelay.originalArrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Arrival:</span>
                      <span className="font-medium text-red-600">{selectedDelay.newArrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reported At:</span>
                      <span className="font-medium">{new Date(selectedDelay.reportedAt).toLocaleString()}</span>
                    </div>
                    {selectedDelay.resolvedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolved At:</span>
                        <span className="font-medium">{new Date(selectedDelay.resolvedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Delay Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedDelay.reason}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Impact Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Passengers Affected</div>
                    <div className="text-2xl font-bold text-blue-900">{selectedDelay.affectedPassengers}</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 mb-1">Estimated Impact</div>
                    <div className="font-medium text-orange-900">{selectedDelay.estimatedImpact}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Action Timeline</h4>
                <div className="space-y-2">
                  {selectedDelay.actions.map((action, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDelay.resolutionNotes && (
                <div>
                  <h4 className="font-semibold mb-3">Resolution Notes</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedDelay.resolutionNotes}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDelay(null)}>
                Close
              </Button>
              {selectedDelay.status === 'acknowledged' && (
                <Button 
                  onClick={() => {
                    const resolutionNotes = prompt('Enter resolution notes:')
                    if (resolutionNotes) {
                      handleResolveDelay(selectedDelay.id, resolutionNotes)
                      setSelectedDelay(null)
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Resolve Delay
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}