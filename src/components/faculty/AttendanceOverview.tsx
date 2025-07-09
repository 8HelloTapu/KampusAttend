'use client';

import { useState, useEffect, useTransition } from 'react';
import type { Student } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { initializeData, getStudents } from '@/lib/attendanceStore';
import { ShieldAlert, XCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { handleCancelAttendance } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function AttendanceOverview({ branch }: { branch: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isPending, startTransition] = useTransition();
  const [cancellingRollNumber, setCancellingRollNumber] = useState<string | null>(null);
  const { toast } = useToast();

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
  
  const onCancelAttendance = (student: Student) => {
    setCancellingRollNumber(student.rollNumber);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('rollNumber', student.rollNumber);
      formData.append('name', student.name);

      const result = await handleCancelAttendance(formData);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result.success) {
        toast({
          variant: 'success',
          title: 'Attendance Cancelled',
          description: `Attendance for ${result.studentName} has been marked as Absent.`,
        });
      }
      setCancellingRollNumber(null);
    });
  }

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
              <TableHead>Time Marked</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-[120px] text-center">Actions</TableHead>
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
                <TableCell className="font-code">{student.attendanceTime || '—'}</TableCell>
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
                      <div className={`h-2 w-2 rounded-full ${student.status === 'Present' ? 'bg-success-foreground' : 'bg-destructive-foreground'}`}></div>
                      <span>{student.status}</span>
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {student.status === 'Present' && (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isPending && cancellingRollNumber === student.rollNumber}>
                           {isPending && cancellingRollNumber === student.rollNumber ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4" />}
                           <span className="ml-2">Cancel</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel the attendance for <span className="font-bold">{student.name}</span> ({student.rollNumber}) and mark them as Absent. An AI-generated notification will be stored for the student. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Back</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onCancelAttendance(student)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, cancel attendance
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
