"use client"

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface RoleCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  features: { icon: ReactNode; text: string }[]
  onSelect: () => void
}

export default function RoleCard({ title, description, icon, color, features, onSelect }: RoleCardProps) {
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