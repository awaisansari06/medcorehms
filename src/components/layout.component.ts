import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-white font-sans overflow-hidden">
      <!-- Sidebar -->
      <aside [class.w-72]="isSidebarOpen()" [class.w-20]="!isSidebarOpen()" 
        class="bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        <div class="h-20 flex items-center px-6 gap-4 border-b border-slate-50">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100/50">
            <i class="fa-solid fa-notes-medical text-white text-xl"></i>
          </div>
          <span class="font-bold text-xl text-slate-800 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300"
            [class.opacity-0]="!isSidebarOpen()" [class.w-0]="!isSidebarOpen()">
            MedCore <span class="text-primary">HMS</span>
          </span>
        </div>

        <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          @for (item of menuItems; track item.path) {
            @if (canAccess(item)) {
              <a [routerLink]="item.path" routerLinkActive="bg-blue-50 text-primary" 
                class="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group hover:bg-slate-50 relative overflow-hidden">
                <div class="w-10 h-10 flex items-center justify-center shrink-0">
                  <i [class]="item.icon + ' text-lg transition-transform group-hover:scale-110'"></i>
                </div>
                <span class="font-bold text-sm whitespace-nowrap transition-all duration-300 text-slate-600 group-hover:text-slate-900"
                  [class.opacity-0]="!isSidebarOpen()" [class.w-0]="!isSidebarOpen()">
                  {{ item.label }}
                </span>
                <!-- Active Indicator -->
                <div class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full transition-all duration-300 scale-y-0 router-link-active:scale-y-100"></div>
              </a>
            }
          }
        </nav>

        <div class="p-4 border-t border-slate-50">
           <button (click)="auth.logout()" 
             class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all group font-bold">
             <div class="w-10 h-10 flex items-center justify-center shrink-0">
               <i class="fa-solid fa-right-from-bracket text-lg"></i>
             </div>
             <span class="text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
               [class.opacity-0]="!isSidebarOpen()" [class.w-0]="!isSidebarOpen()">Sign Out</span>
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-white relative">
        <!-- Header -->
        <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-8 sticky top-0 z-20">
          <div class="flex items-center gap-6">
            <button (click)="toggleSidebar()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">
              <i class="fa-solid" [class.fa-indent]="!isSidebarOpen()" [class.fa-outdent]="isSidebarOpen()"></i>
            </button>
            <div class="hidden lg:block">
              <h1 class="text-lg font-bold text-slate-800 tracking-tight">{{ greeting() }}</h1>
              <p class="text-xs text-slate-400 font-medium tracking-tight">Have a productive day at MedCore.</p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100/50">
              <div class="text-right hidden sm:block">
                <div class="text-sm font-bold text-slate-800 leading-tight">{{ auth.currentUser()?.name }}</div>
                <div class="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{{ auth.currentUser()?.role }}</div>
              </div>
              <img [src]="auth.currentUser()?.avatar" class="w-11 h-11 rounded-xl border-2 border-white shadow-sm object-cover bg-white">
            </div>
          </div>
        </header>

        <!-- Dynamic Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div class="max-w-7xl mx-auto">
             <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `
})
export class LayoutComponent {
  auth = inject(AuthService);
  isSidebarOpen = signal(true);

  menuItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: 'fa-solid fa-chart-line', roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'] },
    { label: 'Patients', path: '/app/patients', icon: 'fa-solid fa-hospital-user', roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist'] },
    { label: 'Doctors', path: '/app/doctors', icon: 'fa-solid fa-user-doctor', roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'] },
    { label: 'Appointments', path: '/app/appointments', icon: 'fa-solid fa-calendar-check', roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'] },
    { label: 'Billing', path: '/app/billing', icon: 'fa-solid fa-file-invoice-dollar', roles: ['Admin', 'Receptionist', 'Patient'] }
  ];

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  canAccess(item: any) {
    const role = this.auth.currentUser()?.role;
    return role && item.roles.includes(role);
  }

  greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}