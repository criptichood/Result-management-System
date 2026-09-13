/**
 * Academic Session & University Calendar Calculation Utilities
 * Handles automatic academic session generation, progression, validation, and term sequencing.
 */

export interface AcademicTermInfo {
  session: string;
  semester: 1 | 2;
  semesterLabel: string;
  fullLabel: string;
}

/**
 * Parses an academic session string (e.g., "2025/2026", "2025-2026", "2025") into start and end years.
 */
export function parseAcademicSession(sessionStr: string): { startYear: number; endYear: number } {
  if (!sessionStr) {
    const currentYear = new Date().getFullYear();
    return { startYear: currentYear - 1, endYear: currentYear };
  }

  const parts = sessionStr.split(/[\/\-]/).map((p) => parseInt(p.trim(), 10));
  const startYear = !isNaN(parts[0]) && parts[0] > 1900 ? parts[0] : 2025;
  const endYear = parts.length > 1 && !isNaN(parts[1]) && parts[1] > 1900 ? parts[1] : startYear + 1;

  return { startYear, endYear };
}

/**
 * Formats a start year into the standard Nigerian university session notation: "YYYY/YYYY+1".
 */
export function formatAcademicSession(startYear: number): string {
  return `${startYear}/${startYear + 1}`;
}

/**
 * Computes the real-time calendar academic session based on the current date.
 * University academic years in Nigeria typically begin in Autumn (September/October).
 */
export function getCalculatedCurrentSession(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11 (8 = Sept)

  if (month >= 8) {
    // Sept - Dec: Start of new academic session
    return formatAcademicSession(year);
  } else {
    // Jan - Aug: Second half of ongoing academic session
    return formatAcademicSession(year - 1);
  }
}

/**
 * Automatically calculates the next sequential term based on current state.
 */
export function getNextSequentialTerm(
  currentSession: string,
  currentSemester: 1 | 2
): {
  session: string;
  semester: 1 | 2;
  isNewSession: boolean;
  title: string;
  description: string;
} {
  const { startYear } = parseAcademicSession(currentSession);

  if (currentSemester === 1) {
    return {
      session: currentSession,
      semester: 2,
      isNewSession: false,
      title: `Advance to 2nd Semester (${currentSession})`,
      description: `Transition the institution to the 2nd Semester of the current ${currentSession} session. Undergraduates retain their existing level.`,
    };
  } else {
    const nextSession = formatAcademicSession(startYear + 1);
    return {
      session: nextSession,
      semester: 1,
      isNewSession: true,
      title: `Commence New Academic Session (${nextSession})`,
      description: `Inaugurate the 1st Semester of the new ${nextSession} academic session. Undergraduates will progress to the next level (100L ➔ 200L, etc.).`,
    };
  }
}

/**
 * Generates an automatic list of academic session options around a given anchor year.
 * Users never need to manually type session strings.
 */
export function getAcademicSessionOptions(anchorSession?: string): { value: string; label: string; isCurrent: boolean }[] {
  const { startYear } = parseAcademicSession(anchorSession || '2025/2026');
  const currentCalculated = getCalculatedCurrentSession();

  const sessions: { value: string; label: string; isCurrent: boolean }[] = [];
  
  // Generate range: 2 years back to 4 years forward
  for (let y = startYear - 2; y <= startYear + 4; y++) {
    const sessionStr = formatAcademicSession(y);
    sessions.push({
      value: sessionStr,
      label: `${sessionStr} Academic Session`,
      isCurrent: sessionStr === currentCalculated,
    });
  }

  return sessions;
}

/**
 * Formats a full term title cleanly.
 */
export function formatTermDisplay(session: string, semester: 1 | 2): string {
  return `${session} • ${semester === 1 ? '1st Semester' : '2nd Semester'}`;
}
