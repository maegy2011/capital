"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Shield,
  Bus,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'passenger' | 'supervisor' | 'manager'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  joinDate: string
  trips: number
  totalSpent: number
  avatar?: string
}

const users: User[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@example.com',
    phone: '+20 123 456 7890',
    role: 'passenger',
    status: 'active',
    lastLogin: '2 hours ago',
    joinDate: '2024-01-15',
    trips: 23,
    totalSpent: 1150
  },
  {
    id: '2',
    name: 'Mohamed Ali',
    email: 'mohamed.a@example.com',
    phone: '+20 234 567 8901',
    role: 'supervisor',
    status: 'active',
    lastLogin: '1 hour ago',
    joinDate: '2024-02-01',
    trips: 0,
    totalSpent: 0
  },
  {
    id: '3',
    name: 'Sara Mahmoud',
    email: 'sara.m@example.com',
    phone: '+20 345 678 9012',
    role: 'manager',
    status: 'active',
    lastLogin: '30 minutes ago',
    joinDate: '2023-12-10',
    trips: 0,
    totalSpent: 0
  },
  {
    id: '4',
    name: 'Fatima Ahmed',
    email: 'fatima.a@example.com',
    phone: '+20 456 789 0123',
    role: 'passenger',
    status: 'inactive',
    lastLogin: '2 days ago',
    joinDate: '2024-01-20',
    trips: 45,
    totalSpent: 2250
  },
  {
    id: '5',
    name: 'Khalid Omar',
    email: 'khalid.o@example.com',
    phone: '+20 567 890 1234',
    role: 'passenger',
    status: 'suspended',
    lastLogin: '1 week ago',
    joinDate: '2023-11-05',
    trips: 67,
    totalSpent: 3350
  },
  {
    id: '6',
    name: 'Nadia Ahmed',
    email: 'nadia.a@example.com',
    phone: '+20 678 901 2345',
    role: 'supervisor',
    status: 'active',
    lastLogin: '45 minutes ago',
    joinDate: '2024-03-01',
    trips: 0,
    totalSpent: 0
  }
]

export default function UserManagement() {
  const { t, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'passenger': return 'bg-blue-100 text-blue-700'
      case 'supervisor': return 'bg-green-100 text-green-700'
      case 'manager': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'suspended': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'suspended': return <Shield className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'passenger': return t('passenger')
      case 'supervisor': return t('supervisor')
      case 'manager': return t('manager')
      default: return role
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active') || 'Active'
      case 'inactive': return 'Inactive'
      case 'suspended': return 'Suspended'
      default: return status
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery)
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalUsers = users.length
  const activeUsers = users.filter(user => user.status === 'active').length
  const passengerUsers = users.filter(user => user.role === 'passenger').length
  const supervisorUsers = users.filter(user => user.role === 'supervisor').length
  const managerUsers = users.filter(user => user.role === 'manager').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('manager')} - {t('userManagement') || 'User Management'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-purple-600 text-white">SM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('userManagement') || 'User Management'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('manageSystemUsers') || 'Manage system users, roles, and permissions'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalUsers')}</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('activeUsers')}</p>
                    <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Bus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('passengerUsers') || 'Passenger Users'}</p>
                    <p className="text-2xl font-bold text-gray-900">{passengerUsers}</p>
                  </div>
                </div>
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('staffUsers') || 'Staff Users'}</p>
                    <p className="text-2xl font-bold text-gray-900">{supervisorUsers + managerUsers}</p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder={t('searchUsers') || 'Search users by name, email, or phone...'}
                  className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="all">{t('allRoles') || 'All Roles'}</option>
                  <option value="passenger">{t('passenger')}</option>
                  <option value="supervisor">{t('supervisor')}</option>
                  <option value="manager">{t('manager')}</option>
                </select>

                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="all">{t('allStatuses') || 'All Statuses'}</option>
                  <option value="active">{t('active') || 'Active'}</option>
                  <option value="inactive">{t('inactive') || 'Inactive'}</option>
                  <option value="suspended">{t('suspended') || 'Suspended'}</option>
                </select>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('addUser') || 'Add User'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              {t('usersList') || 'Users List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('user') || 'User'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('role') || 'Role'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('status') || 'Status'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('lastLogin') || 'Last Login'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('activity') || 'Activity'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('actions') || 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className={`${
                              user.role === 'passenger' ? 'bg-blue-600' :
                              user.role === 'supervisor' ? 'bg-green-600' : 'bg-purple-600'
                            } text-white`}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{user.lastLogin}</div>
                        <div className="text-xs text-gray-400">{t('joined') || 'Joined'} {user.joinDate}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {user.role === 'passenger' && (
                            <>
                              <div className="text-sm font-medium">{user.trips} {t('trips') || 'trips'}</div>
                              <div className="text-xs text-gray-500">EGP {user.totalSpent}</div>
                            </>
                          )}
                          {user.role !== 'passenger' && (
                            <div className="text-sm text-gray-500">{t('staffMember') || 'Staff member'}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' && (
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('noUsersFound') || 'No users found'}
                </h3>
                <p className="text-gray-500">
                  {t('noUsersMatchFilters') || 'No users match the selected filters'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}