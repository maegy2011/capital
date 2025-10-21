"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  MapPin, 
  Bus, 
  CreditCard, 
  Settings, 
  Users, 
  BarChart3, 
  Shield,
  Menu,
  X,
  Bell,
  User,
  ChevronDown
} from 'lucide-react'

interface MobileNavProps {
  userRole: 'passenger' | 'supervisor' | 'manager'
  userName?: string
  notifications?: number
}

const navigation = {
  passenger: [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Stations', href: '/stations', icon: MapPin },
    { name: 'My Trips', href: '/trips', icon: Bus },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
  ],
  supervisor: [
    { name: 'Dashboard', href: '/supervisor', icon: BarChart3 },
    { name: 'Live Tracking', href: '/supervisor/tracking', icon: MapPin },
    { name: 'Bus Management', href: '/supervisor/buses', icon: Bus },
    { name: 'Trip Schedule', href: '/supervisor/schedule', icon: Settings },
    { name: 'Reports', href: '/supervisor/reports', icon: BarChart3 },
  ],
  manager: [
    { name: 'Overview', href: '/manager', icon: Home },
    { name: 'Fleet Management', href: '/manager/fleet', icon: Bus },
    { name: 'User Management', href: '/manager/users', icon: Users },
    { name: 'Analytics', href: '/manager/analytics', icon: BarChart3 },
    { name: 'System Settings', href: '/manager/settings', icon: Settings },
    { name: 'Security', href: '/manager/security', icon: Shield },
  ]
}

export default function MobileNav({ userRole, userName = 'User', notifications = 0 }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const currentNav = navigation[userRole]

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Capital Transport</h1>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            {/* User Menu */}
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <User className="h-5 w-5" />
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full">
            {/* User Info */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{userName}</h2>
                  <p className="text-blue-100 capitalize">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {currentNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Role Switcher */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Switch Role
                </p>
                <div className="space-y-2">
                  {Object.entries(navigation).map(([role, items]) => (
                    <button
                      key={role}
                      onClick={() => {
                        // In a real app, this would handle role switching
                        setIsOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        role === userRole
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Users className="h-5 w-5" />
                      <span className="capitalize">{role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Handle logout
                  setIsOpen(false)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1 p-2">
          {currentNav.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}