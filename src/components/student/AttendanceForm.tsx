
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
  const [placeholder, setPlaceholder] = useState('e.g., 23XV1M0545');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    
    const studentBranch = localStorage.getItem('studentBranch');
    if (studentBranch === 'CSE(DS)') {
      setPlaceholder('e.g., 23XV1M6701');
    } else {
      setPlaceholder('e.g., 23XV1M0545');
    }

    const checkWindow = () => setIsWindowOpen(isAttendanceWindowOpen());
    checkWindow();
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'attendanceSession') {
        checkWindow();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(checkWindow, 10000); 

    return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
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

  const handleVerificationAndMarking = (data: AttendanceFormValues, livePhotoDataUri: string, coords: GeolocationCoordinates) => {
    startTransition(async () => {
        setIsLocating(false);
        const formData = new FormData();
        formData.append('rollNumber', data.rollNumber);
        formData.append('livePhotoDataUri', livePhotoDataUri);
  
        const response = await handleAttendanceVerification(formData);
        
        if (response.error || !response.result?.isMatch) {
          toast({
            variant: 'destructive',
            title: 'Verification Failed',
            description: response.error || response.result?.message || 'Could not verify your identity.',
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
            variant: 'destructive',
            title: 'Already Marked',
            description: `Hi ${student.name}, your attendance is already marked as Present.`,
          });
          form.reset();
          return;
        }
  
        const { locationWarning } = markPresent(data.rollNumber, { latitude: coords.latitude, longitude: coords.longitude });
        const markedTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const successTitle = response.result?.message || 'Verification Successful!';
        if (locationWarning) {
          toast({
              variant: 'success',
              title: successTitle,
              description: `Welcome, ${student.name}. Your location seems far from campus, but attendance has been successfully recorded at ${markedTime}.`,
              duration: 5000,
          });
        } else {
          toast({
              variant: 'success',
              title: successTitle,
              description: `Welcome, ${student.name}. Your attendance has been recorded at ${markedTime}.`,
          });
        }
        
        form.reset();
        
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
    });
  }

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    if (!isWindowOpen) {
      toast({ variant: 'destructive', title: 'Attendance Window Closed', description: 'The time to mark attendance has passed.' });
      return;
    }
    
    const studentBranch = localStorage.getItem('studentBranch');
    const rollNumber = data.rollNumber.toUpperCase();

    if (studentBranch === 'B.Tech CSE' && !rollNumber.includes('M05')) {
        toast({
            variant: 'destructive',
            title: 'Incorrect Branch',
            description: 'This roll number does not belong to the B.Tech CSE branch. Please check the roll number and try again.',
        });
        return;
    }

    if (studentBranch === 'CSE(DS)' && !rollNumber.includes('M67')) {
        toast({
            variant: 'destructive',
            title: 'Incorrect Branch',
            description: 'This roll number does not belong to the CSE(DS) branch. Please check the roll number and try again.',
        });
        return;
    }
    
    if (!videoRef.current || !canvasRef.current) {
        toast({ variant: 'destructive', title: 'Camera Error', description: 'Camera or system components are not ready.' });
        return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        toast({ variant: 'destructive', title: 'System Error', description: 'Could not capture image.' });
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const livePhotoDataUri = canvas.toDataURL('image/jpeg');

    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      toast({ variant: 'destructive', title: 'Geolocation Not Supported', description: 'Your browser does not support location services.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleVerificationAndMarking(data, livePhotoDataUri, position.coords);
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
              Enter your roll number and allow camera access. Verification is based on roll number only for this prototype. Facial recognition will be added soon.
            </CardDescription>
          </CardHeader>

          {!isWindowOpen ? (
            <CardContent>
              <Alert variant="destructive">
                <TimerOff className="h-4 w-4" />
                <AlertTitle>Attendance Window Closed</AlertTitle>
                <AlertDescription>
                  <p>The time limit for marking attendance has passed. Please contact your faculty.</p>
                  <p className="mt-2 text-xs italic">(Evaluator: Please go to the Faculty Dashboard and click 'Start Attendance' to open the window.)</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center p-8 bg-muted rounded-lg border-2 border-dashed relative aspect-video">
                  <video ref={videoRef} className="w-full h-full absolute inset-0 object-cover rounded-md" autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
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
                        <Input placeholder={placeholder} {...field} disabled={hasCameraPermission !== true || isSubmitting}/>
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
