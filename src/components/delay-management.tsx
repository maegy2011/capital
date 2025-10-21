"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Bell
} from 'lucide-react'

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
  severity: 'low' | 'medium' | 'high'
  status: 'reported' | 'acknowledged' | 'resolved'
  reportedAt: string
  resolvedAt?: string
  affectedPassengers: number
  actions: string[]
}

interface DelayManagementProps {
  tripId?: string
  onDelayUpdate?: (delay: DelayReport) => void
}

export default function DelayManagement({ tripId, onDelayUpdate }: DelayManagementProps) {
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
      actions: ['Notify passengers', 'Update schedule']
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
      actions: ['Notify passengers', 'Find alternative route', 'Contact supervisor']
    }
  ])

  const [showReportDialog, setShowReportDialog] = useState(false)
  const [selectedDelay, setSelectedDelay] = useState<DelayReport | null>(null)
  const [newDelay, setNewDelay] = useState({
    reason: '',
    delayMinutes: 0,
    severity: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleReportDelay = () => {
    if (!newDelay.reason || newDelay.delayMinutes <= 0) return

    const delay: DelayReport = {
      id: Date.now().toString(),
      tripId: tripId || 'trip-1',
      busPlate: 'CA 1234',
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
      actions: []
    }

    // Calculate new arrival time
    const originalTime = new Date(`2024-01-15 ${delay.originalArrival}`)
    originalTime.setMinutes(originalTime.getMinutes() + newDelay.delayMinutes)
    delay.newArrival = originalTime.toTimeString().slice(0, 5)

    setDelays(prev => [delay, ...prev])
    setNewDelay({ reason: '', delayMinutes: 0, severity: 'medium' })
    setShowReportDialog(false)
    
    if (onDelayUpdate) {
      onDelayUpdate(delay)
    }
  }

  const handleAcknowledgeDelay = (delayId: string) => {
    setDelays(prev => prev.map(delay => 
      delay.id === delayId 
        ? { ...delay, status: 'acknowledged' as const }
        : delay
    ))
  }

  const handleResolveDelay = (delayId: string) => {
    setDelays(prev => prev.map(delay => 
      delay.id === delayId 
        ? { 
            ...delay, 
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            actions: [...delay.actions, 'Delay resolved']
          }
        : delay
    ))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
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
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    totalDelays: delays.length,
    highSeverity: delays.filter(d => d.severity === 'high').length,
    resolvedDelays: delays.filter(d => d.status === 'resolved').length,
    totalAffectedPassengers: delays.reduce((acc, delay) => acc + delay.affectedPassengers, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delay Management</h2>
          <p className="text-gray-600">Monitor and manage trip delays in real-time</p>
        </div>
        <Button 
          onClick={() => setShowReportDialog(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Delay
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-600">High Severity</p>
                <p className="text-2xl font-bold text-red-600">{stats.highSeverity}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
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
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Delays</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Delays</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {delays.filter(d => d.status !== 'resolved').length > 0 ? (
            <div className="space-y-4">
              {delays.filter(d => d.status !== 'resolved').map((delay) => (
                <Card key={delay.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${
                          delay.severity === 'high' ? 'bg-red-100' : 
                          delay.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            delay.severity === 'high' ? 'text-red-600' : 
                            delay.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">Bus {delay.busPlate}</h3>
                            <Badge className={getSeverityColor(delay.severity)}>
                              {delay.severity} severity
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Impact Assessment</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Passenger Impact:</span>
                            <span className="font-medium">{delay.affectedPassengers} affected</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Connection Impact:</span>
                            <span className="font-medium">Medium</span>
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
                          onClick={() => handleResolveDelay(delay.id)}
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
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No active delays at the moment. All trips are running on schedule.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {delays.filter(d => d.status === 'resolved').length > 0 ? (
            <div className="space-y-4">
              {delays.filter(d => d.status === 'resolved').map((delay) => (
                <Card key={delay.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">Bus {delay.busPlate}</h3>
                          <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{delay.reason}</p>
                        <p className="text-xs text-gray-500">
                          Resolved at {delay.resolvedAt ? new Date(delay.resolvedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Delay: {delay.delayMinutes} minutes
                        </div>
                        <div className="text-xs text-green-600">
                          Passengers notified
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No resolved delays yet.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delay Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Today's Delays</span>
                      <span>{stats.totalDelays}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Resolution Rate</span>
                      <span>{Math.round((stats.resolvedDelays / stats.totalDelays) * 100)}%</span>
                    </div>
                    <Progress value={(stats.resolvedDelays / stats.totalDelays) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Delay Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Heavy Traffic</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={60} className="h-2 w-20" />
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weather Conditions</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="h-2 w-20" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vehicle Issues</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={15} className="h-2 w-20" />
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Delay Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Trip Delay</DialogTitle>
            <DialogDescription>
              Report a delay for a trip and notify affected passengers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="delay-minutes">Delay Duration (minutes)</Label>
              <Input
                id="delay-minutes"
                type="number"
                value={newDelay.delayMinutes}
                onChange={(e) => setNewDelay(prev => ({ ...prev, delayMinutes: parseInt(e.target.value) }))}
                min="1"
                placeholder="Enter delay in minutes"
              />
            </div>
            
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={newDelay.severity} 
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewDelay(prev => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor delay (1-5 min)</SelectItem>
                  <SelectItem value="medium">Medium - Moderate delay (6-15 min)</SelectItem>
                  <SelectItem value="high">High - Major delay (15+ min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Delay</Label>
              <Textarea
                id="reason"
                value={newDelay.reason}
                onChange={(e) => setNewDelay(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe the reason for the delay..."
                rows={3}
              />
            </div>
            
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                This will automatically notify all affected passengers via SMS and email.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportDelay}>
              Report Delay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delay Details Dialog */}
      {selectedDelay && (
        <Dialog open={!!selectedDelay} onOpenChange={() => setSelectedDelay(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delay Details</DialogTitle>
              <DialogDescription>
                Complete information about the reported delay
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Bus</Label>
                  <div className="font-medium">{selectedDelay.busPlate}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Severity</Label>
                  <Badge className={getSeverityColor(selectedDelay.severity)}>
                    {selectedDelay.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Current Station</Label>
                  <div className="font-medium">{selectedDelay.currentStation}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Next Station</Label>
                  <div className="font-medium">{selectedDelay.nextStation}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Reason</Label>
                <div className="font-medium">{selectedDelay.reason}</div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Time Impact</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Original Arrival</span>
                    <div className="font-medium">{selectedDelay.originalArrival}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">New Arrival</span>
                    <div className="font-medium text-red-600">{selectedDelay.newArrival}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Passenger Impact</Label>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{selectedDelay.affectedPassengers} passengers affected</span>
                  <Badge variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Notifications sent
                  </Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDelay(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}