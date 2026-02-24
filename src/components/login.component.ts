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
      <!-- Left Side: Hospital Image -->
      <div class="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-900/30 mixed-blend-multiply z-10"></div>
        <img src="assets/hospital.jpg" alt="Hospital Building" class="w-full h-full object-cover animate-fade-in">
        <div class="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to MedCore</h1>
          <p class="text-xl text-blue-100 max-w-lg drop-shadow-md">Advanced Healthcare Management System providing world-class patient care and administrative efficiency.</p>
        </div>
      </div>

      <!-- Right Side: Auth Form -->
      <div class="w-full lg:w-1/2 h-full overflow-y-auto bg-white relative custom-scrollbar">
        <div class="min-h-full flex flex-col items-center justify-center p-8">
          <div class="w-full max-w-md space-y-8 relative z-10 animate-slide-up">
            
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform duration-300">
                <i class="fa-solid fa-heart-pulse text-4xl"></i>
              </div>
              <h2 class="text-3xl font-bold text-slate-800 tracking-tight">
                {{ isRegistering() ? 'Create Account' : 'Sign In' }}
              </h2>
              <p class="text-slate-500 mt-2">
                {{ isRegistering() ? 'Join the MedCore healthcare network' : 'Access your MedCore dashboard' }}
              </p>
            </div>

            <!-- View: Landing (Select Role Type) -->
            @if (currentView() === 'landing') {
              <div class="space-y-6 pt-4">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Select User Type</p>
                <button (click)="setView('patient')"
                  class="w-full flex flex-col items-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                  <div class="w-16 h-16 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i class="fa-solid fa-user-injured text-3xl"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 group-hover:text-primary transition-colors">Patient Portal</h3>
                  <p class="text-sm text-slate-500 text-center mt-2">Access medical records, appointments, and prescriptions</p>
                </button>

                <button (click)="setView('admin')"
                  class="w-full flex flex-col items-center p-8 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                  <div class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i class="fa-solid fa-shield-halved text-3xl"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 group-hover:text-primary transition-colors">Hospital Administrator</h3>
                  <p class="text-sm text-slate-500 text-center mt-2">Oversee staff, manage resources, and system settings</p>
                </button>
              </div>
            }

            <!-- View: Login / Register Form -->
            @if (currentView() !== 'landing') {
              <div class="space-y-4 pt-4">
                <button (click)="setView('landing')" class="flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
                  <i class="fa-solid fa-arrow-left mr-2"></i> Role Selection
                </button>

                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 class="text-lg font-bold text-slate-700 mb-4 text-center">
                    {{ currentView() === 'admin' ? 'Hospital Head' : 'Patient' }} {{ isRegistering() ? 'Registration' : 'Login' }}
                  </h3>
                  
                  <form (submit)="onSubmit($event)" class="space-y-4">
                    @if (isRegistering()) {
                      <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input type="text" [ngModel]="fullName()" (ngModelChange)="fullName.set($event)" name="fullName" 
                          class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="Dr. John Doe / Jane Smith" required>
                      </div>
                    }

                    <div>
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" 
                        class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="email@example.com" required>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                      <input type="password" [ngModel]="password()" (ngModelChange)="password.set($event)" name="password"
                        class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="••••••••" required>
                    </div>

                    @if (errorMessage()) {
                      <div class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                        {{ errorMessage() }}
                      </div>
                    }

                    <button type="submit" [disabled]="loading()"
                      class="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/30 mt-2 disabled:opacity-50">
                      {{ loading() ? 'Processing...' : (isRegistering() ? 'Create Account' : 'Sign In') }}
                    </button>
                  </form>

                  <div class="mt-6 text-center text-sm">
                    <span class="text-slate-500">{{ isRegistering() ? 'Already have an account?' : "Don't have an account?" }}</span>
                    <button (click)="isRegistering.set(!isRegistering())" class="ml-2 font-bold text-primary hover:underline">
                      {{ isRegistering() ? 'Sign In Instead' : 'Create One Now' }}
                    </button>
                  </div>
                </div>
              </div>
            }
            
            <div class="mt-12 text-center">
              <p class="text-xs text-slate-400 font-medium">&copy; 2026 MedCore Systems. Secure Access Portal.</p>
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

  isRegistering = signal(false);
  email = signal('');
  password = signal('');
  fullName = signal('');
  errorMessage = signal('');
  loading = signal(false);

  setView(view: LoginView) {
    this.currentView.set(view);
    this.resetForm();
  }

  resetForm() {
    this.email.set('');
    this.password.set('');
    this.fullName.set('');
    this.errorMessage.set('');
    this.isRegistering.set(false);
    this.loading.set(false);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.email() || !this.password() || (this.isRegistering() && !this.fullName())) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    this.loading.set(true);
    try {
      // Create a timeout promise that rejects after 15 seconds
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      );

      if (this.isRegistering()) {
        const role = this.currentView() === 'admin' ? 'Admin' : 'Patient';
        // Race between signup and timeout
        await Promise.race([
          this.auth.signup(this.email(), this.password(), this.fullName(), role),
          timeout
        ]);
      } else {
        await Promise.race([
          this.auth.login(this.email(), this.password()),
          timeout
        ]);
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      if (error.message === 'timeout') {
        this.errorMessage.set('Request timed out. Please check your internet connection.');
      } else {
        this.errorMessage.set(this.getFriendlyErrorMessage(error.code || error.message));
      }
    } finally {
      this.loading.set(false);
    }
  }

  private getFriendlyErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'An account already exists with this email.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      default: return 'Authentication failed. Please try again.';
    }
  }
}