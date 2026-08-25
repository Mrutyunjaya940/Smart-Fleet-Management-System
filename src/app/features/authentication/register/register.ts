import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AuthApiService } from '../../../core/services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  roles = [
    { value: 'ROLE_FLEET_MANAGER', label: 'Fleet Manager' },
    { value: 'ROLE_DISPATCHER', label: 'Dispatcher' },
    { value: 'ROLE_DRIVER', label: 'Driver' }
  ];

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      role: ['ROLE_FLEET_MANAGER', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const val = this.registerForm.value;

    this.authApiService.register(val).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Account created successfully in database! Redirecting to Login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}
