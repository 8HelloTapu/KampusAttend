import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KampusAttendLogo from '@/components/AttendaVisionLogo';
import { MoveRight } from 'lucide-react';
import { Header } from '@/components/Header';

// SVG content for the doodle pattern. It uses CSS variables for theme-aware colors.
const svgDoodle = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='hsl(var(--foreground))' stroke-opacity='0.1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><g transform='translate(20 20) rotate(15) scale(0.8)'><path d='M0 20 A 20 20 0 0 1 40 20 L 0 20' /></g><g transform='translate(80 10) rotate(-10) scale(0.9)'><path d='M0 0 L 30 30 L 0 30 Z' /></g><g transform='translate(150 30) rotate(25)'><path d='M0 0 L 0 30' /><path d='M-5 5 L 0 0 L 5 5' /></g><g transform='translate(160 140) scale(1.1)'><rect x='0' y='0' width='30' height='20' rx='2' /><path d='M-5 22 h 40' /></g><g transform='translate(30 130) rotate(20)'><path d='M0 0 L15 30' /><path d='M0 0 L-15 30' /><circle cx='0' cy='0' r='2' fill='hsl(var(--foreground))' fill-opacity='0.1' /></g><g transform='translate(90 90) rotate(-20) scale(0.9)'><rect x='0' y='0' width='15' height='25' rx='3' /><path d='M4 0 L11 0 L7.5 -8 Z' /></g><g transform='translate(10 90) rotate(5)'><rect x='0' y='0' width='50' height='8' rx='2'/><path d='M5 4 h 2 M 12 4 h 2 M 19 4 h 2 M 26 4 h 2 M 33 4 h 2 M 40 4 h 2' stroke-width='1' /></g><g transform='translate(120 70) rotate(45)'><path d='M0 0 C 8 -10, 22 -10, 30 0 L 25 12 C 18 18, 12 18, 5 12 Z' /></g></g></svg>`;
const patternSvg = `<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='p' patternUnits='userSpaceOnUse' width='200' height='200'>${svgDoodle}</pattern></defs><rect width='100%' height='100%' fill='url(#p)'/></svg>`;
const encodedSvg = encodeURIComponent(patternSvg).replace(/'/g, "%27").replace(/"/g, "%22");
const dataUri = `url("data:image/svg+xml,${encodedSvg}")`;


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden bg-background p-4">
          <div 
            className="absolute inset-0 z-0 h-full w-full bg-background opacity-50"
            style={{
              backgroundImage: dataUri
            }}
          ></div>
          
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
              className="mt-2 max-w-2xl animate-fade-in-down text-lg text-foreground/80"
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
