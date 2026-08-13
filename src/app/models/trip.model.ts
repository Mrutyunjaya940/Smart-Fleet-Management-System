export interface Trip {
  id: number;
  tripId: string;
  vehicle: string;
  driver: string;
  route: string;
  source?: string;
  destination?: string;
  distance: number;
  speed: number;
  eta: string;
  progress: number;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Delayed';
  cargoType?: string;
  startTime?: string;
  completionTime?: string;
  fuelConsumed?: number;
}
