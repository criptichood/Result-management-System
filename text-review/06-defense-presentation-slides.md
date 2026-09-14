# 06. Defense Presentation Slides & Speaking Script

This document provides a slide-by-slide presentation script ready for use during a project defense, seminar presentation, or supervisor review.

---

### Slide 1: Title Slide
- **Title**: Federal University of Agriculture, Zuru (FUAZ) — Student Results Management System (SRMS)
- **Subtitle**: A Secure, Role-Governed Academic Records and Moderation Portal
- **Presenter**: Project Team / Candidate
- **Institution**: Department of Computer Science, Faculty of Science, FUAZ
- **Key Talking Point**: "Good day, esteemed panel. Today, we present the FUAZ Student Results Management System—a modern, automated platform engineered to bring transparency, speed, and mathematical accuracy to the university result computation and moderation pipeline."

---

### Slide 2: Background & Problem Statement
- **The Challenges of Conventional Result Processing**:
  - Human calculation errors in calculating 5.0 CGPAs and weighted points.
  - Risk of tampering with physical score sheets prior to Senate approval.
  - Opaque delay between semester exam conclusion and result slip release.
  - Lack of an immutable audit trail when scores are altered.
- **Key Talking Point**: "Traditional university examination workflows rely heavily on distributed spreadsheets and paper score sheets, leading to transcription mistakes, delayed broadsheet approvals, and unrecorded grade alterations."

---

### Slide 3: System Objectives & Scope
- **Our Objectives**:
  - Build a responsive 4-tier actor system (Student, Lecturer, Chief Examiner, Admin).
  - Automate the Nigerian 5.0 CGPA scale with immediate mathematical validation.
  - Establish an immutable Chief Examiner Moderation Audit Trail.
  - Enable instant, fraud-resistant PDF Result Slip and Senate Broadsheet generation.
- **Key Talking Point**: "Our platform enforces strict separation of duties: Lecturers can only score assigned courses, the Chief Examiner moderates and approves, the Senate/Admin oversees institutional records, and Students access tamper-evident records."

---

### Slide 4: System Architecture & Technologies Used
- **Frontend Architecture**: React 18+ (SPA) with TypeScript for rigorous type safety.
- **Styling**: Tailwind CSS v4 featuring the institutional FUAZ palette and dark mode support.
- **Component Primitives**: Radix UI headless components for accessible modal dialogs and tabs.
- **Document Engine**: jsPDF for vector result slips and CSS print media styles for physical Senate broadsheets.
- **Key Talking Point**: "We built the application on React and TypeScript to ensure zero runtime type bugs. The UI follows a strict 500-line modular component standard with accessible, high-contrast typography."

---

### Slide 5: Actor Roles & Workflow Matrix
- **Student**: View published results, analyze CGPA trends, generate official PDF slips, file grade disputes.
- **Lecturer**: Manage assigned course rosters, input CA (0-40) and Exam (0-60), batch upload via CSV, submit to HOD.
- **Chief Examiner / HOD**: Moderate departmental broadsheets, perform score overrides with audit logging, batch publish, resolve disputes.
- **Administrator**: Manage user accounts, curriculum, course allocations, academic sessions, and graduation clearance.
- **Key Talking Point**: "Notice how results flow logically: A lecturer drafts scores, submits them, the course locks, the Chief Examiner audits the broadsheet, and only upon Senate/HOD approval do grades become visible on student portals."

---

### Slide 6: The 5.0 CGPA Grading Engine
- **Grading Scale**:
  - A (70-100%, 5.0 GP), B (60-69%, 4.0 GP), C (50-59%, 3.0 GP), D (45-49%, 2.0 GP), E (40-44%, 1.0 GP), F (0-39%, 0.0 GP).
- **Core Metrics**:
  - $\text{Weighted Points (WP)} = \text{Credit Units} \times \text{Grade Point}$.
  - $\text{GPA} = \frac{\text{Total Weighted Points (TWP)}}{\text{Total Credit Registered (TCR)}}$.
  - $\text{CGPA} = \frac{\sum \text{TWP}}{\sum \text{TCR}}$.
- **Class of Degree**: First Class (4.50–5.00), 2:1 (3.50–4.49), 2:2 (2.40–3.49), Third Class (1.50–2.39), Pass (1.00–1.49).
- **Key Talking Point**: "Our computation engine strictly adheres to NUC guidelines. When an examiner overrides a single score, all dependent metrics—TCR, TCE, TWP, GPA, CGPA, and degree classification—update synchronously."

---

### Slide 7: Security, Moderation & Audit Trail
- **Immutable Historical Logging**:
  - Every batch approval, return for revision, and individual score override is logged.
  - Logs capture: Timestamp, Examiner ID, Course Code, affected students count, and written remarks.
- **Dispute Resolution Flow**:
  - Students submit formal score complaints with evidence.
  - Chief Examiner investigates against lecturer submission sheets and resolves with formal notes.
- **Key Talking Point**: "Academic integrity is guarded by our Moderation Audit Trail. No score can be altered in secret; any override demands a justification note and is permanently recorded."

---

### Slide 8: Official Document Generation
- **Official Result Slip**: Includes institutional crest, student biodata, semester course breakdown, cumulative metrics, and verification code.
- **Departmental Senate Broadsheet**: Horizontal grid displaying all candidates, courses, units, GPAs, and graduation clearance status.
- **Key Talking Point**: "Students no longer need to wait weeks for paper slips. They can generate verifiable PDF slips instantly, while the examination office can print complete Senate broadsheets with a single click."

---

### Slide 9: Conclusion & Demonstration
- **Summary**: FUAZ SRMS delivers a modern, secure, and compliant solution to academic record handling.
- **Future Enhancements**: Integration with institutional SMS notification gateways and biometric exam attendance verification.
- **Live Demonstration**: Open floor for panel questions and interactive live demo walkthrough.
- **Key Talking Point**: "Thank you, members of the panel. We now invite you to observe the live demonstration of the system in action across all four user roles."
