export interface VehicleLocation {

  id: number;

  vehicleNumber: string;

  driver: string;

  latitude: number;

  longitude: number;

  speed: number;

  status: 'Moving' | 'Idle' | 'Offline';

}
