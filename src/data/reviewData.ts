export interface ReviewSection {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  iconName: string;
  summary: string;
  estimatedMinutes: number;
}

export const REVIEW_SECTIONS: ReviewSection[] = [
  {
    id: 'problem-solution',
    number: '01',
    title: 'Institutional Problem Statement & Solutions',
    shortTitle: 'Problems & Solutions',
    subtitle: 'Traditional paper result vulnerabilities vs engineered digital safeguards',
    iconName: 'Building2',
    summary: 'Comprehensive analysis of traditional Nigerian university result processing bottlenecks and the automated safeguards engineered to eliminate them.',
    estimatedMinutes: 3,
  },
  {
    id: 'tech-stack',
    number: '02',
    title: 'Technology Stack & System Architecture',
    shortTitle: 'Tech Stack & Architecture',
    subtitle: 'Component-driven stack, typed mathematical core, and client-side vector engine',
    iconName: 'Cpu',
    summary: 'Deep-dive into the React 18, TypeScript, Tailwind CSS v4, and jsPDF architecture powering instant zero-latency operations.',
    estimatedMinutes: 4,
  },
  {
    id: 'roles',
    number: '03',
    title: 'User Roles & Interaction Matrix',
    shortTitle: 'User Roles & Matrix',
    subtitle: 'Strict 4-tier stakeholder ecosystem and custody locking boundaries',
    iconName: 'Users',
    summary: 'Detailed interaction mapping between Students, Lecturers, Chief Examiners, and Senate Administrators with non-negotiable separation of duties.',
    estimatedMinutes: 4,
  },
  {
    id: 'grading',
    number: '04',
    title: '5.0 CGPA Grading Engine & Academic Rules',
    shortTitle: '5.0 Grading Engine',
    subtitle: 'Standard Nigerian NUC 5-point computation formulas and degree classification',
    iconName: 'Calculator',
    summary: 'Mathematical breakdown of Continuous Assessment (40) + Exam (60), Weighted Points, Semester GPA, Cumulative CGPA, and degree classes.',
    estimatedMinutes: 4,
  },
  {
    id: 'lifecycle',
    number: '05',
    title: 'Grade Moderation, Editing & Dispute Lifecycle',
    shortTitle: 'Moderation & Disputes',
    subtitle: 'Score entry, submission locking, examiner audit logging, and dispute resolution',
    iconName: 'ShieldCheck',
    summary: 'The complete lifecycle of a student grade: draft scoring, locking on submission, Chief Examiner moderation, override audit trail, and student claims.',
    estimatedMinutes: 5,
  },
  {
    id: 'courses',
    number: '06',
    title: 'Curriculum, Broadsheets & Verifiable Documents',
    shortTitle: 'Curriculum & Reports',
    subtitle: 'Course catalog, workload allocation, Senate master broadsheets, and PDF slips',
    iconName: 'FileText',
    summary: 'Catalog management, lecturer workload limits, printable Senate broadsheets, and vector PDF result slips with verification tracking codes.',
    estimatedMinutes: 4,
  },
  {
    id: 'defense',
    number: '07',
    title: 'Project Defense Presentation & Script',
    shortTitle: 'Defense Presentation',
    subtitle: 'Slide-by-slide presentation outline and panel talking points ready for seminar defense',
    iconName: 'Presentation',
    summary: 'Structured academic defense slides complete with timing, key takeaways, and spoken scripts for project presentation.',
    estimatedMinutes: 6,
  },
  {
    id: 'roadmap',
    number: '08',
    title: 'Critical Evaluation & System Roadmap',
    shortTitle: 'Evaluation & Roadmap',
    subtitle: 'Honest evaluation of what is accomplished, design trade-offs, and recommended enhancements',
    iconName: 'GitMerge',
    summary: 'Thorough review of architectural accomplishments, what was separated, what is left for future development (biometrics, SMS gateway, backend microservices).',
    estimatedMinutes: 4,
  },
];

export interface TechStackItem {
  layer: string;
  technology: string;
  version?: string;
  justification: string;
  icon: string;
}

export const TECH_STACK_ITEMS: TechStackItem[] = [
  {
    layer: 'Frontend Framework',
    technology: 'React 18+',
    version: '^18.3.1',
    justification: 'Component-driven, declarative architecture enabling instantaneous reactive grade updates without destructive DOM re-renders.',
    icon: 'Code2',
  },
  {
    layer: 'Language & Type System',
    technology: 'TypeScript',
    version: '5.x',
    justification: 'Compile-time type safety preventing fatal score arithmetic mismatches, missing student IDs, or malformed result objects.',
    icon: 'ShieldCheck',
  },
  {
    layer: 'Build Tooling',
    technology: 'Vite',
    version: '5.x',
    justification: 'Near-instantaneous hot module server and highly optimized production tree-shaking for enterprise loading speeds.',
    icon: 'Zap',
  },
  {
    layer: 'Styling & Theming',
    technology: 'Tailwind CSS v4',
    version: '4.x',
    justification: 'Zero-runtime utility classes enforcing FUAZ institutional palette (#064e3b), dark mode, and responsive layouts.',
    icon: 'Palette',
  },
  {
    layer: 'Document & PDF Engine',
    technology: 'jsPDF + Canvas',
    version: '^2.5.2',
    justification: 'Direct vector PDF generation in the browser, rendering official university seals, QR tracking codes, and grade tables without server latency.',
    icon: 'Printer',
  },
  {
    layer: 'Accessible UI Primitives',
    technology: 'Radix UI Primitives',
    version: 'Latest',
    justification: 'WAI-ARIA compliant accessible foundations for high-density modal dialogs, broadsheet popups, and dropdown menus.',
    icon: 'Layers',
  },
  {
    layer: 'Data Visualizations',
    technology: 'Lucide & SVG Analytics',
    version: 'Latest',
    justification: 'Lightweight, scalable vector icons and GPA trajectory progression charts without bloated third-party charting libraries.',
    icon: 'BarChart3',
  },
];
