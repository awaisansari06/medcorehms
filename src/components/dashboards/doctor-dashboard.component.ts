import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-gradient-to-br from-primary to-blue-700 text-white p-8 rounded-3xl shadow-lg shadow-blue-100 relative overflow-hidden">
        <div class="absolute right-0 top-0 p-8 opacity-10"><i class="fa-solid fa-calendar-check text-8xl rotate-12"></i></div>
        <div class="relative z-10">
          <div class="text-blue-100 text-xs font-black uppercase tracking-widest mb-2">Today's Schedule</div>
          <div class="text-5xl font-black">5</div>
          <div class="mt-6 flex gap-2">
            <span class="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md">2 Urgent</span>
            <span class="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md">3 Routine</span>
          </div>
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 group card-hover">
        <div class="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Pending Reports</div>
        <div class="text-5xl font-black text-slate-800 transition-colors group-hover:text-primary">12</div>
        <div class="mt-6 text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5"><i class="fa-solid fa-circle-exclamation"></i> Needs review</div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 group card-hover">
        <div class="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Patient Reach</div>
        <div class="text-5xl font-black text-slate-800 transition-colors group-hover:text-success">{{ dataService.patients().length }}</div>
        <div class="mt-6 text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-1.5"><i class="fa-solid fa-arrow-trend-up"></i> +14% this month</div>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 mt-8">
      <div class="flex justify-between items-center mb-8">
         <h3 class="font-bold text-2xl text-slate-800">Your Consultations</h3>
         <button class="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center"><i class="fa-solid fa-filter"></i></button>
      </div>
      <div class="space-y-6">
         @for(app of dataService.appointments(); track app.id) {
           <div class="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-3xl border border-slate-50 hover:border-primary/20 hover:bg-blue-50/30 transition-all group">
              <div class="w-20 md:w-24 shrink-0 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
                 <span class="text-[10px] font-black uppercase text-slate-400 mb-1">Time</span>
                 <span class="font-black text-slate-800 text-lg">{{ app.time }}</span>
              </div>
              <div class="flex-1">
                 <div class="flex flex-wrap items-center gap-3 mb-1">
                   <h4 class="font-black text-xl text-slate-800">{{ app.type }}</h4>
                   <span class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500">{{ app.status }}</span>
                 </div>
                 <p class="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <i class="fa-solid fa-circle-user text-slate-300"></i> Patient File: 
                    <span class="font-bold text-slate-700 uppercase tracking-tight">{{ app.patientId }}</span>
                 </p>
              </div>
              <div class="flex gap-3 shrink-0">
                 <button (click)="openConsultModal(app)" class="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Start Consult</button>
                 <button class="w-12 h-12 rounded-2xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary transition-all flex items-center justify-center"><i class="fa-solid fa-file-medical-alt"></i></button>
              </div>
           </div>
         }
      </div>
    </div>

    @if (selectedAppointment) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
        <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]">
          <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div>
              <h3 class="font-bold text-xl text-slate-800">Consultation Notes</h3>
              <p class="text-xs text-slate-500 font-bold uppercase mt-1">Appt ID: {{ selectedAppointment.id }}</p>
            </div>
            <button (click)="selectedAppointment = null" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                 <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div class="p-8 overflow-y-auto custom-scrollbar">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Subjective (Symptoms)</div>
                  <textarea rows="3" class="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 focus:ring-0 placeholder-slate-300" placeholder="Patient complaints..."></textarea>
               </div>
               <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Objective (Observations)</div>
                   <textarea rows="3" class="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 focus:ring-0 placeholder-slate-300" placeholder="Physical exam findings..."></textarea>
               </div>
             </div>
             
             <div class="mb-6">
                <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Assessment (Diagnosis)</label>
                <input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Primary diagnosis">
             </div>

             <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Plan (Treatment)</label>
                <textarea rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Medications, tests, follow-up..."></textarea>
             </div>
          </div>

          <div class="px-8 py-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100 shrink-0">
             <button (click)="selectedAppointment = null" class="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm rounded-2xl transition-all">Draft</button>
             <button (click)="completeConsult()" class="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-100">Finalize & Sign</button>
          </div>
        </div>
      </div>
    }
  `
})
export class DoctorDashboardComponent {
  dataService = inject(DataService);
  selectedAppointment: any = null;

  openConsultModal(appt: any) {
    this.selectedAppointment = appt;
  }

  completeConsult() {
    if (this.selectedAppointment) {
      this.dataService.updateAppointmentStatus(this.selectedAppointment.id, 'Completed');
      this.selectedAppointment = null;
    }
  }
}
