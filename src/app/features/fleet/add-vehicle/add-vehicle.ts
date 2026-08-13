import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-vehicle.html',
  styleUrls: ['./add-vehicle.css']
})
export class AddVehicle {

  isEditMode = false;

  vehicle = {
    vehicleNumber: '',
    modelName: '',
    type: 'Heavy Truck',
    fuelType: 'Diesel',
    driverName: '',
    capacity: '',
    currentOdometer: 0,
    status: 'Active'
  };

  constructor(
    private dialogRef: MatDialogRef<AddVehicle>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.vehicle = { ...data };
      this.isEditMode = true;
    }
  }

  save() {
    if (
      !this.vehicle.vehicleNumber ||
      !this.vehicle.type ||
      !this.vehicle.driverName ||
      !this.vehicle.capacity
    ) {
      alert('Please fill in all required fields (License Plate, Type, Driver, Capacity).');
      return;
    }

    this.dialogRef.close(this.vehicle);
  }

  close() {
    this.dialogRef.close();
  }
}
