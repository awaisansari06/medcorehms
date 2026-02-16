# 🏥 MedCore HMS - Premium Hospital Management System

## 🌟 Overview

MedCore HMS is a sophisticated, high-performance Hospital Management System engineered with **Angular 21**, **Tailwind CSS**, and **RxJS**. Designed for modern healthcare facilities, it bridges the gap between complex medical workflows and a seamless user experience. By leveraging **Angular Signals**, the application provides real-time reactivity, ensuring that clinical data and patient records are always synchronized across the platform.

The system is built with a "Glassmorphism" design philosophy, offering a premium aesthetic that is both functional and visually stunning. Whether it's an administrator managing hospital revenue or a patient viewing their prescriptions, MedCore HMS delivers a polished, state-of-the-art interface.

---

## 👥 Role-Based Architecture

MedCore HMS implements a strict role-based access control (RBAC) system, providing five distinct dashboard experiences tailored to specific user responsibilities:

### 🛡️ Admin Dashboard
- **Hospital Capacity Monitoring**: Real-time tracking of ward and ICU occupancy.
- **Financial Analytics**: Comprehensive revenue tracking and billing summaries.
- **Staff Management**: Overview of active medical staff and clinic availability.
- **Wait Time Analytics**: Monitoring average patient wait times for operational efficiency.

### 🩺 Doctor Dashboard
- **Consultation Schedule**: Manage daily appointments with a prioritized queue.
- **Patient Records**: Direct access to medical histories and diagnostic reports.
- **Prescription Management**: Digital prescription issuance and tracking.
- **Clinical Alerts**: Immediate notification for critical patient results.

### 📋 Nurse Dashboard
- **Vital Monitoring**: View real-time vitals for admitted patients.
- **Medication Schedules**: Track and update medication administration records.
- **Task Management**: Structured workflow for patient care and ward rounds.
- **Alert System**: Quick-launch buttons for emergency medical response.

### 🛎️ Receptionist Dashboard
- **Registration**: Streamlined workflow for new patient intake.
- **Booking System**: Manage appointments and specialist schedules.
- **Billing Oversight**: Initiate invoices and track payment statuses.
- **Clinic Rosters**: Monitor doctor attendance and department status.

### 👤 Patient Dashboard
- **Health Snapshot**: At-a-glance view of BP, Heart Rate, and Weight trends.
- **Record Archive**: Download past prescriptions and laboratory results.
- **Appointment Management**: Book and track upcoming consultations.
- **Health Education**: Access curated health tips and medical advice.

---

## 🇮🇳 Indian Localization

The system has been meticulously localized for the Indian healthcare ecosystem, ensuring a familiar experience for practitioners and patients in the region.

- **Currency Management**: All financial transactions and reports use the **Indian Rupee (₹)** symbol.
- **Naming Conventions**: Mock datasets utilize common Indian names (e.g., *Rajesh Kumar*, *Dr. Aryan Kapoor*).
- **Communication Standards**: Phone number fields and displays are optimized for the **+91** country code and Indian digit grouping.
- **Cultural Nuances**: Date formats and reporting styles aligned with Indian clinical best practices.

---

## 🛠 Technical Excellence (The Stack)

MedCore HMS is built on a foundation of modern web technologies, prioritizing speed, security, and maintainability.

- **Frontend Core**: [Angular 21](https://angular.dev/) - utilizing Standalone Components and the new Control Flow syntax.
- **State Management**: [Angular Signals](https://angular.dev/guide/signals) for ultra-fast, reactive UI updates without manual change detection.
- **Styling Engine**: [Tailwind CSS](https://tailwindcss.com/) for a highly customizable and utility-first design system.
- **Reactivity**: [RxJS](https://rxjs.dev/) for managing asynchronous data streams and API integrations.
- **Visual Assets**: 
  - Icons: [FontAwesome 6](https://fontawesome.com/)
  - Fonts: [Inter](https://fonts.google.com/specimen/Inter) and [Outfit](https://fonts.google.com/specimen/Outfit)
- **Persistence**: Secure `localStorage` integration for persistent user sessions.

---

## 🚀 Getting Started

Follow the guide below to set up your local development environment.

### 📋 Prerequisites
Ensure you have the following installed:
- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher
- **Modern Browser**: Chrome, Firefox, or Edge for best performance.

### 🔧 Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/medcorehms.git
   cd medcorehms
   ```

2. **Install Project Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   *Note: For the demo version, configurations are pre-applied. In production, ensure your API endpoints are set in `src/environments/`.*

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:4200`.

5. **Build for Production**
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist/` folder.

---

## � Project Structure

```text
src/
├── app/
│   ├── app.routes.ts          # Centralized routing configuration
│   └── app.config.ts          # Core application providers and settings
├── components/
│   ├── dashboards/            # Role-specific dashboard components
│   ├── appointments.ts        # Appointment management module
│   ├── billing.ts             # Financial and invoicing system
│   ├── doctors.ts             # Medical staff directory
│   ├── patients.ts            # Patient demographic management
│   ├── dashboard.ts           # Orchestrator component
│   └── login.ts               # Secure authentication portal
├── services/
│   ├── auth.service.ts        # Session and RBAC management
│   └── data.service.ts        # Reactive mock data engine (Signals)
├── assets/                    # Static images and branding assets
└── index.css                  # Global Tailwind utility imports
```

---

## 🛡️ Security & Sessions

MedCore HMS prioritizes user experience with a robust session management system. 
- **Persistance**: Using an encrypted-ready `localStorage` strategy, user sessions are maintained across page refreshes.
- **Auto-Logout**: Integrated clean-up on sign-out to remove sensitive identifiers from storage.
- **Protected Routes**: Angular Router Guards prevent unauthorized access to clinical dashboards without a valid session.

---

## 🗺️ Roadmap

We are constantly improving MedCore HMS. Future updates will include:

- [ ] **AI Diagnostics**: Integration with Gemini API for symptom analysis (Draft started).
- [ ] **Real-time Chat**: Direct messaging between Doctors and Patients.
- [ ] **Automated Invoicing**: GST-compliant invoice generation and tax reporting.
- [ ] **Mobile App**: Native mobile experience via Capacitor or NativeScript.
- [ ] **DICOM Viewer**: Integrated medical imaging (X-Ray, MRI) viewer.

---

## 🤝 Contributing

We welcome contributions from the community to make MedCore HMS the best open-source medical platform.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Designed with precision for the future of healthcare.** 
*MedCore HMS - Caring through Technology.*
