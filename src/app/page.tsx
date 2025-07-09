import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KampusAttendLogo from '@/components/AttendaVisionLogo';
import { MoveRight } from 'lucide-react';
import { Header } from '@/components/Header';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background p-4">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          
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
              className="mt-4 max-w-2xl animate-fade-in-down text-lg text-foreground/80"
              style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
            >
              Campus life, Digitally marked.
            </p>

            <div 
              className="mt-10 animate-fade-in-up"
              style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
            >
              <Link href="/auth">
                <Button size="lg" className="group text-lg shadow-lg">
                  Get Started
                  <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
