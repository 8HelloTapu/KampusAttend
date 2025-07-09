'use client';

import { useState, useEffect } from 'react';
import type { Student } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initializeData, getStudents } from '@/lib/attendanceStore';

export function AttendanceOverview({ branch }: { branch: string }) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    initializeData();
    setStudents(getStudents(branch));

    const handleStorageUpdate = () => {
      setStudents(getStudents(branch));
    };

    window.addEventListener('storageUpdate', handleStorageUpdate);

    return () => {
      window.removeEventListener('storageUpdate', handleStorageUpdate);
    };
  }, [branch]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0]?.[0] || '';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student: Student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person student" />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className='font-code'>{student.rollNumber}</TableCell>
              <TableCell>{student.branch}</TableCell>
              <TableCell className="text-right">
                <Badge variant={student.status === 'Present' ? 'secondary' : 'destructive'} className="items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${student.status === 'Present' ? 'bg-[hsl(var(--chart-2))]' : 'bg-destructive'}`}></div>
                  <span>{student.status}</span>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
