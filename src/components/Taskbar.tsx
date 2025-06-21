// src/components/Taskbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs'; // Import UserButton and useAuth

interface TaskbarProps {
  actions?: React.ReactNode;
}

const Taskbar = ({ actions }: TaskbarProps) => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  // Don't render the taskbar on sign-in/sign-up pages
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  return (
    <nav className="taskbar">
      <div className="taskbar-logo">
        {/* If signed in, show UserButton. Otherwise, show 'n' */}
        {isSignedIn ? <UserButton afterSignOutUrl="/sign-in" /> : 'n'}
      </div>

      <div className="taskbar-navigation">
        <Link href="/" className={`taskbar-button ${pathname === '/' ? 'active' : ''}`}>
          notes
        </Link>
        <Link href="/calendar" className={`taskbar-button ${pathname === '/calendar' ? 'active' : ''}`}>
          calendar
        </Link>
      </div>

      <div className="taskbar-actions">
        {actions}
      </div>
    </nav>
  );
};

export default Taskbar;