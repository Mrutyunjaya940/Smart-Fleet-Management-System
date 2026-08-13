import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { Driver } from '../../../models/driver.model';
import { AddDriverDialog } from '../add-driver-dialog/add-driver-dialog';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './driver-list.html',
  styleUrls: ['./driver-list.css']
})
export class DriverList implements OnInit {

  displayedColumns: string[] = [
    'name',
    'phone',
    'licenseNumber',
    'assignedVehicle',
    'safetyScore',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Driver>([]);
  selectedDriver: Driver | null = null;
  isDrawerOpen = false;
  activeFilter = 'All';

  mockDrivers: Driver[] = [
    {
      id: 1,
      name: 'Rahul Kumar',
      phone: '+91 98765 43210',
      email: 'rahul.kumar@smartfleet.com',
      licenseNumber: 'DL-2024-001',
      licenseExpiry: '2028-11-15',
      assignedVehicle: 'OD-02-AB-1234',
      status: 'Available',
      experienceYears: 6,
      rating: 4.9,
      tripsCompleted: 342,
      safetyScore: 98,
      emergencyContact: '+91 91234 56789',
      joinDate: '12 Jan 2024'
    },
    {
      id: 2,
      name: 'Amit Das',
      phone: '+91 91234 56789',
      email: 'amit.das@smartfleet.com',
      licenseNumber: 'DL-2024-002',
      licenseExpiry: '2027-08-20',
      assignedVehicle: 'OD-05-CD-5678',
      status: 'On Trip',
      experienceYears: 8,
      rating: 4.7,
      tripsCompleted: 512,
      safetyScore: 95,
      emergencyContact: '+91 98765 12345',
      joinDate: '05 Mar 2023'
    },
    {
      id: 3,
      name: 'Suresh Nayak',
      phone: '+91 99887 76655',
      email: 'suresh.nayak@smartfleet.com',
      licenseNumber: 'DL-2024-003',
      licenseExpiry: '2029-01-10',
      assignedVehicle: 'Not Assigned',
      status: 'Off Duty',
      experienceYears: 4,
      rating: 4.8,
      tripsCompleted: 210,
      safetyScore: 97,
      emergencyContact: '+91 94321 87654',
      joinDate: '18 Nov 2024'
    },
    {
      id: 4,
      name: 'Prakash Rout',
      phone: '+91 93456 78901',
      email: 'prakash.rout@smartfleet.com',
      licenseNumber: 'DL-2024-004',
      licenseExpiry: '2026-12-05',
      assignedVehicle: 'OD-10-EF-9012',
      status: 'On Trip',
      experienceYears: 5,
      rating: 4.6,
      tripsCompleted: 188,
      safetyScore: 92,
      emergencyContact: '+91 97654 32109',
      joinDate: '01 Jun 2024'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = this.mockDrivers;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    if (status === 'All') {
      this.dataSource.data = this.mockDrivers;
    } else {
      this.dataSource.data = this.mockDrivers.filter(d => d.status === status);
    }
  }

  viewDriverProfile(driver: Driver): void {
    this.selectedDriver = driver;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  addDriver(): void {
    const dialogRef = this.dialog.open(AddDriverDialog, {
      width: '580px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newDriver: Driver = {
          id: this.mockDrivers.length + 1,
          name: result.name,
          phone: result.phone,
          email: result.email || `${result.name.toLowerCase().replace(/\s+/g, '.')}@smartfleet.com`,
          licenseNumber: result.licenseNumber,
          assignedVehicle: result.assignedVehicle || 'Not Assigned',
          status: result.status || 'Available',
          experienceYears: result.experienceYears || 3,
          rating: 5.0,
          tripsCompleted: 0,
          safetyScore: 100,
          licenseExpiry: '2029-12-31',
          emergencyContact: '+91 98000 00000',
          joinDate: 'Today'
        };

        this.mockDrivers = [newDriver, ...this.mockDrivers];
        this.filterByStatus(this.activeFilter);
      }
    });
  }

  editDriver(driver: Driver): void {
    const dialogRef = this.dialog.open(AddDriverDialog, {
      width: '580px',
      data: driver
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.mockDrivers.findIndex(d => d.id === driver.id);
        if (index !== -1) {
          this.mockDrivers[index] = {
            ...driver,
            ...result
          };
          this.filterByStatus(this.activeFilter);
          if (this.selectedDriver?.id === driver.id) {
            this.selectedDriver = this.mockDrivers[index];
          }
        }
      }
    });
  }

  deleteDriver(driver: Driver): void {
    const confirmed = confirm(`Are you sure you want to remove driver "${driver.name}"?`);
    if (!confirmed) return;

    this.mockDrivers = this.mockDrivers.filter(d => d.id !== driver.id);
    this.filterByStatus(this.activeFilter);
    if (this.selectedDriver?.id === driver.id) {
      this.closeDrawer();
    }
  }

  // Dynamic KPI getters
  get totalDriversCount(): number {
    return this.mockDrivers.length;
  }

  get availableCount(): number {
    return this.mockDrivers.filter(d => d.status === 'Available').length;
  }

  get onTripCount(): number {
    return this.mockDrivers.filter(d => d.status === 'On Trip').length;
  }

  get offDutyCount(): number {
    return this.mockDrivers.filter(d => d.status === 'Off Duty').length;
  }

  get avgSafetyScore(): number {
    if (!this.mockDrivers.length) return 0;
    const sum = this.mockDrivers.reduce((acc, d) => acc + (d.safetyScore || 95), 0);
    return Math.round(sum / this.mockDrivers.length);
  }
}
