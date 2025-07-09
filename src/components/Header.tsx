import Link from 'next/link';
import AttendaVisionLogo from './AttendaVisionLogo';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <AttendaVisionLogo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            AttendaVision
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Home">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
