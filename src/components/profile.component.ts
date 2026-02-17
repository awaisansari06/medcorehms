import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">My Profile</h2>
        <p class="text-slate-500 mt-1">Manage your account details.</p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/3 space-y-6">
           <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col items-center text-center">
              <div class="relative mb-6">
                <img [src]="auth.currentUser()?.avatar" class="w-32 h-32 rounded-3xl shadow-lg object-cover">
                <button class="absolute bottom-[-10px] right-[-10px] w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all border-4 border-white">
                  <i class="fa-solid fa-camera"></i>
                </button>
              </div>
              <h3 class="text-xl font-bold text-slate-800">{{ auth.currentUser()?.name }}</h3>
              <p class="text-sm font-bold text-primary uppercase tracking-wider mt-1">{{ auth.currentUser()?.role }}</p>
           </div>

           <div class="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h4>
              <div class="space-y-4">
                 <div class="flex justify-between items-center">
                   <span class="text-sm font-semibold text-slate-600">Member Since</span>
                   <span class="text-sm font-bold text-slate-800">Oct 2023</span>
                 </div>
                 <div class="flex justify-between items-center">
                   <span class="text-sm font-semibold text-slate-600">Last Login</span>
                   <span class="text-sm font-bold text-slate-800">Today, 9:00 AM</span>
                 </div>
              </div>
           </div>
        </div>

        <div class="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
           <h3 class="font-bold text-xl text-slate-800 mb-6">Personal Information</h3>
           <form class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Full Name</label>
                  <input type="text" [value]="auth.currentUser()?.name" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
               </div>
               <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                  <input type="email" value="user@medcore.com" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
               </div>
               <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Phone</label>
                  <input type="tel" value="+1 234 567 890" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
               </div>
               <div>
                  <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Location</label>
                  <input type="text" value="New York, USA" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
               </div>
             </div>
             
             <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Bio</label>
                <textarea rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">Experienced healthcare professional dedicated to patient care.</textarea>
             </div>

             <div class="pt-6 border-t border-slate-100 flex justify-end">
                <button type="button" class="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Changes</button>
             </div>
           </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
    auth = inject(AuthService);
}
