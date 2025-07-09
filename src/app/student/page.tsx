
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { AttendanceForm } from '@/components/student/AttendanceForm';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { Bell, MessageSquareWarning } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isStudentLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login/student');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
                <div className="w-full max-w-md space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="w-full max-w-md space-y-4">
            <AttendanceForm />
            <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/student/notifications" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                    <Bell className="mr-2 h-4 w-4"/>
                    Check Notifications
                </Link>
                <Link href="/student/report-absence" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                    <MessageSquareWarning className="mr-2 h-4 w-4"/>
                    Report Absence
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
