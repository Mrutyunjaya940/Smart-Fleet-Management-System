import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MAP_STYLES_DARK, MAP_STYLES_LIGHT } from '../../core/constants/maps.constants';

declare var google: any;

interface WaypointStop {
  name: string;
  lat: number;
  lng: number;
  selected: boolean;
  order?: number;
}

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  templateUrl: './route-optimization.html',
  styleUrls: ['./route-optimization.css']
})
export class RouteOptimization implements AfterViewInit {

  private fb = inject(FormBuilder);

  routeForm = this.fb.group({
    source: ['Bhubaneswar (Master Canteen)'],
    destination: ['Centurion University (CUTM Jatni)'],
    vehicle: ['OD-02-AB-1234'],
    driver: ['Rahul Kumar'],
    optimizationMode: ['FuelSaver'] // 'FuelSaver' | 'Fastest' | 'Balanced'
  });

  allLocations: Record<string, { lat: number; lng: number }> = {
    'Bhubaneswar (Master Canteen)': { lat: 20.2648, lng: 85.8417 },
    'Centurion University (CUTM Jatni)': { lat: 20.1743, lng: 85.7067 },
    'Jaydev Vihar Square': { lat: 20.3010, lng: 85.8240 },
    'Rasulgarh Square': { lat: 20.3021, lng: 85.8647 },
    'Khandagiri & Udayagiri': { lat: 20.2588, lng: 85.7865 },
    'Patia / KIIT Square': { lat: 20.3556, lng: 85.8188 },
    'AIIMS Bhubaneswar (Sijua)': { lat: 20.2289, lng: 85.7766 },
    'Baramunda ISBT Bus Stand': { lat: 20.2745, lng: 85.7952 },
    'Khordha Road Railway Station': { lat: 20.1555, lng: 85.6705 },
    'Biju Patnaik Intl Airport (BBI)': { lat: 20.2444, lng: 85.8178 }
  };

  locationKeys = Object.keys(this.allLocations);

  // Multi-Stop TSP Delivery Stops (5-10 stops)
  multiStops: WaypointStop[] = [
    { name: 'Jaydev Vihar Square', lat: 20.3010, lng: 85.8240, selected: true, order: 1 },
    { name: 'Rasulgarh Square', lat: 20.3021, lng: 85.8647, selected: true, order: 2 },
    { name: 'Khandagiri & Udayagiri', lat: 20.2588, lng: 85.7865, selected: true, order: 3 },
    { name: 'Baramunda ISBT Bus Stand', lat: 20.2745, lng: 85.7952, selected: true, order: 4 },
    { name: 'AIIMS Bhubaneswar (Sijua)', lat: 20.2289, lng: 85.7766, selected: false, order: 5 }
  ];

  // Calculated TSP Sequence
  optimizedSequence: string[] = [];

  // Comparison Stats
  standardStats = {
    distance: '34.2 km',
    time: '58 mins',
    fuel: '4.2 L',
    co2: '9.8 kg',
    cost: '₹420'
  };

  aiStats = {
    distance: '26.8 km',
    time: '38 mins',
    fuel: '2.8 L',
    co2: '6.2 kg',
    cost: '₹270',
    savingsPercent: 'Save 22% Fuel & 20 Mins via TSP Sorting!'
  };

  // Weather & Traffic Hazards
  hazards = [
    { type: 'Heavy Rain Warning', location: 'NH-16 Expressway', delay: '+15 mins', severity: 'Critical', icon: 'cloudy_snowing' },
    { type: 'Traffic Jam', location: 'Rasulgarh Flyover', delay: '+10 mins', severity: 'High', icon: 'traffic' },
    { type: 'Road Maintenance', location: 'Khandagiri Crossing', delay: '+5 mins', severity: 'Medium', icon: 'engineering' }
  ];

  geofenceAlert: string | null = null;
  private map!: any;
  private markers: any[] = [];
  private polylines: any[] = [];

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    const mapContainer = document.getElementById('routeMap');
    if (!mapContainer) return;

