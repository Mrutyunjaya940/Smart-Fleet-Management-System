export interface MaintenanceLog {
  id: number;
  date: string;
  type: string;
  description: string;
  cost: number;
  mechanic: string;
  status: 'Completed' | 'Pending' | 'In Progress';
}

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  type: string;
  modelName?: string;
  driverName: string;
  capacity: string;
  status: 'Active' | 'Available' | 'Maintenance' | 'Inactive';
  fuelType?: 'Diesel' | 'Petrol' | 'Electric' | 'CNG';
  currentOdometer?: number;
  lastServiceDate?: string;
  nextServiceDue?: string;
  maintenanceLogs?: MaintenanceLog[];
}
