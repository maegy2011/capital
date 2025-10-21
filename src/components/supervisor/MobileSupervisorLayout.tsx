'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Menu, 
  X, 
  Home, 
  Bus, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  Settings,
  Bell,
  Users,
  Navigation,
  Activity,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus,
  Search
} from 'lucide-react'

interface MobileSupervisorLayoutProps {
  children: React.ReactNode
  title: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileSupervisorLayout({ 
  children, 
  title, 
  activeTab, 
  onTabChange 
}: MobileSupervisorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'trips', name: 'Trips', icon: Bus },
    { id: 'buses', name: 'Buses', icon: Navigation },
    { id: 'realtime', name: 'Live', icon: Activity },
    { id: 'trip-tracking', name: 'Tracking', icon: MapPin },
    { id: 'delays', name: 'Delays', icon: Clock },
    { id: 'notifications', name: 'Alerts', icon: AlertTriangle },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'stations', name: 'Stations', icon: MapPin }
  ]

  const quickStats = [
    { label: 'Active Trips', value: '12', change: '+2', icon: Bus },
    { label: 'Alerts', value: '3', change: '-1', icon: AlertTriangle },
    { label: 'On Time', value: '92%', change: '+3%', icon: Zap },
    { label: 'Passengers', value: '1.2k', change: '+120', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-500">Supervisor Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-4 overflow-x-auto">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm font-bold">{stat.value}</span>
                <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.slice(0, 4).map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className="flex-col h-auto py-2 px-1"
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{tab.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Capital Transport</h2>
                <p className="text-xs text-gray-500">Supervisor Portal</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Main Menu
                </h3>
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => {
                      onTabChange(tab.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.name}
                  </Button>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </h3>
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Plus className="h-4 w-4 mr-3" />
                  New Trip
                </Button>
                <Button variant="outline" className="w-full justify-start mb-2">
                  <AlertTriangle className="h-4 w-4 mr-3" />
                  Report Alert
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bus className="h-4 w-4 mr-3" />
                  Register Bus
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}