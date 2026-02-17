import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="h-screen w-full flex flex-col items-center justify-center bg-white text-center p-6 animate-fade-in">
      <div class="w-24 h-24 bg-blue-50 text-primary rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">
        <i class="fa-solid fa-file-circle-question"></i>
      </div>
      <h1 class="text-4xl font-black text-slate-800 mb-2">Page Not Found</h1>
      <p class="text-slate-500 font-medium mb-8 max-w-md">The requested resource could not be located or has been moved to a different directory.</p>
      
      <a routerLink="/app/dashboard" class="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
        Return to Dashboard
      </a>
    </div>
  `
})
export class NotFoundComponent { }
