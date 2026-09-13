export interface QueryPreset {
  id: string;
  label: string;
  category: 'Query' | 'Insert' | 'Update' | 'Delete';
  description: string;
  query: string;
}

export const QUERY_PRESETS: QueryPreset[] = [
  {
    id: 'broadsheet',
    label: 'Student Grade Broadsheet (SELECT)',
    category: 'Query',
    description: 'JOIN users, courses, enrollments and published results',
    query: `SELECT 
  u.name AS student_name,
  u.matric_number,
  c.code AS course_code,
  c.title AS course_title,
  r.ca_score,
  r.exam_score,
  r.total_score,
  r.grade,
  r.status
FROM results r
JOIN enrollments e ON r.enrollment_id = e.id
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE r.status = 'Published'
ORDER BY u.name ASC, c.code ASC;`
  },
  {
    id: 'carryovers',
    label: 'Failed Results & Carryovers (SELECT)',
    category: 'Query',
    description: 'Find all failed results (grade F or score < 40)',
    query: `SELECT 
  u.name AS student_name,
  u.matric_number,
  u.level AS student_level,
  c.code AS course_code,
  c.title AS course_title,
  r.total_score,
  r.grade,
  e.academic_year
FROM results r
JOIN enrollments e ON r.enrollment_id = e.id
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE r.grade = 'F' OR r.total_score < 40
ORDER BY u.name ASC;`
  },
  {
    id: 'course_stats',
    label: 'Course Stats & Averages (SELECT)',
    category: 'Query',
    description: 'Aggregated metrics, average, min and max scores per course',
    query: `SELECT 
  c.code,
  c.title,
  c.credit_units,
  COUNT(r.id) AS total_graded,
  ROUND(AVG(r.total_score), 2) AS average_score,
  MIN(r.total_score) AS min_score,
  MAX(r.total_score) AS max_score
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN results r ON e.id = r.enrollment_id AND r.status = 'Published'
GROUP BY c.id
ORDER BY total_graded DESC;`
  },
  {
    id: 'insert_course',
    label: 'Insert New Course (INSERT DML)',
    category: 'Insert',
    description: 'Add a new course record directly into SQLite database',
    query: `INSERT INTO courses (
  id, 
  code, 
  title, 
  credit_units, 
  semester, 
  level, 
  department, 
  college, 
  description
) VALUES (
  'c_' || hex(randomblob(4)), 
  'CSC 411', 
  'Cloud Computing Architecture', 
  3, 
  1, 
  400, 
  'Computer Science', 
  'College of Physical Sciences', 
  'Architectures and distributed virtualization paradigms'
);`
  },
  {
    id: 'insert_student',
    label: 'Insert Student Account (INSERT DML)',
    category: 'Insert',
    description: 'Add a new student user record into SQLite users table',
    query: `INSERT INTO users (
  id, 
  name, 
  email, 
  role, 
  college, 
  department, 
  matric_number, 
  level, 
  phone_number
) VALUES (
  'u_' || hex(randomblob(4)), 
  'Abubakar Danladi', 
  'abubakar.d@fuaz.edu.ng', 
  'Student', 
  'College of Physical Sciences', 
  'Computer Science', 
  'UG/2021/01/01/099', 
  400, 
  '+234 809 111 2233'
);`
  },
  {
    id: 'update_setting',
    label: 'Update Academic Session (UPDATE DML)',
    category: 'Update',
    description: 'Update the active session in system_settings table',
    query: `UPDATE system_settings 
SET value = '2024/2025' 
WHERE key = 'currentSession';`
  },
  {
    id: 'students',
    label: 'Student Directory (SELECT)',
    category: 'Query',
    description: 'All registered student accounts with department and level',
    query: `SELECT id, name, matric_number, department, level, email 
FROM users 
WHERE role = 'Student' 
ORDER BY level ASC, name ASC;`
  }
];

export function generateTableDdl(tableInfo: { name: string; columns: Array<{ name: string; type?: string; pk?: number; notnull?: number; dflt_value?: any }> }) {
  const colDefs = tableInfo.columns.map(c => {
    const parts = [`  "${c.name}"`, c.type || 'TEXT'];
    if (c.pk) parts.push('PRIMARY KEY');
    if (c.notnull && !c.pk) parts.push('NOT NULL');
    if (c.dflt_value) parts.push(`DEFAULT ${c.dflt_value}`);
    return parts.join(' ');
  });
  return `CREATE TABLE "${tableInfo.name}" (\n${colDefs.join(',\n')}\n);`;
}
