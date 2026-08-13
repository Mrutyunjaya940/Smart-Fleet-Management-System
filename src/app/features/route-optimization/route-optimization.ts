import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MAP_STYLES_DARK, MAP_STYLES_LIGHT } from '../../core/constants/maps.constants';

declare var google: any;

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
    MatCardModule
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
    optimization: ['Fastest']
  });

  locations: Record<string, { lat: number; lng: number }> = {
    'Bhubaneswar (Master Canteen)': { lat: 20.2648, lng: 85.8417 },
    'Centurion University (CUTM Jatni)': { lat: 20.1743, lng: 85.7067 },
    'Khordha Road Railway Station': { lat: 20.1555, lng: 85.6705 },
    'Biju Patnaik Intl Airport (BBI)': { lat: 20.2444, lng: 85.8178 },
    'Patia / KIIT Square': { lat: 20.3556, lng: 85.8188 },
    'Jaydev Vihar Square': { lat: 20.3010, lng: 85.8240 },
    'Saheed Nagar': { lat: 20.2882, lng: 85.8436 },
    'Rasulgarh Square': { lat: 20.3021, lng: 85.8647 },
    'Khandagiri & Udayagiri': { lat: 20.2588, lng: 85.7865 },
    'AIIMS Bhubaneswar (Sijua)': { lat: 20.2289, lng: 85.7766 },
    'Baramunda ISBT Bus Stand': { lat: 20.2745, lng: 85.7952 },
    'Infocity IT Hub': { lat: 20.3582, lng: 85.8143 },
    'Cuttack (Badambadi)': { lat: 20.4625, lng: 85.8830 },
    'Puri (Jagannath Temple)': { lat: 19.8135, lng: 85.8312 },
    'Paradip Port': { lat: 20.3164, lng: 86.6110 }
  };

  locationKeys = Object.keys(this.locations);

  // Dynamic calculated stats
  calculatedStats = {
    distance: '24.5 km',
    time: '42 mins',
    fuel: '2.1 L',
    cost: '₹210'
  };

  private map!: any;
  private markers: any[] = [];
  private polyline?: any;
  private directionsService?: any;
  private directionsRenderer?: any;

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    const mapContainer = document.getElementById('routeMap');
    if (!mapContainer) return;

    const isDarkMode = document.body.classList.contains('dark-theme');

    this.map = new google.maps.Map(mapContainer, {
      center: { lat: 20.2961, lng: 85.8245 },
      zoom: 11,
      styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 6,
        strokeOpacity: 0.9
      }
    });

    this.optimizeRoute();
  }

  optimizeRoute(): void {
    const sourceName = this.routeForm.get('source')?.value!;
    const destinationName = this.routeForm.get('destination')?.value!;

    const source = this.locations[sourceName];
    const destination = this.locations[destinationName];

    if (!source || !destination || !this.map) {
      return;
    }

    // Recalculate dynamic estimates
    this.updateCalculatedStats(source, destination);

    // Try Google Maps Directions Service
    if (this.directionsService && this.directionsRenderer) {
      this.directionsService.route(
        {
          origin: source,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (response: any, status: any) => {
          if (status === 'OK') {
            this.directionsRenderer.setDirections(response);
            const route = response.routes[0]?.legs[0];
            if (route) {
              this.calculatedStats.distance = route.distance.text;
              this.calculatedStats.time = route.duration.text;
              const distKm = parseFloat(route.distance.text.replace(/[^0-9.]/g, '')) || 25;
              this.calculatedStats.fuel = (distKm * 0.085).toFixed(1) + ' L';
              this.calculatedStats.cost = '₹' + Math.round(distKm * 8.5);
            }
          } else {
            this.drawFallbackPolyline(source, destination, sourceName, destinationName);
          }
        }
      );
    } else {
      this.drawFallbackPolyline(source, destination, sourceName, destinationName);
    }
  }

  updateCalculatedStats(source: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    // Haversine distance estimation
    const R = 6371;
    const dLat = (destination.lat - source.lat) * Math.PI / 180;
    const dLng = (destination.lng - source.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(source.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = Math.max(2, Math.round(R * c * 1.3)); // 1.3 road curvature factor

    this.calculatedStats.distance = distKm + ' km';
    this.calculatedStats.time = Math.round(distKm * 1.8) + ' mins';
    this.calculatedStats.fuel = (distKm * 0.08).toFixed(1) + ' L';
    this.calculatedStats.cost = '₹' + Math.round(distKm * 8.5);
  }

  drawFallbackPolyline(source: { lat: number; lng: number }, destination: { lat: number; lng: number }, sourceName: string, destinationName: string) {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    if (this.polyline) this.polyline.setMap(null);

    const startMarker = new google.maps.Marker({
      position: source,
      map: this.map,
      title: sourceName,
      label: { text: 'A', color: '#ffffff', fontWeight: 'bold' }
    });

    const endMarker = new google.maps.Marker({
      position: destination,
      map: this.map,
      title: destinationName,
      label: { text: 'B', color: '#ffffff', fontWeight: 'bold' }
    });

    this.markers.push(startMarker, endMarker);

    this.polyline = new google.maps.Polyline({
      path: [source, destination],
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      map: this.map
    });

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(source);
    bounds.extend(destination);
    this.map.fitBounds(bounds);
  }

  swapLocations(): void {
    const source = this.routeForm.get('source')?.value;
    const destination = this.routeForm.get('destination')?.value;

    this.routeForm.patchValue({
      source: destination,
      destination: source
    });

    this.optimizeRoute();
  }

  refreshForm(): void {
    this.routeForm.reset({
      source: 'Bhubaneswar (Master Canteen)',
      destination: 'Centurion University (CUTM Jatni)',
      vehicle: 'OD-02-AB-1234',
      driver: 'Rahul Kumar',
      optimization: 'Fastest'
    });

    this.optimizeRoute();
  }

  exportRoute(): void {
    const report = {
      ...this.routeForm.value,
      ...this.calculatedStats,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-route-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
