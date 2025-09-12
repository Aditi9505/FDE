"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show the header on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-background border-b p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Xeno Insights
      </Link>
      {session ? (
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground text-sm hidden md:inline">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded transition-colors">
          Login
        </Link>
      )}
    </header>
  );
}