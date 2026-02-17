import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 border-l-8 border-l-danger">
        <div class="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Critical Alerts</div>
        <div class="text-5xl font-black text-danger">02</div>
        <div class="mt-4 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">ICU BED 04 • WARD A-12</div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 border-l-8 border-l-primary">
        <div class="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">In-Patients</div>
        <div class="text-5xl font-black text-slate-800">{{ admittedPatients.length }}</div>
        <div class="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Bed occupancy</div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 border-l-8 border-l-success">
        <div class="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Task Queue</div>
        <div class="text-5xl font-black text-slate-800">08</div>
        <div class="mt-4 text-[10px] font-bold text-success uppercase tracking-widest">Medication & Vitals due</div>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 mt-8">
      <div class="flex justify-between items-center mb-10">
        <h3 class="font-black text-2xl text-slate-800 leading-none">Monitoring Dashboard</h3>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-glow-sm"></span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl border border-slate-100">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
            <tr>
              <th class="px-6 py-5">Patient Name</th>
              <th class="px-6 py-5">Diagnosis</th>
              <th class="px-6 py-5">Assigned Ward</th>
              <th class="px-6 py-5">Vitals Status</th>
              <th class="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            @for(patient of admittedPatients; track patient.id) {
              <tr class="hover:bg-slate-50 group transition-colors">
                <td class="px-6 py-5 font-bold text-slate-800">{{ patient.name }}</td>
                <td class="px-6 py-5">
                   <span class="px-2.5 py-1 bg-blue-50 text-primary text-[10px] font-black rounded-lg uppercase border border-blue-100">{{ patient.condition }}</span>
                </td>
                <td class="px-6 py-5 font-semibold text-slate-500">Suite A-{{ patient.id }}</td>
                <td class="px-6 py-5">
                   <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-success"></span>
                      <span class="text-[10px] font-black text-success uppercase">Stable</span>
                   </div>
                </td>
                <td class="px-6 py-5">
                   <button (click)="openVitalsModal(patient)" class="bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-primary transition-all">Log Vitals</button>
                </td>
              </tr>
            }
            @if (admittedPatients.length === 0) {
              <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 font-bold italic uppercase tracking-widest">System idle: No active monitoring required</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (selectedPatient) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
        <div class="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 p-8 shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="font-bold text-xl text-slate-800">Log Vitals</h3>
              <p class="text-xs text-slate-500 font-bold uppercase mt-1">For {{ selectedPatient?.name }}</p>
            </div>
            <button (click)="selectedPatient = null" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div class="space-y-4">
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Blood Pressure</label>
               <input type="text" placeholder="120/80" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
             </div>
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Heart Rate (BPM)</label>
               <input type="number" placeholder="72" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
             </div>
             <div>
               <label class="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Temperature (°C)</label>
               <input type="number" placeholder="36.6" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
             </div>
          </div>

          <div class="mt-8 flex gap-3">
             <button (click)="selectedPatient = null" class="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
             <button (click)="saveVitals()" class="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Log</button>
          </div>
        </div>
      </div>
    }
  `
})
export class NurseDashboardComponent {
  dataService = inject(DataService);
  selectedPatient: any = null;

  get admittedPatients() {
    return this.dataService.patients().filter(p => p.admitted);
  }

  openVitalsModal(patient: any) {
    this.selectedPatient = patient;
  }

  saveVitals() {
    // Here we would call dataService to save
    this.selectedPatient = null;
    alert('Vitals logged successfully');
  }
}
