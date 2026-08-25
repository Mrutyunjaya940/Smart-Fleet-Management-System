import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface AssignedTrip {
  tripId: string;
  source: string;
  destination: string;
  cargo: string;
  status: 'In Transit' | 'Completed' | 'Assigned';
  eta: string;
  distanceKm: number;
  waypoints: string[];
}

@Component({
  selector: 'app-driver-portal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './driver-portal.html',
  styleUrls: ['./driver-portal.css']
})
export class DriverPortal implements OnInit {

  driverName = 'Rahul Kumar';
  driverVehicle = 'OD-02-AB-1234 (Volvo FH16)';
  safetyRating = 4.9;
  safetyScore = 98;

  activeTrip: AssignedTrip = {
    tripId: 'TRP-840',
    source: 'Bhubaneswar (Master Canteen)',
    destination: 'Centurion University (CUTM Jatni)',
    cargo: 'Electronics Cargo',
    status: 'In Transit',
    eta: '25 Mins',
    distanceKm: 24.5,
    waypoints: ['Janpath Square', 'Khandagiri Crossing', 'Gohira Square']
  };

  isPodModalOpen = false;
  isSigned = false;
  photoUploaded = false;
  deliveryConfirmed = false;

  ngOnInit(): void {}

  openPodModal(): void {
    this.isPodModalOpen = true;
    this.isSigned = false;
    this.photoUploaded = false;
    this.deliveryConfirmed = false;
  }

  closePodModal(): void {
    this.isPodModalOpen = false;
  }

  signCanvas(): void {
    this.isSigned = true;
  }

  uploadPhoto(): void {
    this.photoUploaded = true;
  }

  confirmDelivery(): void {
    this.deliveryConfirmed = true;
    this.activeTrip.status = 'Completed';
    setTimeout(() => {
      this.closePodModal();
    }, 1500);
  }
}
