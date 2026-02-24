import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User as FirebaseUser, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { DataService } from './data.service';

export type UserRole = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private dataService = inject(DataService);

  currentUser = signal<User | null>(null);

  constructor() {
    // Listen to Firebase Auth state
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser) {
        await this.loadUserProfile(fbUser);
      } else {
        this.currentUser.set(null);
        localStorage.removeItem('medcore_user');
      }
    });

    // Initial load from local storage for faster UI feedback
    const savedUser = localStorage.getItem('medcore_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medcore_user');
      }
    }
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    await this.loadUserProfile(credential.user);
    this.router.navigate(['/app/dashboard']);
  }

  async signup(email: string, password: string, name: string, role: UserRole) {
    console.log('Starting signup process...');
    try {
      console.log('Creating user in Firebase Auth...');
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User created:', credential.user.uid);

      const userProfile: User = {
        id: credential.user.uid,
        name,
        role,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
      };

      console.log('Saving user profile to Firestore...');
      // Store in Firestore
      await setDoc(doc(this.firestore, `users/${credential.user.uid}`), userProfile);
      console.log('User profile saved successfully.');

      this.currentUser.set(userProfile);
      localStorage.setItem('medcore_user', JSON.stringify(userProfile));

      // Also create a patient record if role is Patient
      if (role === 'Patient') {
        console.log('Creating initial patient record for', name);
        await this.dataService.addPatient({
          id: credential.user.uid,
          name: name,
          age: 0,
          gender: 'Not specified',
          contact: email,
          condition: 'New Registration',
          admitted: false
        });
      }

      console.log('Navigating to dashboard...');
      this.router.navigate(['/app/dashboard']);
    } catch (error) {
      console.error('Signup error details:', error);
      throw error;
    }
  }

  private async loadUserProfile(fbUser: FirebaseUser) {
    const userDoc = await getDoc(doc(this.firestore, `users/${fbUser.uid}`));
    if (userDoc.exists()) {
      const profile = userDoc.data() as User;
      this.currentUser.set(profile);
      localStorage.setItem('medcore_user', JSON.stringify(profile));
    }
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser.set(null);
    localStorage.removeItem('medcore_user');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }
}