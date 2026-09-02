# Project Architecture & Coding Standards

## 1. Modular Architecture & File Size Limit (Rule of 500)
- **Strict File Size Cap**: No single file should exceed 300–500 lines of code. Files approaching or exceeding 500 lines must be immediately broken down into smaller, focused, and maintainable sub-components or utility modules.
- **Single Responsibility Principle**: Each component must do one thing well. Extract UI sub-sections, modals, charts, and table rows into dedicated sub-components.

## 2. Feature-Based Component Organization
- **Dedicated Feature Folders**: Components must NEVER be dumped into a flat `src/components/` folder. All non-primitive components must live in their respective feature directory:
  - `src/components/ui/` — Base reusable design system primitives (buttons, cards, tables, dialogs, badges).
  - `src/components/student/` — Student portal views, result slips, analytics charts, course registration modules.
  - `src/components/lecturer/` — Lecturer grading sheets, batch CSV score uploaders, course selector panels.
  - `src/components/examiner/` — Chief Examiner result review queues, grade moderation, audit logs.
  - `src/components/admin/` — Admin controls, user management tables, course catalog CRUD, system settings.
  - `src/components/layout/` — Shell layout, navigation bars, sidebars, footers.
- **Index Exports**: Where appropriate, export feature components cleanly from feature folders.

## 3. State Management & Data Flow
- Use shared TypeScript interfaces in `src/types/` or `src/types.ts`.
- Database abstractions and localStorage helpers stay in `src/lib/`.
- Auth context and session management stay in `src/contexts/`.

## 4. UI Consistency & Anti-Slop Guidelines
- Adhere strictly to the institutional portal aesthetic: high contrast, pristine typography, verified 5.0 CGPA Nigerian university scale computations.
- Always provide accessible touch targets, clear responsive breakpoints (`sm:`, `md:`, `lg:`), and zero unrendered placeholder stubs.
