import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserCog } from 'lucide-react';
import AttendaVisionLogo from '@/components/AttendaVisionLogo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-4 text-4xl font-bold text-primary">
        <AttendaVisionLogo className="h-12 w-12" />
        <h1 className="font-headline">AttendaVision</h1>
      </div>
      <p className="mb-12 max-w-2xl text-center text-lg text-foreground/80">
        Seamless attendance tracking powered by AI. Choose your portal to get started.
      </p>
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <Link href="/login/student">
          <Card className="transform cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <Users className="h-12 w-12" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-headline">Student Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Mark your attendance quickly and securely with our smart verification system.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/login/faculty">
          <Card className="transform cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <UserCog className="h-12 w-12" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-headline">Faculty Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                View attendance records, get AI-powered insights, and manage your class effortlessly.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
