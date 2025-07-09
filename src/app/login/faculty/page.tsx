import { LoginCard } from '@/components/auth/LoginCard';

const subjects = [
  { value: 'B.Tech CSE', label: 'B.Tech CSE' },
  { value: 'CSE(DS)', label: 'CSE (Data Science)' },
];

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
