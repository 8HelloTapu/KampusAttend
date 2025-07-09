'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Loader2, VideoOff, RefreshCw, TimerOff } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { findStudent, markPresent, isAttendanceWindowOpen } from '@/lib/attendanceStore';
import { handleAttendanceVerification } from '@/app/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const attendanceSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required.'),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isWindowOpen, setIsWindowOpen] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        clearInterval(interval);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);
  
  const getLocation = () => {
      setLocation(null);
      setLocationError(null);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setLocationError(null);
          },
          (error) => {
            setLocationError(`Error: ${error.message}`);
            setLocation(null);
          }
        );
      } else {
        setLocationError('Geolocation is not supported.');
      }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        getLocation();
      }
    }
  };
  
  const handleRetake = () => {
      setCapturedImage(null);
      setLocation(null);
      setLocationError(null);
  }

  const onSubmit: SubmitHandler<AttendanceFormValues> = (data) => {
    if (!isWindowOpen) {
      toast({ variant: 'destructive', title: 'Attendance Window Closed', description: 'The time to mark attendance has passed.' });
      return;
    }
    if (!capturedImage) {
        toast({ variant: 'destructive', title: 'Image Required', description: 'Please capture your image.' });
        return;
    }
    if (!location) {
      toast({ variant: 'destructive', title: 'Location Required', description: 'Please wait for location to be fetched.' });
      return;
    }

    setIsSubmitting(true);
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('rollNumber', data.rollNumber);
      formData.append('capturedPhotoDataUri', capturedImage);

      const response = await handleAttendanceVerification(formData);
      setIsSubmitting(false);

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
          markPresent(data.rollNumber);
          toast({
            title: 'Verification Successful!',
            description: `Welcome, ${student.name}. Your attendance has been recorded.`,
          });
          form.reset();
          handleRetake();
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
          description: response.result?.message || 'Could not verify your identity.',
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
              Capture your image for AI verification and enter your roll number.
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
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted flex items-center justify-center relative">
                    {hasCameraPermission === false && (
                        <div className="text-center text-muted-foreground p-4">
                            <VideoOff className="mx-auto h-10 w-10" />
                            <p className="mt-2">Camera access denied.</p>
                        </div>
                    )}
                    {hasCameraPermission === null && (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                            <p className="mt-2">Starting camera...</p>
                        </div>
                    )}
                    <video ref={videoRef} className={cn("h-full w-full object-cover", capturedImage || hasCameraPermission !== true ? 'hidden' : 'block')} autoPlay muted playsInline />
                    {capturedImage && (
                        <Image src={capturedImage} alt="Captured student photo" fill className="object-cover" data-ai-hint="person student" />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  {!capturedImage ? (
                    <Button type="button" variant="outline" className="w-full" onClick={handleCapture} disabled={hasCameraPermission !== true}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Image
                    </Button>
                  ) : (
                    <Button type="button" variant="secondary" className="w-full" onClick={handleRetake}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retake Image
                    </Button>
                  )}
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
                {capturedImage && (
                    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 text-sm">
                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            Your Location:
                        </div>
                        {location && <span className="font-mono font-code text-foreground">{location}</span>}
                        {locationError && <span className="text-destructive">{locationError}</span>}
                        {!location && !locationError && <span className="text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Fetching...</span>}
                    </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || isPending || !capturedImage || !location}>
                  {(isSubmitting || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {(isSubmitting || isPending) ? 'Verifying with AI...' : 'Mark Attendance'}
                </Button>
              </CardFooter>
            </>
          )}
        </form>
      </Form>
    </Card>
  );
}
