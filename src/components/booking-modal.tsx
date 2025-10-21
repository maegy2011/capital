"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Wallet, Smartphone, CheckCircle, Clock, MapPin, Users } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  station: {
    id: string
    name: string
    lat: number
    lng: number
    description?: string
    nextArrival: string
    distance: string
  }
  onBookingComplete: (bookingData: any) => void
}

export default function BookingModal({ isOpen, onClose, station, onBookingComplete }: BookingModalProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [bookingData, setBookingData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    seatPreference: 'any',
    paymentMethod: 'wallet',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    agreeTerms: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!bookingData.passengerName.trim()) {
      setError('Please enter your name')
      return false
    }
    if (!bookingData.passengerEmail.trim()) {
      setError('Please enter your email')
      return false
    }
    if (!bookingData.passengerPhone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (bookingData.paymentMethod === 'card') {
      if (!bookingData.cardNumber.trim() || !bookingData.cardExpiry.trim() || !bookingData.cardCVC.trim()) {
        setError('Please complete card details')
        return false
      }
    }
    if (!bookingData.agreeTerms) {
      setError('Please agree to the terms and conditions')
      return false
    }
    setError('')
    return true
  }

  const handleBooking = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const booking = {
        id: 'BK' + Date.now(),
        station: station.name,
        passengerName: bookingData.passengerName,
        passengerEmail: bookingData.passengerEmail,
        passengerPhone: bookingData.passengerPhone,
        departureTime: station.nextArrival,
        price: 50,
        paymentMethod: bookingData.paymentMethod,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        qrCode: 'QR' + Math.random().toString(36).substr(2, 9)
      }

      setBookingComplete(true)
      onBookingComplete(booking)
    } catch (err) {
      setError('Booking failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetBooking = () => {
    setBookingComplete(false)
    setBookingData({
      passengerName: '',
      passengerEmail: '',
      passengerPhone: '',
      seatPreference: 'any',
      paymentMethod: 'wallet',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      agreeTerms: false
    })
    setError('')
    onClose()
  }

  if (bookingComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={resetBooking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your trip to Administrative Capital has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Booking ID:</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  BK{Date.now()}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">From:</span>
                <span className="font-medium">{station.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">To:</span>
                <span className="font-medium">Administrative Capital</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Departure:</span>
                <span className="font-medium">{station.nextArrival}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount Paid:</span>
                <span className="font-medium text-green-600">EGP 50</span>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Your e-ticket has been sent to {bookingData.passengerEmail}. Please show the QR code at the station.
              </AlertDescription>
            </Alert>

            <Button onClick={resetBooking} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Book Your Trip
          </DialogTitle>
          <DialogDescription>
            Complete your booking from {station.name} to Administrative Capital
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="confirm">Confirm</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={bookingData.passengerName}
                  onChange={(e) => handleInputChange('passengerName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.passengerEmail}
                  onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={bookingData.passengerPhone}
                  onChange={(e) => handleInputChange('passengerPhone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label>Seat Preference</Label>
                <RadioGroup
                  value={bookingData.seatPreference}
                  onValueChange={(value) => handleInputChange('seatPreference', value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="window" id="window" />
                    <Label htmlFor="window">Window</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aisle" id="aisle" />
                    <Label htmlFor="aisle">Aisle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button 
              onClick={() => setActiveTab('payment')}
              className="w-full"
              disabled={!bookingData.passengerName || !bookingData.passengerEmail || !bookingData.passengerPhone}
            >
              Continue to Payment
            </Button>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={bookingData.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center">
                      <Wallet className="h-4 w-4 mr-1" />
                      Wallet
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {bookingData.paymentMethod === 'card' && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={bookingData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={bookingData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={bookingData.cardCVC}
                        onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {bookingData.paymentMethod === 'wallet' && (
                <Alert>
                  <AlertDescription>
                    Your wallet balance will be used. Current balance: EGP 150
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setActiveTab('details')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setActiveTab('confirm')} className="flex-1">
                Continue to Confirmation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{station.name} → Administrative Capital</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">{station.nextArrival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger:</span>
                  <span className="font-medium">{bookingData.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-medium capitalize">{bookingData.paymentMethod}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-green-600">EGP 50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={bookingData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions and cancellation policy
              </Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setActiveTab('payment')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleBooking} 
                className="flex-1"
                disabled={isProcessing || !bookingData.agreeTerms}
              >
                {isProcessing ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}