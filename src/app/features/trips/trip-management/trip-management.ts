import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-trip-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './trip-management.html',
  styleUrls: ['./trip-management.css']
})
export class TripManagement implements OnInit {

  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  selectedTrip: Trip | null = null;
  isDrawerOpen = false;
  isScheduleModalOpen = false;
  activeFilter = 'All';

  tripForm!: FormGroup;

  locations = [
    'Bhubaneswar (Master Canteen)',
    'Centurion University (CUTM Jatni)',
    'Khordha Road Railway Station',
    'Biju Patnaik Intl Airport (BBI)',
    'Patia / KIIT Square',
    'Cuttack (Badambadi)',
    'Puri (Jagannath Temple)'
  ];

  vehiclesList = ['OD-02-AB-1234', 'OD-05-CD-5678', 'OD-14-GH-3456', 'OD-10-EF-9012'];
  driversList = ['Rahul Kumar', 'Amit Das', 'Suresh Nayak', 'Prakash Rout'];

  constructor(private fb: FormBuilder) {
    this.tripForm = this.fb.group({
      source: ['Bhubaneswar (Master Canteen)', Validators.required],
      destination: ['Centurion University (CUTM Jatni)', Validators.required],
      vehicle: ['OD-02-AB-1234', Validators.required],
      driver: ['Rahul Kumar', Validators.required],
      cargoType: ['Commercial Goods', Validators.required],
      distance: [24.5, Validators.required]
    });
  }

  ngOnInit(): void {
    this.trips = [
      {
        id: 1,
        tripId: 'TRP-840',
        vehicle: 'OD-02-AB-1234',
        driver: 'Rahul Kumar',
        route: 'Bhubaneswar → CUTM Jatni',
        source: 'Bhubaneswar (Master Canteen)',
        destination: 'Centurion University (CUTM Jatni)',
        distance: 24.5,
        speed: 62,
        eta: '25 min',
        progress: 65,
        status: 'Active',
        cargoType: 'Electronics Cargo',
        startTime: '09:15 AM',
        fuelConsumed: 2.1
      },
      {
        id: 2,
        tripId: 'TRP-841',
        vehicle: 'OD-05-CD-5678',
        driver: 'Amit Das',
        route: 'Puri → Khordha',
        source: 'Puri (Jagannath Temple)',
        destination: 'Khordha Road Railway Station',
        distance: 52,
        speed: 45,
        eta: '12 min',
        progress: 82,
        status: 'Active',
        cargoType: 'Food & FMCG Supplies',
        startTime: '08:30 AM',
        fuelConsumed: 4.8
      },
      {
        id: 3,
        tripId: 'TRP-842',
        vehicle: 'OD-14-GH-3456',
        driver: 'Suresh Nayak',
        route: 'Airport → Patia KIIT',
        source: 'Biju Patnaik Intl Airport (BBI)',
        destination: 'Patia / KIIT Square',
        distance: 18,
        speed: 0,
        eta: 'Completed',
        progress: 100,
        status: 'Completed',
        cargoType: 'Express Parcel Delivery',
        startTime: '07:00 AM',
        completionTime: '07:42 AM',
        fuelConsumed: 1.5
      },
      {
        id: 4,
        tripId: 'TRP-843',
        vehicle: 'OD-10-EF-9012',
        driver: 'Prakash Rout',
        route: 'Cuttack → Bhubaneswar',
        source: 'Cuttack (Badambadi)',
        destination: 'Bhubaneswar (Master Canteen)',
        distance: 28,
        speed: 15,
        eta: '45 min (Delayed)',
        progress: 35,
        status: 'Delayed',
        cargoType: 'Heavy Machinery Parts',
        startTime: '08:00 AM',
        fuelConsumed: 3.2
      },
      {
        id: 5,
        tripId: 'TRP-844',
        vehicle: 'OD-02-AB-1234',
        driver: 'Rahul Kumar',
        route: 'CUTM Jatni → Khordha Station',
        source: 'Centurion University (CUTM Jatni)',
        destination: 'Khordha Road Railway Station',
        distance: 12,
        speed: 0,
        eta: 'Scheduled 04:00 PM',
        progress: 0,
        status: 'Scheduled',
        cargoType: 'Campus Supply Dispatch',
        startTime: '04:00 PM'
      }
    ];

    this.filteredTrips = [...this.trips];
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.filteredTrips = this.trips.filter(trip =>
      trip.tripId.toLowerCase().includes(value) ||
      trip.vehicle.toLowerCase().includes(value) ||
      trip.driver.toLowerCase().includes(value) ||
      trip.route.toLowerCase().includes(value)
    );
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    if (status === 'All') {
      this.filteredTrips = [...this.trips];
    } else {
      this.filteredTrips = this.trips.filter(t => t.status === status);
    }
  }

  viewTripDetails(trip: Trip): void {
    this.selectedTrip = trip;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  openScheduleModal(): void {
    this.isScheduleModalOpen = true;
  }

  closeScheduleModal(): void {
    this.isScheduleModalOpen = false;
  }

  submitScheduleTrip(): void {
    if (this.tripForm.invalid) return;

    const val = this.tripForm.value;
    const newTrip: Trip = {
      id: this.trips.length + 1,
      tripId: `TRP-${845 + this.trips.length}`,
      vehicle: val.vehicle,
      driver: val.driver,
      route: `${val.source.split(' ')[0]} → ${val.destination.split(' ')[0]}`,
      source: val.source,
      destination: val.destination,
      distance: val.distance || 25,
      speed: 0,
      eta: 'Scheduled',
      progress: 0,
      status: 'Scheduled',
      cargoType: val.cargoType,
      startTime: 'Just Scheduled',
      fuelConsumed: 0
    };

    this.trips = [newTrip, ...this.trips];
    this.filterByStatus(this.activeFilter);
    this.closeScheduleModal();
  }

  deleteTrip(trip: Trip): void {
    const confirmed = confirm(`Are you sure you want to cancel Trip "${trip.tripId}"?`);
    if (!confirmed) return;

    this.trips = this.trips.filter(t => t.id !== trip.id);
    this.filterByStatus(this.activeFilter);
    if (this.selectedTrip?.id === trip.id) {
      this.closeDrawer();
    }
  }

  get totalTrips(): number { return this.trips.length; }
  get activeTrips(): number { return this.trips.filter(t => t.status === 'Active').length; }
  get scheduledTrips(): number { return this.trips.filter(t => t.status === 'Scheduled').length; }
  get completedTrips(): number { return this.trips.filter(t => t.status === 'Completed').length; }
  get delayedTrips(): number { return this.trips.filter(t => t.status === 'Delayed').length; }
}
