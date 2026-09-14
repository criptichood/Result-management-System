# 04. Grade Moderation, Editing & Dispute Lifecycle

A central feature of the FUAZ SRMS is ensuring that results cannot be arbitrarily published or modified without procedural transparency.

---

## 1. The Result Processing Pipeline

```
[ LECTURER ]
    │
    ├─> Step 1: Enters CA (0-40) and Exam (0-60)
    │           (Saved as "Draft" — editable anytime)
    │
    └─> Step 2: Formal Submission
                └─> Course status transitions to: "Pending Moderation"
                    (Lecturer cannot edit once submitted)

[ CHIEF EXAMINER / HOD ]
    │
    ├─> Step 3: Broadsheet Audit
    │           Checks class statistics, grade bell curve, flagged discrepancies
    │
    ├─> Option A: Approve & Publish
    │             └─> Course status: "Published"
    │             └─> Instant sync to all enrolled student portals
    │             └─> Immutable log added to Audit Trail
    │
    ├─> Option B: Return for Revision
    │             └─> Course status: "Returned"
    │             └─> Remarks dispatched to lecturer (e.g. "Recalibrate CA scores")
    │
    └─> Option C: Granular Score Override
                  └─> Chief examiner adjusts single student's CA or Exam
                  └─> Requires mandatory moderation reason
                  └─> Generates permanent Audit Trail entry

[ STUDENT PORTAL ]
    │
    └─> Step 4: Live Visibility & Dispute Window
                Students view published slips and can file a dispute if needed
```

---

## 2. Grade Editing & Score Override Rules

1. **Lecturer Draft Phase**:
   - Scores are freely editable by the course lecturer while in draft.
   - Validations prevent entering CA > 40 or Exam > 60.
2. **Post-Submission Locking**:
   - Once submitted to the Chief Examiner, lecturer score fields are locked to prevent uncoordinated alterations.
3. **Chief Examiner Score Override**:
   - The Chief Examiner can adjust scores in the moderation broadsheet (e.g., following an official remarking committee resolution).
   - The system records:
     - Old Score vs. New Score.
     - Timestamp and Examiner ID.
     - Moderation Justification Note.
     - Student Matriculation Number.

---

## 3. Grade Dispute Resolution Mechanism

When a student discovers a potential error (e.g., missing continuous assessment score or exam script transcription error):

1. **Student Lodges Dispute**:
   - The student clicks **"File Dispute"** on their published result slip.
   - Selects Course Code, enters Expected Score, and provides Detailed Statement/Evidence.
   - Status becomes **"Under Review"**.
2. **Examiner Dispute Queue**:
   - Appears in the Chief Examiner’s dedicated **Dispute Management Queue**.
   - The examiner can cross-reference the physical exam attendance list, continuous assessment test sheets, and lecturer's upload.
3. **Outcome Determination**:
   - **Approved with Correction**: The examiner applies an authorized score adjustment, which automatically recalculates the student's GPA and logs the resolution.
   - **Rejected with Feedback**: The examiner provides written justification explaining why the original score stands (e.g., "Verified against signed exam answer booklet; score accurate").
