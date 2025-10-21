"use client"

import { useState } from 'react'
import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  MapPin, 
  Clock, 
  Wallet, 
  Settings, 
  Bus, 
  Users, 
  BarChart3, 
  Shield,
  Menu,
  X,
  ChevronRight,
  User
} from 'lucide-react'
import { MobileButton } from './mobile-layout'
import { cn } from '@/lib/utils'

export type UserRole = 'passenger' | 'supervisor' | 'manager'

interface NavigationItem {
  id: string
  label: string
  icon: ReactNode
  path: string
  roles: UserRole[]
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    path: '/passenger',
    roles: ['passenger']
  },
  {
    id: 'stations',
    label: 'Stations',
    icon: <MapPin size={20} />,
    path: '/passenger/stations',
    roles: ['passenger']
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: <Clock size={20} />,
    path: '/passenger/tracking',
    roles: ['passenger']
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: <Wallet size={20} />,
    path: '/passenger/payments',
    roles: ['passenger']
  },
  {
    id: 'supervisor-home',
    label: 'Dashboard',
    icon: <BarChart3 size={20} />,
    path: '/supervisor',
    roles: ['supervisor']
  },
  {
    id: 'supervisor-buses',
    label: 'Buses',
    icon: <Bus size={20} />,
    path: '/supervisor/buses',
    roles: ['supervisor']
  },
  {
    id: 'supervisor-trips',
    label: 'Trips',
    icon: <Clock size={20} />,
    path: '/supervisor/trips',
    roles: ['supervisor']
  },
  {
    id: 'manager-home',
    label: 'Overview',
    icon: <Shield size={20} />,
    path: '/manager',
    roles: ['manager']
  },
  {
    id: 'manager-users',
    label: 'Users',
    icon: <Users size={20} />,
    path: '/manager/users',
    roles: ['manager']
  },
  {
    id: 'manager-settings',
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/manager/settings',
    roles: ['manager']
  }
]

interface MobileNavigationProps {
  currentRole: UserRole
  onRoleChange?: (role: UserRole) => void
}

export function MobileNavigation({ currentRole, onRoleChange }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentRole)
  )

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleRoleSwitch = (role: UserRole) => {
    onRoleChange?.(role)
    setIsMenuOpen(false)
    // Navigate to the home page for that role
    const homePath = role === 'passenger' ? '/passenger' : 
                     role === 'supervisor' ? '/supervisor' : '/manager'
    router.push(homePath)
  }

  const getActiveItem = () => {
    return filteredItems.find(item => pathname === item.path)
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Capital Transport
              </h1>
              <p className="text-xs text-gray-500 capitalize">
                {currentRole} Portal
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Role Switcher */}
            <div className="bg-gray-100 rounded-lg p-1 flex">
              {(['passenger', 'supervisor', 'manager'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    currentRole === role
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Menu Button */}
            <MobileButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileButton>
          </div>
        </div>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <MobileButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                >
                  <X size={20} />
                </MobileButton>
              </div>
            </div>
            
            <div className="p-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500 capitalize">{currentRole}</p>
                </div>
              </div>
              
              {/* Navigation Items */}
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isActive ? "bg-blue-100" : "bg-gray-100"
                        )}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {/* Settings */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <Settings size={16} />
                  </div>
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around py-1">
            {filteredItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.path
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-[60px] transition-colors",
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <div className={cn(
                    "mb-1",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

interface PageContainerProps {
  children: ReactNode
  currentRole: UserRole
  onRoleChange?: (role: UserRole) => void
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function PageContainer({ 
  children, 
  currentRole, 
  onRoleChange,
  title,
  subtitle,
  actions
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileNavigation 
        currentRole={currentRole} 
        onRoleChange={onRoleChange}
      />
      
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        {(title || subtitle || actions) && (
          <div className="bg-white px-4 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="ml-4">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}