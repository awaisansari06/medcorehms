import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Settings</h2>
        <p class="text-slate-500 mt-1">Manage your application preferences.</p>
      </div>

      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50">
          <h3 class="font-bold text-lg text-slate-800">Appearance</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-slate-700">Dark Mode</div>
              <div class="text-sm text-slate-500">Enable dark theme for the application</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [checked]="themeService.darkMode()" (change)="themeService.toggleDarkMode()" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-slate-700">Compact Mode</div>
              <div class="text-sm text-slate-500">Reduce padding and font sizes</div>
            </div>
             <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [checked]="themeService.compactMode()" (change)="themeService.toggleCompactMode()" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50">
          <h3 class="font-bold text-lg text-slate-800">Notifications</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-slate-700">Email Notifications</div>
              <div class="text-sm text-slate-500">Receive daily summaries and alerts</div>
            </div>
             <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
           <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-slate-700">Desktop Alerts</div>
              <div class="text-sm text-slate-500">Show popup notifications for urgent tasks</div>
            </div>
             <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50">
          <h3 class="font-bold text-lg text-slate-800">Security</h3>
        </div>
         <div class="p-6">
           <button class="bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">Change Password</button>
         </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  themeService = inject(ThemeService);
}
