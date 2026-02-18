import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Patient';

export interface User {
  id: string; // Links to DataService IDs (e.g., P001, D001)
  name: string;
  role: UserRole;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    // Load user from session storage on init
    const savedUser = localStorage.getItem('medcore_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medcore_user');
      }
    }
  }

  login(role: UserRole) {
    // Map roles to specific mock data IDs for a better demo experience
    let mockUser: User;

    switch (role) {
      case 'Patient':
        mockUser = {
          id: 'P001', // Rajesh Kumar
          name: 'Rajesh Kumar',
          role: 'Patient',
          avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4f46e5&color=fff'
        };
        break;
      case 'Doctor':
        mockUser = {
          id: 'D001', // Dr. Aryan Kapoor
          name: 'Dr. Aryan Kapoor',
          role: 'Doctor',
          avatar: 'https://ui-avatars.com/api/?name=Aryan+Kapoor&background=06b6d4&color=fff'
        };
        break;
      default:
        mockUser = {
          id: 'u-' + Math.floor(Math.random() * 1000),
          name: role === 'Admin' ? 'Administrator' : `${role} User`,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${role}&background=random&color=fff`
        };
        break;
    }

    this.loginUser(mockUser);
  }

  loginUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('medcore_user', JSON.stringify(user));
    this.router.navigate(['/app/dashboard']);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('medcore_user');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }
}