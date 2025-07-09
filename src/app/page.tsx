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
          <div className="absolute inset-0 z-0 h-full w-full bg-background bg-[url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0,30 L120,30 M0,60 L120,60 M0,90 L120,90 M30,0 L30,120 M60,0 L60,120 M90,0 L90,120' stroke='hsl(var(--foreground))' stroke-width='0.5' opacity='0.1' fill='none'/%3E%3Cg fill='none' stroke='hsl(var(--foreground))' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' opacity='0.15'%3E%3Cpath d='M10,20 l15,-5 l15,5 l-15,5 z' /%3E%3Cpath d='M25,15 v7' /%3E%3Cpath d='M34,16 h4' /%3E%3Cpath d='M80,40 C 75 45, 75 55, 80 60' /%3E%3Cpath d='M80,40 L 100 40 L 100 60 L 80 60' /%3E%3Cpath d='M85,45 h10' /%3E%3Cpath d='M85,50 h10' /%3E%3Cpath d='M85,55 h5' /%3E%3Cpath d='M20,90 l20,-20 l5,5 z' /%3E%3Cpath d='M36,74 l4,4' /%3E%3Cpath d='M20,90 l-2,2' /%3E%3Cpath d='M90,90 a 5,5 0 1 1 -10,0 v -10 a 5,5 0 1 0 -10,0'/%3E%3C/g%3E%3C/svg%3E&quot;)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          
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
