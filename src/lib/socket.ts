import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  // Store connected clients by role
  const connectedClients = new Map<string, { socketId: string; role: string; userId?: string }>();
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle client authentication and role assignment
    socket.on('authenticate', (data: { role: string; userId?: string }) => {
      connectedClients.set(socket.id, {
        socketId: socket.id,
        role: data.role,
        userId: data.userId
      });
      
      // Join role-specific rooms
      socket.join(data.role);
      if (data.userId) {
        socket.join(`user_${data.userId}`);
      }
      
      socket.emit('authenticated', { success: true, role: data.role });
    });

    // Handle bus location updates
    socket.on('bus_location_update', (data: {
      busId: string;
      latitude: number;
      longitude: number;
      speed: number;
      timestamp: string;
    }) => {
      // Broadcast to all supervisors and passengers
      io.to('SUPERVISOR').emit('bus_location_updated', {
        busId: data.busId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        timestamp: data.timestamp
      });
      
      // Also broadcast to passengers who might be tracking this bus
      io.to(`bus_${data.busId}`).emit('bus_location_updated', {
        busId: data.busId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        timestamp: data.timestamp
      });
    });

    // Handle trip status updates
    socket.on('trip_status_update', (data: {
      tripId: string;
      status: string;
      currentLocation: string;
      nextStop: string;
      estimatedArrival: string;
    }) => {
      // Broadcast to all supervisors
      io.to('SUPERVISOR').emit('trip_status_updated', {
        tripId: data.tripId,
        status: data.status,
        currentLocation: data.currentLocation,
        nextStop: data.nextStop,
        estimatedArrival: data.estimatedArrival
      });
    });

    // Handle alert creation
    socket.on('alert_created', (data: {
      type: string;
      severity: string;
      title: string;
      description: string;
      busId: string;
      location: string;
    }) => {
      // Broadcast to all supervisors
      io.to('SUPERVISOR').emit('new_alert', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // Handle delay notifications
    socket.on('delay_created', (data: {
      tripId: string;
      busId: string;
      delayMinutes: number;
      reason: string;
      affectedStations: string[];
    }) => {
      // Broadcast to all supervisors
      io.to('SUPERVISOR').emit('new_delay', {
        ...data,
        timestamp: new Date().toISOString()
      });
      
      // Also notify passengers on the affected trip
      io.to(`trip_${data.tripId}`).emit('trip_delayed', {
        tripId: data.tripId,
        delayMinutes: data.delayMinutes,
        reason: data.reason
      });
    });

    // Handle passenger joining bus tracking
    socket.on('join_bus_tracking', (busId: string) => {
      socket.join(`bus_${busId}`);
      socket.emit('joined_bus_tracking', { busId });
    });

    // Handle passenger leaving bus tracking
    socket.on('leave_bus_tracking', (busId: string) => {
      socket.leave(`bus_${busId}`);
      socket.emit('left_bus_tracking', { busId });
    });

    // Handle passenger joining trip tracking
    socket.on('join_trip_tracking', (tripId: string) => {
      socket.join(`trip_${tripId}`);
      socket.emit('joined_trip_tracking', { tripId });
    });

    // Handle passenger leaving trip tracking
    socket.on('leave_trip_tracking', (tripId: string) => {
      socket.leave(`trip_${tripId}`);
      socket.emit('left_trip_tracking', { tripId });
    });

    // Handle supervisor requesting real-time data
    socket.on('request_real_time_data', () => {
      const clientData = connectedClients.get(socket.id);
      if (clientData && clientData.role === 'SUPERVISOR') {
        // Send current system status
        socket.emit('real_time_data', {
          timestamp: new Date().toISOString(),
          activeBuses: 3, // This would come from database
          activeTrips: 2, // This would come from database
          totalPassengers: 65 // This would come from database
        });
      }
    });

    // Handle messages (legacy echo functionality)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Capital Transport Real-time System!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};