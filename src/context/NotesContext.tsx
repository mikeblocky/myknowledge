// src/context/NotesContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk, useAuth } from '@clerk/nextjs';

// MOCK DATA
const initialNotes: Note[] = [
    { _id: '1', title: 'Meeting Notes', content: 'Discussed Q3 roadmap. Key items:\n- Launch new feature\n- Hire new engineer', date: '2024-06-20T10:00:00Z', tagIds: ['1'], isPinned: true,},
    { _id: '2', title: 'Personal Goals', content: '# My Goals\n- Run a marathon\n- Read 12 books', date: '2024-06-18T15:30:00Z', tagIds: ['3'], isPinned: false,},
    { _id: '3', title: 'Grocery List', content: '- Milk\n- Bread\n- Cheese', date: '2024-06-22T08:00:00Z', tagIds: ['2'], isPinned: false, },
    { _id: '4', title: 'Project Ideas', content: 'New app concepts:\n- Task manager\n- Habit tracker\n- Recipe organizer', date: '2024-06-25T14:20:00Z', tagIds: ['1'], isPinned: true,},
    { _id: '5', title: 'Book Recommendations', content: 'Books to read:\n- Atomic Habits\n- Deep Work\n- The Pragmatic Programmer', date: '2024-06-19T09:15:00Z', tagIds: ['3'], isPinned: false,},
    { _id: '6', title: 'Workout Plan', content: 'Weekly routine:\n- Monday: Cardio\n- Wednesday: Strength\n- Friday: Yoga', date: '2024-06-21T16:45:00Z', tagIds: ['3'], isPinned: false,},
    { _id: '7', title: 'Travel Plans', content: 'Summer vacation ideas:\n- Beach trip\n- Mountain hiking\n- City exploration', date: '2024-06-23T11:30:00Z', tagIds: ['2'], isPinned: true, },
    { _id: '8', title: 'Code Review Notes', content: 'Feedback on PR #123:\n- Add error handling\n- Improve performance\n- Update documentation', date: '2024-06-24T13:00:00Z', tagIds: ['1'], isPinned: false,},
    { _id: '9', title: 'Birthday Reminder', content: 'Mom\'s birthday next week!\n- Buy gift\n- Plan celebration\n- Send card', date: '2024-06-26T10:00:00Z', tagIds: ['2'], isPinned: true,},
    { _id: '10', title: 'Learning Goals', content: 'Skills to develop:\n- React advanced patterns\n- TypeScript mastery\n- System design', date: '2024-06-27T15:20:00Z', tagIds: ['2'], isPinned: false,},
];

const initialTags: Tag[] = [
    { _id: '1', name: 'work', color: '#4285F4' },
    { _id: '2', name: 'home', color: '#DB4437' },
    { _id: '3', name: 'personal', color: '#F4B400' },
];

export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
  tagIds: string[];
  isJournal?: boolean;
}

export interface JournalEntry extends Note {}

export interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  journalEntries: JournalEntry[];
  addNote: (noteData: Omit<Note,  | '_id' | 'date' | 'isPinned'>) => Promise<Note>;
  updateNote: (note: Note) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => void;
  reorderNotes: (oldIndex: number, newIndex: number) => void;
  getJournalEntry: (id: string) => JournalEntry | undefined;
  addJournalEntry: (entryData: { title: string; content: string; tagIds: string[] }) => Promise<JournalEntry>;
  updateJournalEntry: (updatedEntry: JournalEntry) => Promise<JournalEntry>;
  deleteJournalEntry: (id: string) => Promise<void>;
  addTag: (label: string, color: string) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  updateTag: (id: string, data: { name?: string; color?: string }) => Promise<Tag>;
  loading: boolean;
  error: string | null;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id;

  // Helper to get auth headers
  const getAuthHeaders = async () => {
    const token = await getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const headers = await getAuthHeaders();
      const [notesRes, tagsRes, journalsRes] = await Promise.all([
        fetch(`${API_URL}/api/notes`, { headers }),
        fetch(`${API_URL}/api/tags`, { headers }),
        fetch(`${API_URL}/api/journals`, { headers }),
      ]);
      if (!notesRes.ok) throw new Error('Failed to fetch notes');
      if (!tagsRes.ok) throw new Error('Failed to fetch tags');
      if (!journalsRes.ok) throw new Error('Failed to fetch journals');
      setNotes(await notesRes.json());
      setTags(await tagsRes.json());
      setJournalEntries(await journalsRes.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchAllData();
  }, [userId]);

  // Listen for signOut and clear data
  useEffect(() => {
    const handleSignOut = () => {
      setNotes([]);
      setTags([]);
      setJournalEntries([]);
      setError(null);
      setLoading(false);
      window.location.reload();
    };
    window.addEventListener('clerk:signOut', handleSignOut);
    return () => {
      window.removeEventListener('clerk:signOut', handleSignOut);
    };
  }, []);

  const addNote = async ({ title, content, tagIds }: Omit<Note, '_id' | 'date' | 'isPinned'>) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, content, tagIds }),
    });
    const newNote = await res.json();
    await fetchAllData();
    return newNote;
  };

  const updateNote = async (note: Note) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(note),
    });
    const updated = await res.json();
    await fetchAllData();
    return updated;
  };

  const deleteNote = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    await fetch(`${API_URL}/api/notes/${id}`, { method: 'DELETE', headers });
    await fetchAllData();
  };

  const togglePinNote = (id: string) => {
    setNotes(prevNotes => {
      const note = prevNotes.find(n => n._id === id);
      if (!note) return prevNotes;
      const updatedNote = { ...note, isPinned: !note.isPinned };
      const otherNotes = prevNotes.filter(n => n._id !== id);
      return updatedNote.isPinned ? [updatedNote, ...otherNotes] : [...otherNotes, updatedNote];
    });
  };

  const reorderNotes = (oldIndex: number, newIndex: number) => {
    setNotes(prevNotes => {
      const newArr = [...prevNotes];
      const [movedItem] = newArr.splice(oldIndex, 1);
      newArr.splice(newIndex, 0, movedItem);
      return newArr;
    });
  };

  // --- Journal Specific ---
  const getJournalEntry = (id: string) => journalEntries.find(e => e._id === id);
  const addJournalEntry = async (entryData: { title: string; content: string; tagIds: string[] }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/journals`, {
      method: 'POST',
      headers,
      body: JSON.stringify(entryData),
    });
    const newEntry = await res.json();
    await fetchAllData();
    return newEntry;
  };
  const updateJournalEntry = async (updatedEntry: JournalEntry) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/journals/${updatedEntry._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedEntry),
    });
    const updated = await res.json();
    await fetchAllData();
    return updated;
  };
  const deleteJournalEntry = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    await fetch(`${API_URL}/api/journals/${id}`, { method: 'DELETE', headers });
    await fetchAllData();
  };

  const addTag = async (label: string, color: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: label, color }),
    });
    const newTag: Tag = await res.json();
    await fetchAllData();
    return newTag;
  };

  const deleteTag = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    await fetch(`${API_URL}/api/tags/${id}`, { method: 'DELETE', headers });
    await fetchAllData();
  };

  const updateTag = async (id: string, data: { name?: string; color?: string }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/tags/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    await fetchAllData();
    return updated;
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        tags,
        journalEntries,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        reorderNotes,
        getJournalEntry,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        addTag,
        deleteTag,
        updateTag,
        loading,
        error,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};