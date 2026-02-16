import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex items-center card-hover group">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mr-3 text-xl transition-colors group-hover:bg-primary group-hover:text-white shrink-0"><i class="fa-solid fa-users"></i></div>
        <div class="min-w-0">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">Patients</div>
          <div class="text-2xl font-bold text-slate-800 leading-none truncate">{{ dataService.stats().totalPatients }}</div>
        </div>
      </div>
      <div class="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex items-center card-hover group">
        <div class="w-12 h-12 rounded-2xl bg-green-50 text-success flex items-center justify-center mr-3 text-xl transition-colors group-hover:bg-success group-hover:text-white shrink-0"><i class="fa-solid fa-user-doctor"></i></div>
        <div class="min-w-0">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">Medical Staff</div>
          <div class="text-2xl font-bold text-slate-800 leading-none truncate">{{ dataService.doctors().length }}</div>
        </div>
      </div>
       <div class="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex items-center card-hover group">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mr-3 text-xl transition-colors group-hover:bg-amber-500 group-hover:text-white shrink-0"><i class="fa-solid fa-clock-rotate-left"></i></div>
        <div class="min-w-0">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">Avg. Wait</div>
          <div class="text-2xl font-bold text-slate-800 leading-none truncate">12m</div>
        </div>
      </div>
        <div class="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex items-center card-hover group">
         <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-xl transition-colors group-hover:bg-indigo-600 group-hover:text-white shrink-0"><i class="fa-solid fa-wallet"></i></div>
         <div class="min-w-0">
           <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">Revenue</div>
           <div class="text-2xl font-bold text-slate-800 leading-none truncate">{{ '₹' + (dataService.stats().totalRevenue | number:'1.0-0') }}</div>
         </div>
       </div>
     </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
       <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
         <div class="flex justify-between items-center mb-8">
           <h3 class="font-bold text-xl text-slate-800">Hospital Capacity</h3>
           <span class="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
         </div>
         <div class="space-y-8">
           <div>
             <div class="flex items-center justify-between text-sm mb-2">
               <span class="font-bold text-slate-600">General Ward</span>
               <span class="font-black text-primary">85%</span>
             </div>
             <div class="w-full bg-slate-50 rounded-full h-3">
               <div class="bg-primary h-3 rounded-full shadow-glow-sm" style="width: 85%"></div>
             </div>
           </div>

           <div>
             <div class="flex items-center justify-between text-sm mb-2">
               <span class="font-bold text-slate-600">ICU Units</span>
               <span class="font-black text-danger">92%</span>
             </div>
             <div class="w-full bg-slate-50 rounded-full h-3">
               <div class="bg-danger h-3 rounded-full shadow-glow-sm" style="width: 92%"></div>
             </div>
           </div>
           
           <div>
             <div class="flex items-center justify-between text-sm mb-2">
               <span class="font-bold text-slate-600">Emergency</span>
               <span class="font-black text-amber-500">60%</span>
             </div>
             <div class="w-full bg-slate-50 rounded-full h-3">
               <div class="bg-amber-500 h-3 rounded-full" style="width: 60%"></div>
             </div>
           </div>
         </div>
       </div>

       <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-bold text-xl text-slate-800">Recent Appointments</h3>
            <a routerLink="/app/appointments" class="text-xs font-black text-primary uppercase tracking-widest hover:underline">See All</a>
          </div>
          <div class="space-y-4">
             @for(app of recentAppointments; track app.id) {
               <div class="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                 <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 uppercase">{{ app.type.charAt(0) }}</div>
                   <div>
                      <div class="font-bold text-slate-800">{{ app.type }}</div>
                      <div class="text-xs text-slate-400 font-medium">{{ app.date }} at {{ app.time }}</div>
                   </div>
                 </div>
                 <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider" 
                   [class.bg-green-100]="app.status === 'Completed'" [class.text-green-700]="app.status === 'Completed'"
                   [class.bg-blue-100]="app.status === 'Scheduled'" [class.text-blue-700]="app.status === 'Scheduled'">
                   {{ app.status }}
                 </span>
               </div>
             }
          </div>
       </div>
    </div>
  `
})
export class AdminDashboardComponent {
    dataService = inject(DataService);

    get recentAppointments() {
        return this.dataService.appointments().slice(0, 5);
    }
}
