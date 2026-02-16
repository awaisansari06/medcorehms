import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './dashboards/admin-dashboard.component';
import { DoctorDashboardComponent } from './dashboards/doctor-dashboard.component';
import { NurseDashboardComponent } from './dashboards/nurse-dashboard.component';
import { ReceptionistDashboardComponent } from './dashboards/receptionist-dashboard.component';
import { PatientDashboardComponent } from './dashboards/patient-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardComponent,
    DoctorDashboardComponent,
    NurseDashboardComponent,
    ReceptionistDashboardComponent,
    PatientDashboardComponent
  ],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <!-- Common Header -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">{{ auth.currentUser()?.role }} Overview</h2>
          <p class="text-slate-500 mt-1">Welcome back, {{ auth.currentUser()?.name }}</p>
        </div>
        <div class="flex items-center gap-3">
           <div class="px-5 py-2.5 bg-white rounded-2xl border border-slate-100 text-slate-600 shadow-sm font-bold text-sm flex items-center gap-3">
             <i class="fa-regular fa-calendar text-primary"></i> {{ today | date:'mediumDate' }}
           </div>
        </div>
      </div>

      <!-- Role Based Content Orchestrator -->
      @switch (auth.currentUser()?.role) {
        @case ('Admin') { <app-admin-dashboard /> }
        @case ('Doctor') { <app-doctor-dashboard /> }
        @case ('Nurse') { <app-nurse-dashboard /> }
        @case ('Receptionist') { <app-receptionist-dashboard /> }
        @case ('Patient') { <app-patient-dashboard /> }
      }
    </div>
  `
})
export class DashboardComponent {
  public auth = inject(AuthService);
  public today = new Date();
}