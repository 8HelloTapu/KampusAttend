'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TimerOff, UserCheck } from 'lucide-react';
import { findStudent, markPresent, isAttendanceWindowOpen } from '@/lib/attendanceStore';
import { handleAttendanceVerification } from '@/app/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const attendanceSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required.'),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendanceForm() {
  const [isPending, startTransition] = useTransition();
  const [isWindowOpen, setIsWindowOpen] = useState(true);

  const { toast } = useToast();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      rollNumber: '',
    },
  });

  useEffect(() => {
    const checkWindow = () => setIsWindowOpen(isAttendanceWindowOpen());
    checkWindow();
    const interval = setInterval(checkWindow, 10000); 

    return () => {
        clearInterval(interval);
    };
  }, []);

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    if (!isWindowOpen) {
      toast({ variant: 'destructive', title: 'Attendance Window Closed', description: 'The time to mark attendance has passed.' });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('rollNumber', data.rollNumber);

      const response = await handleAttendanceVerification(formData);

      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
        return;
      }

      if (response.result?.isMatch) {
        const student = findStudent(data.rollNumber);
        if (student) {
          if (student.status === 'Present') {
              toast({
                  variant: 'default',
                  title: 'Already Marked',
                  description: `Hi ${student.name}, your attendance is already marked as Present.`,
              });
          } else {
              markPresent(data.rollNumber);
              toast({
                  title: 'Verification Successful!',
                  description: `Welcome, ${student.name}. Your attendance has been recorded.`,
              });
          }
          form.reset();
        } else {
          toast({
            variant: 'destructive',
            title: 'Verification Error',
            description: 'Could not find student data after verification.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: response.result?.message || 'Could not verify your roll number.',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Mark Your Attendance</CardTitle>
            <CardDescription>
              Enter your roll number to mark your attendance.
            </CardDescription>
          </CardHeader>

          {!isWindowOpen ? (
            <CardContent>
              <Alert variant="destructive">
                <TimerOff className="h-4 w-4" />
                <AlertTitle>Attendance Window Closed</AlertTitle>
                <AlertDescription>
                  The time limit for marking attendance has passed. Please contact your faculty.
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-6">
                 <div className="flex justify-center p-8 bg-muted rounded-lg border-2 border-dashed">
                    <UserCheck className="w-24 h-24 text-muted-foreground" />
                </div>
                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 23XV1M0501" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Verifying...' : 'Mark Attendance'}
                </Button>
              </CardFooter>
            </>
          )}
        </form>
      </Form>
    </Card>
  );
}
