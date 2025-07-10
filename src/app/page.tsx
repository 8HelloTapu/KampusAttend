
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KampusAttendLogo from '@/components/AttendaVisionLogo';
import { MoveRight, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden bg-background p-4">
           <div className="absolute inset-0 z-0 h-full w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="z-10 flex flex-col items-center text-center">
            <div 
              className="mb-6 animate-fade-in-down"
              style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
            >
              <KampusAttendLogo className="h-20 w-20 text-primary" />
            </div>
            
            <h1 
              className="animate-fade-in-down text-5xl font-bold tracking-tight text-foreground md:text-7xl font-headline"
              style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
            >
              KampusAttend
            </h1>
            
            <p 
              className="mt-2 max-w-2xl animate-fade-in-down text-lg text-foreground/80"
              style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
            >
              Campus life. Digitally marked.
            </p>

            <div 
              className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
            >
              <Link href="/auth">
                <Button size="lg" className="group text-lg shadow-lg">
                  Let's Mark Attendance
                  <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" variant="outline" className="text-lg shadow-lg">
                    <Info className="mr-2 h-5 w-5" />
                    Evaluator Instructions
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Instructions for Evaluators</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-4 text-left pt-2 text-foreground/90">
                        <p>Welcome! Here’s how to test the key features of the KampusAttend prototype:</p>
                        
                        <ol className="list-decimal list-inside space-y-3">
                          <li>
                            <strong>Open the Attendance Window (as Faculty):</strong>
                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm">
                              <li>Navigate to the <span className="font-bold text-primary">Faculty Portal</span>.</li>
                              <li>Login with Username: <code className="font-bold bg-muted p-1 rounded">faculty</code> and Password: <code className="font-bold bg-muted p-1 rounded">password</code>.</li>
                              <li>On the dashboard, click the <span className="font-bold">"Start Attendance"</span> button. This opens a 30-minute window for students to mark their attendance.</li>
                            </ul>
                          </li>
                          <li>
                             <strong>Mark Attendance (as Student):</strong>
                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm">
                              <li>Navigate to the <span className="font-bold text-primary">Student Portal</span>.</li>
                              <li>Login with Username: <code className="font-bold bg-muted p-1 rounded">student</code> and Password: <code className="font-bold bg-muted p-1 rounded">password</code>.</li>
                              <li>On the student page, enter a valid Roll Number (e.g., <code className="font-bold bg-muted p-1 rounded">23XV1M0545</code>) and click "Mark Attendance".</li>
                               <li>You can now return to the Faculty dashboard to see the status updated to "Present" in real-time.</li>
                            </ul>
                          </li>
                           <li>
                             <strong>Explore AI & Other Features (as Faculty):</strong>
                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm">
                                <li>Use the <span className="font-bold">"AI Attendance Assistant"</span> tab to ask questions like "who is absent?".</li>
                                <li>Use the <span className="font-bold">"Location Anomaly Report"</span> to see a list of students who are not on campus.</li>
                                <li>In the <span className="font-bold">"Overview"</span> tab, you can <span className="font-bold text-destructive">cancel</span> a student's attendance. This will mark them absent and send an AI-generated notification.</li>
                            </ul>
                          </li>
                          <li>
                             <strong>Check Notifications (as Student):</strong>
                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm">
                                <li>Go to the <span className="font-bold">Student Portal</span> and click <span className="font-bold">"Check Notifications"</span>.</li>
                                <li>Enter the roll number whose attendance you cancelled to see the AI-generated message.</li>
                            </ul>
                          </li>
                        </ol>
                        <p>Thank you for evaluating the application!</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

