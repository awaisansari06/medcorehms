import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { PatientsComponent } from './components/patients.component';
import { DoctorsComponent } from './components/doctors.component';
import { AppointmentsComponent } from './components/appointments.component';
import { BillingComponent } from './components/billing.component';
import { LoginComponent } from './components/login.component';
import { LayoutComponent } from './components/layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || false;
};

import { ProfileComponent } from './components/profile.component';
import { SettingsComponent } from './components/settings.component';
import { NotFoundComponent } from './components/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];