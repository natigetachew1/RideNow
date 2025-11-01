export interface IParkingStation {
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  occupiedSlots: number;
}
