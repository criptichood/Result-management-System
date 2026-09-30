# AGENTS.md — FUAZ SRMS

React 19 + Vite 6 SPA for the Federal University of Agriculture, Zuru Student Results Management System. **There is no backend.** Auth, data, and PDF generation all run in the browser.

## Commands

```bash
npm install
npm run dev      # hardcoded to --port=3000 --host=0.0.0.0
npm run lint     # this IS `tsc --noEmit`; there is no ESLint
npm run build
```

- **No test runner exists** (no vitest/jest/playwright). Verify changes with `npm run lint` + `npm run build` + clicking the flow in `npm run dev`.
- **npm is the only package manager.** `package.json` pins `"packageManager": "npm@11.19.0"` and `package-lock.json` is the sole lockfile. The repo previously tracked a `bun.lock` alongside an untracked `package-lock.json`; since npm ignores `bun.lock` and bun ignores `package-lock.json`, the tracked lockfile was guaranteeing nothing for anyone following the README. Don't reintroduce a second lockfile.
- `npm run clean` deletes a `server.js` that does not exist — vestigial, ignore it.
- `DISABLE_HMR=true` disables HMR **and** file watching (`vite.config.ts`). Don't "fix" that block.
- No env vars are needed. `.env.example`, `metadata.json`, `public/assets/aistudio/`, and the installed-but-never-imported `@google/genai` / `express` / `dotenv` deps are Google AI Studio boilerplate.

## Data layer (the part to read first)

`src/lib/db.ts` exports a singleton `db` (`MockDB`) and is the only write path. Reads are synchronous array access on in-memory state — no async, no loading states needed.

- `db.from(table).insert/update/delete` for CRUD; `db.getSettings()`, `db.saveCourseScores()`, `db.moderateCourse()`, `db.ratifySenateCourses()`, `db.overrideStudentScore()` for domain actions.

### Submitting a sheet is gated in the data layer

`db.saveCourseScores` refuses `status: 'Submitted'` and returns `{ ok: false, reason }` when the course has **no enrolled candidates**, when **any candidate is missing a CA or Exam score**, or when any score is **outside CA 0–40 / Exam 0–60**. Drafts are still allowed to be partial. This is the enforcement point — the Submit button in `GradingHeaderToolbar` is disabled on the same rule so the lecturer sees why, but a `disabled` attribute is not a guard. Any new route that submits must go through this method, and must handle a `!ok` result rather than assuming success.

### Grading roster CSV round-trip

`src/lib/gradingRosterCsv.ts` is the **single source of truth** for the lecturer roster export/import. Do not write a second exporter or parser — the app used to have two near-identical exporters that had drifted apart.

