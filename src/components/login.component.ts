import { Component, inject } from '@angular/core';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="h-screen w-full overflow-y-auto bg-gradient-to-br from-slate-100 to-slate-200 relative p-4 flex flex-col custom-scrollbar">
      <!-- Decorational Blobs (Fixed positioning to avoid scrolling with content) -->
      <div class="fixed top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-fade-in pointer-events-none"></div>
      <div class="fixed bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-fade-in pointer-events-none"></div>

      <div class="flex-1 flex flex-col items-center py-12 relative z-10 min-h-full">
        <div class="my-auto glass-panel bg-white/80 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 backdrop-blur-xl animate-slide-up">
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform duration-300">
              <i class="fa-solid fa-heart-pulse text-4xl"></i>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 tracking-tight">MedCore HMS</h2>
            <p class="text-slate-500 mt-2">Hospital Management System</p>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-1">Select Role to Login</p>
            @for (role of roles; track role) {
              <button (click)="login(role)"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all duration-200 group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                    <i class="fa-solid" [class]="getRoleIcon(role)"></i>
                  </div>
                  <span class="font-medium text-slate-700 group-hover:text-primary transition-colors">{{ role }}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all"></i>
              </button>
            }
          </div>
          
          <div class="mt-8 text-center border-t border-slate-100 pt-6">
            <p class="text-xs text-slate-400">
              &copy; 2026 MedCore Systems. Secure Access Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  roles: UserRole[] = ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'];

  login(role: UserRole) {
    this.auth.login(role);
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case 'Admin': return 'fa-shield-halved';
      case 'Doctor': return 'fa-user-doctor';
      case 'Nurse': return 'fa-user-nurse';
      case 'Receptionist': return 'fa-concierge-bell';
      case 'Patient': return 'fa-user-injured';
      default: return 'fa-user';
    }
  }
}