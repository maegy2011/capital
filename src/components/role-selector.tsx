"use client"

import { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bus, 
  Users, 
  Shield, 
  ArrowRight,
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
import LanguageSwitcher from '@/components/language-switcher'

interface RoleCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  features: { icon: ReactNode; text: string }[]
  onSelect: () => void
}

function RoleCard({ title, description, icon, color, features, onSelect }: RoleCardProps) {
  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-0 ${color} text-white overflow-hidden group`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
            {icon}
          </div>
          <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
            {title}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="text-white text-opacity-90 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 text-white text-opacity-90">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onSelect}
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 mt-6 backdrop-blur-sm border border-white border-opacity-30 transition-all duration-200"
        >
          <span className="flex items-center justify-center">
            Enter Portal
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function RoleSelector() {
  const router = useRouter()
  const { t, isRTL } = useLanguage()

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
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-95"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          {/* Language Switcher */}
          <div className="absolute top-4 right-4 z-20">
            <LanguageSwitcher />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-3xl mb-6 backdrop-blur-sm border border-white border-opacity-30">
                <Bus className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
                {t('appTitle')}
              </h1>
              <p className="text-2xl text-blue-100 mb-2">
                {t('appSubtitle')}
              </p>
              <p className="text-lg text-blue-200">
                {t('appLocation')}
              </p>
            </div>
          </div>
        </div>
      </div>

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

        {/* System Info */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('systemInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('activeBuses')}
                </p>
                <p className="text-3xl font-bold text-blue-600">38</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('todayTrips')}
                </p>
                <p className="text-3xl font-bold text-green-600">89</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('activeUsers')}
                </p>
                <p className="text-3xl font-bold text-purple-600">3,241</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('systemStatus')}
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {t('online')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-lg mb-2">{t('copyright')}</p>
          <p className="text-base">{t('poweredBy')}</p>
        </div>
      </div>
    </div>
  )
}