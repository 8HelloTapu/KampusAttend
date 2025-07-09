'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';

const attendanceSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required.'),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      rollNumber: '',
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationError(null);
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
          setLocation(null);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    if (!location) {
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'Please enable location services to mark attendance.',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate a successful match
      const isMatch = Math.random() > 0.2; // 80% success rate

      if (isMatch) {
        toast({
          title: 'Attendance Marked!',
          description: `Welcome, Roll No. ${data.rollNumber}. Your attendance has been recorded successfully.`,
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Attendance Failed',
          description: 'Image or location verification failed. Please try again.',
        });
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Mark Your Attendance</CardTitle>
            <CardDescription>
              Please enter your roll number and capture your image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted">
                 <Image src="https://placehold.co/400x225.png" alt="Camera placeholder" width={400} height={225} className="h-full w-full object-cover" data-ai-hint="camera person" />
              </div>
              <Button type="button" variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Capture Image
              </Button>
            </div>
            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., R001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Your Location:
                </div>
                {location && <span className="font-mono font-code text-foreground">{location}</span>}
                {locationError && <span className="text-destructive">{locationError}</span>}
                {!location && !locationError && <span className="text-muted-foreground">Fetching...</span>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting || !location}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Verifying...' : 'Mark Attendance'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
