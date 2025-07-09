import { Header } from '@/components/Header';
import { AttendanceForm } from '@/components/student/AttendanceForm';

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
        <AttendanceForm />
      </main>
    </div>
  );
}
