'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addAbsenceReason } from '@/lib/attendanceStore';
import { MessageSquareWarning, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const absenceSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required.'),
  reason: z.string().min(10, 'Reason must be at least 10 characters long.'),
});

type AbsenceFormValues = z.infer<typeof absenceSchema>;

export default function ReportAbsencePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceSchema),
    defaultValues: {
      rollNumber: '',
      reason: '',
    },
  });

  const onSubmit: SubmitHandler<AbsenceFormValues> = (data) => {
    setIsSubmitting(true);
    
    // This is now a direct client-side call
    const result = addAbsenceReason(data.rollNumber, data.reason);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error,
      });
    } else {
      toast({
        variant: 'success',
        title: 'Reason Submitted',
        description: `Your reason for absence has been recorded for ${result.studentName}.`,
      });
      form.reset();
      router.push('/student');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
        <Card className="w-full max-w-2xl shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                  <MessageSquareWarning /> Report Absence
                </CardTitle>
                <CardDescription>
                  If you were marked absent, please provide your roll number and a reason. This will be visible to your faculty.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Roll Number" {...field} className="font-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Absence</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please provide a brief reason for your absence..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Reason
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
