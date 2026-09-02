import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AdminUsersTabProps {
  users: any[];
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ users }) => {
  return (
    <Card id="admin-users-tab">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users in the system.</CardDescription>
        </div>
        <Button id="btn-add-user" className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#064e3b]">Add New User</Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID / Matric</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>College</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.name}
                  <div className="text-xs text-slate-500 font-normal">{u.email}</div>
                </TableCell>
                <TableCell>{u.staffId || u.matricNumber}</TableCell>
                <TableCell>
                  <Badge variant={
                    u.role === 'Admin' ? 'destructive' : 
                    u.role === 'Chief Examiner' ? 'warning' : 
                    u.role === 'Lecturer' ? 'success' : 'default'
                  }>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>{u.college || '-'}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center text-xs font-medium text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                    Active
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
