'use client';

import { useState, useEffect } from 'react';
import type { Student } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initializeData, getStudents } from '@/lib/attendanceStore';
import { ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
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
                  <div className="flex items-center justify-end gap-2">
                    {student.locationWarning && (
                      <Tooltip>
                        <TooltipTrigger>
                           <ShieldAlert className="h-5 w-5 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Location mismatch detected. <br/> Recorded at: {student.location}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Badge variant={student.status === 'Present' ? 'success' : 'destructive'} className="items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${student.status === 'Present' ? 'bg-[hsl(var(--chart-2))]' : 'bg-destructive'}`}></div>
                      <span>{student.status}</span>
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
