import { Component, inject, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillItem } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Billing & Invoices</h2>
          <p class="text-slate-500 mt-1">Manage financial records and patient billing.</p>
        </div>
        @if (auth.currentUser()?.role !== 'Patient') {
          <button (click)="openCreateInvoiceModal()" class="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center gap-2 font-medium">
            <i class="fa-solid fa-plus"></i> Create Invoice
          </button>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-file-invoice text-primary"></i> Total Billed
           </div>
           <div class="text-3xl font-black text-slate-800 transition-colors group-hover:text-primary">₹ {{ totalBilled() | number:'1.2-2' }}</div>
        </div>
         <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-circle-check text-success"></i> Received
           </div>
           <div class="text-3xl font-black text-success">₹ {{ totalReceived() | number:'1.2-2' }}</div>
        </div>
         <div class="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 card-hover group">
           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
             <i class="fa-solid fa-clock-rotate-left text-danger"></i> Pending
           </div>
           <div class="text-3xl font-black text-danger">₹ {{ totalPending() | number:'1.2-2' }}</div>
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
             @for (bill of filteredBills(); track bill.id) {
               <tr class="hover:bg-slate-50 transition-colors group">
                 <td class="px-8 py-5 font-bold text-primary group-hover:scale-105 transition-transform inline-block mt-4 ml-4">#{{ bill.id }}</td>
                 <td class="px-8 py-5 font-bold text-slate-800">{{ getPatientName(bill.patientId) }}</td>
                 <td class="px-8 py-5 font-medium text-slate-500">{{ bill.date }}</td>
                 <td class="px-8 py-5 font-black text-slate-800">
                    <div>₹ {{ bill.amount.toFixed(2) }}</div>
                    @if(bill.items && bill.items.length) {
                       <div class="text-[10px] text-slate-400 font-medium">{{ bill.items.length }} item(s)</div>
                    }
                 </td>
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
                 <td class="px-8 py-5 text-right space-x-2">
                   @if (auth.currentUser()?.role === 'Patient' && bill.status !== 'Paid') {
                     <button (click)="payBill(bill.id!)" class="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                       Pay Now
                     </button>
                   }
                   <button class="bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                     <i class="fa-solid fa-download mr-1.5"></i> PDF
                   </button>
                 </td>
               </tr>
             }
          </tbody>
        </table>
      </div>

      <!-- Create Invoice Modal -->
      @if (showCreateModal) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up border border-slate-100">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 class="font-bold text-xl text-slate-800">Create New Invoice</h3>
              <button (click)="closeCreateInvoiceModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <!-- Patient Selection -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 class="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Bill To</h4>
                  <select [(ngModel)]="newBill.patientId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    <option value="">Select Patient...</option>
                    @for (patient of dataService.patients(); track patient.id) {
                      <option [value]="patient.id">{{ patient.name }} ({{ patient.id }})</option>
                    }
                  </select>
                </div>

                <!-- Invoice Details -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 class="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Invoice Details</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Status</label>
                      <select [(ngModel)]="newBill.status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Date</label>
                      <input type="date" [(ngModel)]="newBill.date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Line Items -->
              <div class="bg-white p-6 rounded-2xl border border-slate-200">
                <div class="flex justify-between items-center mb-6">
                  <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest">Line Items</h4>
                  <button (click)="addItem()" class="text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                    <i class="fa-solid fa-plus mr-1"></i> Add Item
                  </button>
                </div>
                
                <div class="space-y-4">
                  <!-- Headers -->
                  <div class="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    <div class="col-span-5">Description</div>
                    <div class="col-span-2 text-right">Qty</div>
                    <div class="col-span-2 text-right">Price (₹)</div>
                    <div class="col-span-2 text-right">Total</div>
                    <div class="col-span-1"></div>
                  </div>

                  <!-- Rows -->
                  @for (item of newBill.items; track item.id; let i = $index) {
                    <div class="grid grid-cols-12 gap-4 items-center bg-slate-50 p-2 rounded-xl border border-slate-100 group">
                      <div class="col-span-5">
                        <input [(ngModel)]="item.description" type="text" placeholder="Service or Item Description" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none">
                      </div>
                      <div class="col-span-2">
                        <input [(ngModel)]="item.quantity" (ngModelChange)="updateItemTotal(item)" type="number" min="1" class="w-full text-right bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none">
                      </div>
                      <div class="col-span-2">
                        <input [(ngModel)]="item.unitPrice" (ngModelChange)="updateItemTotal(item)" type="number" min="0" step="0.01" class="w-full text-right bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none">
                      </div>
                      <div class="col-span-2 text-right font-bold text-slate-800 text-sm">
                        {{ item.total.toFixed(2) }}
                      </div>
                      <div class="col-span-1 text-center">
                        <button (click)="removeItem(i)" class="w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </div>
                  }
                  @if (newBill.items.length === 0) {
                    <div class="text-center py-8 text-slate-400 text-sm italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No items added to this invoice yet.
                    </div>
                  }
                </div>

                <!-- Totals -->
                <div class="mt-8 border-t border-slate-100 pt-6 flex justify-end">
                  <div class="w-64 space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-500 font-medium">Subtotal</span>
                      <span class="font-bold text-slate-800">₹ {{ calculatedSubtotal.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-500 font-medium">Tax (5%)</span>
                      <span class="font-bold text-slate-800">₹ {{ calculatedTax.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-lg pt-3 border-t border-slate-100">
                      <span class="font-bold text-slate-800">Total</span>
                      <span class="font-black text-primary">₹ {{ calculatedTotal.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-8 py-6 bg-white flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button (click)="closeCreateInvoiceModal()" class="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button (click)="saveInvoice()" [disabled]="!newBill.patientId" class="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">Generate Invoice</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BillingComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);

  showCreateModal = false;

  filteredBills = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    const bills = this.dataService.bills();
    if (user.role === 'Patient') {
      return bills.filter(b => b.patientId === user.id);
    }
    return bills;
  });

  totalBilled = computed(() => this.filteredBills().reduce((sum, b) => sum + b.amount, 0));
  totalReceived = computed(() => this.filteredBills().filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0));
  totalPending = computed(() => this.totalBilled() - this.totalReceived());

  newBill: {
    patientId: string;
    date: string;
    status: 'Paid' | 'Unpaid' | 'Pending';
    items: BillItem[];
  } = this.getInitialBillState();

  getPatientName(id: string) {
    return this.dataService.patients().find(p => p.id === id)?.name || id;
  }

  getInitialBillState() {
    const today = new Date().toISOString().split('T')[0];
    return {
      patientId: '',
      date: today,
      status: 'Pending' as const,
      items: []
    };
  }

  openCreateInvoiceModal() {
    this.newBill = this.getInitialBillState();
    this.addItem(); // add one empty row by default
    this.showCreateModal = true;
  }

  closeCreateInvoiceModal() {
    this.showCreateModal = false;
  }

  addItem() {
    this.newBill.items.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    });
  }

  removeItem(index: number) {
    this.newBill.items.splice(index, 1);
  }

  updateItemTotal(item: BillItem) {
    item.total = item.quantity * item.unitPrice;
  }

  get calculatedSubtotal() {
    return this.newBill.items.reduce((sum, item) => sum + item.total, 0);
  }

  get calculatedTax() {
    return this.calculatedSubtotal * 0.05; // 5% tax assumed
  }

  get calculatedTotal() {
    return this.calculatedSubtotal + this.calculatedTax;
  }

  async saveInvoice() {
    if (!this.newBill.patientId) return;

    await this.dataService.createBill({
      patientId: this.newBill.patientId,
      patientName: this.getPatientName(this.newBill.patientId),
      items: this.newBill.items,
      subtotal: this.calculatedSubtotal,
      tax: this.calculatedTax,
      amount: this.calculatedTotal,
      status: this.newBill.status,
      date: this.newBill.date
    });

    this.closeCreateInvoiceModal();
  }

  async payBill(billId: string) {
    if (confirm('Are you sure you want to pay this bill?')) {
      await this.dataService.updateBillStatus(billId, 'Paid');
      alert('Payment successful!');
    }
  }
}