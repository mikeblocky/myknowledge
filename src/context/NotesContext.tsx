// src/context/NotesContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// --- Data models ---
export interface Tag { id: number; name: string; color: string; }
export interface Note { id: number; title: string; content: string; date: string; tagIds: number[]; userId: string; }

// --- FIXED: The "Contract" - This interface now correctly lists ALL provided values ---
interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  addNote: (title: string, content: string, tagIds: number[]) => void;
  updateNote: (id: number, title: string, content: string, tagIds: number[]) => void;
  deleteNote: (id: number) => void;
  getNotesForDate: (date: Date) => Note[];
  addTag: (name: string, color: string) => Tag;
}

const NotesContext = createContext<NotesContextType>(null!);

export function useNotes() {
  return useContext(NotesContext);
}

// --- Define the props for our provider ---
interface NotesProviderProps {
  children: ReactNode;
  initialNotes: Note[];
  initialTags: Tag[];
}

export function NotesProvider({ children, initialNotes, initialTags }: NotesProviderProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  // In a real app with a DB, these functions would make API calls.
  // For our mock setup, they just manipulate local state.
  const addNote = (title: string, content: string, tagIds: number[]) => {
    const newNote: Note = { id: Date.now(), title, content, date: new Date().toISOString(), tagIds, userId: 'mock-user-id' };
    setNotes([newNote, ...notes]);
  };
  
  const updateNote = (id: number, title: string, content: string, tagIds: number[]) => {
    setNotes(notes.map(note => note.id === id ? { ...note, title, content, tagIds, date: new Date().toISOString() } : note));
  };
  
  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => new Date(note.date).toDateString() === date.toDateString());
  };

  const addTag = (name: string, color: string) => {
    const newTag = { id: Date.now(), name: name.toLowerCase().trim(), color };
    setTags([...tags, newTag]);
    return newTag;
  };

  // This `value` object now perfectly matches the NotesContextType interface.
  const value = { notes, tags, addNote, updateNote, deleteNote, getNotesForDate, addTag };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}