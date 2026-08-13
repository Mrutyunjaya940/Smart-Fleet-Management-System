import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-driver-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './add-driver-dialog.html',
  styleUrls: ['./add-driver-dialog.css']
})
export class AddDriverDialog {

  driverForm: FormGroup;
  isEditMode = false;

  vehiclesList = [
    'Not Assigned',
    'OD-02-AB-1234 (Tata Signa)',
    'OD-05-CD-5678 (Mahindra Bolero)',
    'OD-14-GH-3456 (Ashok Leyland)',
    'OD-10-EF-9012 (Tata Ace EV)'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDriverDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.driverForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      licenseNumber: ['', Validators.required],
      experienceYears: [3, [Validators.min(0)]],
      assignedVehicle: ['Not Assigned'],
      status: ['Available', Validators.required]
    });

    if (data) {
      this.isEditMode = true;
      this.driverForm.patchValue(data);
    }
  }

  save(): void {
    if (this.driverForm.valid) {
      this.dialogRef.close(this.driverForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
