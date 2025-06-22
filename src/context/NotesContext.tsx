// src/context/NotesContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// MOCK DATA
const initialNotes: Note[] = [
    { id: 1, title: 'Meeting Notes', content: 'Discussed Q3 roadmap. Key items:\n- Launch new feature\n- Hire new engineer', date: '2024-06-20T10:00:00Z', tagIds: [1], isPinned: true },
    { id: 2, title: 'Personal Goals', content: '# My Goals\n- Run a marathon\n- Read 12 books', date: '2024-06-18T15:30:00Z', tagIds: [3], isPinned: false },
    { id: 3, title: 'Grocery List', content: '- Milk\n- Bread\n- Cheese', date: '2024-06-22T08:00:00Z', tagIds: [2], isPinned: false },
    { id: 4, title: 'Project Ideas', content: 'New app concepts:\n- Task manager\n- Habit tracker\n- Recipe organizer', date: '2024-06-25T14:20:00Z', tagIds: [1], isPinned: true },
    { id: 5, title: 'Book Recommendations', content: 'Books to read:\n- Atomic Habits\n- Deep Work\n- The Pragmatic Programmer', date: '2024-06-19T09:15:00Z', tagIds: [3], isPinned: false },
    { id: 6, title: 'Workout Plan', content: 'Weekly routine:\n- Monday: Cardio\n- Wednesday: Strength\n- Friday: Yoga', date: '2024-06-21T16:45:00Z', tagIds: [3], isPinned: false },
    { id: 7, title: 'Travel Plans', content: 'Summer vacation ideas:\n- Beach trip\n- Mountain hiking\n- City exploration', date: '2024-06-23T11:30:00Z', tagIds: [2], isPinned: true },
    { id: 8, title: 'Code Review Notes', content: 'Feedback on PR #123:\n- Add error handling\n- Improve performance\n- Update documentation', date: '2024-06-24T13:00:00Z', tagIds: [1], isPinned: false },
    { id: 9, title: 'Birthday Reminder', content: 'Mom\'s birthday next week!\n- Buy gift\n- Plan celebration\n- Send card', date: '2024-06-26T10:00:00Z', tagIds: [2], isPinned: true },
    { id: 10, title: 'Learning Goals', content: 'Skills to develop:\n- React advanced patterns\n- TypeScript mastery\n- System design', date: '2024-06-27T15:20:00Z', tagIds: [1], isPinned: false },
];

const initialTags: Tag[] = [
    { id: 1, name: 'work', color: '#4285F4' },
    { id: 2, name: 'home', color: '#DB4437' },
    { id: 3, name: 'personal', color: '#F4B400' },
];

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
  tagIds: number[];
  isJournal?: boolean;
}

export interface JournalEntry extends Note {}

export interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  journalEntries: JournalEntry[];
  addNote: (noteData: Omit<Note, 'id' | 'date' | 'isPinned'>) => Promise<Note>;
  updateNote: (note: Note) => Promise<Note>;
  deleteNote: (id: number) => void;
  togglePinNote: (id: number) => void;
  reorderNotes: (oldIndex: number, newIndex: number) => void;
  getJournalEntry: (id: number) => JournalEntry | undefined;
  addJournalEntry: (entryData: { title: string; content: string; tagIds: number[] }) => void;
  updateJournalEntry: (updatedEntry: JournalEntry) => void;
  addTag: (label: string, color: string) => Tag;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  useEffect(() => {
    // Simulate fetching data
    const notesWithJournalFlag = initialNotes.map(n => ({...n, isJournal: n.title.toLowerCase().includes('journal')}))
    setNotes(notesWithJournalFlag);
    setTags(initialTags);
  }, []);

  const addNote = async (noteData: Omit<Note, 'id' | 'date' | 'isPinned'>) => {
    const newNote: Note = {
      id: Date.now(),
      ...noteData,
      date: new Date().toISOString(),
      isPinned: false,
      isJournal: noteData.isJournal || false,
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = async (updatedNote: Note) => {
    const noteToUpdate = { ...updatedNote, date: new Date().toISOString() };
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === updatedNote.id ? noteToUpdate : note))
    );
    return noteToUpdate;
  };
  
  const deleteNote = (id: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const togglePinNote = (id: number) => {
    setNotes(prevNotes => {
      const note = prevNotes.find(n => n.id === id);
      if (!note) return prevNotes;
      const updatedNote = { ...note, isPinned: !note.isPinned };
      const otherNotes = prevNotes.filter(n => n.id !== id);
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
  const journalEntries = notes.filter(n => n.isJournal);
  const getJournalEntry = (id: number) => journalEntries.find(e => e.id === id);
  const addJournalEntry = (entryData: { title: string; content: string; tagIds: number[] }) => addNote({...entryData, isJournal: true});
  const updateJournalEntry = (updatedEntry: JournalEntry) => updateNote(updatedEntry);

  const addTag = (label: string, color: string) => {
    const newTag: Tag = {
      id: Date.now(),
      name: label,
      color,
    };
    setTags(prevTags => [...prevTags, newTag]);
    return newTag;
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
        addTag,
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