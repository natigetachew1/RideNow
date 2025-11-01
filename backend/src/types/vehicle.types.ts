export interface IVehicle {
  vehicleType: 'scooter' | 'bike';
  model: string;
  serialNumber: string;
  batteryLevel: number;
  location: { lat: number; lng: number };
  status: 'available' | 'in_use' | 'maintenance';
  lastMaintenance?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
