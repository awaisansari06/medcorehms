import { Component, inject, signal, computed } from '@angular/core';
import { DataService, Appointment } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h2>
          <p class="text-slate-500 mt-1">Manage scheduling and clinical visits.</p>
        </div>
        <button (click)="toggleForm()" class="bg-primary text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
          <i class="fa-solid" [class.fa-calendar-plus]="!showForm" [class.fa-xmark]="showForm"></i> 
          {{ showForm ? 'Cancel Action' : 'Schedule New' }}
        </button>
      </div>

      <!-- New Appointment Form (Collapsible) -->
      @if (showForm) {
        <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 animate-slide-down">
          <div class="flex items-center gap-4 mb-10">
            <div class="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-xl"><i class="fa-solid fa-calendar-check"></i></div>
            <h3 class="font-black text-xl text-slate-800">New Appointment Details</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
             <!-- Patient Select: Read-only if user is a Patient -->
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Patient</label>
               @if (isPatient()) {
                 <div class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-bold flex items-center gap-3">
                   <img [src]="currentUser()?.avatar" class="w-6 h-6 rounded-full opacity-50">
                   {{ currentUser()?.name }}
                 </div>
               } @else {
                 <select [(ngModel)]="newAppt.patientId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700">
                   @for (p of dataService.patients(); track p.id) {
                     <option [value]="p.id">{{ p.name }} ({{p.id}})</option>
                   }
                 </select>
               }
             </div>
             
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Medical Officer</label>
               <select [(ngModel)]="newAppt.doctorId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700">
                 @for (d of dataService.doctors(); track d.id) {
                   <option [value]="d.id">{{ d.name }} • {{d.specialization}}</option>
                 }
               </select>
             </div>
             
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Preferred Date</label>
               <input [(ngModel)]="newAppt.date" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700">
             </div>
             
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Service Type</label>
               <select [(ngModel)]="newAppt.type" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700">
                 <option>Consultation</option>
                 <option>Follow-up</option>
                 <option>Emergency</option>
                 <option>Routine Checkup</option>
               </select>
             </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-50">
            <button (click)="toggleForm()" class="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">Abort</button>
            <button (click)="bookAppointment()" class="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200">Confirm Schedule</button>
          </div>
        </div>
      }

      <!-- List -->
      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50">
               <tr class="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <th class="px-8 py-6">ID</th>
                 <th class="px-8 py-6">Patient Entity</th>
                 <th class="px-8 py-6">Assigned Doctor</th>
                 <th class="px-8 py-6">Date Schedule</th>
                 <th class="px-8 py-6">Classification</th>
                 <th class="px-8 py-6">Current Status</th>
                 <th class="px-8 py-6 text-right"></th>
               </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              @for (apt of filteredAppointments(); track apt.id) {
                <tr class="group hover:bg-slate-50/80 transition-colors">
                  <td class="px-8 py-6 font-bold text-slate-300 tracking-tight">#{{ apt.id }}</td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-xs font-black transition-colors group-hover:bg-primary group-hover:text-white">
                        {{ getPatientName(apt.patientId).charAt(0) }}
                      </div>
                      <span class="font-bold text-slate-800">{{ getPatientName(apt.patientId) }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6 font-semibold text-slate-500">
                    {{ getDoctorName(apt.doctorId) }}
                  </td>
                  <td class="px-8 py-6">
                     <div class="font-bold text-slate-800">{{ apt.date | date:'mediumDate' }}</div>
                     <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ apt.time }}</div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100">
                      {{ apt.type }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                     <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      [class.bg-green-50]="apt.status === 'Completed'" [class.text-success]="apt.status === 'Completed'"
                      [class.bg-blue-50]="apt.status === 'Scheduled'" [class.text-primary]="apt.status === 'Scheduled'"
                      [class.bg-red-50]="apt.status === 'Cancelled'" [class.text-danger]="apt.status === 'Cancelled'">
                       <span class="w-1.5 h-1.5 rounded-full shadow-glow-sm" 
                        [class.bg-success]="apt.status === 'Completed'"
                        [class.bg-primary]="apt.status === 'Scheduled'"
                        [class.bg-danger]="apt.status === 'Cancelled'"></span>
                       {{ apt.status }}
                     </span>
                  </td>
                  <td class="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    @if (!isPatient() && apt.status === 'Scheduled') {
                      <div class="flex justify-end gap-2">
                         <button (click)="dataService.updateAppointmentStatus(apt.id, 'Completed')" class="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50 text-success hover:bg-success hover:text-white transition-all shadow-sm" title="Mark as Completed">
                           <i class="fa-solid fa-check"></i>
                         </button>
                         <button (click)="dataService.updateAppointmentStatus(apt.id, 'Cancelled')" class="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-danger hover:bg-danger hover:text-white transition-all shadow-sm" title="Cancel Appointment">
                           <i class="fa-solid fa-xmark"></i>
                         </button>
                      </div>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                   <td colspan="7" class="py-20 text-center text-slate-400 font-black uppercase tracking-widest italic opacity-50">
                     No active appointments in system
                   </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AppointmentsComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);
  showForm = false;

  currentUser = this.auth.currentUser;

  newAppt: any = {
    patientId: '', doctorId: '', date: '', time: '09:00 AM', status: 'Scheduled', type: 'Consultation'
  };

  constructor() {
    // Auto-select patient if logged in as patient
    if (this.isPatient() && this.currentUser()) {
      this.newAppt.patientId = this.currentUser()!.id;
    }
  }

  isPatient() {
    return this.currentUser()?.role === 'Patient';
  }

  filteredAppointments = computed(() => {
    const all = this.dataService.appointments();
    if (this.isPatient()) {
      return all.filter(a => a.patientId === this.currentUser()?.id);
    }
    return all;
  });

  toggleForm() {
    this.showForm = !this.showForm;
  }

  bookAppointment() {
    this.dataService.addAppointment(this.newAppt);
    this.toggleForm();
  }

  getPatientName(id: string) {
    return this.dataService.patients().find(p => p.id === id)?.name || id;
  }

  getDoctorName(id: string) {
    return this.dataService.doctors().find(d => d.id === id)?.name || id;
  }
}