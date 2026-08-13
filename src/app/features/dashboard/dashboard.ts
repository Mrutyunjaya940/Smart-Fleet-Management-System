import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
import { MAP_STYLES_DARK, MAP_STYLES_LIGHT } from '../../core/constants/maps.constants';

Chart.register(...registerables);

declare var google: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  currentTime = new Date();
  private timeInterval: any;
  private previewMap: any;

  // Weather Widget Data
  weather = {
    city: 'Bhubaneswar, Odisha',
    temp: 31,
    condition: 'Partly Cloudy',
    icon: 'partly_cloudy_day',
    humidity: '68%',
    wind: '14 km/h',
    visibility: '10 km',
    advisory: 'Optimal driving conditions'
  };

  // KPI Cards
  kpiCards = [
    {
      title: 'Total Vehicles',
      value: '120',
      icon: 'local_shipping',
      color: 'blue',
      trend: '+5% this month',
      trendUp: true
    },
    {
      title: 'Active Trips',
      value: '38',
      icon: 'route',
      color: 'green',
      trend: '+12% this week',
      trendUp: true
    },
    {
      title: 'Total Drivers',
      value: '95',
      icon: 'people',
      color: 'purple',
      trend: '+2 new this week',
      trendUp: true
    },
    {
      title: 'Fuel Cost Today',
      value: '₹14,280',
      icon: 'local_gas_station',
      color: 'orange',
      trend: '-3% vs yesterday',
      trendUp: false
    }
  ];

  // Fleet Status Breakdown
  fleetStatus = [
    { label: 'Moving',      count: 42, color: '#22c55e', percent: 35 },
    { label: 'Idle',        count: 28, color: '#f59e0b', percent: 23 },
    { label: 'Available',   count: 33, color: '#3b82f6', percent: 28 },
    { label: 'Maintenance', count: 17, color: '#ef4444', percent: 14 }
  ];

  // Chart: Revenue vs Fuel Expenses
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Trip Revenue (₹)',
        data: [185000, 210000, 195000, 240000, 230000, 265000],
        backgroundColor: '#2563eb',
        borderRadius: 8,
        barPercentage: 0.6
      },
      {
        label: 'Fuel Expense (₹)',
        data: [42000, 51000, 48000, 61000, 58000, 64000],
        backgroundColor: '#ef4444',
        borderRadius: 8,
        barPercentage: 0.6
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { family: 'Poppins' } }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 50000 } }
    }
  };

  // Recent Activity Feed
  recentActivities = [
    {
      id: 1,
      type: 'success',
      icon: 'check_circle',
      message: 'Vehicle OD-02-AB-1234 completed Trip #840 safely.',
      time: '10 mins ago'
    },
    {
      id: 2,
      type: 'warning',
      icon: 'warning',
      message: 'Low fuel alert triggered for Vehicle OD-05-XY-9876.',
      time: '45 mins ago'
    },
    {
      id: 3,
      type: 'info',
      icon: 'alt_route',
      message: 'Route optimized for Driver Rahul Kumar (Bhubaneswar → Airport).',
      time: '2 hours ago'
    },
    {
      id: 4,
      type: 'error',
      icon: 'build',
      message: 'Maintenance required: Engine diagnostic failed on Vehicle #12.',
      time: '5 hours ago'
    },
    {
      id: 5,
      type: 'success',
      icon: 'person_add',
      message: 'New driver Suresh Nayak has been onboarded successfully.',
      time: '1 day ago'
    }
  ];

  // Quick Action Links
  quickLinks = [
    { label: 'Add Vehicle',    icon: 'add_circle',    route: '/fleet',              color: 'blue' },
    { label: 'Live Tracking',  icon: 'location_on',   route: '/tracking',           color: 'green' },
    { label: 'New Trip',       icon: 'directions_car', route: '/trips',             color: 'purple' },
    { label: 'Optimize Route', icon: 'alt_route',     route: '/route-optimization', color: 'orange' }
  ];

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPreviewMap();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  initPreviewMap(): void {
    const mapElement = document.getElementById('dashboardPreviewMap');
    if (!mapElement || typeof google === 'undefined') return;

    const isDarkMode = document.body.classList.contains('dark-theme');

    this.previewMap = new google.maps.Map(mapElement, {
      center: { lat: 20.2961, lng: 85.8245 },
      zoom: 12,
      styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: true,
      zoomControl: true
    });

    const activeVehicles = [
      { lat: 20.2961, lng: 85.8245, title: 'OD-02-AB-1234 (Moving)' },
      { lat: 20.2855, lng: 85.8402, title: 'OD-05-CD-5678 (Idle)' },
      { lat: 20.2915, lng: 85.8320, title: 'OD-10-EF-9012 (Moving)' }
    ];

    activeVehicles.forEach(v => {
      new google.maps.Marker({
        position: { lat: v.lat, lng: v.lng },
        map: this.previewMap,
        title: v.title,
        icon: {
          path: 'M 0,-10 L 6,10 L 0,6 L -6,10 Z',
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.4
        }
      });
    });
  }
}
