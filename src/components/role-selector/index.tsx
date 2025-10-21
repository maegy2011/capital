"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bus, 
  Users, 
  Shield, 
  MapPin,
  TrendingUp,
  Settings,
  Clock,
  CreditCard,
  Navigation,
  Wallet,
  Monitor,
  Calendar,
  MessageSquare,
  BarChart3,
  Users2,
  Cog,
  DollarSign,
  ShieldCheck
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import RoleCard from './RoleCard'
import SystemStats from './SystemStats'
import Header from './Header'
import Footer from './Footer'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalBuses: number
  activeBuses: number
  totalTrips: number
  todayTrips: number
  totalRevenue: number
  todayRevenue: number
}

export default function RoleSelector() {
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        setSystemStats(data.stats)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const roles = [
    {
      id: 'passenger',
      title: t('passenger'),
      description: t('passengerDesc'),
      icon: <Users className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
      features: [
        { icon: <MapPin className="h-4 w-4" />, text: t('realtimeTracking') },
        { icon: <CreditCard className="h-4 w-4" />, text: t('quickBooking') },
        { icon: <Navigation className="h-4 w-4" />, text: t('routePlanning') },
        { icon: <Wallet className="h-4 w-4" />, text: t('digitalTickets') }
      ],
      path: '/passenger'
    },
    {
      id: 'supervisor',
      title: t('supervisor'),
      description: t('supervisorDesc'),
      icon: <Bus className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-green-600 via-green-700 to-green-800',
      features: [
        { icon: <Monitor className="h-4 w-4" />, text: t('fleetMonitoring') },
        { icon: <Calendar className="h-4 w-4" />, text: t('tripManagement') },
        { icon: <MessageSquare className="h-4 w-4" />, text: t('driverCommunication') },
        { icon: <BarChart3 className="h-4 w-4" />, text: t('performanceAnalytics') }
      ],
      path: '/supervisor'
    },
    {
      id: 'manager',
      title: t('manager'),
      description: t('managerDesc'),
      icon: <Shield className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800',
      features: [
        { icon: <Users2 className="h-4 w-4" />, text: t('userManagement') },
        { icon: <Cog className="h-4 w-4" />, text: t('systemConfig') },
        { icon: <DollarSign className="h-4 w-4" />, text: t('revenueAnalytics') },
        { icon: <ShieldCheck className="h-4 w-4" />, text: t('securityCompliance') }
      ],
      path: '/manager'
    }
  ]

  const handleRoleSelect = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Header />
      
      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('selectRole')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('choosePortal')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              title={role.title}
              description={role.description}
              icon={role.icon}
              color={role.color}
              features={role.features}
              onSelect={() => handleRoleSelect(role.path)}
            />
          ))}
        </div>

        <SystemStats systemStats={systemStats} loading={loading} />
        <Footer />
      </div>
    </div>
  )
}