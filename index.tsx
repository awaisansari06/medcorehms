
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCEDSzNjxqdP_Cl8w2HwUCQfBUEyi-Oc9Y",
  authDomain: "hm-system-awee.firebaseapp.com",
  projectId: "hm-system-awee",
  storageBucket: "hm-system-awee.firebasestorage.app",
  messagingSenderId: "208875646318",
  appId: "1:208875646318:web:c66321ac3d9a180ff0a57f"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