- Exported **Total and Grade cells are live spreadsheet formulas** and must be CSV-quoted (`toFormulaCsvField`), because a formula contains commas and an unquoted comma is a cell separator. Quoting keeps it one cell; the spreadsheet unquotes, sees a leading `=`, and evaluates.
- The **NUC grading key travels in the same file** in columns K–N (a blank spacer sits in J). CSV has no sheets, so a second sheet is not possible — the key is extra columns instead.
- **The parser ignores the Total and Grade columns entirely** and recomputes from CA + Exam. This is the property that makes the round trip safe: a file where the formula survived as literal text (`=F2+G2`), or was never evaluated, cannot poison the marks. Do not "trust" those columns.
- Parsing stops at the first row with an empty matric cell, which is where the grading-key rows begin; the count is reported as `ignoredLines` and surfaced in the import modal.
- `NUC_GRADING_BANDS` in that module must stay consistent with `calculateLetterGrade` (A≥70, B≥60, C≥50, D≥45, E≥40, F).
- Every `saveState()` JSON-serializes the **entire** state into `localStorage` under `DB_KEY = 'fuaz_srms_db_v19'` (`src/lib/dbStateInit.ts`). **Bump that key when you change the persisted shape *or the seed data materially*** — it is the only migration mechanism. Currently v19 (teaching load rebalanced); bump again if you reassign lecturers.
- `loadAndMigrateDBState()` back-fills any seed rows missing from an existing blob, so an old localStorage state won't lose new `mockData` entries.
- **A `Course` row is not an offering.** The same catalog course is reused by every cohort that ever took it (CSC 411 in the seed has enrollments across four sessions). Enrollments carry `academicYear`, so any query about *whose* marks you are editing must filter on `e.academicYear === course.session`. `computeLecturerCourses` resolves one session per course (live session if present, else newest, else live) and every count it returns is scoped to it.
- **Access control is allocation-only.** `computeLecturerCourses` returns just the courses explicitly assigned to the lecturer (`lecturerId` / `lecturerIds` / `instructors`). There is deliberately **no department fallback** — an earlier version leaked all 32 department courses to anyone with a `department` set. Do not reintroduce one.
- **Teaching-load cap: no lecturer may hold more than 2 courses per semester** (≤4 per session). This is a seed-data invariant, currently satisfied by all 12 lecturers in `mockData.ts`; the observed spread is 2+2, 1+1, 1+2, 2+1 and 0+2. Re-run that check before adding a course to an existing lecturer. `computeLecturersWorkload` (`dbWorkload.ts`) is the admin-side view of the same numbers.
- Do not assume a lecturer has one course. The seed allocates each lecturer courses at one level-cohort, and each level's cohort is live in 2024/2025, so "teaching load" is genuinely 2–4. `LecturerCourseOffering.isCurrentOffering` (has a cohort in the live session) is what splits live from not-yet-started; the dashboard falls back to the lecturer's whole allocation when nothing is live yet.
- **UI refresh:** `saveState()` fires `db.subscribe()` listeners and a `window` `CustomEvent('fuaz_db_updated')`. Only the Student/Lecturer/Examiner dashboards subscribe; Admin uses `useAdminDashboardState` + explicit `reloadData()`. New components that mutate data and expect live updates must subscribe or call reload themselves.
- **The SQLite layer is dead code in practice — don't rely on it.** `src/lib/sqliteEngine.ts` (sql.js WASM, binary persisted to IndexedDB) is mirrored from localStorage by `dbSqliteBridge.ts`, but its bootstrap always throws and is swallowed:
  - `users.role` CHECK allows only `('Student','Lecturer','Chief Examiner','Admin')`, yet `mockData.ts` seeds `Senate` / `HOD` / `Examiner` as users 2–4. `bootstrapSchemaAndSeed()` aborts inside `init()`, the catch logs "running in hybrid mode", and `initialized` stays `false`.
  - `results.status` CHECK omits `'Approved'`, which `db.moderateCourse()` writes.
  - Verified by executing the exact schema against `sql.js` from `node_modules`.
  - The app is designed to work localStorage-only, so fixing this will not change behavior unless you also rewire reads.

## Grading scale — duplicated, and it has churned

Canonical helpers: `calculateLetterGrade()` in `src/lib/academicOperations.ts`, `getGradePoint()` and `getDegreeClassification()` in `src/lib/academicUtils.ts`. CA is capped 40, exam 60.

Current bands: `A ≥70, B ≥60, C ≥50, D ≥45, E ≥40, else F`.

**The same bands are re-inlined in ~10 other files.** Changing only the canonical helper will silently desync the dashboards. Grep and update all of:

`src/pages/LecturerDashboard.tsx` · `src/lib/mockData.ts` (`getNucGrade`) · `src/components/gpa/InteractiveGpaSandbox.tsx` · `src/components/gpa/GpaScaleReference.tsx` · `src/components/gpa/SemesterGpaWalkthrough.tsx` · `src/components/student/SubjectDiagnosticsView.tsx` · `src/components/student/GradeAnalyticsView.tsx` · `src/components/review/slides/GradingEngineSlide.tsx` · `src/components/admin/AdminSettingsTab.tsx` (band reference table) · `src/components/examiner/{ExaminerBroadSheetModal,StudentProfileModal}.tsx` · `src/components/student/OfficialStatementOfResultModal.tsx` · `src/components/lecturer/CsvPreviewTable.tsx`

Grade `E` was removed by commit `9444b72` and restored by `9db3642`. Treat the scale as churn-prone.

Degree classification uses different cut-offs (4.50 / 3.50 / 2.40 / 1.50) — don't conflate it with the grade bands.

**The pass threshold itself is not consistent:** grades come from `calculateLetterGrade` (E = 40–44, so pass ≥ 40), but `LecturerGradingTab` computes `passRate`, the "Passed" filter and the borderline filter with `total >= 45`. A 44 is a pass in the ledger and a fail in the lecturer's stats bar. Resolve this before trusting either number.

