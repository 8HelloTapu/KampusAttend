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
          {/* Background Doodles */}
          <div className="absolute inset-0 z-0 h-full w-full bg-background bg-[url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='hsl(var(--foreground))' stroke-width='1'%3E%3Cpath d='M0 0L80 80' stroke-dasharray='4 4' opacity='0.1'/%3E%3Cpath d='M80 0L0 80' stroke-dasharray='4 4' opacity='0.1'/%3E%3Ccircle cx='20' cy='20' r='2' opacity='0.2'/%3E%3Cpath d='M60 60L58 62L62 62L60 58Z' opacity='0.2'/%3E%3Cpath d='M10 70 L20 60 L30 70' opacity='0.2'/%3E%3Cpath d='M70 10 L60 20 L70 30' opacity='0.2' transform='rotate(90 65 20)'/%3E%3C/g%3E%3C/svg%3E&quot;)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          
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
