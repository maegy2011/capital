"use client"

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Users, Monitor, BarChart3, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export default function QuickAccess() {
  const { t } = useLanguage()

  const quickAccessItems = [
    {
      href: '/manager/user-management',
      icon: Users,
      color: 'blue',
      title: t('userManagement') || 'User Management',
      description: t('manageSystemUsers') || 'Manage users, roles, and permissions'
    },
    {
      href: '/manager/system-health',
      icon: Monitor,
      color: 'green',
      title: t('systemHealth') || 'System Health',
      description: t('monitorSystemPerformance') || 'Monitor system performance and uptime'
    },
    {
      href: '/manager/analytics',
      icon: BarChart3,
      color: 'purple',
      title: t('analytics') || 'Analytics',
      description: t('viewReportsAndInsights') || 'View reports and business insights'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {quickAccessItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`bg-${item.color}-100 p-3 rounded-lg`}>
                  <item.icon className="h-6 w-6 text-${item.color}-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}