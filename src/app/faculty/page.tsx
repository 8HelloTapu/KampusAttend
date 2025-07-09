'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceOverview } from '@/components/faculty/AttendanceOverview';
import { AttendanceQuery } from '@/components/faculty/AttendanceQuery';
import { AbsenteeAlerts } from '@/components/faculty/AbsenteeAlerts';
import { Users, Bot, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { startAttendanceSession, getAttendanceSession, isAttendanceWindowOpen } from '@/lib/attendanceStore';

const ALL_CLASSES = [
  { value: 'B.Tech CSE', label: 'B.Tech CSE' },
  { value: 'CSE(DS)', label: 'CSE (Data Science)' },
];

export default function FacultyDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES[0].value);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isFacultyLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login/faculty');
    } else {
      setIsAuthorized(true);
      const storedClass = localStorage.getItem('facultyClass');
      if (storedClass && ALL_CLASSES.some(c => c.value === storedClass)) {
        setSelectedClass(storedClass);
      }
      setSessionActive(isAttendanceWindowOpen());

      const handleStorageUpdate = () => {
        setSessionActive(isAttendanceWindowOpen());
      };
      window.addEventListener('storageUpdate', handleStorageUpdate);
      const interval = setInterval(() => setSessionActive(isAttendanceWindowOpen()), 5000);

      return () => {
        window.removeEventListener('storageUpdate', handleStorageUpdate);
        clearInterval(interval);
      };
    }
  }, [router]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    localStorage.setItem('facultyClass', value);
  };

  const handleStartSession = () => {
    startAttendanceSession();
    setSessionActive(true);
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-1/2" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Faculty Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Users className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="query">
              <Bot className="mr-2 h-4 w-4" />
              AI Attendance Assistant
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Absentee Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>A summary of student attendance for the selected class.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select onValueChange={handleClassChange} value={selectedClass}>
                            <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_CLASSES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleStartSession} disabled={sessionActive}>
                            <Clock className="mr-2 h-4 w-4" />
                            {sessionActive ? 'Window is Open' : 'Start Attendance'}
                        </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceOverview branch={selectedClass} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="query" className="space-y-4">
            <AttendanceQuery branch={selectedClass} />
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <AbsenteeAlerts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
