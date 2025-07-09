import { LoginCard } from '@/components/auth/LoginCard';
import { ALL_BRANCHES } from '@/lib/data';

export default function StudentLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <LoginCard
        userType="Student"
        expectedUsername="student"
        expectedPassword="password"
        redirectPath="/student"
        authKey="isStudentLoggedIn"
        subjects={ALL_BRANCHES}
      />
    </div>
  );
}
