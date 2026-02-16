import { Component, inject, signal, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in px-4 sm:px-0">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Patient Records</h2>
          <p class="text-slate-500 mt-1">Directory of registered patients.</p>
        </div>
        
        @if (auth.currentUser()?.role !== 'Patient') {
          <button (click)="openModal()" class="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center gap-2 font-medium">
            <i class="fa-solid fa-plus"></i> Add Patient
          </button>
        }
      </div>

      <!-- Search -->
      <div class="bg-white p-2 rounded-2xl shadow-soft border border-slate-100 flex items-center">
        <div class="w-12 h-12 flex items-center justify-center text-slate-400">
           <i class="fa-solid fa-search text-lg"></i>
        </div>
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search patients by name, diagnosis or ID..." 
          class="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 h-12">
      </div>

      <!-- Grid Layout for Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (patient of filteredPatients(); track patient.id) {
          <div class="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden card-hover">
            <!-- Admitted Badge -->
             @if (patient.admitted) {
               <div class="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] font-bold uppercase px-3 py-1.5 rounded-bl-xl border-b border-l border-red-100">
                 In-Patient
               </div>
             }

             <div class="flex items-start gap-4 mb-4">
               <div class="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-bold text-primary shadow-inner">
                 {{ patient.name.charAt(0) }}
               </div>
               <div>
                 <h3 class="font-bold text-slate-800 text-lg leading-tight">{{ patient.name }}</h3>
                 <span class="font-mono text-xs text-slate-400">ID: {{ patient.id }}</span>
               </div>
             </div>

             <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-400">Gender/Age</span>
                  <span class="font-medium text-slate-700">{{ patient.gender }}, {{ patient.age }} yrs</span>
                </div>
                <div class="flex justify-between text-sm">
                   <span class="text-slate-400">Contact</span>
                   <span class="font-medium text-slate-700">{{ patient.contact }}</span>
                </div>
                <div class="pt-2 border-t border-slate-50 mt-2">
                  <span class="block text-xs font-bold uppercase text-slate-400 mb-1">Diagnosis</span>
                  <span class="inline-block bg-primary-light text-primary text-sm px-3 py-1 rounded-lg font-medium">
                    {{ patient.condition }}
                  </span>
                </div>
             </div>

             <div class="flex gap-2">
               <button (click)="viewProfile(patient)" class="flex-1 bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">View Profile</button>
               @if (auth.currentUser()?.role !== 'Patient') {
                 <button (click)="dataService.deletePatient(patient.id)" class="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100">
                   <i class="fa-solid fa-trash-can"></i>
                 </button>
               }
             </div>
          </div>
        }
      </div>

      <!-- Profile Modal -->
      @if (selectedPatient()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-100 shadow-2xl">
            <div class="relative h-32 bg-gradient-to-r from-primary to-blue-400">
              <button (click)="selectedPatient.set(null)" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div class="px-10 pb-10">
              <div class="flex flex-col sm:flex-row gap-6 -mt-12 items-end sm:items-center">
                <div class="w-32 h-32 rounded-3xl bg-white border-8 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-primary">
                  {{ selectedPatient()?.name.charAt(0) }}
                </div>
                <div class="flex-1 pb-2">
                  <h3 class="text-3xl font-bold text-slate-800">{{ selectedPatient()?.name }}</h3>
                  <div class="flex items-center gap-3 mt-1">
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">{{ selectedPatient()?.id }}</span>
                    <span class="text-slate-400 text-sm font-medium">{{ selectedPatient()?.gender }}, {{ selectedPatient()?.age }} years</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div class="space-y-6">
                  <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medical Information</h4>
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div class="text-sm font-bold text-slate-800 mb-1">Current Diagnosis</div>
                      <div class="text-sm text-primary font-semibold">{{ selectedPatient()?.condition }}</div>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Details</h4>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3 text-slate-600">
                        <i class="fa-solid fa-phone w-5 text-center text-primary/60"></i>
                        <span class="text-sm">{{ selectedPatient()?.contact }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-slate-600">
                        <i class="fa-solid fa-envelope w-5 text-center text-primary/60"></i>
                        <span class="text-sm">{{ selectedPatient()?.name.toLowerCase().replace(' ', '.') }}@email.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Status</h4>
                    <div class="flex items-center gap-2">
                      @if (selectedPatient()?.admitted) {
                        <span class="w-24 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold text-center border border-red-200">IN-PATIENT</span>
                      } @else {
                        <span class="w-24 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-xs font-bold text-center border border-green-200">OUT-PATIENT</span>
                      }
                    </div>
                  </div>
                  <div class="pt-6 border-t border-slate-100">
                     <button class="w-full bg-slate-800 text-white py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                       <i class="fa-solid fa-print"></i> Print Medical Record
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Add Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-slate-100">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 class="font-bold text-xl text-slate-800">Register New Patient</h3>
              <button (click)="closeModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Full Name</label>
                  <input [(ngModel)]="newPatient.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                </div>
                 <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Contact</label>
                  <input [(ngModel)]="newPatient.contact" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Age</label>
                  <input [(ngModel)]="newPatient.age" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Gender</label>
                  <select [(ngModel)]="newPatient.gender" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Condition/Diagnosis</label>
                <input [(ngModel)]="newPatient.condition" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
              </div>
              <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input [(ngModel)]="newPatient.admitted" type="checkbox" id="admitted" class="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300">
                <label for="admitted" class="text-sm font-semibold text-slate-700">Admit to Hospital Immediately</label>
              </div>
            </div>
            <div class="px-8 py-6 bg-white flex justify-end gap-3 border-t border-slate-100">
              <button (click)="closeModal()" class="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button (click)="savePatient()" class="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl transition-all shadow-lg shadow-blue-100">Save Record</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientsComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);
  searchTerm = signal('');
  showModal = false;
  selectedPatient = signal<any | null>(null);

  newPatient: any = {
    name: '', age: null, gender: 'Male', contact: '', condition: '', admitted: false
  };

  filteredPatients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.patients().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.condition.toLowerCase().includes(term)
    );
  });

  openModal() {
    this.newPatient = { name: '', age: null, gender: 'Male', contact: '', condition: '', admitted: false };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  viewProfile(patient: any) {
    this.selectedPatient.set(patient);
  }

  savePatient() {
    if (!this.newPatient.name) return; // Simple validation
    this.dataService.addPatient(this.newPatient);
    this.closeModal();
  }
}