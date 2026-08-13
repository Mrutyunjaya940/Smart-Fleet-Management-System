export interface Driver {
  id: number;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  assignedVehicle: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  experienceYears?: number;
  rating?: number;
  tripsCompleted?: number;
  safetyScore?: number;
  licenseExpiry?: string;
  emergencyContact?: string;
  joinDate?: string;
}
