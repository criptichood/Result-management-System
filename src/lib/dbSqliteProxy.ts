import { sqliteEngine } from './sqliteEngine';

export async function executeSqlWithSync(sql: string, params: any[] = []) {
  await sqliteEngine.init();
  const result = sqliteEngine.executeQuery(sql, params);
  const isMutation =
    sql.trim().toUpperCase().startsWith('INSERT') ||
    sql.trim().toUpperCase().startsWith('UPDATE') ||
    sql.trim().toUpperCase().startsWith('DELETE') ||
    sql.trim().toUpperCase().startsWith('REPLACE');
  return { result, isMutation };
}

export function getSqliteTablesInfo() {
  return sqliteEngine.getTablesInfo();
}

export function exportSqliteBinaryData() {
  return sqliteEngine.exportDatabaseBinary();
}

export function generateSqlDumpData() {
  return sqliteEngine.generateSqlDump();
}

export async function importSqliteBinaryData(buffer: ArrayBuffer | Uint8Array) {
  await sqliteEngine.importDatabaseBinary(buffer);
}
