import { Injectable, signal, computed } from '@angular/core';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  condition: string;
  admitted: boolean;
}

export interface Doctor {
  id: string;
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

export interface Bill {
  id: string;
  patientId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Mock Data
  patients = signal<Patient[]>([
    { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', contact: '+91 98765 43210', condition: 'Hypertension', admitted: false },
    { id: 'P002', name: 'Anjali Sharma', age: 32, gender: 'Female', contact: '+91 98765 43211', condition: 'Pregnancy', admitted: true },
    { id: 'P003', name: 'Suresh Patil', age: 60, gender: 'Male', contact: '+91 98765 43212', condition: 'Diabetes', admitted: false },
    { id: 'P004', name: 'Priya Verma', age: 25, gender: 'Female', contact: '+91 98765 43213', condition: 'Flu', admitted: false },
    { id: 'P005', name: 'Amit Shah', age: 50, gender: 'Male', contact: '+91 98765 43214', condition: 'Cardiac Arrest', admitted: true },
  ]);

  doctors = signal<Doctor[]>([
    { id: 'D001', name: 'Dr. Aryan Kapoor', specialization: 'Diagnostician', department: 'Diagnostic Medicine', available: true },
    { id: 'D002', name: 'Dr. Meera Iyer', specialization: 'Oncologist', department: 'Oncology', available: true },
    { id: 'D003', name: 'Dr. Sameer Reddy', specialization: 'Endocrinologist', department: 'Administration', available: false },
    { id: 'D004', name: 'Dr. Vikram Malhotra', specialization: 'Neurologist', department: 'Neurology', available: true },
  ]);

  appointments = signal<Appointment[]>([
    { id: 'A001', patientId: 'P001', doctorId: 'D001', date: '2023-10-25', time: '10:00 AM', status: 'Scheduled', type: 'Consultation' },
    { id: 'A002', patientId: 'P003', doctorId: 'D002', date: '2023-10-25', time: '11:30 AM', status: 'Completed', type: 'Follow-up' },
    { id: 'A003', patientId: 'P002', doctorId: 'D003', date: '2023-10-26', time: '09:00 AM', status: 'Scheduled', type: 'Consultation' },
  ]);

  bills = signal<Bill[]>([
    { id: 'B001', patientId: 'P001', amount: 1500, status: 'Paid', date: '2023-10-20' },
    { id: 'B002', patientId: 'P002', amount: 25000, status: 'Unpaid', date: '2023-10-21' },
    { id: 'B003', patientId: 'P003', amount: 750, status: 'Pending', date: '2023-10-22' },
  ]);

  stats = computed(() => ({
    totalPatients: this.patients().length,
    activeDoctors: this.doctors().filter(d => d.available).length,
    pendingAppointments: this.appointments().filter(a => a.status === 'Scheduled').length,
    totalRevenue: this.bills().reduce((acc, b) => b.status === 'Paid' ? acc + b.amount : acc, 0)
  }));

  addPatient(patient: Omit<Patient, 'id'>) {
    const newPatient = { ...patient, id: `P${String(this.patients().length + 1).padStart(3, '0')}` };
    this.patients.update(p => [...p, newPatient]);
  }

  deletePatient(id: string) {
    this.patients.update(p => p.filter(x => x.id !== id));
  }

  addAppointment(appt: Omit<Appointment, 'id'>) {
    const newAppt = { ...appt, id: `A${String(this.appointments().length + 1).padStart(3, '0')}` };
    this.appointments.update(a => [...a, newAppt]);
  }

  updateAppointmentStatus(id: string, status: Appointment['status']) {
    this.appointments.update(appts => appts.map(a => a.id === id ? { ...a, status } : a));
  }
}