import { Component, inject, signal } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type LoginView = 'landing' | 'admin' | 'patient';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            
            <!-- Header -->
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform duration-300">
                <i class="fa-solid fa-heart-pulse text-4xl"></i>
              </div>
              <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Sign In</h2>
              <p class="text-slate-500 mt-2">Access your MedCore dashboard</p>
            </div>

            <!-- View: Landing (Select Role Type) -->
            @if (currentView() === 'landing') {
              <div class="space-y-6 pt-4">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Select User Type</p>
                
                <!-- Patient Option -->
                <button (click)="setView('patient')"
                  class="w-full flex flex-col items-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                  <div class="w-16 h-16 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i class="fa-solid fa-user-injured text-3xl"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 group-hover:text-primary transition-colors">Patient Login</h3>
                  <p class="text-sm text-slate-500 text-center mt-2">Access medical records, appointments, and prescriptions</p>
                </button>

                <!-- Admin Option -->
                <button (click)="setView('admin')"
                  class="w-full flex flex-col items-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                  <div class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i class="fa-solid fa-shield-halved text-3xl"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 group-hover:text-primary transition-colors">Admin Login</h3>
                  <p class="text-sm text-slate-500 text-center mt-2">Manage hospital resources, staff, and system settings</p>
                </button>
              </div>
            }

            <!-- View: Login Form -->
            @if (currentView() !== 'landing') {
              <div class="space-y-4 pt-4">
                <button (click)="setView('landing')" class="flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
                  <i class="fa-solid fa-arrow-left mr-2"></i> Back to Role Selection
                </button>

                <!-- Login Form -->
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 class="text-lg font-bold text-slate-700 mb-4 text-center">
                    {{ currentView() === 'admin' ? 'Administrator' : 'Patient' }} Login
                  </h3>
                  
                  <form (submit)="onSubmit($event)" class="space-y-4">
                    <div>
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                      <input type="text" [(ngModel)]="username" name="username" 
                        class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Enter username" required>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                      <input type="password" [(ngModel)]="password" name="password"
                        class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="••••••••" required>
                    </div>

                    @if (errorMessage) {
                      <div class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                        {{ errorMessage }}
                      </div>
                    }

                    <button type="submit" 
                      class="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/30 mt-2">
                      Sign In
                    </button>
                  </form>
                </div>

                <!-- Demo Accounts section -->
                <div class="mt-8">
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                    Demo Accounts (Click to Auto-fill)
                  </p>

                  <div class="grid gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    @for (user of (currentView() === 'admin' ? mockAdmins : mockPatients); track user.id) {
                      <button (click)="fillCredentials(user)"
                        class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-primary/50 hover:bg-slate-50 transition-all duration-200 text-left group">
                        <img [src]="user.avatar" [alt]="user.name" class="w-8 h-8 rounded-full bg-slate-100 object-cover border border-slate-200">
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-sm text-slate-700 group-hover:text-primary truncate">{{ user.name }}</h4>
                          <div class="flex gap-3 text-xs text-slate-500 mt-0.5">
                            <span class="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">User: <span class="font-mono text-slate-700">{{ getUsername(user) }}</span></span>
                            <span class="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Pass: <span class="font-mono text-slate-700">password123</span></span>
                          </div>
                        </div>
                        <i class="fa-solid fa-arrow-turn-up text-slate-300 group-hover:text-primary rotate-90 transform transition-colors"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
            
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
  currentView = signal<LoginView>('landing');

  username = '';
  password = '';
  errorMessage = '';

  // Mock Data
  mockAdmins: User[] = [
    { id: 'A001', name: 'Dr. Sarah Smith', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=0f172a&color=fff' },
    { id: 'A002', name: 'James Wilson', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=334155&color=fff' },
    { id: 'A003', name: 'Maria Rodriguez', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=475569&color=fff' }
  ];

  mockPatients: User[] = [
    { id: 'P001', name: 'Rajesh Kumar', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=ef4444&color=fff' },
    { id: 'P002', name: 'Anita Desai', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Anita+Desai&background=f97316&color=fff' },
    { id: 'P003', name: 'Vikram Singh', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff' },
    { id: 'P004', name: 'Priya Patel', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=84cc16&color=fff' },
    { id: 'P005', name: 'Amit Shah', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Amit+Shah&background=10b981&color=fff' },
    { id: 'P006', name: 'Sneha Gupta', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=06b6d4&color=fff' },
    { id: 'P007', name: 'Rahul Verma', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=3b82f6&color=fff' },
    { id: 'P008', name: 'Kavita Sharma', role: 'Patient', avatar: 'https://ui-avatars.com/api/?name=Kavita+Sharma&background=6366f1&color=fff' }
  ];

  setView(view: LoginView) {
    this.currentView.set(view);
    this.resetForm();
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }

  // Generate a mock username based on the name (e.g., Sarah Smith -> sarah.smith)
  getUsername(user: User): string {
    return user.name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace('dr..', '');
  }

  fillCredentials(user: User) {
    this.username = this.getUsername(user);
    this.password = 'password123'; // Dummy password
    this.errorMessage = '';
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    const currentList = this.currentView() === 'admin' ? this.mockAdmins : this.mockPatients;
    const user = currentList.find(u => this.getUsername(u) === this.username.toLowerCase());

    if (user) {
      // Success
      this.auth.loginUser(user);
    } else {
      // Error
      this.errorMessage = 'Invalid username or password';
    }
  }
}