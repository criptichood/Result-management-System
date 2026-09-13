import React, { RefObject } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Download, FileCode, Upload, RotateCcw } from 'lucide-react';

interface SqlMaintenanceTabProps {
  handleDownloadSqliteFile: () => void;
  handleDownloadSqlDump: () => void;
  handleResetDatabase: () => Promise<void>;
  fileInputRef: RefObject<HTMLInputElement>;
}

export const SqlMaintenanceTab: React.FC<SqlMaintenanceTabProps> = ({
  handleDownloadSqliteFile,
  handleDownloadSqlDump,
  handleResetDatabase,
  fileInputRef,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Export Binary .sqlite */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Export SQLite Database (.sqlite)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download the exact binary SQLite database file with all tables, constraints, and records.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            This file can be opened directly with tools like <strong>DB Browser for SQLite</strong> or <strong>DBeaver</strong>, or backed up for offline testing.
          </p>
          <Button
            onClick={handleDownloadSqliteFile}
            className="bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .sqlite Binary</span>
          </Button>
        </CardContent>
      </Card>

      {/* Export SQL Script Dump */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Export SQL Script Dump (.sql)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate standard SQL DDL schema creation and INSERT statements.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Plaintext SQL script containing full table creation definitions and INSERT batches for version control or migration.
          </p>
          <Button
            variant="outline"
            onClick={handleDownloadSqlDump}
            className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs gap-1.5 cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>Download .sql Script</span>
          </Button>
        </CardContent>
      </Card>

      {/* Import Database Binary */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Import SQLite Database (.sqlite)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload an external SQLite database file to replace current state.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Accepts <code>.sqlite</code>, <code>.db</code>, or <code>.sqlite3</code> files. Replaces tables and updates all student, course, and grade records in real time.
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-amber-300 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold text-xs gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            <span>Choose .sqlite File to Import</span>
          </Button>
        </CardContent>
      </Card>

      {/* Reset to Clean Seed State */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Re-Seed Institutional Database
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reset tables and populate standard FUAZ academic data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Clears all custom testing records and restores standard departments, courses, user accounts, and test results.
          </p>
          <Button
            variant="destructive"
            onClick={handleResetDatabase}
            className="font-bold text-xs gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database to Seed State</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
