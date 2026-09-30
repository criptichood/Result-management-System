/**
 * Class Grading Roster — CSV build & parse.
 *
 * Single source of truth for the roster round-trip. Two callers used to export
 * their own near-identical copy (`LecturerDashboard.handleDownloadCSV` and
 * `LecturerCsvUploadModal.handleDownloadTemplate`) which had drifted apart, and
 * the parser was a naive `split(',')` that broke on any quoted field holding a
 * comma. Both now live here.
 *
 * The exported Total and Grade cells carry live spreadsheet formulas so a
 * lecturer sees the arithmetic as they type. They are a *convenience only*:
 * the parser below deliberately ignores those two columns and recomputes from
 * CA and Exam. That is what makes the round trip safe — a file edited in a tool
 * that never evaluates formulas, or a formula that survived as literal text
 * (`=F2+G2`), cannot poison the marks.
 */

import { Course } from '../types';
import { calculateLetterGrade } from './academicOperations';

export const CA_MAX = 40;
export const EXAM_MAX = 60;
export const TOTAL_MAX = 100;

/** NUC 5-point grading key, embedded in every exported roster. */
export interface NucBand {
  grade: string;
  range: string;
  point: number;
  interpretation: string;
}

export const NUC_GRADING_BANDS: NucBand[] = [
  { grade: 'A', range: '70 - 100', point: 5, interpretation: 'Excellent' },
  { grade: 'B', range: '60 - 69', point: 4, interpretation: 'Very Good' },
  { grade: 'C', range: '50 - 59', point: 3, interpretation: 'Good' },
  { grade: 'D', range: '45 - 49', point: 2, interpretation: 'Fair / Moderate Pass' },
  { grade: 'E', range: '40 - 44', point: 1, interpretation: 'Pass (Minimum Pass Threshold)' },
  { grade: 'F', range: '0 - 39', point: 0, interpretation: 'Fail (Carryover Required)' },
];

export interface ParsedRow {
  matricNumber: string;
  studentName?: string;
  department?: string;
  level?: number | string;
  enrollmentId?: string;
  caScore: string;
  examScore: string;
  totalScore?: number | null;
  grade?: string | null;
  isValid: boolean;
  errors: string[];
}

export interface RosterStudent {
  enrollmentId: string;
  student?: { name?: string; matricNumber?: string; department?: string; level?: number } | null;
}

/** Column order of the roster block. Index 9 is a spacer, 10-13 are the grading key. */
const ROSTER_HEADERS = [
  'S/N',
  'Matric Number',
  'Student Name',
  'Department',
  'Level',
  `CA Score (${CA_MAX})`,
  `Exam Score (${EXAM_MAX})`,
  `Total (${TOTAL_MAX})`,
  'Grade',
] as const;

/** How many leading columns are the actual roster; the key sits after a spacer. */
const ROSTER_WIDTH = ROSTER_HEADERS.length;
const SPACER_COL = ROSTER_WIDTH; // index 9
const KEY_START_COL = ROSTER_WIDTH + 1; // index 10

