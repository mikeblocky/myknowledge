// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { NotesProvider } from '@/context/NotesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Taskbar from '@/components/Taskbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'MyNote',
  description: 'A note-taking app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="app-container">
        <ClerkProvider>
          <ThemeProvider>
            <NotesProvider>
              <Taskbar />
              <main className="main-content">{children}</main>
            </NotesProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}