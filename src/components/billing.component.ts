import { Component, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Billing & Invoices</h2>
          <p class="text-slate-500 mt-1">Manage financial records and patient billing.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-file-invoice text-primary"></i> Total Billed
           </div>
           <div class="text-3xl font-black text-slate-800 transition-colors group-hover:text-primary">₹ 2,22,500.00</div>
        </div>
         <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-circle-check text-success"></i> Received
           </div>
           <div class="text-3xl font-black text-success">₹ 15,000.00</div>
        </div>
         <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-clock-rotate-left text-danger"></i> Pending
           </div>
           <div class="text-3xl font-black text-danger">₹ 2,07,500.00</div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
         <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
             <tr>
               <th class="px-8 py-5">Invoice ID</th>
               <th class="px-8 py-5">Patient Details</th>
               <th class="px-8 py-5">Billing Date</th>
               <th class="px-8 py-5">Total Amount</th>
               <th class="px-8 py-5">Status</th>
               <th class="px-8 py-5"></th>
             </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
             @for (bill of dataService.bills(); track bill.id) {
               <tr class="hover:bg-slate-50 transition-colors group">
                 <td class="px-8 py-5 font-bold text-primary group-hover:scale-105 transition-transform inline-block mt-4 ml-4">#{{ bill.id }}</td>
                 <td class="px-8 py-5 font-bold text-slate-800">{{ getPatientName(bill.patientId) }}</td>
                 <td class="px-8 py-5 font-medium text-slate-500">{{ bill.date }}</td>
                 <td class="px-8 py-5 font-black text-slate-800">₹ {{ bill.amount.toFixed(2) }}</td>
                 <td class="px-8 py-5">
                   <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
                      [class.bg-green-100]="bill.status === 'Paid'" [class.text-green-700]="bill.status === 'Paid'"
                      [class.bg-red-100]="bill.status === 'Unpaid'" [class.text-red-700]="bill.status === 'Unpaid'"
                      [class.bg-amber-100]="bill.status === 'Pending'" [class.text-amber-700]="bill.status === 'Pending'">
                      <span class="w-1.5 h-1.5 rounded-full shadow-glow-sm" 
                        [class.bg-green-500]="bill.status === 'Paid'" 
                        [class.bg-red-500]="bill.status === 'Unpaid'"
                        [class.bg-amber-500]="bill.status === 'Pending'"></span>
                      {{ bill.status }}
                   </span>
                 </td>
                 <td class="px-8 py-5 text-right">
                   <button class="bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                     <i class="fa-solid fa-download mr-1.5"></i> PDF
                   </button>
                 </td>
               </tr>
             }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BillingComponent {
  dataService = inject(DataService);

  getPatientName(id: string) {
    return this.dataService.patients().find(p => p.id === id)?.name || id;
  }
}