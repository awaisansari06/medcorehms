import { Component, inject, signal } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in px-4 sm:px-0">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Medical Staff</h2>
           <p class="text-slate-500 mt-1">Directory of our professional healthcare providers.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (doctor of dataService.doctors(); track doctor.id) {
          <div class="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-md transition-all group card-hover">
            <div class="h-28 bg-gradient-to-br from-primary to-blue-400 relative">
               <div class="absolute -bottom-10 left-6">
                 <img [src]="'https://ui-avatars.com/api/?name=' + doctor.name + '&background=ffffff&color=2563eb&bold=true'" 
                   class="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white object-cover" alt="Doctor">
               </div>
               <div class="absolute top-4 right-4">
                 <div class="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                   [class.bg-green-500]="doctor.available" [class.bg-red-500]="!doctor.available"></div>
               </div>
            </div>
            <div class="pt-12 px-6 pb-6">
              <div class="mb-4">
                 <h3 class="font-bold text-slate-800 text-lg leading-tight">{{ doctor.name }}</h3>
                 <div class="text-xs font-bold text-primary uppercase mt-1 tracking-wider">{{ doctor.specialization }}</div>
              </div>
              
              <div class="flex items-center gap-2 mb-6 text-sm text-slate-500">
                <i class="fa-solid fa-hospital-user text-slate-300"></i> {{ doctor.department }}
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                <span class="text-xs font-bold"
                  [class.text-green-600]="doctor.available" [class.text-red-500]="!doctor.available">
                  {{ doctor.available ? 'AVAILABLE' : 'ON LEAVE' }}
                </span>
                
                <button (click)="viewProfile(doctor)" class="text-primary hover:text-blue-800 text-sm font-bold transition-colors">View Profile</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Doctor Profile Modal -->
      @if (selectedDoctor()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-100 shadow-2xl">
            <div class="relative h-40 bg-gradient-to-br from-primary to-blue-500">
              <button (click)="selectedDoctor.set(null)" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div class="px-10 pb-10">
              <div class="flex flex-col sm:flex-row gap-6 -mt-16 items-end sm:items-center">
                <img [src]="'https://ui-avatars.com/api/?name=' + selectedDoctor()?.name + '&background=ffffff&color=2563eb&bold=true&size=128'" 
                   class="w-32 h-32 rounded-3xl bg-white border-8 border-white shadow-lg object-cover">
                <div class="flex-1 pb-2">
                  <div class="flex items-center gap-3">
                    <h3 class="text-3xl font-bold text-slate-800">{{ selectedDoctor()?.name }}</h3>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border" 
                      [class.bg-green-50]="selectedDoctor()?.available" [class.text-green-600]="selectedDoctor()?.available" [class.border-green-100]="selectedDoctor()?.available"
                      [class.bg-red-50]="!selectedDoctor()?.available" [class.text-red-600]="!selectedDoctor()?.available" [class.border-red-100]="!selectedDoctor()?.available">
                      {{ selectedDoctor()?.available ? 'ACTIVE' : 'AWAY' }}
                    </span>
                  </div>
                  <div class="text-primary font-bold uppercase tracking-wider text-sm mt-1">{{ selectedDoctor()?.specialization }}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div class="space-y-6">
                  <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Professional Info</h4>
                    <div class="space-y-4">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                          <i class="fa-solid fa-building-user"></i>
                        </div>
                        <div>
                          <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter">Department</p>
                          <p class="text-sm font-semibold text-slate-700">{{ selectedDoctor()?.department }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                          <i class="fa-solid fa-id-badge"></i>
                        </div>
                        <div>
                          <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter">Staff ID</p>
                          <p class="text-sm font-semibold text-slate-700">{{ selectedDoctor()?.id }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                   <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Consultation Status</h4>
                    <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <p class="text-xs text-slate-500 font-medium mb-2">Availability Notice</p>
                       <p class="text-sm font-bold text-slate-800">
                         {{ selectedDoctor()?.available ? 'Currently accepting new appointments.' : 'Not available for new bookings today.' }}
                       </p>
                    </div>
                  </div>
                  <div class="pt-6 border-t border-slate-50">
                     <button class="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                       <i class="fa-solid fa-calendar-plus"></i> Schedule Session
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DoctorsComponent {
  dataService = inject(DataService);
  selectedDoctor = signal<any | null>(null);

  viewProfile(doctor: any) {
    this.selectedDoctor.set(doctor);
  }
}