export interface Route {

  id: number;

  routeName: string;

  source: string;

  destination: string;

  distance: number;

  estimatedTime: string;

  assignedVehicle: string;

  assignedDriver: string;

  status: 'Active' | 'Completed' | 'Pending';

}
