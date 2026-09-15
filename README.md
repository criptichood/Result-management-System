# Federal University of Agriculture, Zuru (FUAZ)
## Student Results Management System (SRMS)

A comprehensive, production-grade academic record processing and results management portal custom-engineered to meet the rigorous security, grading rules, and administrative workflows of the **Federal University of Agriculture, Zuru (FUAZ), Kebbi State, Nigeria**.

The system provides fully role-governed portals for Students, Lecturers, Chief Examiners/HODs, and Senate Administrators, implementing direct mathematical compliance under the National Universities Commission (NUC) 5.0 CGPA academic scale.

---

## 📋 Table of Contents
1. [Core Academic & Compliance Architecture](#-core-academic--compliance-architecture)
2. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
3. [Technology Stack](#-technology-stack)
4. [Installation & Local Setup](#-installation--local-setup)
5. [Database Architecture & Migration to Cloud PostgreSQL](#-database-architecture--migration-to-cloud-postgresql)
6. [Operational Workflows (The 4-Role Matrix)](#-operational-workflows-the-4-role-matrix)
7. [Official Documents & Print-Ready Reports](#-official-documents--print-ready-reports)

---

## 🎓 Core Academic & Compliance Architecture

The FUAZ SRMS implements the standard NUC 5-point scale, adhering strictly to the revised guidelines which completely eliminate the legacy "E" grade:

*   **Assessment Splits:** Continuous Assessment (CA) is strictly capped at a maximum of `40` marks. The final Semester Examination is capped at a maximum of `60` marks. Total marks = `100`.
*   **Deterministic Grading Logic:**
    *   **70% – 100%:** Grade `A` (5.0 Grade Points) — Excellent
    *   **60% – 69%:** Grade `B` (4.0 Grade Points) — Very Good
    *   **50% – 59%:** Grade `C` (3.0 Grade Points) — Good
    *   **45% – 49%:** Grade `D` (2.0 Grade Points) — Pass
    *   **0% – 44%:** Grade `F` (0.0 Grade Points) — Fail (Carryover Required)
*   **CGPA Calculations:** Real-time calculation of Cumulative Grade Point Average (CGPA) based on semester Total Credit Registered (TCR), Total Credit Earned (TCE), and Total Weighted Points (TWP):
    $$\text{GPA} = \frac{\sum(\text{Credit Units} \times \text{Grade Points})}{\text{Total Credit Registered (TCR)}}$$

---

## 💻 Prerequisites & System Requirements

To install and run the FUAZ Student Results Management System locally, the host system **MUST** meet the following requirement first before any commands can be executed:

*   **Node.js Runtime Environment:** Requires **Node.js v18.0.0 or higher** (LTS versions such as v20 or v22 are highly recommended). Node.js includes the `npm` (Node Package Manager) utility necessary for fetching application packages.
*   **Supported Platforms:** Windows, macOS, or Linux/Unix.

Verify your local Node.js installation by running:
```bash
node --version
npm --version
```

---

## 🛠️ Technology Stack

*   **User Interface:** React 18+ powered by **Vite** for optimized assets compilation.
*   **Programming Language:** TypeScript (strict type checking enabled).
*   **Styling Engine:** Tailwind CSS v4 utilizing pure utility classes.
*   **Vector Reporting Engine:** jsPDF for real-time, client-side vector PDF rendering of university results sheets and statements.
*   **Icon Primitives:** Lucide React (for uniform vector icon representation).

---

## ⚙️ Installation & Local Setup

Follow these structured steps to clone, configure, and boot the application locally on your computer:

### 1. Install Project Dependencies
Run the install command from the root directory containing `package.json` to populate the `node_modules` directory:
```bash
npm install
```

### 2. Launch the Development Server
Run the local Vite development server to launch the app:
```bash
npm run dev
```
Once initialized, open your browser and navigate to the local address (typically `http://localhost:3000`).

### 3. Build for Production Compilation
Compile the application into static HTML, JS, and CSS files ready for server or hosting deployment:
```bash
npm run build
```
All compiled distribution files will be generated cleanly inside the `dist/` folder.

---

## 🗄️ Database Architecture & Migration to Cloud PostgreSQL

The FUAZ SRMS is designed with a high-fidelity, decoupled client data-model state representing institutional databases. For full production deployment, the application is pre-mapped for migration to a cloud-hosted relational **PostgreSQL Database** (e.g., hosted via Google Cloud SQL, Supabase, or AWS RDS).

### Relational Schema Blueprint (PostgreSQL DDL)

To transition to production, create the following core Postgres tables representing the FUAZ academic ledger:

```sql
-- 1. Academic Users Table (Access Control List)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matric_or_staff_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) CHECK (user_role IN ('student', 'lecturer', 'chief_examiner', 'admin')),
    department_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Course Catalog Table
CREATE TABLE courses (
    course_code VARCHAR(10) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    credit_units INT CHECK (credit_units BETWEEN 1 AND 6),
    is_core BOOLEAN DEFAULT TRUE,
    department_code VARCHAR(10) NOT NULL
);

-- 3. Lecturer Course Allocations Table
CREATE TABLE course_allocations (
    id SERIAL PRIMARY KEY,
    lecturer_id VARCHAR(50) REFERENCES users(matric_or_staff_id),
    course_code VARCHAR(10) REFERENCES courses(course_code),
    academic_session VARCHAR(20) NOT NULL,
    semester VARCHAR(10) CHECK (semester IN ('Alpha', 'Omega'))
);

-- 4. Student Academic Marks Ledger Table
CREATE TABLE student_marks (
    id SERIAL PRIMARY KEY,
    student_matric VARCHAR(50) REFERENCES users(matric_or_staff_id),
    course_code VARCHAR(10) REFERENCES courses(course_code),
    ca_score INT CHECK (ca_score BETWEEN 0 AND 40),
    exam_score INT CHECK (exam_score BETWEEN 0 AND 60),
    total_score INT GENERATED ALWAYS AS (ca_score + exam_score) STORED,
    letter_grade CHAR(1) CHECK (letter_grade IN ('A', 'B', 'C', 'D', 'F')),
    grade_point NUMERIC(2,1),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Moderation', 'Published')),
    last_updated_by VARCHAR(50) REFERENCES users(matric_or_staff_id),
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Permanent Moderation Audit Log Table (Immutable Audit Trail)
CREATE TABLE moderation_audit_trail (
    id SERIAL PRIMARY KEY,
    examiner_id VARCHAR(50) REFERENCES users(matric_or_staff_id),
    student_matric VARCHAR(50) REFERENCES users(matric_or_staff_id),
    course_code VARCHAR(10) REFERENCES courses(course_code),
    old_ca INT,
    new_ca INT,
    old_exam INT,
    new_exam INT,
    justification_remark TEXT NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Student Academic Disputes Table
CREATE TABLE student_disputes (
    id SERIAL PRIMARY KEY,
    student_matric VARCHAR(50) REFERENCES users(matric_or_staff_id),
    course_code VARCHAR(10) REFERENCES courses(course_code),
    expected_score INT,
    student_statement TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Resolved_Approved', 'Resolved_Dismissed')),
    resolution_remark TEXT,
    resolved_by VARCHAR(50) REFERENCES users(matric_or_staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Operational Workflows (The 4-Role Matrix)

The system is split into four strict clearance boundaries to enforce academic custody:

1.  **Senate Administrator:** Manages the university catalog, sets academic session states (Alpha/Omega), adds staff records, and overrides course workloads.
2.  **Course Lecturer:** Views allocated classes, records Continuous Assessment (CA) and Exams (validated live to stay within 0-40 and 0-60 caps), imports batch class registers using standard CSV templates, and submits grades to lock sheet custody.
3.  **Chief Examiner / HOD:** Reviews incoming department score registries, reviews grade distribution curves, returns files to lecturers for corrections, overrides individual student grades with mandatory log notes, and publishes sheets live.
4.  **Student Candidate:** Logs in securely, reviews official published results, tracks GPA/CGPA progression, exports print-ready statements, and initiates formal academic dispute requests.

---

## 📄 Official Documents & Print-Ready Reports

All official university records are rendered client-side dynamically:

*   **Horizontal Senate Broadsheets:** Standard horizontal format matching the physical deliberation ledgers. Features a clean landscape layout optimizing student grades, quality metrics, and grade classifications.
*   **Cryptographic Verification Slips:** Real-time PDF statement of results bearing the FUAZ logo, student bio details, and a unique cryptographic verification tracking hash (e.g., `FUAZ-SRMS-STU-X9A2`) enabling registries to immediately verify result authenticity.
*   **Print Optimizations:** Formatted via native browser `@media print` layout parameters, ensuring all navigation sidebars, buttons, and system controls are cleanly hidden during paper printing.
