import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-receptionist-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Quick Actions -->
      <div class="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
        <div class="absolute right-0 bottom-0 p-12 opacity-5 -mb-6 -mr-6 transition-transform group-hover:scale-110"><i class="fa-solid fa-hospital-user text-[15rem]"></i></div>
        <h3 class="text-3xl font-black mb-4 leading-tight">Front Desk<br>Operations</h3>
        <p class="text-slate-400 mb-10 text-sm font-medium max-w-xs leading-relaxed">Streamline patient admissions and coordinate medical staff schedules effortlessly.</p>
        <div class="flex flex-wrap gap-4 relative z-10">
          <a routerLink="/app/patients" class="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40 hover:bg-blue-700 transition-all flex items-center gap-3">
            <i class="fa-solid fa-user-plus text-sm"></i> New Patient
          </a>
          <a routerLink="/app/appointments" class="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3">
            <i class="fa-solid fa-calendar-plus text-sm"></i> Booking
          </a>
        </div>
      </div>

      <!-- Doctor Status Board -->
      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col h-full max-h-[420px]">
         <div class="flex justify-between items-center mb-8 shrink-0">
            <h3 class="font-black text-lg text-slate-800 uppercase tracking-widest">Medical Staff Roster</h3>
            <span class="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">Live Status</span>
         </div>
         <div class="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
           @for (doc of dataService.doctors(); track doc.id) {
             <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-primary/20 hover:bg-slate-50 transition-all group">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black shrink-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary">{{ doc.name.charAt(0) }}</div>
                 <div>
                   <div class="font-black text-slate-800 text-sm leading-tight">{{ doc.name }}</div>
                   <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ doc.department }}</div>
                 </div>
               </div>
               <div class="text-[10px] font-black px-3 py-1.5 rounded-xl border tracking-widest shrink-0" 
                 [class.bg-green-50]="doc.available" [class.text-success]="doc.available" [class.border-success/20]="doc.available"
                 [class.bg-red-50]="!doc.available" [class.text-danger]="!doc.available" [class.border-danger/20]="!doc.available">
                 {{ doc.available ? 'AVAILABLE' : 'OFF DUTY' }}
               </div>
             </div>
           }
         </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
        <div class="flex items-center gap-6">
           <div class="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors group-hover:bg-primary group-hover:text-white"><i class="fa-solid fa-check-to-slot"></i></div>
           <div>
             <div class="text-4xl font-black text-slate-800">14</div>
             <div class="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Check-ins Today</div>
           </div>
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
        <div class="flex items-center gap-6">
           <div class="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors group-hover:bg-pink-500 group-hover:text-white"><i class="fa-solid fa-phone"></i></div>
           <div>
             <div class="text-4xl font-black text-slate-800">08</div>
             <div class="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Pending Inquiries</div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ReceptionistDashboardComponent {
    dataService = inject(DataService);
}
