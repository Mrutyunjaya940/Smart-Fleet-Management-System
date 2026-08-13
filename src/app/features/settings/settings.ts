import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

export interface UserRoleItem {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Fleet Manager' | 'Dispatcher' | 'Driver';
  status: 'Active' | 'Inactive';
}

export interface PermissionItem {
  feature: string;
  admin: boolean;
  manager: boolean;
  dispatcher: boolean;
  driver: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  activeTab: 'profile' | 'users' | 'roles' | 'system' = 'profile';

  profile = {
    name: 'Admin User',
    email: 'admin@smartfleet.com',
    phone: '+91 98765 43210',
    role: 'Fleet Manager',
    company: 'Smart Fleet Enterprise Ltd',
    currentPassword: '',
    newPassword: ''
  };

  notifications = {
    lowFuel: true,
    tripCompleted: true,
    driverAlert: true,
    maintenanceDue: true,
    routeDeviation: true
  };

  preferences = {
    language: 'English',
    timezone: 'Asia/Kolkata (IST)',
    distanceUnit: 'Kilometers (km)',
    fuelUnit: 'Liters (L)',
    speedLimitAlert: 80,
    lowFuelThreshold: 15,
    backendApiUrl: 'http://localhost:8080/api/v1'
  };

  usersList: UserRoleItem[] = [
    { id: 1, name: 'Admin User', email: 'admin@smartfleet.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Rahul Kumar', email: 'rahul.k@smartfleet.com', role: 'Driver', status: 'Active' },
    { id: 3, name: 'Amit Das', email: 'amit.d@smartfleet.com', role: 'Driver', status: 'Active' },
    { id: 4, name: 'Suresh Nayak', email: 'suresh.n@smartfleet.com', role: 'Dispatcher', status: 'Active' }
  ];

  permissionsMatrix: PermissionItem[] = [
    { feature: 'Fleet Vehicle Management', admin: true, manager: true, dispatcher: true, driver: false },
    { feature: 'Trip Dispatching & Scheduling', admin: true, manager: true, dispatcher: true, driver: false },
    { feature: 'Live Tracking & Playback', admin: true, manager: true, dispatcher: true, driver: true },
    { feature: 'Fuel Log Receipts & Expenses', admin: true, manager: true, dispatcher: false, driver: true },
    { feature: 'Reports Export & Print', admin: true, manager: true, dispatcher: false, driver: false },
    { feature: 'System Configuration & Roles', admin: true, manager: false, dispatcher: false, driver: false }
  ];

  displayedUserCols = ['name', 'email', 'role', 'status', 'actions'];
  displayedPermCols = ['feature', 'admin', 'manager', 'dispatcher', 'driver'];

  saved = false;

  setTab(tab: 'profile' | 'users' | 'roles' | 'system'): void {
    this.activeTab = tab;
  }

  save(): void {
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}
