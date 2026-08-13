import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { VehicleLocation } from '../../../models/location.model';
import { MAP_STYLES_DARK, MAP_STYLES_LIGHT } from '../../../core/constants/maps.constants';

declare var google: any;

export interface PlaybackWaypoint {
  lat: number;
  lng: number;
  time: string;
  speed: number;
  locationName: string;
}

@Component({
  selector: 'app-live-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSliderModule
  ],
  templateUrl: './live-tracking.html',
  styleUrls: ['./live-tracking.css']
})
export class LiveTracking implements AfterViewInit, OnDestroy {

  activeTab: 'live' | 'playback' = 'live';

  map!: any;
  markers: any[] = [];
  infoWindow!: any;
  simulationInterval: any;
  selectedVehicle: VehicleLocation | null = null;

  // Real-Time Vehicles Data
  vehicles: VehicleLocation[] = [
    {
      id: 1,
      vehicleNumber: 'OD-02-AB-1234',
      driver: 'Rahul Kumar',
      latitude: 20.2961,
      longitude: 85.8245,
      speed: 65,
      status: 'Moving'
    },
    {
      id: 2,
      vehicleNumber: 'OD-05-CD-5678',
      driver: 'Amit Das',
      latitude: 20.2855,
      longitude: 85.8402,
      speed: 0,
      status: 'Idle'
    },
    {
      id: 3,
      vehicleNumber: 'OD-14-GH-3456',
      driver: 'Suresh Nayak',
      latitude: 20.3025,
      longitude: 85.8154,
      speed: 0,
      status: 'Offline'
    },
    {
      id: 4,
      vehicleNumber: 'OD-10-EF-9012',
      driver: 'Prakash Rout',
      latitude: 20.2915,
      longitude: 85.8320,
      speed: 42,
      status: 'Moving'
    }
  ];

  // Route Playback State
  selectedPlaybackVehicle = 'OD-02-AB-1234';
  isPlaying = false;
  playbackSpeed = 1; // 1x, 2x, 4x
  playbackIndex = 0;
  playbackInterval: any;
  playbackPolyline?: any;
  playbackMarker?: any;

  // Mock Playback Route History (Bhubaneswar → Cuttack Highway)
  playbackWaypoints: PlaybackWaypoint[] = [
    { lat: 20.2648, lng: 85.8417, time: '09:00 AM', speed: 0,  locationName: 'Master Canteen Station' },
    { lat: 20.2882, lng: 85.8436, time: '09:08 AM', speed: 45, locationName: 'Saheed Nagar' },
    { lat: 20.3010, lng: 85.8240, time: '09:15 AM', speed: 58, locationName: 'Jaydev Vihar Square' },
    { lat: 20.3205, lng: 85.8390, time: '09:22 AM', speed: 65, locationName: 'Acharya Vihar Overbridge' },
    { lat: 20.3556, lng: 85.8188, time: '09:30 AM', speed: 72, locationName: 'KIIT Square / Patia' },
    { lat: 20.3890, lng: 85.8410, time: '09:40 AM', speed: 80, locationName: 'Nandankanan Expressway' },
    { lat: 20.4200, lng: 85.8620, time: '09:50 AM', speed: 75, locationName: 'Trisulia Bridge' },
    { lat: 20.4625, lng: 85.8830, time: '10:05 AM', speed: 0,  locationName: 'Cuttack Badambadi Bus Stand' }
  ];

  ngAfterViewInit(): void {
    this.initGoogleMap();
    this.simulateMovement();
  }

