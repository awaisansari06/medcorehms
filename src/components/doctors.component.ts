import { Component, inject, signal } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in px-4 sm:px-0">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Staff Management</h2>
           <p class="text-slate-500 mt-1">Medical professionals currently managed under Hospital Head administration.</p>
        </div>
        
        @if (auth.currentUser()?.role !== 'Patient') {
          <button (click)="openAddDoctorModal()" class="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center gap-2 font-medium">
            <i class="fa-solid fa-plus"></i> Add Doctor
          </button>
        }
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

    </div>

    <!-- Doctor Profile Modal -->
    @if (selectedDoctor()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center p-4 sm:p-6 animate-fade-in shadow-2xl overflow-y-auto">
          <div class="bg-white rounded-3xl w-full max-w-2xl m-auto flex flex-col overflow-hidden animate-slide-up border border-slate-100 shadow-2xl shrink-0">
            <div class="relative h-40 shrink-0 bg-gradient-to-br from-primary to-blue-500">
              <button (click)="selectedDoctor.set(null)" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div class="px-10 pb-10 overflow-y-auto custom-scrollbar">
              <div class="flex flex-col sm:flex-row gap-6 -mt-16 items-end sm:items-center shrink-0">
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

      <!-- Add Doctor Modal -->
      @if (showAddModal) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center p-4 sm:p-6 animate-fade-in shadow-2xl overflow-y-auto">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg m-auto flex flex-col overflow-hidden animate-slide-up border border-slate-100 shrink-0">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 class="font-bold text-xl text-slate-800">Register New Doctor</h3>
              <button (click)="closeAddDoctorModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Full Name</label>
                <input [(ngModel)]="newDoctor.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Specialization</label>
                <input [(ngModel)]="newDoctor.specialization" type="text" placeholder="e.g., Cardiologist" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Department</label>
                <input [(ngModel)]="newDoctor.department" type="text" placeholder="e.g., Cardiology" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
              </div>
              <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input [(ngModel)]="newDoctor.available" type="checkbox" id="available" class="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300">
                <label for="available" class="text-sm font-semibold text-slate-700">Available immediately</label>
              </div>
            </div>
            <div class="px-8 py-6 bg-white flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button (click)="closeAddDoctorModal()" class="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button (click)="saveDoctor()" class="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl transition-all shadow-lg shadow-blue-100">Save Record</button>
            </div>
          </div>
        </div>
      }
  `
})
export class DoctorsComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);
  selectedDoctor = signal<any | null>(null);

  showAddModal = false;
  newDoctor: any = {
    name: '',
    specialization: '',
    department: '',
    available: true
  };

  viewProfile(doctor: any) {
    this.selectedDoctor.set(doctor);
  }

  openAddDoctorModal() {
    this.newDoctor = { name: '', specialization: '', department: '', available: true };
    this.showAddModal = true;
  }

  closeAddDoctorModal() {
    this.showAddModal = false;
  }

  async saveDoctor() {
    try {
      if (!this.newDoctor.name || !this.newDoctor.specialization) return;
      console.log('Attempting to save doctor:', this.newDoctor);
      await this.dataService.addDoctor(this.newDoctor);
      console.log('Doctor saved successfully');
      this.closeAddDoctorModal();
    } catch (e) {
      console.error('Error saving doctor:', e);
      alert('Error saving doctor: ' + (e as Error).message);
    }
  }
}