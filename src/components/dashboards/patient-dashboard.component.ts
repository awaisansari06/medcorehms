import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-patient-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="col-span-1 md:col-span-2 bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
         <div class="absolute right-0 top-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110"><i class="fa-solid fa-heart-pulse text-[20rem]"></i></div>
         <div class="relative z-10">
           <h3 class="text-3xl font-black mb-2 leading-tight">Your Health<br>Snapshot</h3>
           <p class="text-slate-400 mb-10 text-sm font-medium flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> Last clinical assessment: Oct 20, 2023</p>
           
           <div class="grid grid-cols-3 gap-6">
             <div class="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all">
               <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Blood Pressure</div>
               <div class="text-2xl font-black text-white leading-none">120/80</div>
               <div class="text-[9px] font-bold text-success mt-1 uppercase tracking-tight">Optimal</div>
             </div>
             <div class="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all">
               <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Heart Rate</div>
               <div class="text-2xl font-black text-white leading-none">72 <span class="text-xs font-medium text-slate-400">bpm</span></div>
               <div class="text-[9px] font-bold text-success mt-1 uppercase tracking-tight">Normal</div>
             </div>
             <div class="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all">
               <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Body Weight</div>
               <div class="text-2xl font-black text-white leading-none">75 <span class="text-xs font-medium text-slate-400">kg</span></div>
               <div class="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">-2kg streak</div>
             </div>
           </div>
         </div>
      </div>

      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col justify-center items-center text-center card-hover group">
         <div class="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner transition-colors group-hover:bg-primary group-hover:text-white">
           <i class="fa-solid fa-calendar-check text-2xl"></i>
         </div>
         <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Upcoming Consultation</div>
         <div class="text-2xl font-black text-slate-800 mb-1">Oct 25, 2023</div>
         <div class="text-sm text-slate-500 font-bold mb-8">10:00 AM • Dr. Aryan Kapoor</div>
         <button class="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-200">Manage Appointment</button>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 mt-8">
       <div class="flex justify-between items-center mb-8">
         <h3 class="font-black text-2xl text-slate-800 leading-none">Records & prescriptions</h3>
         <button class="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">View Full Archive <i class="fa-solid fa-arrow-right"></i></button>
       </div>
       <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 border border-slate-50 rounded-3xl flex justify-between items-center hover:bg-slate-50 transition-all group border-l-4 border-l-primary shadow-sm hover:shadow-md">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xl transition-colors group-hover:bg-primary group-hover:text-white shrink-0"><i class="fa-solid fa-file-prescription"></i></div>
              <div>
                <div class="font-black text-slate-800">Prescription #RX-9921</div>
                <div class="text-xs text-slate-500 font-bold uppercase tracking-tight mt-1">Amoxicillin 500mg • Due: Nov 05</div>
              </div>
            </div>
            <button class="w-12 h-12 rounded-2xl border border-slate-100 text-slate-300 hover:text-primary hover:border-primary transition-all flex items-center justify-center"><i class="fa-solid fa-download"></i></button>
          </div>
           <div class="p-6 border border-slate-50 rounded-3xl flex justify-between items-center hover:bg-slate-50 transition-all group border-l-4 border-l-success shadow-sm hover:shadow-md">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xl transition-colors group-hover:bg-success group-hover:text-white shrink-0"><i class="fa-solid fa-microscope"></i></div>
              <div>
                <div class="font-black text-slate-800">Laboratory Results</div>
                <div class="text-xs text-slate-500 font-bold uppercase tracking-tight mt-1">Comprehensive Blood Panel • Oct 15</div>
              </div>
            </div>
            <button class="w-12 h-12 rounded-2xl border border-slate-100 text-slate-300 hover:text-primary hover:border-primary transition-all flex items-center justify-center"><i class="fa-solid fa-eye"></i></button>
          </div>
       </div>
    </div>
  `
})
export class PatientDashboardComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);
}
