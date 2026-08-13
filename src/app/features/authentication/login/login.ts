import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  hidePassword = true;
  isLoading = false;
  loginError = '';
  activeParticles: number[] = [];

  loginForm: FormGroup;

  stats = [
    { value: '2,400+', label: 'Vehicles Tracked' },
    { value: '98.5%',  label: 'Uptime' },
    { value: '340+',   label: 'Fleet Managers' }
  ];

  features = [
    { icon: 'location_on',      text: 'Real-time GPS Tracking' },
    { icon: 'alt_route',        text: 'AI Route Optimization' },
    { icon: 'local_gas_station', text: 'Fuel Cost Analytics' },
    { icon: 'bar_chart',        text: 'Live Reports & Insights' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.activeParticles = Array.from({ length: 12 }, (_, i) => i);
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    // Simulate API call
    setTimeout(() => {
      const { email, password } = this.loginForm.value;

      // Demo: any valid email + 8-char password works
      if (email && password.length >= 8) {
        localStorage.setItem('access_token', 'demo-jwt-token');
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'Invalid credentials. Please try again.';
        this.isLoading = false;
      }
    }, 1200);
  }

  getEmailError(): string {
    const ctrl = this.loginForm.get('email');
    if (ctrl?.hasError('required')) return 'Email is required';
    if (ctrl?.hasError('email'))    return 'Enter a valid email address';
    return '';
  }

  getPasswordError(): string {
    const ctrl = this.loginForm.get('password');
    if (ctrl?.hasError('required'))   return 'Password is required';
    if (ctrl?.hasError('minlength'))  return 'At least 8 characters required';
    return '';
  }
}