## Roles and "auth"

- Seven role strings: `Admin | Senate | HOD | Chief Examiner | Examiner | Lecturer | Student` (`src/types/index.ts`).
- Routing from `src/components/layout/Header.tsx`: `Senate → /admin?tab=senate`, `HOD/Examiner/Chief Examiner → /examiner`, `Admin → /admin`.
- Login is a demo account picker. `AuthContext.login(userId)` takes **no password**; the id lives in `localStorage['srms_auth_user']`.
- **No route guards exist.** Any logged-in user can open `/admin`, `/examiner`, etc. Don't assume the router protects a feature you're adding. Lecturer *course* visibility is the one place that is enforced, in `computeLecturerCourses` — see the data-layer section.
- Seed-only invariant: unassigned courses exist (General Studies, Physics, Chemistry, Crop Science — 15 of them) because this mock has no staff for those departments. Do not give them a lecturer as a shortcut.
- Both `src/types.ts` (a one-line re-export) and `src/types/index.ts` exist — import from `../types`.

## Routing and tabs

- `src/App.tsx` defines routes; role dashboards are `React.lazy` + `Suspense` with the shared `PageLoader`. New routes follow that pattern.
- In-dashboard navigation is the **`?tab=` query param**, not router state: read with `useSearchParams()` in `src/pages/*Dashboard.tsx` and `src/components/Sidebar.tsx`. Deep links and the sidebar's active state depend on it.
- **The sidebar is the only navigation. Do not add an in-page tab bar.** The lecturer portal had one and it duplicated the sidebar's own menu while also repeating the Export/Import buttons each tab already renders in its own header — pure wasted vertical space. Same applies to the other roles: their `?tab=` lists in `Sidebar.tsx` are the nav.
- Lecturer page metadata (heading, subtitle, `courseScoped`) lives in `src/components/lecturer/lecturerTabs.ts`; the nav labels live in `LECTURER_NAV` in `Sidebar.tsx`. The lecturer nav ids are typed as `LecturerTabId`, so adding a view to one and not the other fails `tsc`.
- Every lecturer tab already owns its own actions in its card header (Export Roster / Import Results / Print / Submit). Don't re-host them in shared chrome.

## Conventions

- **File size cap: 300–500 lines.** Four files already sit at/over it — `src/lib/db.ts` (597), `src/components/examiner/DepartmentLecturerAllocationModal.tsx` (572), `DepartmentStudentsTable.tsx` (527), `CourseResultModal.tsx` (500).
- Feature folders under `src/components/`: `ui/`, `layout/`, `student/`, `lecturer/`, `examiner/`, `admin/` (with nested `senate/`, `sql/`), `login/`, `landing/`, `gpa/`, `profile/`, `review/`. Keep `index.ts` barrel exports updated. Exceptions that already exist: `src/components/Layout.tsx` and `src/components/Sidebar.tsx` live at the components root.
- Route-level components live in `src/pages/`; they own tab state + data loading and delegate to `src/components/<feature>/`.
- Shared types in `src/types/`, persistence and computation helpers in `src/lib/`, contexts in `src/contexts/`, non-trivial dashboard state in `src/hooks/`.
- Tailwind **v4**, no `tailwind.config.js`. Dark mode is class-based (`@custom-variant dark (&:where(.dark, .dark *))` in `src/index.css`, `ThemeContext` toggles `.dark` on `<html>`), so every element needs explicit `dark:` variants.
- Visual convention: emerald accent, `bg-white dark:bg-slate-800/60` pairs, shadcn-style primitives in `src/components/ui/`, `cn()` from `src/lib/utils.ts` for class merging.
- Printing/PDF: hide chrome with `print:hidden`, global A4 `@media print` rules live in `src/index.css`; vector PDF generation is `src/lib/pdfUtils.ts` (jsPDF).
- `tsconfig.json` does **not** enable `strict` (README claims it does). The `@/*` alias maps to the repo root and is unused — imports are relative.

## Docs

- `README.md` — install/grading overview, partly stale (grade bands, role list). Trust the code over it.
- `text-review/` — six project-review/defense documents; `src/components/review/` renders them as the `/project-review` slide deck. Keep the two in sync if you change domain rules.