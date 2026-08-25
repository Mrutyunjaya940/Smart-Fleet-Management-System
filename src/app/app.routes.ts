import { Routes } from '@angular/router';

import { Login } from './features/authentication/login/login';
import { Register } from './features/authentication/register/register';
import { ForgotPassword } from './features/authentication/forgot-password/forgot-password';
import { OtpVerification } from './features/authentication/otp-verification/otp-verification';
import { ResetPassword } from './features/authentication/reset-password/reset-password';
import { authGuard } from './features/authentication/guards/auth.guard';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { Fleet } from './features/fleet/fleet';
import { DriverList } from './features/driver/driver-list/driver-list';
import { LiveTracking } from './features/tracking/live-tracking/live-tracking';
import { RouteManagement } from './features/routes/route-management/route-management';
import { TripManagement } from './features/trips/trip-management/trip-management';
import { FuelManagement } from './features/fuel/fuel-management/fuel-management';
import { RouteOptimization } from './features/route-optimization/route-optimization';
import { Reports } from './features/reports/reports';
import { Settings } from './features/settings/settings';
import { DriverPortal } from './features/driver-portal/driver-portal';

export const routes: Routes = [

  // Default redirect
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public auth routes
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'otp-verification',
    component: OtpVerification
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },

  // Dedicated Driver Mobile Portal
  {
    path: 'driver-portal',
    component: DriverPortal
  },

  // Protected routes (require auth)
  {
    path: 'app',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',          component: DashboardComponent },
      { path: 'fleet',              component: Fleet },
      { path: 'drivers',            component: DriverList },
      { path: 'tracking',           component: LiveTracking },
      { path: 'routes',             component: RouteManagement },
      { path: 'trips',              component: TripManagement },
      { path: 'fuel',               component: FuelManagement },
      { path: 'route-optimization', component: RouteOptimization },
      { path: 'reports',            component: Reports },
      { path: 'settings',           component: Settings },
      { path: 'driver-portal',      component: DriverPortal }
    ]
  },

  // Top-level shortcut aliases
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: DashboardComponent }]
  },
  {
    path: 'fleet',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: Fleet }]
  },
  {
    path: 'drivers',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: DriverList }]
  },
  {
    path: 'tracking',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: LiveTracking }]
  },
  {
    path: 'routes',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: RouteManagement }]
  },
  {
    path: 'trips',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: TripManagement }]
  },
  {
    path: 'fuel',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: FuelManagement }]
  },
  {
    path: 'route-optimization',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: RouteOptimization }]
  },
  {
    path: 'reports',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: Reports }]
  },
  {
    path: 'settings',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: '', component: Settings }]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'login'
  }

];
