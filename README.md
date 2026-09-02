# Federal University of Agriculture, Zuru (FUAZ) - Student Result Management System (SRMS)

A comprehensive, production-grade academic record and result management portal designed specifically for the Federal University of Agriculture, Zuru (FUAZ). The system provides secure portals for Students, Lecturers, Chief Examiners, and Administrators with robust grade computations, official statement of result PDF generation, and batch result processing.

---

## 🚀 Key Features

### 1. Multi-Role Authentication & Portals
- **Student Portal**: View semester results, cumulative academic summaries, print/preview official result slips, and track graduation progress on the Nigerian 5.0 CGPA scale.
- **Lecturer Portal**: Upload course scores, manage continuous assessments (CA) and examinations, and submit batch grade sheets.
- **Chief Examiner / HOD Portal**: Review, audit, and moderate departmental result sheets before final publication.
- **Administrator Portal**: Manage course catalogs, student matriculation records, user accounts, and system-wide academic session settings.

### 2. Official Result Slip & PDF Generation
- **Standalone PDF Export**: Download official semester or cumulative result slips instantly formatted with official FUAZ university crest, tabular student biodata, course grade breakdowns, and cumulative academic summaries.
- **Instant Print & Preview Mode**: Open formatted result slips in a clean browser preview tab for seamless printing and record-keeping.

### 3. Academic Computation & Grading Engine
- Standard Nigerian University 5.0 Grading System (A: 70-100%, B: 60-69%, C: 50-59%, D: 45-49%, E: 40-44%, F: 0-39%).
- Real-time GPA and Cumulative CGPA calculation.
- Classification of degrees (First Class, Second Class Upper, Second Class Lower, Third Class, Pass, Fail).

---

## 🛠️ Technology Stack

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons.
- **PDF Generation**: jsPDF vector rendering.
- **State & Storage**: Client-side reactive stores with local persistence.

---

## ⚙️ Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository or open the workspace.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
Start the local development server on port `3000`:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Building for Production
To build the application for production:
```bash
npm run build
```

---

## 🔮 Future Roadmap
- **Cloud Database Synchronization**: Integration with cloud-hosted PostgreSQL (Cloud SQL) and Firebase Firestore for multi-device synchronization.
- **Biometric & Smartcard Verification**: QR code and digital signature scanning for instant certificate and transcript authentication.
- **Mobile Companion App**: Dedicated Android and iOS progressive web app (PWA) push notifications for result releases.
- **Advanced Analytics Dashboard**: Departmental performance trends, carryover failure hot-spot mapping, and graduation projection forecasts.
