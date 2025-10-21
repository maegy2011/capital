"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Bus, Upload, Camera, CheckCircle, X } from 'lucide-react'

export interface BusData {
  id?: string
  plateNumber: string
  type: 'STANDARD' | 'DELUXE' | 'VIP'
  capacity: number
  photoUrl?: string
  isActive: boolean
  pricePerKm: number
  features: string[]
  description?: string
}

interface BusRegistrationProps {
  bus?: BusData
  onSave: (bus: BusData) => void
  onCancel: () => void
}

export default function BusRegistration({ bus, onSave, onCancel }: BusRegistrationProps) {
  const [formData, setFormData] = useState<BusData>(bus || {
    plateNumber: '',
    type: 'STANDARD',
    capacity: 35,
    isActive: true,
    pricePerKm: 2.5,
    features: [],
    description: ''
  })
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(bus?.photoUrl || null)

  const busFeatures = [
    'WiFi', 'USB Charging', 'Air Conditioning', 'Reclining Seats', 
    'TV Entertainment', 'GPS Tracking', 'Emergency Exit', 'First Aid Kit'
  ]

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsUploading(false)
            
            // Create preview URL
            const reader = new FileReader()
            reader.onload = (e) => {
              setPhotoPreview(e.target?.result as string)
              setFormData(prev => ({
                ...prev,
                photoUrl: e.target?.result as string
              }))
            }
            reader.readAsDataURL(file)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.plateNumber || !formData.capacity) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  const getBusTypeColor = (type: string) => {
    switch (type) {
      case 'DELUXE': return 'bg-purple-100 text-purple-800'
      case 'VIP': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bus className="h-5 w-5 mr-2 text-blue-600" />
            {bus ? 'Edit Bus' : 'Register New Bus'}
          </CardTitle>
          <CardDescription>
            {bus ? 'Update bus information and features' : 'Add a new bus to your fleet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plateNumber">Plate Number *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                  placeholder="e.g., CA 1234"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="busType">Bus Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'STANDARD' | 'DELUXE' | 'VIP') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bus type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity">Seat Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  min="10"
                  max="60"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pricePerKm">Price per Km (EGP) *</Label>
                <Input
                  id="pricePerKm"
                  type="number"
                  step="0.1"
                  value={formData.pricePerKm}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerKm: parseFloat(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <Label>Bus Photo</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Bus preview" 
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null)
                          setFormData(prev => ({ ...prev, photoUrl: undefined }))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span>Choose Photo</span>
                      </div>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <Label>Bus Features</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {busFeatures.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`p-3 border rounded-lg text-sm transition-colors ${
                      formData.features.includes(feature)
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {formData.features.includes(feature) && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span>{feature}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional information about this bus..."
                rows={3}
              />
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Bus" 
                      className="w-20 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Bus className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{formData.plateNumber || 'Plate Number'}</h3>
                      <Badge className={getBusTypeColor(formData.type)}>
                        {formData.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Capacity: {formData.capacity} seats</div>
                      <div>Price: EGP {formData.pricePerKm}/km</div>
                      {formData.features.length > 0 && (
                        <div>Features: {formData.features.slice(0, 3).join(', ')}
                          {formData.features.length > 3 && ` +${formData.features.length - 3} more`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {bus ? 'Update Bus' : 'Register Bus'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}