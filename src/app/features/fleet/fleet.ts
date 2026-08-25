import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Vehicle } from '../../models/vehicle.model';
import { AddVehicle } from './add-vehicle/add-vehicle';

interface MaintenanceAlert {
  vehicleNumber: string;
  model: string;
  odometer: number;
  thresholdKm: number;
  serviceType: string;
  urgency: 'Immediate' | 'Upcoming';
}

interface DocumentExpiryAlert {
  vehicleNumber: string;
  docName: 'Insurance' | 'PUC Certificate' | 'Fitness Pass' | 'Road Permit';
  expiryDate: string;
  daysRemaining: number;
  status: 'Expired' | 'Expiring Soon' | 'Valid';
}

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressBarModule
  ],
  templateUrl: './fleet.html',
  styleUrls: ['./fleet.css']
})
export class Fleet implements OnInit {

  displayedColumns: string[] = [
    'vehicleNumber',
    'modelName',
    'type',
    'fuelType',
    'driverName',
    'capacity',
    'odometer',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Vehicle>([]);
  selectedVehicle: Vehicle | null = null;
  isDetailsDrawerOpen = false;
  activeFilter = 'All';

  // Vehicle Document & Insurance Expiry Tracker
  docExpiryAlerts: DocumentExpiryAlert[] = [
    { vehicleNumber: 'OD-05-CD-5678', docName: 'Insurance', expiryDate: '30 Aug 2026', daysRemaining: 6, status: 'Expiring Soon' },
    { vehicleNumber: 'OD-02-AB-1234', docName: 'PUC Certificate', expiryDate: '15 Aug 2026', daysRemaining: -9, status: 'Expired' },
    { vehicleNumber: 'OD-14-GH-3456', docName: 'Fitness Pass', expiryDate: '12 Dec 2026', daysRemaining: 110, status: 'Valid' }
  ];

  // Predictive Maintenance Alerts (@ 10,000 km threshold)
  predictiveAlerts: MaintenanceAlert[] = [
    { vehicleNumber: 'OD-05-CD-5678', model: 'Mahindra Bolero', odometer: 68100, thresholdKm: 70000, serviceType: '70,000 km Gearbox & Fluid Service', urgency: 'Immediate' },
    { vehicleNumber: 'OD-02-AB-1234', model: 'Tata Signa 2823.K', odometer: 45200, thresholdKm: 50000, serviceType: '50,000 km Oil & Brake Service', urgency: 'Upcoming' }
  ];

  // Repair Cost Breakdown Per Model
  modelCostBreakdown = [
    { model: 'Mahindra Bolero Pickup', totalCost: 14500, repairCount: 1, status: 'High Cost' },
    { model: 'Tata Signa 2823.K', totalCost: 12700, repairCount: 2, status: 'Normal' },
    { model: 'Ashok Leyland Ecomet', totalCost: 3500, repairCount: 1, status: 'Low Cost' },
    { model: 'Tata Ace EV', totalCost: 1800, repairCount: 1, status: 'Optimal EV' }
  ];

  mockVehicles: Vehicle[] = [
    {
      id: 1,
      vehicleNumber: 'OD-02-AB-1234',
      modelName: 'Tata Signa 2823.K',
      type: 'Heavy Truck',
      fuelType: 'Diesel',
      driverName: 'Rahul Kumar',
      capacity: '16 Tons',
      status: 'Active',
      currentOdometer: 45200,
      lastServiceDate: '15 Jul 2026',
      nextServiceDue: '15 Sep 2026',
      maintenanceLogs: [
        { id: 101, date: '15 Jul 2026', type: 'Oil Change & Filter Replacement', description: 'Replaced engine oil, air filter, fuel filter', cost: 8500, mechanic: 'Bhubaneswar Auto Workshop', status: 'Completed' },
        { id: 102, date: '10 May 2026', type: 'Brake Pad Inspection', description: 'Front brake pad adjustment & alignment', cost: 4200, mechanic: 'Utkal Motors', status: 'Completed' }
      ]
    },
    {
      id: 2,
      vehicleNumber: 'OD-05-CD-5678',
      modelName: 'Mahindra Bolero Pickup',
      type: 'Light Van',
      fuelType: 'Diesel',
      driverName: 'Amit Das',
      capacity: '2.5 Tons',
      status: 'Maintenance',
      currentOdometer: 68100,
      lastServiceDate: '01 Jun 2026',
      nextServiceDue: '12 Aug 2026',
      maintenanceLogs: [
        { id: 103, date: '10 Aug 2026', type: 'Transmission Repair', description: 'Gearbox clutch plate replacement', cost: 14500, mechanic: 'Cuttack Service Hub', status: 'In Progress' }
      ]
    },
    {
      id: 3,
      vehicleNumber: 'OD-14-GH-3456',
      modelName: 'Ashok Leyland Ecomet',
      type: 'Medium Truck',
      fuelType: 'Diesel',
      driverName: 'Suresh Nayak',
      capacity: '10 Tons',
      status: 'Available',
      currentOdometer: 29400,
      lastServiceDate: '20 Jun 2026',
      nextServiceDue: '20 Oct 2026',
      maintenanceLogs: [
        { id: 104, date: '20 Jun 2026', type: 'Routine 30k Inspection', description: 'Tire rotation, battery check, fluid top-up', cost: 3500, mechanic: 'Master Service Center', status: 'Completed' }
      ]
    },
    {
      id: 4,
      vehicleNumber: 'OD-10-EF-9012',
      modelName: 'Tata Ace EV',
      type: 'Electric Express',
      fuelType: 'Electric',
      driverName: 'Prakash Rout',
      capacity: '1 Ton',
      status: 'Active',
      currentOdometer: 14800,
      lastServiceDate: '05 Aug 2026',
      nextServiceDue: '05 Dec 2026',
      maintenanceLogs: [
        { id: 105, date: '05 Aug 2026', type: 'EV Battery Diagnostic', description: 'Battery health check (98% capacity), firmware update', cost: 1800, mechanic: 'Tata EV Service Center', status: 'Completed' }
      ]
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = this.mockVehicles;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    if (status === 'All') {
      this.dataSource.data = this.mockVehicles;
    } else {
      this.dataSource.data = this.mockVehicles.filter(v => v.status === status);
    }
  }

  viewVehicleDetails(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.isDetailsDrawerOpen = true;
  }

  closeDetailsDrawer(): void {
    this.isDetailsDrawerOpen = false;
  }

  addVehicle(): void {
    const dialogRef = this.dialog.open(AddVehicle, {
      width: '640px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newVehicle: Vehicle = {
          id: this.mockVehicles.length + 1,
          vehicleNumber: result.vehicleNumber,
          modelName: result.modelName || 'Standard Truck',
          type: result.type,
          fuelType: result.fuelType || 'Diesel',
          driverName: result.driverName,
          capacity: result.capacity,
          currentOdometer: result.currentOdometer || 0,
          status: result.status || 'Active',
          lastServiceDate: 'Today',
          nextServiceDue: 'In 3 Months',
          maintenanceLogs: []
        };

        this.mockVehicles = [newVehicle, ...this.mockVehicles];
        this.filterByStatus(this.activeFilter);
      }
    });
  }

  editVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(AddVehicle, {
      width: '640px',
      data: vehicle
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.mockVehicles.findIndex(v => v.id === vehicle.id);
        if (index !== -1) {
          this.mockVehicles[index] = {
            ...vehicle,
            ...result
          };
          this.filterByStatus(this.activeFilter);
          if (this.selectedVehicle?.id === vehicle.id) {
            this.selectedVehicle = this.mockVehicles[index];
          }
        }
      }
    });
  }

  deleteVehicle(vehicle: Vehicle): void {
    const confirmed = confirm(`Are you sure you want to delete vehicle "${vehicle.vehicleNumber}"?`);
    if (!confirmed) return;

    this.mockVehicles = this.mockVehicles.filter(v => v.id !== vehicle.id);
    this.filterByStatus(this.activeFilter);
    if (this.selectedVehicle?.id === vehicle.id) {
      this.closeDetailsDrawer();
    }
  }

  get totalVehiclesCount(): number {
    return this.mockVehicles.length;
  }

  get activeVehiclesCount(): number {
    return this.mockVehicles.filter(v => v.status === 'Active').length;
  }

  get maintenanceVehiclesCount(): number {
    return this.mockVehicles.filter(v => v.status === 'Maintenance').length;
  }

  get availableVehiclesCount(): number {
    return this.mockVehicles.filter(v => v.status === 'Available').length;
  }
}
