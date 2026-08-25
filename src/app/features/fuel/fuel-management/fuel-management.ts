import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { BaseChartDirective } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';

import { Fuel } from '../../../models/fuel.model';
import { MAP_STYLES_DARK, MAP_STYLES_LIGHT } from '../../../core/constants/maps.constants';

Chart.register(...registerables);

declare var google: any;

@Component({
  selector: 'app-fuel-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    BaseChartDirective,
    NgxGaugeModule
  ],
  templateUrl: './fuel-management.html',
  styleUrls: ['./fuel-management.css']
})
export class FuelManagement implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'vehicle',
    'driver',
    'liters',
    'totalCost',
    'mileage',
    'station',
    'paymentMethod',
    'date',
    'actions'
  ];

  dataSource = new MatTableDataSource<Fuel>();
  fuelLogs: Fuel[] = [];
  selectedFuel: Fuel | null = null;
  isDrawerOpen = false;
  isAddModalOpen = false;
  isOcrModalOpen = false;
  isOcrScanning = false;
  ocrSuccess = false;

  fuelForm!: FormGroup;

  stationsList = ['Indian Oil (Master Canteen)', 'HP Petrol (Jaydev Vihar)', 'Bharat Petroleum (Rasulgarh)', 'Shell (Patia KIIT)'];
  vehiclesList = ['OD-02-AB-1234', 'OD-05-CD-5678', 'OD-10-EF-9012', 'OD-14-GH-3456'];
  driversList = ['Rahul Kumar', 'Amit Das', 'Prakash Rout', 'Suresh Nayak'];

  map!: any;

  topVehicles = [
    { vehicle: 'OD-02-AB-1234', driver: 'Rahul Kumar', efficiency: 96, mileage: '15.2 km/L' },
    { vehicle: 'OD-10-EF-9012', driver: 'Prakash Rout', efficiency: 91, mileage: '14.8 km/L' },
    { vehicle: 'OD-05-CD-5678', driver: 'Amit Das', efficiency: 87, mileage: '13.4 km/L' }
  ];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fuel Expense (₹)',
        data: [38500, 42000, 39800, 46100, 44900, 48200],
        backgroundColor: [
          '#2563eb',
          '#3b82f6',
          '#10b981',
          '#22c55e',
          '#f59e0b',
          '#ef4444'
        ],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 10000 } }
    }
  };

  constructor(private fb: FormBuilder) {
    this.fuelForm = this.fb.group({
      vehicle: ['OD-02-AB-1234', Validators.required],
      driver: ['Rahul Kumar', Validators.required],
      station: ['Indian Oil (Master Canteen)', Validators.required],
      liters: [45, [Validators.required, Validators.min(1)]],
      pricePerLiter: [100.5, [Validators.required, Validators.min(1)]],
      mileage: [15.2, Validators.required],
      odometer: [32600, Validators.required],
      paymentMethod: ['Corporate Card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fuelLogs = [
      {
        id: 1,
        vehicle: 'OD-02-AB-1234',
        driver: 'Rahul Kumar',
        station: 'Indian Oil (Master Canteen)',
        liters: 42,
        pricePerLiter: 100,
        totalCost: 4200,
        mileage: 15.2,
        odometer: 32560,
        paymentMethod: 'Corporate Card',
        date: '08 Aug 2026'
      },
      {
        id: 2,
        vehicle: 'OD-05-CD-5678',
        driver: 'Amit Das',
        station: 'HP Petrol (Jaydev Vihar)',
        liters: 55,
        pricePerLiter: 99,
        totalCost: 5445,
        mileage: 13.4,
        odometer: 45200,
        paymentMethod: 'Cash',
        date: '07 Aug 2026'
      },
      {
        id: 3,
        vehicle: 'OD-10-EF-9012',
        driver: 'Prakash Rout',
        station: 'Bharat Petroleum (Rasulgarh)',
        liters: 48,
        pricePerLiter: 101,
        totalCost: 4848,
        mileage: 14.8,
        odometer: 28900,
        paymentMethod: 'UPI',
        date: '06 Aug 2026'
      }
    ];

    this.dataSource.data = this.fuelLogs;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeFuelMap();
    }, 200);
  }

  initializeFuelMap(): void {
    const mapElement = document.getElementById('fuelMap');
    if (!mapElement || typeof google === 'undefined') return;

    const isDarkMode = document.body.classList.contains('dark-theme');

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 20.2961, lng: 85.8245 },
      zoom: 12,
      styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false
    });

    this.addFuelStations();
  }

  addFuelStations(): void {
    const stations = [
      { name: 'Indian Oil (Master Canteen)', lat: 20.2648, lng: 85.8417 },
      { name: 'HP Petrol (Jaydev Vihar)', lat: 20.3010, lng: 85.8240 },
      { name: 'Bharat Petroleum (Rasulgarh)', lat: 20.3021, lng: 85.8647 },
      { name: 'Shell (Patia KIIT)', lat: 20.3556, lng: 85.8188 }
    ];

    const infoWindow = new google.maps.InfoWindow();

    stations.forEach(station => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: this.map,
        title: station.name,
        icon: {
          path: 'M 0,-10 L 8,10 L -8,10 Z',
          fillColor: '#ea580c',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.3
        }
      });

      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding:8px; font-family:'Poppins',sans-serif; color:#0f172a;">
            <h4 style="margin:0 0 4px; font-weight:700; color:#ea580c;">${station.name}</h4>
            <span style="font-size:0.78rem; color:#64748b;">Verified Partner Station · Fleet Discount Active</span>
          </div>
        `);
        infoWindow.open(this.map, marker);
      });
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  // AI Receipt OCR Scanner Modal Methods
  openOcrModal(): void {
    this.isOcrModalOpen = true;
    this.isOcrScanning = false;
    this.ocrSuccess = false;
  }

  closeOcrModal(): void {
    this.isOcrModalOpen = false;
  }

  simulateOcrScan(): void {
    this.isOcrScanning = true;
    this.ocrSuccess = false;

    setTimeout(() => {
      this.isOcrScanning = false;
      this.ocrSuccess = true;

      // Auto fill Form values parsed by OCR
      this.fuelForm.patchValue({
        vehicle: 'OD-02-AB-1234',
        driver: 'Rahul Kumar',
        station: 'Indian Oil (Master Canteen)',
        liters: 52.5,
        pricePerLiter: 96.5,
        mileage: 15.6,
        odometer: 32800,
        paymentMethod: 'Corporate Card'
      });

      setTimeout(() => {
        this.closeOcrModal();
        this.openAddModal();
      }, 1200);

    }, 2000);
  }

  submitAddFuel(): void {
    if (this.fuelForm.invalid) return;

    const val = this.fuelForm.value;
    const totalCost = Math.round(val.liters * val.pricePerLiter);

    const newLog: Fuel = {
      id: this.fuelLogs.length + 1,
      vehicle: val.vehicle,
      driver: val.driver,
      station: val.station,
      liters: val.liters,
      pricePerLiter: val.pricePerLiter,
      totalCost: totalCost,
      mileage: val.mileage,
      odometer: val.odometer,
      paymentMethod: val.paymentMethod,
      date: 'Today'
    };

    this.fuelLogs = [newLog, ...this.fuelLogs];
    this.dataSource.data = [...this.fuelLogs];
    this.closeAddModal();
  }

  viewFuelDetails(fuel: Fuel): void {
    this.selectedFuel = fuel;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  deleteFuel(fuel: Fuel): void {
    const confirmed = confirm(`Are you sure you want to delete refuel log #${fuel.id}?`);
    if (!confirmed) return;

    this.fuelLogs = this.fuelLogs.filter(f => f.id !== fuel.id);
    this.dataSource.data = [...this.fuelLogs];
    if (this.selectedFuel?.id === fuel.id) {
      this.closeDrawer();
    }
  }

  get totalFuel(): number {
    return this.fuelLogs.reduce((sum, fuel) => sum + fuel.liters, 0);
  }

  get totalCost(): number {
    return this.fuelLogs.reduce((sum, fuel) => sum + fuel.totalCost, 0);
  }

  get averageMileage(): number {
    if (!this.fuelLogs.length) return 0;
    const total = this.fuelLogs.reduce((sum, fuel) => sum + fuel.mileage, 0);
    return Number((total / this.fuelLogs.length).toFixed(1));
  }

  get lowFuelAlerts(): number {
    return 3;
  }
}
