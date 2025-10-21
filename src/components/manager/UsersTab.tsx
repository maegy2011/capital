"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Edit, Trash2, Eye } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'PASSENGER' | 'SUPERVISOR' | 'ADMIN'
  createdAt: string
  updatedAt: string
  isActive?: boolean
  bookings?: Array<{
    id: string
  }>
  wallets?: Array<{
    id: string
    balance: number
  }>
}

interface UsersTabProps {
  users: User[]
  getRoleColor: (role: string) => string
  getRoleText: (role: string) => string
  getStatusColor: (isActive?: boolean) => string
  getStatusText: (isActive?: boolean) => string
  formatDate: (dateString: string) => string
}

export default function UsersTab({ 
  users, 
  getRoleColor, 
  getRoleText, 
  getStatusColor, 
  getStatusText, 
  formatDate 
}: UsersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage all system users and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                    <Badge className={getStatusColor(user.isActive)}>
                      {getStatusText(user.isActive)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </span>
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {user.wallets && user.wallets.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Balance: EGP {user.wallets[0].balance}
                  </span>
                )}
                {user.bookings && (
                  <span className="text-sm text-gray-600">
                    {user.bookings.length} bookings
                  </span>
                )}
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}