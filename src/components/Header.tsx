'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import AttendaVisionLogo from './AttendaVisionLogo';
import { Button } from './ui/button';
import { Home, LogOut } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const studentLogin = localStorage.getItem('isStudentLoggedIn') === 'true';
    const facultyLogin = localStorage.getItem('isFacultyLoggedIn') === 'true';
    setIsLoggedIn(studentLogin || facultyLogin);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('isFacultyLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

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
            {isLoggedIn && (
              <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
