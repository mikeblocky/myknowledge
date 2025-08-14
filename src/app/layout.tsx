// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { NotesProvider } from '@/context/NotesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Taskbar from '@/components/Taskbar';
import { Toaster } from 'sonner';
import PerformanceMonitor from '@/components/PerformanceMonitor';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-national-park',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: true,
  fallback: ['monospace'],
});

export const metadata = {
  title: 'MyNote',
  description: 'A note-taking app',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Resource hints */}
        <link rel="preload" href="/api/notes" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="app-container">
        <PerformanceMonitor />
        <ClerkProvider>
          <ThemeProvider>
            <NotesProvider>
              <Taskbar />
              <main className="main-content">{children}</main>
              <Toaster position="top-center" richColors />
            </NotesProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}