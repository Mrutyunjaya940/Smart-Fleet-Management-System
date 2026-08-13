import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleList {

  displayedColumns: string[] = [
    'vehicleNumber',
    'vehicleType',
    'status'
  ];

}
