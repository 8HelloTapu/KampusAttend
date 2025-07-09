'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Loader2, VideoOff, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera not supported on this device');
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
    
    return () => {
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
            toast({
                variant: 'destructive',
                title: 'Location Error',
                description: 'Could not get your location. Please enable location services.',
            });
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
    if (!capturedImage) {
        toast({
          variant: 'destructive',
          title: 'Image Required',
          description: 'Please capture your image to mark attendance.',
        });
        return;
    }
    if (!location) {
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'Please wait for location to be fetched after capturing image.',
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting data:', { ...data, location, image: capturedImage.substring(0, 30) + '...' });
    
    setTimeout(() => {
      setIsSubmitting(false);
      const isMatch = Math.random() > 0.2;

      if (isMatch) {
        toast({
          title: 'Attendance Marked!',
          description: `Welcome, Roll No. ${data.rollNumber}. Your attendance has been recorded successfully.`,
        });
        form.reset();
        handleRetake();
      } else {
        toast({
          variant: 'destructive',
          title: 'Attendance Failed',
          description: 'Verification failed. Please try again.',
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
              Capture your image for verification and enter your roll number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted flex items-center justify-center relative">
                 {hasCameraPermission === false && (
                    <div className="text-center text-muted-foreground p-4">
                        <VideoOff className="mx-auto h-10 w-10" />
                        <p className="mt-2">Camera access not available.</p>
                        <p className="text-xs">Please check permissions in your browser.</p>
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
                    <Image src={capturedImage} alt="Captured student photo" fill className="object-cover" />
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
                    <Input placeholder="e.g., R001" {...field} />
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
            <Button type="submit" className="w-full" disabled={isSubmitting || !capturedImage || !location}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Verifying...' : 'Mark Attendance'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