    const isDarkMode = document.body.classList.contains('dark-theme');

    this.map = new google.maps.Map(mapContainer, {
      center: { lat: 20.2648, lng: 85.8417 },
      zoom: 11,
      styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false
    });

    this.solveTspAndOptimize();
  }

  toggleStop(stop: WaypointStop): void {
    stop.selected = !stop.selected;
    this.solveTspAndOptimize();
  }

  // Traveling Salesperson Problem (Nearest Neighbor Greedy TSP Algorithm)
  solveTspAndOptimize(): void {
    const sourceName = this.routeForm.get('source')?.value!;
    const destinationName = this.routeForm.get('destination')?.value!;

    const start = this.allLocations[sourceName] || this.allLocations['Bhubaneswar (Master Canteen)'];
    const end = this.allLocations[destinationName] || this.allLocations['Centurion University (CUTM Jatni)'];

    const activeStops = this.multiStops.filter(s => s.selected);

    // Greedy Nearest Neighbor TSP Solver
    let unvisited = [...activeStops];
    let currentPos = start;
    const orderedStops: WaypointStop[] = [];

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.getDist(currentPos, unvisited[i]);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nextStop = unvisited.splice(nearestIdx, 1)[0];
      orderedStops.push(nextStop);
      currentPos = nextStop;
    }

    // Assign order numbers
    orderedStops.forEach((stop, index) => {
      stop.order = index + 1;
    });

    this.optimizedSequence = [
      sourceName,
      ...orderedStops.map(s => s.name),
      destinationName
    ];

    this.renderMapRoutes(start, orderedStops, end);
  }

  getDist(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
  }

  renderMapRoutes(start: { lat: number; lng: number }, waypoints: WaypointStop[], end: { lat: number; lng: number }): void {
    if (!this.map) return;

    // Clear old map overlays
    this.markers.forEach(m => m.setMap(null));
    this.polylines.forEach(p => p.setMap(null));
    this.markers = [];
    this.polylines = [];

    // TSP Green Polyline Path
    const fullPath = [start, ...waypoints, end];

    const aiPolyline = new google.maps.Polyline({
      path: fullPath,
      geodesic: true,
      strokeColor: '#10b981',
      strokeOpacity: 0.9,
      strokeWeight: 7,
      map: this.map
    });

    this.polylines.push(aiPolyline);

    // Origin Marker (A)
    const startMarker = new google.maps.Marker({
      position: start,
      map: this.map,
      title: 'Origin',
      label: { text: 'A', color: '#ffffff', fontWeight: 'bold' }
    });
    this.markers.push(startMarker);

    // Waypoint Markers (1, 2, 3...)
    waypoints.forEach((wp) => {
      const marker = new google.maps.Marker({
        position: { lat: wp.lat, lng: wp.lng },
        map: this.map,
        title: wp.name,
        label: { text: `${wp.order}`, color: '#ffffff', fontWeight: 'bold' }
      });
      this.markers.push(marker);
    });

    // Destination Marker (B)
    const endMarker = new google.maps.Marker({
      position: end,
      map: this.map,
      title: 'Destination',
      label: { text: 'B', color: '#ffffff', fontWeight: 'bold' }
    });
    this.markers.push(endMarker);

    // Fit map bounds
    const bounds = new google.maps.LatLngBounds();
    fullPath.forEach(pt => bounds.extend(pt));
    this.map.fitBounds(bounds);
  }

  simulateGeofenceBreach(): void {
    this.geofenceAlert = '🚨 GEOFENCE BREACH: Vehicle OD-02-AB-1234 exited Paradeep Logistics Zone at 10:14 AM!';
    setTimeout(() => {
      this.geofenceAlert = null;
    }, 6000);
  }

  exportRoute(): void {
    const report = {
      ...this.routeForm.value,
      tspOptimizedSequence: this.optimizedSequence,
      aiStats: this.aiStats,
      hazards: this.hazards,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multi-stop-tsp-route-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
