import { Routes } from '@angular/router';


import { Login } from './features/authentication/login/login';
import { ForgotPassword } from './features/authentication/forgot-password/forgot-password';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { OtpVerification } from './features/authentication/otp-verification/otp-verification';
import { ResetPassword } from './features/authentication/reset-password/reset-password';
import { authGuard } from './features/authentication/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },

  {
    path: 'otp-verification',
    component: OtpVerification
  },

  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard]
  }
];
