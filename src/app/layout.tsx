// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import './globals.css';
import { NotesProvider } from '@/context/NotesContext';
import { Note, Tag } from '@/context/NotesContext';

export const metadata: Metadata = {
  title: 'My Knowledge Base',
  description: 'a digital second brain',
};

// --- MOCK DATABASE (In a real app, this would be a separate file/API call) ---
// IMPORTANT: Replace the placeholder userId with YOUR user ID from the Clerk Dashboard to see these notes.
const allNotes: Note[] = [
  { id: 1, title: 'My First Note (For User 1)', content: 'This note is only visible to me.', date: new Date().toISOString(), tagIds: [1], userId: 'user_2fA...YOUR_ID_HERE' },
  { id: 2, title: 'Another Note (For User 1)', content: 'This is also mine!', date: new Date().toISOString(), tagIds: [2], userId: 'user_2fA...YOUR_ID_HERE' },
  { id: 3, title: 'A Different User\'s Note', content: 'You should not see this note.', date: new Date().toISOString(), tagIds: [3], userId: 'user_anotherId...' },
];
const allTags: Tag[] = [
  { id: 1, name: 'work', color: '#458588' },
  { id: 2, name: 'ideas', color: '#b16286' },
  { id: 3, name: 'personal', color: '#d79921' },
];
// --- END MOCK DATABASE ---

// This function is correctly marked as `async`
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `auth()` is called on the server to get the userId
  const { userId } = await auth();

  // Fetch data for the logged-in user on the server before rendering
  let userNotes: Note[] = [];
  if (userId) {
    userNotes = allNotes.filter(note => note.userId === userId);
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* The server-fetched data is passed to the provider */}
          <NotesProvider initialNotes={userNotes} initialTags={allTags}>
            {children}
          </NotesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}