  ngOnDestroy(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.playbackInterval) clearInterval(this.playbackInterval);
  }

  switchTab(tab: 'live' | 'playback'): void {
    this.activeTab = tab;
    this.stopPlayback();

    if (tab === 'live') {
      if (this.playbackPolyline) this.playbackPolyline.setMap(null);
      if (this.playbackMarker) this.playbackMarker.setMap(null);
      this.addMarkers();
      this.map.setCenter({ lat: 20.2961, lng: 85.8245 });
      this.map.setZoom(13);
    } else {
      this.setupPlaybackMode();
    }
  }

  initGoogleMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof google === 'undefined') return;

    const isDarkMode = document.body.classList.contains('dark-theme');

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 20.2961, lng: 85.8245 },
      zoom: 13,
      styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false
    });

    this.infoWindow = new google.maps.InfoWindow();
    this.addMarkers();
  }

  addMarkers(): void {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.vehicles.forEach((vehicle) => {
      const marker = new google.maps.Marker({
        position: { lat: vehicle.latitude, lng: vehicle.longitude },
        map: this.map,
        title: vehicle.vehicleNumber,
        icon: this.getVehicleIcon(vehicle.status)
      });

      marker.addListener('click', () => {
        this.openVehicleInfoWindow(vehicle, marker);
      });

      this.markers.push(marker);
    });
  }

  getVehicleIcon(status: string) {
    let color = '#16a34a';
    if (status === 'Idle') color = '#f59e0b';
    if (status === 'Offline') color = '#ef4444';

    return {
      path: 'M 0,-12 L 8,12 L 0,8 L -8,12 Z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5
    };
  }

  openVehicleInfoWindow(vehicle: VehicleLocation, marker: any) {
    this.selectedVehicle = vehicle;
    const content = `
      <div style="padding:10px; font-family:'Poppins',sans-serif; color:#0f172a;">
        <h4 style="margin:0 0 6px; font-weight:700; color:#2563eb;">${vehicle.vehicleNumber}</h4>
        <p style="margin:0 0 4px; font-size:0.85rem;"><b>Driver:</b> ${vehicle.driver}</p>
        <p style="margin:0 0 4px; font-size:0.85rem;"><b>Status:</b> <span style="font-weight:600; color:${this.getStatusColor(vehicle.status)}">${vehicle.status}</span></p>
        <p style="margin:0; font-size:0.85rem;"><b>Speed:</b> ${vehicle.speed} km/h</p>
      </div>
    `;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  getStatusColor(status: string): string {
    if (status === 'Moving') return '#16a34a';
    if (status === 'Idle') return '#f59e0b';
    return '#ef4444';
  }

  focusVehicle(vehicle: VehicleLocation, index: number) {
    this.selectedVehicle = vehicle;
    const pos = { lat: vehicle.latitude, lng: vehicle.longitude };
    this.map.panTo(pos);
    this.map.setZoom(15);
    if (this.markers[index]) {
      this.openVehicleInfoWindow(vehicle, this.markers[index]);
    }
  }

  simulateMovement(): void {
    this.simulationInterval = setInterval(() => {
      if (this.activeTab !== 'live') return;

      this.vehicles.forEach((vehicle, index) => {
        if (vehicle.status === 'Moving') {
          vehicle.latitude += (Math.random() - 0.5) * 0.002;
          vehicle.longitude += (Math.random() - 0.5) * 0.002;
          vehicle.speed = Math.floor(Math.random() * 30) + 40;

          if (this.markers[index]) {
            const newPos = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
            this.markers[index].setPosition(newPos);
          }
        }
      });
    }, 3000);
  }

  // ---- ROUTE PLAYBACK LOGIC ----
  setupPlaybackMode(): void {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    if (this.playbackPolyline) this.playbackPolyline.setMap(null);
    if (this.playbackMarker) this.playbackMarker.setMap(null);

    const path = this.playbackWaypoints.map(w => ({ lat: w.lat, lng: w.lng }));

    // Draw route trail
    this.playbackPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 6,
      map: this.map
    });

    // Create playback vehicle marker
    const firstPoint = path[0];
    this.playbackMarker = new google.maps.Marker({
      position: firstPoint,
      map: this.map,
      title: `Playback: ${this.selectedPlaybackVehicle}`,
      icon: {
        path: 'M 0,-14 L 10,14 L 0,9 L -10,14 Z',
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.6
      }
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    this.map.fitBounds(bounds);

    this.playbackIndex = 0;
    this.updatePlaybackPosition();
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startPlaybackTimer();
    } else {
      this.stopPlayback();
    }
  }

  startPlaybackTimer(): void {
    this.stopPlayback();
    this.isPlaying = true;
    const intervalMs = 1500 / this.playbackSpeed;

    this.playbackInterval = setInterval(() => {
      if (this.playbackIndex < this.playbackWaypoints.length - 1) {
        this.playbackIndex++;
        this.updatePlaybackPosition();
      } else {
        this.stopPlayback();
      }
    }, intervalMs);
  }

  stopPlayback(): void {
    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
    }
  }

  onSliderChange(event: any): void {
    this.playbackIndex = event.target.value;
    this.updatePlaybackPosition();
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
    if (this.isPlaying) {
      this.startPlaybackTimer();
    }
  }

  updatePlaybackPosition(): void {
    const waypoint = this.playbackWaypoints[this.playbackIndex];
    if (waypoint && this.playbackMarker) {
      const pos = new google.maps.LatLng(waypoint.lat, waypoint.lng);
      this.playbackMarker.setPosition(pos);
      this.map.panTo(pos);
    }
  }

  get currentWaypoint(): PlaybackWaypoint {
    return this.playbackWaypoints[this.playbackIndex] || this.playbackWaypoints[0];
  }

  get movingCount(): number {
    return this.vehicles.filter(v => v.status === 'Moving').length;
  }

  get idleCount(): number {
    return this.vehicles.filter(v => v.status === 'Idle').length;
  }

  get offlineCount(): number {
    return this.vehicles.filter(v => v.status === 'Offline').length;
  }
}