/** Escapes a value for CSV, and neutralises spreadsheet formula injection. */
function toCsvField(value: string | number): string {
  let text = value === null || value === undefined ? '' : String(value);
  // A leading = + - @ makes Excel treat the cell as a formula. Only the two
  // formula columns are meant to do that, so neutralise it everywhere else.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

/**
 * Emits a cell verbatim — no formula-injection guard, because these two cells
 * are *meant* to be formulas.
 *
 * It still has to be CSV-quoted. A formula contains commas (`=IF(a,b,c)`), and
 * an unquoted comma is a cell separator, so the spreadsheet would read
 * `=IF(COUNT(F2:G2)=0` as the Total and spill the remainder into the next
 * columns. Quoting with doubled inner quotes keeps it one cell; the
 * spreadsheet unquotes it, sees a leading `=`, and evaluates it.
 */
function toFormulaCsvField(formula: string): string {
  return `"${formula.replace(/"/g, '""')}"`;
}

const colLetter = (index: number) => {
  let n = index;
  let out = '';
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
};

export interface BuildRosterOptions {
  course: Course;
  students: RosterStudent[];
  /** Current CA/Exam for a student, as raw strings (empty = not yet entered). */
  getScores: (enrollmentId: string) => { ca: string; exam: string };
}

/**
 * Builds the roster CSV: nine roster columns with live Total/Grade formulas,
 * then a spacer, then the NUC grading key in four more columns.
 */
export function buildGradingRosterCsv({
  course,
  students,
  getScores,
}: BuildRosterOptions): string {
  const caCol = colLetter(5);
  const examCol = colLetter(6);
  const totalCol = colLetter(7);

  const headerCells = [
    ...ROSTER_HEADERS.map(toCsvField),
    toCsvField(''), // spacer
    toCsvField('NUC Grade'),
    toCsvField('Range (%)'),
    toCsvField('Grade Point'),
    toCsvField('Interpretation'),
  ];

  // First spreadsheet row after the header is row 2.
  const rows = students.map((s, idx) => {
    const row = idx + 2;
    const { ca, exam } = getScores(s.enrollmentId);

    // Blank when neither component has been entered, so an untouched row is
    // not reported as a zero.
    const totalFormula = `=IF(COUNT(${caCol}${row}:${examCol}${row})=0,"",${caCol}${row}+${examCol}${row})`;
    const gradeFormula =
      `=IF(${totalCol}${row}="","",` +
      `IF(${totalCol}${row}>=70,"A",` +
      `IF(${totalCol}${row}>=60,"B",` +
      `IF(${totalCol}${row}>=50,"C",` +
      `IF(${totalCol}${row}>=45,"D",` +
      `IF(${totalCol}${row}>=40,"E","F"))))))`;

    const cells = [
      toCsvField(idx + 1),
      toCsvField(s.student?.matricNumber || ''),
      toCsvField(s.student?.name || ''),
      toCsvField(s.student?.department || course.department),
      toCsvField(s.student?.level ?? course.level),
      toCsvField(ca),
      toCsvField(exam),
      toFormulaCsvField(totalFormula),
      toFormulaCsvField(gradeFormula),
      toCsvField(''), // spacer
      ...(NUC_GRADING_BANDS[idx] ? [NUC_GRADING_BANDS[idx]] : []).flatMap((band) => [
        toCsvField(band.grade),
        toCsvField(band.range),
        toCsvField(band.point),
        toCsvField(band.interpretation),
      ]),
    ];

    return cells.join(',');
  });

  // Keep the key visible even for a short roster.
  const notes: string[] = [];
  NUC_GRADING_BANDS.forEach((band, idx) => {
    notes.push(
      [
        toCsvField(''), // S/N
        toCsvField(''), // Matric
        toCsvField(''), // Name
        toCsvField(''), // Dept
        toCsvField(''), // Level
        toCsvField(''), // CA
        toCsvField(''), // Exam
        toCsvField(''), // Total
        toCsvField(''), // Grade
        toCsvField(''), // spacer
        toCsvField(band.grade),
        toCsvField(band.range),
        toCsvField(band.point),
        toCsvField(band.interpretation),
      ].join(',')
    );
    void idx;
  });

  return [headerCells.join(','), ...rows, ...notes].join('\r\n');
}

export function downloadRosterCsv(filename: string, csv: string) {
  // BOM so Excel opens UTF-8 names correctly on Windows.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Splits CSV text into rows of fields, honouring quoted fields and escapes. */
function splitCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

export interface ParseRosterOptions {
  course: Course;
  students: RosterStudent[];
}

/**
 * Validates one candidate's CA/Exam and resolves them against the enrolment.
 *
 * Shared by the file parser and the manual preview editor so a row can never
 * pass one path and fail the other.
 */
export function validateRosterRow(
  matric: string,
  caStr: string,
  examStr: string,
  matricMap: Map<string, RosterStudent>,
  course: Course
): ParsedRow {
  const errors: string[] = [];
  const normalizedMatric = matric.trim().toUpperCase();
  const studentMatch = matricMap.get(normalizedMatric);

  if (!studentMatch) {
    errors.push(`Matric No "${normalizedMatric}" is not enrolled in this course`);
  }

  const caNum = parseFloat(caStr);
  if (caStr !== '' && !isNaN(caNum) && (caNum < 0 || caNum > CA_MAX)) {
    errors.push(`CA score (${caNum}) exceeds 0-${CA_MAX} range`);
  }
  const examNum = parseFloat(examStr);
  if (examStr !== '' && !isNaN(examNum) && (examNum < 0 || examNum > EXAM_MAX)) {
    errors.push(`Exam score (${examNum}) exceeds 0-${EXAM_MAX} range`);
  }

  const hasCa = caStr !== '' && !isNaN(caNum);
  const hasExam = examStr !== '' && !isNaN(examNum);
  // Always recomputed. The Total/Grade columns in the file are a convenience
  // for the person editing it and are never trusted.
  const totalScore = hasCa || hasExam ? (hasCa ? caNum : 0) + (hasExam ? examNum : 0) : null;

  return {
    matricNumber: normalizedMatric,
    studentName: studentMatch?.student?.name || 'Unmatched',
    department: studentMatch?.student?.department || course.department,
    level: studentMatch?.student?.level || course.level,
    enrollmentId: studentMatch?.enrollmentId,
    caScore: caStr,
    examScore: examStr,
    totalScore,
    grade: totalScore !== null ? calculateLetterGrade(totalScore) : null,
    isValid: errors.length === 0 && !!studentMatch,
    errors,
  };
}

export interface ParseRosterResult {
  rows: ParsedRow[];
  /** Non-roster lines skipped, e.g. the grading key exported alongside the roster. */
  ignoredLines: number;
  error?: string;
}

export function parseGradingRosterCsv(
  text: string,
  { course, students }: ParseRosterOptions
): ParseRosterResult {
  const all = splitCsv(text);
  if (all.length < 2) return { rows: [], ignoredLines: 0, error: 'File has no data rows.' };

  const header = all[0].map((h) => h.replace(/'/g, '').trim().toLowerCase());
  // Only trust the roster block, never the grading-key columns to its right.
  const rosterHeader = header.slice(0, ROSTER_WIDTH);

  const findIndex = (pred: (h: string) => boolean, fallback: number) => {
    const found = rosterHeader.findIndex(pred);
    return found === -1 ? fallback : found;
  };

  const matricIdx = findIndex(
    (h) => h.includes('matric') || h.includes('reg') || h.includes('student no'),
    rosterHeader[0].includes('s/n') || rosterHeader[0] === '#' ? 1 : 0
  );
  const caIdx = findIndex(
    (h) =>
      (h.includes('ca') && !h.includes('candidate')) ||
      h.includes('assessment') ||
      h.includes('(40)'),
    2
  );
  const examIdx = findIndex(
    (h) => h.includes('exam') || h.includes('examination') || h.includes('final') || h.includes('(60)'),
    3
  );

  const matricMap = new Map<string, RosterStudent>();
  students.forEach((s) => {
    if (s.student?.matricNumber) {
      matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
    }
  });

  const rows: ParsedRow[] = [];
  let ignoredLines = 0;
  let stopped = false;

  for (let i = 1; i < all.length; i++) {
    const cols = all[i];

    if (stopped) {
      ignoredLines++;
      continue;
    }

    const matricRaw = (cols[matricIdx] || '').replace(/'/g, '').trim();
    // Roster rows are contiguous. The first row with no matric number marks the
    // end of the data (blank line, or the grading key that follows the roster).
    if (!matricRaw) {
      stopped = true;
      ignoredLines++;
      continue;
    }

    const caStr = (cols[caIdx] || '').replace(/'/g, '').trim();
    const examStr = (cols[examIdx] || '').replace(/'/g, '').trim();

    rows.push(validateRosterRow(matricRaw, caStr, examStr, matricMap, course));
  }

  return { rows, ignoredLines };
}
