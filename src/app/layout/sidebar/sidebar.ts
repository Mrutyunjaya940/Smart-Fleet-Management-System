import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  appName: string = 'Smart Fleet';

  menus = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Fleet', icon: '🚚' },
    { name: 'Drivers', icon: '👨‍✈️' },
    { name: 'Tracking', icon: '📍' },
    { name: 'Route Optimization', icon: '🗺️' },
    { name: 'Trips', icon: '🛣️' },
    { name: 'Reports', icon: '📊' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Profile', icon: '👤' }
  ];

}
