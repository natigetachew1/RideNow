export interface IVehicle {
  vehicleType: 'scooter' | 'bike';
  model: string;
  serialNumber: string;
  description: string;
  location: { lat: number; lng: number };
  status: 'available' | 'in_use' | 'maintenance';
  lastMaintenance?: Date;
  pricePerHour : number;
  createdAt?: Date;
  updatedAt?: Date;
}
