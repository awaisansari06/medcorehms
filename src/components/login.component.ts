import { Component, inject } from '@angular/core';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="h-screen w-full flex bg-slate-50 overflow-hidden">
      <!-- Left Side: Hospital Image (Hidden on mobile) -->
      <div class="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-900/30 mixed-blend-multiply z-10"></div>
        <img src="assets/hospital.jpg" alt="Hospital Building" class="w-full h-full object-cover animate-fade-in">
        
        <!-- Overlay Text -->
        <div class="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to MedCore</h1>
          <p class="text-xl text-blue-100 max-w-lg drop-shadow-md">Advanced Healthcare Management System providing world-class patient care and administrative efficiency.</p>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full lg:w-1/2 h-full overflow-y-auto bg-white relative custom-scrollbar">
        <div class="min-h-full flex flex-col items-center justify-center p-8">
          <!-- Decorational Blobs for the form side -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div class="w-full max-w-md space-y-8 relative z-10 animate-slide-up">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform duration-300">
              <i class="fa-solid fa-heart-pulse text-4xl"></i>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Sign In</h2>
            <p class="text-slate-500 mt-2">Access your MedCore dashboard</p>
          </div>

          <div class="space-y-4 pt-4">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Select Role to Continue</p>
            @for (role of roles; track role) {
              <button (click)="login(role)"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden">
                <div class="flex items-center gap-4 relative z-10">
                  <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                    <i class="fa-solid" [class]="getRoleIcon(role)"></i>
                  </div>
                  <span class="font-medium text-slate-700 group-hover:text-primary transition-colors text-lg">{{ role }}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300 group-hover:text-primary transition-colors relative z-10">
                  <span class="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">Login</span>
                  <i class="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                </div>
                <!-- Hover Effect Background -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            }
          </div>
          
          <div class="mt-12 text-center">
            <p class="text-xs text-slate-400 font-medium">
              &copy; 2026 MedCore Systems. Secure Access Portal.
            </p>
          </div>
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