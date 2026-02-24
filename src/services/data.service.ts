import { Injectable, signal, computed, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, setDoc, query, where } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Patient {
  id?: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  condition: string;
  admitted: boolean;
}

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  department: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: 'Consultation' | 'Follow-up' | 'Emergency';
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  id?: string;
  patientId: string;
  patientName?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  // Firestore Collections
  private usersCollection = collection(this.firestore, 'users');
  private appointmentsCollection = collection(this.firestore, 'appointments');
  private billsCollection = collection(this.firestore, 'bills');

  // Real-time Data Signals
  patients = toSignal(
    collectionData(query(this.usersCollection, where('role', '==', 'Patient')), { idField: 'id' }).pipe(
      map((users: any[]) => users.map(u => ({
        id: u.id,
        name: u.name || 'Unknown',
        age: u.age || 0,
        gender: u.gender || 'Not specified',
        contact: u.contact || u.email || 'No contact',
        condition: u.condition || 'Registered Online',
        admitted: u.admitted || false
      } as Patient)))
    ),
    { initialValue: [] }
  );

  doctors = toSignal(
    collectionData(query(this.usersCollection, where('role', '==', 'Doctor')), { idField: 'id' }).pipe(
      map((users: any[]) => users.map(u => ({
        id: u.id,
        name: u.name || 'Unknown',
        specialization: u.specialization || 'General',
        department: u.department || 'General',
        available: u.available ?? true
      } as Doctor)))
    ),
    { initialValue: [] }
  );

  appointments = toSignal(collectionData(this.appointmentsCollection, { idField: 'id' }) as Observable<Appointment[]>, { initialValue: [] });
  bills = toSignal(collectionData(this.billsCollection, { idField: 'id' }) as Observable<Bill[]>, { initialValue: [] });

  constructor() {
    // Signals initialized automatically
  }

  stats = computed(() => ({
    totalPatients: this.patients().length,
    activeDoctors: this.doctors().filter(d => d.available).length,
    pendingAppointments: this.appointments().filter(a => a.status === 'Scheduled').length,
    totalRevenue: this.bills().reduce((acc, b) => b.status === 'Paid' ? acc + b.amount : acc, 0)
  }));

  async addPatient(patient: Patient) {
    const userData = {
      ...patient,
      role: 'Patient',
      email: patient.contact || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random&color=fff`
    };
    if (patient.id) {
      // Use setDoc with merge to preserve auth fields if any
      await setDoc(doc(this.firestore, `users/${patient.id}`), userData, { merge: true });
    } else {
      await addDoc(this.usersCollection, userData);
    }
  }

  async deletePatient(id: string) {
    const docRef = doc(this.firestore, `users/${id}`);
    await deleteDoc(docRef);
  }

  async addAppointment(appt: Omit<Appointment, 'id'>) {
    await addDoc(this.appointmentsCollection, appt);
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']) {
    const docRef = doc(this.firestore, `appointments/${id}`);
    await updateDoc(docRef, { status });
  }

  async addDoctor(doctor: Doctor) {
    const userData = {
      ...doctor,
      role: 'Doctor',
      email: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random&color=fff`
    };
    if (doctor.id) {
      await setDoc(doc(this.firestore, `users/${doctor.id}`), userData, { merge: true });
    } else {
      await addDoc(this.usersCollection, userData);
    }
  }

  async createBill(bill: Bill) {
    await addDoc(this.billsCollection, bill);
  }

  async updateBillStatus(id: string, status: Bill['status']) {
    const docRef = doc(this.firestore, `bills/${id}`);
    await updateDoc(docRef, { status });
  }
}