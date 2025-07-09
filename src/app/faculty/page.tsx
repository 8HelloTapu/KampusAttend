import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceOverview } from '@/components/faculty/AttendanceOverview';
import { AttendanceQuery } from '@/components/faculty/AttendanceQuery';
import { AbsenteeAlerts } from '@/components/faculty/AbsenteeAlerts';
import { Users, Bot, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FacultyDashboard() {
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
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>A summary of student attendance for the current class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AttendanceOverview />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="query" className="space-y-4">
                <AttendanceQuery />
            </TabsContent>
            <TabsContent value="alerts" className="space-y-4">
                <AbsenteeAlerts />
            </TabsContent>
          </Tabs>
        </main>
      </div>
  );
}
