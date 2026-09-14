# 01. System Overview & Technology Stack

## 1. Problem Statement & Motivation

In traditional academic institutions, results processing often suffers from:
1. **Manual Calculation Errors**: Human error in weighting Continuous Assessment (CA) and Exams, or computing cumulative GPAs.
2. **Result Leakage & Tampering**: Vulnerability of paper score sheets and unmonitored spreadsheet files prior to Senate approval.
3. **Delayed Broadsheet Approvals**: Prolonged lead time between final exam completion and official publication.
4. **Opaque Dispute Resolutions**: Students filing score complaints without an audit trail of who modified scores, when, or why.
5. **Slow Transcript & Result Slip Issuance**: Students queueing for paper printouts that lack automated verification.

The **FUAZ Student Results Management System (SRMS)** was built to solve these challenges with an integrated, secure, web-first platform designed strictly in accordance with Nigerian National Universities Commission (NUC) standards.

---

## 2. Core Capabilities

- **4 Multi-Tier Stakeholder Portals**: Customized user experiences for Students, Lecturers, Chief Examiners/HODs, and Administrators.
- **Strict Separation of Duties**: Lecturers can only score their assigned courses; Examiners moderate, approve, or return; Admins configure catalogs and accounts; Students view only officially published results.
- **Automated 5.0 CGPA Computation**: Real-time evaluation of Total Credit Registered (TCR), Total Credit Earned (TCE), Total Weighted Points (TWP), Grade Point Average (GPA), and Cumulative GPA (CGPA).
- **Immutable Moderation Audit Trail**: Every score edit, batch approval, score override, or moderation return is timestamped with examiner ID and remarks.
- **Bi-Directional Dispute Resolution**: Students can file formal disputes with evidence notes; examiners review disputes alongside lecturer continuous assessments before approving or rejecting claims.
- **Official Print & PDF Generation**: Vector PDF result slips with university crest, verification hashes, and print-optimized Senate broadsheets.

---

## 3. Technology Stack & Architectural Decisions

### Frontend Framework & Runtime
- **React 18+ (Functional Components & Hooks)**: Declarative, component-driven UI ensuring high interactivity without full-page reloads.
- **TypeScript**: Strict compile-time type safety preventing runtime type mismatches, missing fields, or invalid grading states.
- **Vite**: Ultra-fast next-generation development server and production bundler producing highly optimized static bundles.

### Styling & Design System
- **Tailwind CSS v4**: High-performance CSS utility framework used directly without heavy CSS-in-JS runtimes.
- **Theme Support**: Consistent institutional palette adhering to FUAZ forest green (`#064e3b`), clean light canvas, and high-contrast dark mode.
- **Lucide React Icons**: Cohesive, lightweight SVG icon system.
- **Radix UI Primitives**: Fully accessible, unstyled UI foundations for Modals (`Dialog`), Dropdowns, Tooltips, and Tabs.

### Document & Vector Generation
- **jsPDF**: Direct client-side vector PDF generation that compiles academic result slips and transcripts without requiring third-party cloud printers.
- **Tailwind Print Styles (`print:*`)**: Specialized print media queries that hide UI chrome (toolbars, buttons, sidebars) and render crisp 300-DPI broadsheets for physical printing or PDF saving.

### Data Storage & State Architecture
- **Normalized Data Models**: Typed entities for Users, Courses, Results, Enrollments, Audit Logs, and Disputes.
- **Local Reactive Storage Layer**: Reliable client-side database layer with initial pre-populated institutional demo datasets and mock state persistence across browser reloads.

### Project Architecture Standards
- **Rule of 500 Lines**: No file exceeds 500 lines of code; complex components are broken down into sub-components, helper utilities, and modals.
- **Feature-Based Directory Structure**:
  - `src/components/student/`: Student result views, CGPA analytics, dispute submission.
  - `src/components/lecturer/`: Grade entry, CA/Exam validation, batch CSV upload.
  - `src/components/examiner/`: Moderation queue, audit trail, departmental broadsheets.
  - `src/components/admin/`: User management, course catalog, Senate clearance.
  - `src/components/ui/`: Base design system primitives.
