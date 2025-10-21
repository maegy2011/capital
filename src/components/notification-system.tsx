"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Bell, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Users,
  MapPin,
  Bus,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channel: 'app' | 'sms' | 'email' | 'push'
  target: 'passenger' | 'supervisor' | 'all'
  tripId?: string
  userId?: string
  actionUrl?: string
  expiresAt?: string
}

interface NotificationTemplate {
  id: string
  name: string
  description: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channel: 'app' | 'sms' | 'email' | 'push'
  template: string
  variables: string[]
  triggerConditions: string[]
}

interface NotificationSettings {
  enableAppNotifications: boolean
  enableSMSNotifications: boolean
  enableEmailNotifications: boolean
  enablePushNotifications: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Bus Arriving in 1 Minute',
      message: 'Your bus to Administrative Capital is arriving at Tahrir Square in 1 minute.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
      channel: 'app',
      target: 'passenger',
      tripId: 'trip-1'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Trip Delayed',
      message: 'Your trip is delayed by 15 minutes due to heavy traffic. New departure time: 08:35.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high',
      channel: 'sms',
      target: 'passenger',
      tripId: 'trip-1'
    },
    {
      id: '3',
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your trip from Nasr City to Administrative Capital has been confirmed. Booking ID: BK123456',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium',
      channel: 'email',
      target: 'passenger'
    },
    {
      id: '4',
      type: 'error',
      title: 'Trip Cancelled',
      message: 'Trip CA 1234 has been cancelled due to mechanical issues. Please contact support for refund.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'urgent',
      channel: 'app',
      target: 'all',
      tripId: 'trip-2'
    }
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    enableAppNotifications: true,
    enableSMSNotifications: true,
    enableEmailNotifications: true,
    enablePushNotifications: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '06:00'
    },
    soundEnabled: true,
    vibrationEnabled: true
  })

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Bus Arrival Alert',
      description: 'Notify passengers when bus is 1 minute away',
      type: 'info',
      priority: 'medium',
      channel: 'app',
      template: 'Your bus to {destination} is arriving at {station} in 1 minute.',
      variables: ['destination', 'station'],
      triggerConditions: ['Bus within 1 minute of station']
    },
    {
      id: '2',
      name: 'Trip Delay Notification',
      description: 'Alert passengers about trip delays',
      type: 'warning',
      priority: 'high',
      channel: 'sms',
      template: 'Your trip is delayed by {delayMinutes} minutes. New departure time: {newTime}.',
      variables: ['delayMinutes', 'newTime'],
      triggerConditions: ['Trip delayed by 5+ minutes']
    },
    {
      id: '3',
      name: 'Booking Confirmation',
      description: 'Confirm successful booking',
      type: 'success',
      priority: 'medium',
      channel: 'email',
      template: 'Your trip from {origin} to {destination} has been confirmed. Booking ID: {bookingId}',
      variables: ['origin', 'destination', 'bookingId'],
      triggerConditions: ['Booking completed']
    },
    {
      id: '4',
      name: 'Trip Cancellation',
      description: 'Notify about trip cancellation',
      type: 'error',
      priority: 'urgent',
      channel: 'app',
      template: 'Trip {busPlate} has been cancelled due to {reason}. Please contact support.',
      variables: ['busPlate', 'reason'],
      triggerConditions: ['Trip cancelled']
    }
  ])

  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.priority === 'urgent').length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'push': return <Bell className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    urgent: urgentCount,
    today: notifications.filter(n => {
      const notifDate = new Date(n.timestamp)
      const today = new Date()
      return notifDate.toDateString() === today.toDateString()
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
            <p className="text-gray-600">Manage smart notifications and alerts</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
          <Button 
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  setSelectedNotification(notification)
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          {getChannelIcon(notification.channel)}
                          <span className="ml-1">{notification.channel}</span>
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      <div className="flex items-center space-x-2">
                        {notification.tripId && (
                          <span className="flex items-center">
                            <Bus className="h-3 w-3 mr-1" />
                            {notification.tripId}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {notification.target}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <Badge className={getPriorityColor(template.priority)}>
                      {template.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Template:</span>
                      <p className="text-sm bg-gray-50 p-2 rounded mt-1">{template.template}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Variables:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map((variable, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Channel:</span>
                      <div className="flex items-center mt-1">
                        {getChannelIcon(template.channel)}
                        <span className="ml-2 text-sm capitalize">{template.channel}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Triggers:</span>
                      <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                        {template.triggerConditions.map((trigger, index) => (
                          <li key={index}>{trigger}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Delivery Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>App Notifications</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>SMS Delivery</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Email Delivery</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Push Notifications</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Average Read Time</p>
                      <p className="text-sm text-gray-600">Time to open notification</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl">2.3s</p>
                      <p className="text-sm text-green-600">-15% from last week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Action Rate</p>
                      <p className="text-sm text-gray-600">Users who take action</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl">78%</p>
                      <p className="text-sm text-green-600">+8% from last week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Opt-out Rate</p>
                      <p className="text-sm text-gray-600">Users disabling notifications</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl">1.2%</p>
                      <p className="text-sm text-red-600">+0.3% from last week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how you receive notifications
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">In-App Notifications</div>
                      <div className="text-sm text-gray-600">Show notifications within the app</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.enableAppNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.enableAppNotifications ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive text messages for urgent alerts</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.enableSMSNotifications ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.enableSMSNotifications ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Get detailed notifications via email</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.enableEmailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.enableEmailNotifications ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-600">Browser and mobile push notifications</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.enablePushNotifications ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.enablePushNotifications ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Quiet Hours</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Quiet Hours</div>
                  <div className="text-sm text-gray-600">
                    {settings.quietHours.enabled 
                      ? `No notifications from ${settings.quietHours.start} to ${settings.quietHours.end}`
                      : 'Notifications allowed 24/7'
                    }
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                      settings.quietHours.enabled ? 'translate-x-6' : ''
                    }`}></div>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Alert Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">Sound</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-gray-400 rounded-sm"></div>
                    <span className="text-sm">Vibration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.vibrationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.vibrationEnabled ? 'translate-x-6' : ''
                      }`}></div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSettingsDialog(false)}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getNotificationIcon(selectedNotification.type)}
                <span>{selectedNotification.title}</span>
              </DialogTitle>
              <DialogDescription>
                {new Date(selectedNotification.timestamp).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{selectedNotification.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Priority</span>
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Channel</span>
                  <div className="flex items-center mt-1">
                    {getChannelIcon(selectedNotification.channel)}
                    <span className="ml-2 capitalize">{selectedNotification.channel}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Target</span>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="capitalize">{selectedNotification.target}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={selectedNotification.read ? "outline" : "default"}>
                    {selectedNotification.read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedNotification(null)}>
                Close
              </Button>
              {selectedNotification.actionUrl && (
                <Button>
                  Take Action
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}