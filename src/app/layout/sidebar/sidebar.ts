import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  appName = 'Smart Fleet';
  appTagline = 'Management System';

  menus = [
    { name: 'Dashboard',         icon: 'dashboard',         route: '/dashboard' },
    { name: 'Vehicle List',      icon: 'local_shipping',    route: '/fleet' },
    { name: 'Drivers',           icon: 'people',            route: '/drivers' },
    { name: 'Live Tracking',     icon: 'location_on',       route: '/tracking' },
    { name: 'Routes',            icon: 'map',               route: '/routes' },
    { name: 'Trips',             icon: 'directions_car',    route: '/trips' },
    { name: 'Fuel Management',   icon: 'local_gas_station', route: '/fuel' },
    { name: 'Route Optimizer',   icon: 'alt_route',         route: '/route-optimization' },
    { name: 'Driver Mobile POD', icon: 'smartphone',        route: '/driver-portal' },
    { name: 'Reports & Export',  icon: 'bar_chart',         route: '/reports' },
    { name: 'System Settings',   icon: 'settings',          route: '/settings' }
  ];

  constructor(public layoutService: LayoutService) {}

  toggleCollapse(): void {
    this.layoutService.toggleSidebar();
  }
}
