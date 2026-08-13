import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Route } from '../../../models/route.model';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './route-management.html',
  styleUrls: ['./route-management.css']
})
export class RouteManagement implements OnInit {

  displayedColumns: string[] = [
    'routeName',
    'source',
    'destination',
    'distance',
    'estimatedTime',
    'assignedVehicle',
    'assignedDriver',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Route>();

  routes: Route[] = [];

  ngOnInit(): void {

    this.routes = [

      {
        id: 1,
        routeName: 'Route-001',
        source: 'Bhubaneswar',
        destination: 'Cuttack',
        distance: 28,
        estimatedTime: '40 min',
        assignedVehicle: 'OD-02-AB-1234',
        assignedDriver: 'Rahul Kumar',
        status: 'Active'
      },

      {
        id: 2,
        routeName: 'Route-002',
        source: 'Puri',
        destination: 'Khordha',
        distance: 62,
        estimatedTime: '1 hr 20 min',
        assignedVehicle: 'OD-05-CD-5678',
        assignedDriver: 'Amit Das',
        status: 'Pending'
      },

      {
        id: 3,
        routeName: 'Route-003',
        source: 'Balasore',
        destination: 'Bhadrak',
        distance: 36,
        estimatedTime: '50 min',
        assignedVehicle: 'OD-14-GH-3456',
        assignedDriver: 'Suresh Nayak',
        status: 'Completed'
      }

    ];

    this.dataSource.data = this.routes;

  }

  applyFilter(event: Event): void {

    const filter = (event.target as HTMLInputElement)
      .value
      .trim()
      .toLowerCase();

    this.dataSource.filter = filter;

  }

  addRoute(): void {
    console.log('Add Route');
  }

  editRoute(route: Route): void {
    console.log(route);
  }

  deleteRoute(route: Route): void {
    console.log(route);
  }

  get totalRoutes(): number {
    return this.routes.length;
  }

  get activeRoutes(): number {
    return this.routes.filter(r => r.status === 'Active').length;
  }

  get pendingRoutes(): number {
    return this.routes.filter(r => r.status === 'Pending').length;
  }

  get completedRoutes(): number {
    return this.routes.filter(r => r.status === 'Completed').length;
  }

}
