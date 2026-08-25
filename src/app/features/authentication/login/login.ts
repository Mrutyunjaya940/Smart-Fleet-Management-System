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
import { MatSelectModule } from '@angular/material/select';

import { AuthApiService } from '../../../core/services/auth-api.service';

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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  activeTab: 'register' | 'login' = 'register';

  hidePassword = true;
  hideRegPassword = true;

  isLoading = false;
  loginError = '';

  isRegLoading = false;
  regSuccess = '';
  regError = '';

  // Unregistered User Modal Popup State
  showUnregisteredModal = false;
  unregisteredEmail = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

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
    // Login Form
    this.loginForm = this.fb.group({
      email:      ['admin@smartfleet.com', [Validators.required, Validators.email]],
      password:   ['password123', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Registration Form
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      role: ['ROLE_FLEET_MANAGER', Validators.required]
    });
  }

  ngOnInit(): void {}

  setTab(tab: 'register' | 'login'): void {
    this.activeTab = tab;
    this.loginError = '';
    this.regError = '';
    this.regSuccess = '';
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginError = 'Please enter a valid email address and password (min 6 characters).';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;

    this.authApiService.login({ email, password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('access_token', res.token || 'jwt-token');
        localStorage.setItem('user_name', res.name || 'User');
        localStorage.setItem('user_email', res.email || email);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.error?.error || '';

        // If user is unregistered or not found in database -> Show Popup Modal!
        if (err.status === 401 || err.status === 404 || errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('register')) {
          this.unregisteredEmail = email;
          this.showUnregisteredModal = true;
        } else {
          this.loginError = errorMsg || 'Invalid credentials. Please check your email and password.';
        }
      }
    });
  }

  redirectToRegister(): void {
    this.showUnregisteredModal = false;
    this.registerForm.patchValue({
      email: this.unregisteredEmail
    });
    this.setTab('register');
  }

  closeUnregisteredModal(): void {
    this.showUnregisteredModal = false;
  }

  registerUser(): void {
    if (!this.registerForm.get('name')?.value) {
      this.regError = 'Please enter your Full Name.';
      return;
    }

    if (this.registerForm.get('email')?.invalid) {
      this.regError = 'Please enter a valid Gmail / Email address.';
      return;
    }

    if (this.registerForm.get('password')?.invalid) {
      this.regError = 'Please enter a password with at least 6 characters.';
      return;
    }

    this.isRegLoading = true;
    this.regError = '';
    this.regSuccess = '';

    const val = this.registerForm.value;

    this.authApiService.register(val).subscribe({
      next: (res) => {
        this.isRegLoading = false;
        this.regSuccess = 'Account registered successfully in MySQL database!';

        // Auto fill credentials into Login Form
        this.loginForm.patchValue({
          email: val.email,
          password: val.password
        });

        // Automatically switch to Login tab after 1.2s
        setTimeout(() => {
          this.setTab('login');
        }, 1200);
      },
      error: (err) => {
        this.isRegLoading = false;
        this.regSuccess = '';
        if (err.status === 409) {
          this.regError = 'This email is already registered in the database! Please switch to Sign In.';
        } else {
          this.regError = err.error?.error || 'Registration failed. Please try again.';
        }
      }
    });
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
    if (ctrl?.hasError('minlength'))  return 'At least 6 characters required';
    return '';
  }
}
