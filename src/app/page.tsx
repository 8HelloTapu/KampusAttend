import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KampusAttendLogo from '@/components/AttendaVisionLogo';
import { MoveRight } from 'lucide-react';
import { Header } from '@/components/Header';

// SVG content for a subtle grid pattern. It uses CSS variables for theme-aware colors.
const patternSvg = `<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='p' patternUnits='userSpaceOnUse' width='20' height='20'><path d='M0 0h20v20H0z' fill='none' stroke='hsl(var(--foreground))' stroke-opacity='0.2' stroke-width='1'/></pattern></defs><rect width='100%' height='100%' fill='url(#p)'/></svg>`;
const encodedSvg = encodeURIComponent(patternSvg).replace(/'/g, "%27").replace(/"/g, "%22");
const dataUri = `url("data:image/svg+xml,${encodedSvg}")`;


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden bg-background p-4">
          <div 
            className="absolute inset-0 z-0 h-full w-full"
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
