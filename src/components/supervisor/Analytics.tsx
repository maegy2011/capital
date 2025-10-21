'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Bus, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Navigation,
  MapPin,
  Timer,
  Download,
  Calendar,
  DollarSign,
  Star,
  Target
} from 'lucide-react'

interface AnalyticsData {
  trips: {
    total: number
    completed: number
    cancelled: number
    onTime: number
    delayed: number
    avgDelay: number
    totalPassengers: number
    totalRevenue: number
  }
  buses: {
    total: number
    active: number
    avgOccupancy: number
    totalDistance: number
    maintenanceIssues: number
  }
  alerts: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    resolved: number
    avgResolutionTime: number
  }
  delays: {
    total: number
    totalDelayMinutes: number
    avgDelay: number
    mostAffectedRoute: string
    resolutionRate: number
  }
  performance: {
    onTimePerformance: number
    passengerSatisfaction: number
    efficiency: number
    safety: number
  }
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('today')
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    trips: {
      total: 45,
      completed: 42,
      cancelled: 3,
      onTime: 38,
      delayed: 7,
      avgDelay: 12,
      totalPassengers: 1245,
      totalRevenue: 45600
    },
    buses: {
      total: 15,
      active: 12,
      avgOccupancy: 78,
      totalDistance: 2450,
      maintenanceIssues: 2
    },
    alerts: {
      total: 23,
      critical: 3,
      high: 8,
      medium: 9,
      low: 3,
      resolved: 20,
      avgResolutionTime: 18
    },
    delays: {
      total: 15,
      totalDelayMinutes: 180,
      avgDelay: 12,
      mostAffectedRoute: 'Tahrir → Admin Capital',
      resolutionRate: 87
    },
    performance: {
      onTimePerformance: 84,
      passengerSatisfaction: 92,
      efficiency: 88,
      safety: 96
    }
  })

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-yellow-100 text-yellow-800'
    if (score >= 70) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h2>
          <p className="text-gray-600">Comprehensive performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Performance</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.performance.onTimePerformance)}`}>
                  {analytics.performance.onTimePerformance}%
                </p>
                <div className="flex items-center mt-1">
                  {analytics.performance.onTimePerformance >= 85 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passenger Satisfaction</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.performance.passengerSatisfaction)}`}>
                  {analytics.performance.passengerSatisfaction}%
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-gray-500">4.6/5.0 rating</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational Efficiency</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.performance.efficiency)}`}>
                  {analytics.performance.efficiency}%
                </p>
                <div className="flex items-center mt-1">
                  <Zap className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-gray-500">Optimal</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Safety Score</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.performance.safety)}`}>
                  {analytics.performance.safety}%
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-gray-500">Excellent</span>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trips" className="w-full">
        <TabsList>
          <TabsTrigger value="trips">Trip Analytics</TabsTrigger>
          <TabsTrigger value="buses">Bus Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alert Analysis</TabsTrigger>
          <TabsTrigger value="delays">Delay Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Trips</p>
                    <p className="text-2xl font-bold">{analytics.trips.total}</p>
                  </div>
                  <Navigation className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((analytics.trips.completed / analytics.trips.total) * 100)}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                    <p className="text-2xl font-bold">{analytics.trips.totalPassengers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">EGP {analytics.trips.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On Time</span>
                      <span>{analytics.trips.onTime} ({Math.round((analytics.trips.onTime / analytics.trips.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.trips.onTime / analytics.trips.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Delayed</span>
                      <span>{analytics.trips.delayed} ({Math.round((analytics.trips.delayed / analytics.trips.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.trips.delayed / analytics.trips.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cancelled</span>
                      <span>{analytics.trips.cancelled} ({Math.round((analytics.trips.cancelled / analytics.trips.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.trips.cancelled / analytics.trips.total) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Delay</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{analytics.trips.avgDelay} min</span>
                      <Badge className={getPerformanceBadge(100 - (analytics.trips.avgDelay * 2))}>
                        {analytics.trips.avgDelay <= 10 ? 'Good' : analytics.trips.avgDelay <= 15 ? 'Fair' : 'Poor'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Passengers per Trip</span>
                    <span className="font-medium">{Math.round(analytics.trips.totalPassengers / analytics.trips.total)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue per Trip</span>
                    <span className="font-medium">EGP {Math.round(analytics.trips.totalRevenue / analytics.trips.total)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Performance</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{analytics.performance.onTimePerformance}%</span>
                      <Badge className={getPerformanceBadge(analytics.performance.onTimePerformance)}>
                        {analytics.performance.onTimePerformance >= 85 ? 'Excellent' : analytics.performance.onTimePerformance >= 75 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="buses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Buses</p>
                    <p className="text-2xl font-bold">{analytics.buses.total}</p>
                  </div>
                  <Bus className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Buses</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.buses.active}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
                    <p className="text-2xl font-bold">{analytics.buses.avgOccupancy}%</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Maintenance Issues</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.buses.maintenanceIssues}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bus Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active Rate</span>
                      <span>{Math.round((analytics.buses.active / analytics.buses.total) * 100)}%</span>
                    </div>
                    <Progress value={(analytics.buses.active / analytics.buses.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg Occupancy</span>
                      <span>{analytics.buses.avgOccupancy}%</span>
                    </div>
                    <Progress value={analytics.buses.avgOccupancy} className="h-2" />
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Efficiency Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Distance</span>
                        <span className="font-medium">{analytics.buses.totalDistance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance per Bus</span>
                        <span className="font-medium">{Math.round(analytics.buses.totalDistance / analytics.buses.total)} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-medium">Active Issues</span>
                    </div>
                    <p className="text-sm text-gray-600">{analytics.buses.maintenanceIssues} buses require maintenance</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Maintenance Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Next Service Due</span>
                        <span className="font-medium">2 buses</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inspection Required</span>
                        <span className="font-medium">1 bus</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parts Replacement</span>
                        <span className="font-medium">3 buses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                    <p className="text-2xl font-bold">{analytics.alerts.total}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.alerts.critical}</p>
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
                    <p className="text-2xl font-bold text-green-600">{analytics.alerts.resolved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                    <p className="text-2xl font-bold">{analytics.alerts.avgResolutionTime}m</p>
                  </div>
                  <Timer className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Critical</span>
                      <span>{analytics.alerts.critical} ({Math.round((analytics.alerts.critical / analytics.alerts.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.alerts.critical / analytics.alerts.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>High</span>
                      <span>{analytics.alerts.high} ({Math.round((analytics.alerts.high / analytics.alerts.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.alerts.high / analytics.alerts.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medium</span>
                      <span>{analytics.alerts.medium} ({Math.round((analytics.alerts.medium / analytics.alerts.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.alerts.medium / analytics.alerts.total) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Low</span>
                      <span>{analytics.alerts.low} ({Math.round((analytics.alerts.low / analytics.alerts.total) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.alerts.low / analytics.alerts.total) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Rate</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{Math.round((analytics.alerts.resolved / analytics.alerts.total) * 100)}%</span>
                      <Badge className={getPerformanceBadge(Math.round((analytics.alerts.resolved / analytics.alerts.total) * 100))}>
                        {Math.round((analytics.alerts.resolved / analytics.alerts.total) * 100) >= 90 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Resolution Time</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{analytics.alerts.avgResolutionTime} minutes</span>
                      <Badge className={getPerformanceBadge(100 - (analytics.alerts.avgResolutionTime * 2))}>
                        {analytics.alerts.avgResolutionTime <= 15 ? 'Excellent' : analytics.alerts.avgResolutionTime <= 30 ? 'Good' : 'Fair'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Alert Trends</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>vs Last Week</span>
                        <span className="text-green-600 font-medium">↓ 12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>vs Last Month</span>
                        <span className="text-red-600 font-medium">↑ 8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delays" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Delays</p>
                    <p className="text-2xl font-bold">{analytics.delays.total}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Delay Time</p>
                    <p className="text-2xl font-bold">{analytics.delays.totalDelayMinutes}m</p>
                  </div>
                  <Timer className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Delay</p>
                    <p className="text-2xl font-bold">{analytics.delays.avgDelay}m</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.delays.resolutionRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delay Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium">Most Affected Route</span>
                    </div>
                    <p className="text-sm text-gray-600">{analytics.delays.mostAffectedRoute}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Delay Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Passengers Affected</span>
                        <span className="font-medium">{Math.round(analytics.trips.totalPassengers * 0.15)} estimated</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Impact</span>
                        <span className="font-medium text-red-600">EGP {Math.round(analytics.trips.totalRevenue * 0.08)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schedule Disruption</span>
                        <span className="font-medium">Moderate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delay Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Rate</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{analytics.delays.resolutionRate}%</span>
                      <Badge className={getPerformanceBadge(analytics.delays.resolutionRate)}>
                        {analytics.delays.resolutionRate >= 90 ? 'Excellent' : analytics.delays.resolutionRate >= 80 ? 'Good' : 'Fair'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Resolution Time</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{Math.round(analytics.alerts.avgResolutionTime)} minutes</span>
                      <Badge className={getPerformanceBadge(100 - (Math.round(analytics.alerts.avgResolutionTime) * 1.5))}>
                        {Math.round(analytics.alerts.avgResolutionTime) <= 20 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Improvement Targets</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Reduce Avg Delay</span>
                        <span className="text-green-600 font-medium">Target: 10m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Improve Resolution Rate</span>
                        <span className="text-green-600 font-medium">Target: 95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}