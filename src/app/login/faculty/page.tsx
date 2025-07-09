'use client';

import { LoginCard } from '@/components/auth/LoginCard';
import { ALL_BRANCHES } from '@/lib/data';

const subjects = ALL_BRANCHES;

export default function FacultyLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <LoginCard
        userType="Faculty"
        expectedUsername="faculty"
        expectedPassword="password"
        redirectPath="/faculty"
        authKey="isFacultyLoggedIn"
        subjects={subjects}
      />
    </div>
  );
}
