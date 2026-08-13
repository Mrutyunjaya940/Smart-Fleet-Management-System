import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ReportRow {
  vehicle: string;
  driver: string;
  trips: number;
  distance: string;
  fuel: string;
  efficiency: string;
  cost: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  activeCategory: 'fleet' | 'driver' | 'fuel' = 'fleet';
  selectedDateRange = 'This Month';

  dateRanges = ['Today', 'This Week', 'This Month', 'Quarter to Date', 'Year to Date'];

  reportCards = [
    { title: 'Total Distance',   value: '18,450 km',  icon: 'straighten',        color: 'blue',   sub: 'Fleet total' },
    { title: 'Fuel Consumed',    value: '1,240 L',    icon: 'local_gas_station', color: 'orange', sub: 'Fleet total' },
    { title: 'Trips Completed',  value: '342',        icon: 'check_circle',      color: 'green',  sub: '100% on-time' },
    { title: 'Avg. Fleet Speed', value: '62 km/h',    icon: 'speed',             color: 'purple', sub: 'Optimal range' }
  ];

  displayedColumns: string[] = ['vehicle', 'driver', 'trips', 'distance', 'fuel', 'efficiency', 'cost', 'status'];

  allReportsData: ReportRow[] = [
    { vehicle: 'OD-02-AB-1234', driver: 'Rahul Kumar',  trips: 42, distance: '3,200 km', fuel: '210 L', efficiency: '15.2 km/L', cost: '₹21,000', status: 'Optimal' },
    { vehicle: 'OD-05-CD-5678', driver: 'Amit Das',     trips: 38, distance: '2,850 km', fuel: '215 L', efficiency: '13.3 km/L', cost: '₹21,285', status: 'Moderate' },
    { vehicle: 'OD-10-EF-9012', driver: 'Prakash Rout', trips: 31, distance: '2,400 km', fuel: '160 L', efficiency: '15.0 km/L', cost: '₹16,160', status: 'Optimal' },
    { vehicle: 'OD-14-GH-3456', driver: 'Suresh Nayak', trips: 27, distance: '1,900 km', fuel: '140 L', efficiency: '13.6 km/L', cost: '₹14,140', status: 'Moderate' }
  ];

  filteredData: ReportRow[] = [];

  ngOnInit(): void {
    this.filteredData = [...this.allReportsData];
  }

  setCategory(category: 'fleet' | 'driver' | 'fuel'): void {
    this.activeCategory = category;
    if (category === 'fleet') {
      this.filteredData = [...this.allReportsData];
    } else if (category === 'driver') {
      this.filteredData = this.allReportsData.filter(r => r.driver !== 'Unassigned');
    } else {
      this.filteredData = this.allReportsData.filter(r => parseFloat(r.fuel) > 150);
    }
  }

  exportCSV(): void {
    const csv = [
      ['Vehicle Plate', 'Driver', 'Trips Completed', 'Distance Traveled', 'Fuel Consumed', 'Mileage Efficiency', 'Total Fuel Cost', 'Status'],
      ...this.filteredData.map(r => [r.vehicle, r.driver, r.trips, r.distance, r.fuel, r.efficiency, r.cost, r.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-fleet-report-${this.activeCategory}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  printPDF(): void {
    window.print();
  }
}
