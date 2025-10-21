"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Users, Bus } from 'lucide-react'

interface AnalyticsTabProps {
  systemStats: {
    totalUsers: number
    activeUsers: number
    totalBuses: number
    activeBuses: number
    totalTrips: number
    todayTrips: number
    totalRevenue: number
    todayRevenue: number
  } | null
}

export default function AnalyticsTab({ systemStats }: AnalyticsTabProps) {
  const analyticsData = [
    {
      title: 'User Growth',
      value: systemStats?.totalUsers || 0,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Revenue Trend',
      value: `EGP ${systemStats?.totalRevenue?.toLocaleString() || 0}`,
      change: '+8%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Trip Completion',
      value: '94%',
      change: '+2%',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'System Performance',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-green-600">{item.change}</p>
                </div>
                <item.icon className={`h-8 w-8 text-${item.color}-600`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold">EGP {(systemStats?.totalRevenue || 0) * 1000}</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>75% of target</span>
                <span className="text-green-600">+12% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold">{systemStats?.activeUsers || 0}</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>85% engagement rate</span>
                <span className="text-green-600">+5% vs last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators and system health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Bus className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Fleet Utilization</h3>
              <p className="text-2xl font-bold text-green-600">84%</p>
              <p className="text-sm text-gray-500">+3% this month</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">Booking Rate</h3>
              <p className="text-2xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-gray-500">+7% this month</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">Growth Rate</h3>
              <p className="text-2xl font-bold text-purple-600">18%</p>
              <p className="text-sm text-gray-500">+5% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}