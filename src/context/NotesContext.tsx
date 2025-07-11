// src/context/NotesContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    Promise.all([
      fetch(`${API_URL}/notes`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch notes');
          return res.json();
        })
        .then(data => setNotes(data)),
      fetch(`${API_URL}/tags`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch tags');
          return res.json();
        })
        .then(data => setTags(data)),
      fetch(`${API_URL}/journals`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch journals');
          return res.json();
        })
        .then(data => setJournalEntries(data)),
    ])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

const addNote = async ({ title, content, tagIds }: Omit<Note, '_id' | 'date' | 'isPinned'>) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tagIds }),
  });
  const newNote = await res.json();
  setNotes(prev => [...prev, newNote]);
  return newNote;
};

  const updateNote = async (note: Note) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/notes/${note._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  const updated = await res.json();
  setNotes(prev => prev.map(n => n._id === updated._id ? updated : n));
  return updated;
};

const deleteNote = async (id: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  setNotes(prev => prev.filter(n => n._id !== id));
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
    const res = await fetch(`${API_URL}/journals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    const newEntry = await res.json();
    setJournalEntries(prev => [...prev, newEntry]);
    return newEntry;
  };
  const updateJournalEntry = async (updatedEntry: JournalEntry) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/journals/${updatedEntry._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry),
    });
    const updated = await res.json();
    setJournalEntries(prev => prev.map(e => e._id === updated._id ? updated : e));
    return updated;
  };
  const deleteJournalEntry = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    await fetch(`${API_URL}/journals/${id}`, { method: 'DELETE' });
    setJournalEntries(prev => prev.filter(e => e._id !== id));
  };

  const addTag = async (label: string, color: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: label, color }),
    });
    const newTag: Tag = await res.json();
    setTags(prevTags => [...prevTags, newTag]);
    return newTag;
  };

  const deleteTag = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    await fetch(`${API_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    setTags(prev => prev.filter(tag => tag._id !== id));

    setNotes(prevNotes =>
      prevNotes.map(note => ({
        ...note,
        tagIds: note.tagIds.filter(tid => tid !== id),
      }))
    );
  };

  const updateTag = async (id: string, data: { name?: string; color?: string }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setTags(prev => prev.map(t => (t._id === updated._id ? updated : t)));
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