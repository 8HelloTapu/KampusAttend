import { LoginCard } from '@/components/auth/LoginCard';

export default function FacultyLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <LoginCard
        userType="Faculty"
        expectedUsername="faculty"
        expectedPassword="password"
        redirectPath="/faculty"
        authKey="isFacultyLoggedIn"
      />
    </div>
  );
}
