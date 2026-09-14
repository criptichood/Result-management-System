# 02. User Roles & Interaction Matrix

The FUAZ SRMS is architected around four distinct user roles. Each role operates within strict boundaries to preserve academic integrity and confidentiality.

```
       ┌───────────────────────────────┐
       │      1. ADMINISTRATOR         │
       │  (Senate / Academic Registry) │
       └───────┬───────────────┬───────┘
               │               │
      Configures Courses &      Manages Faculty
      Allocates Lecturers      & Student Accounts
               │               │
               ▼               ▼
       ┌───────────────┐       ┌───────────────────────────────┐
       │  2. LECTURER  │       │      3. CHIEF EXAMINER        │
       │ (Course Lead) │       │      (HOD / Moderation Board) │
       └───────┬───────┘       └───────────────▲───────────────┘
               │                               │
       Enters CA (0-40)                        │
       & Exam (0-60) Scores                    │
       Submits Batch ──────────────────────────┘
                               Submits for Review
                               Moderates & Publishes
                                               │
                                               │ Approves & Publishes
                                               ▼
                               ┌───────────────────────────────┐
                               │          4. STUDENT           │
                               │   (Candidate / Result Viewer) │
                               └───────────────┬───────────────┘
                                               │
                               Files Grade     │
                               Dispute         │
                               └───────────────┘
```

---

## 1. Student Portal (`Role: student`)

### Responsibilities:
- **Academic Dashboard**: Instant view of current Level (100L–400L), current semester GPA, and Cumulative CGPA.
- **Result Slips**: View officially published grades broken down by Course Code, Title, Credit Units, Score, Grade Point, and Letter Grade.
- **Verification & Official Downloads**: Generate tamper-evident PDF Result Slips and Statements of Academic Result carrying institutional verification codes.
- **Academic Transcript & CGPA Progression**: Interactive visual trajectory charts showing semester-by-semester GPA trends.
- **Grade Dispute Filing**: Submit formal queries against published grades (specifying reason, expected score, and evidence notes).

---

## 2. Lecturer Portal (`Role: lecturer`)

### Responsibilities:
- **Course Rosters**: Access enrolled candidates for courses assigned by the Department/Admin.
- **CA & Exam Score Entry**: Real-time validation for:
  - Continuous Assessment: `0 <= CA <= 40`
  - Semester Examination: `0 <= Exam <= 60`
  - Total: `0 <= Total <= 100`
- **Batch CSV Import / Export**: Upload scores in bulk via standardized CSV templates with instant error-checking.
- **Submission Workflow**: Lock scores into **"Submitted to Chief Examiner"** status, transferring custody to the Head of Department.

---

## 3. Chief Examiner / HOD Portal (`Role: chief_examiner`)

### Responsibilities:
- **Departmental Moderation Queue**: Review submitted course score sheets before publication.
- **Broadsheet Audits**: Verify class grade distribution (bell curves, pass/fail ratios, high failure alerts).
- **Quality Control Actions**:
  - **Approve & Publish**: Makes grades live and permanently visible on student portals.
  - **Return with Feedback**: Sends batch back to lecturer with explicit moderation notes for correction.
  - **Score Override**: Surgically updates erroneous individual scores with mandatory audit justification.
- **Dispute Resolution Queue**: Investigate student-filed disputes against lecturer submission archives.
- **Senate Broadsheet Export**: Export official departmental broadsheets formatted for Senate graduation clearance.

---

## 4. Administrator Portal (`Role: admin`)

### Responsibilities:
- **User Management**: Create, edit, activate/deactivate students, lecturers, and academic officers.
- **Curriculum & Course Catalog**: Add courses, set credit units, designate Core vs. Borrowed/Elective courses, and map prerequisites.
- **Workload Allocation**: Assign course leaders and co-lecturers to specific courses.
- **Academic Session Controls**: Open and close registration windows, set current academic session (e.g., 2025/2026) and active semester.
- **System-Wide Anomaly Detection**: Flag missing results, unallocated courses, or abnormal grade spikes.
