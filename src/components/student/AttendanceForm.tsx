
'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TimerOff, VideoOff, LocateFixed } from 'lucide-react';
import { findStudent, markPresent, isAttendanceWindowOpen, initializeData } from '@/lib/attendanceStore';
import { handleAttendanceVerification } from '@/app/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const attendanceSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required.'),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendanceForm() {
  const [isPending, startTransition] = useTransition();
  const [isLocating, setIsLocating] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      rollNumber: '',
    },
  });

  useEffect(() => {
    initializeData();

    const checkWindow = () => setIsWindowOpen(isAttendanceWindowOpen());
    checkWindow();
    const interval = setInterval(checkWindow, 10000); 

    return () => {
        clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  const handleVerificationAndMarking = (data: AttendanceFormValues, coords: GeolocationCoordinates) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('rollNumber', data.rollNumber);

      const response = await handleAttendanceVerification(formData);
      setIsLocating(false);

      if (response.error || !response.result?.isMatch) {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: response.error || response.result?.message || 'Could not verify your roll number.',
        });
        return;
      }

      const student = findStudent(data.rollNumber);
      if (!student) {
        toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'Could not find student data after verification.',
        });
        return;
      }

      if (student.status === 'Present') {
        toast({
          variant: 'default',
          title: 'Already Marked',
          description: `Hi ${student.name}, your attendance is already marked as Present.`,
        });
        form.reset();
        return;
      }

      // If we reach here, it's a successful, new attendance marking.
      const { locationWarning } = markPresent(data.rollNumber, { latitude: coords.latitude, longitude: coords.longitude });
      
      if(locationWarning) {
        toast({
            variant: 'destructive',
            title: 'Location Warning!',
            description: `Welcome, ${student.name}. Your location seems to be far from campus, but your attendance has been recorded with a warning.`,
            duration: 5000,
        });
      } else {
        toast({
            title: 'Verification Successful!',
            description: `Welcome, ${student.name}. Your attendance has been recorded.`,
        });
      }
      
      // The redirect should be the final action.
      setTimeout(() => {
        router.push('/');
      }, 2000);

      form.reset();
    });
  }

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    if (!isWindowOpen) {
      toast({ variant: 'destructive', title: 'Attendance Window Closed', description: 'The time to mark attendance has passed.' });
      return;
    }
    
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      toast({ variant: 'destructive', title: 'Geolocation Not Supported', description: 'Your browser does not support location services.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleVerificationAndMarking(data, position.coords);
      },
      (error) => {
        setIsLocating(false);
        toast({ variant: 'destructive', title: 'Location Error', description: `Could not get your location: ${error.message}` });
      }
    );
  };

  const isSubmitting = isPending || isLocating;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Mark Your Attendance</CardTitle>
            <CardDescription>
              Enter your roll number and allow camera &amp; location access. For this
              prototype, verification is based on roll number only. Image
              verification feature will be added soon.
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
                <div className="flex justify-center items-center p-8 bg-muted rounded-lg border-2 border-dashed relative aspect-video">
                  <video ref={videoRef} className="w-full h-full absolute inset-0 object-cover rounded-md" autoPlay muted playsInline />
                  {hasCameraPermission === false && (
                      <div className="flex flex-col items-center justify-center text-muted-foreground z-10 p-4 bg-background/80 rounded-lg">
                          <VideoOff className="w-12 h-12 mb-2" />
                          <p className="text-center">Camera permission denied.</p>
                      </div>
                  )}
                  {hasCameraPermission === null && (
                      <div className="flex flex-col items-center justify-center text-muted-foreground z-10">
                          <Loader2 className="w-12 h-12 animate-spin" />
                      </div>
                  )}
                </div>

                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser settings to continue. The submit button is disabled until access is granted.
                        </AlertDescription>
                    </Alert>
                )}

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 23XV1M0501" {...field} disabled={hasCameraPermission !== true || isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || hasCameraPermission !== true}>
                  {isLocating && <LocateFixed className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLocating ? 'Getting Location...' : isPending ? 'Verifying...' : 'Mark Attendance'}
                </Button>
              </CardFooter>
            </>
          )}
        </form>
      </Form>
    </Card>
  );
}
