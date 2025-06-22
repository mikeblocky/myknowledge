// src/app/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import NoteListItem from '@/components/NoteListItem';
import NoteModal from '@/components/NoteModal';
import NoteDisplay from '@/components/NoteDisplay';
import { Plus, Search, Tag, Filter, SortAsc, FileText, ChevronDown, ArrowLeft, ChevronsUpDown, LayoutGrid, List, ArrowDownUp } from 'lucide-react';
import TagPill from '@/components/TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type SortOption =
  | 'newest-first'
  | 'oldest-first'
  | 'title-a-z'
  | 'title-z-a';

export default function HomePage() {
  const { notes, tags, addNote, updateNote, togglePinNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest-first');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isListView, setIsListView] = useState(true);
  
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortOrder) {
        case 'newest-first':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest-first':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-a-z':
          return a.title.localeCompare(b.title);
        case 'title-z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [notes, sortOrder]);

  const filteredNotes = useMemo(() => {
    let tempNotes = sortedNotes;
    if (selectedTagId) {
      tempNotes = tempNotes.filter(note => note.tagIds.includes(selectedTagId));
    }
    if (searchTerm) {
      tempNotes = tempNotes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    }
    return tempNotes;
  }, [sortedNotes, selectedTagId, searchTerm]);

  const selectedNote = useMemo(() => notes.find(note => note.id === selectedNoteId), [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNote && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0].id);
    }
    if (selectedNote && !filteredNotes.some(n => n.id === selectedNote.id)) {
        setSelectedNoteId(filteredNotes.length > 0 ? filteredNotes[0].id : null);
    }
  }, [filteredNotes, selectedNote]);

  const handleAddClick = () => { setEditingNote(null); setIsModalOpen(true); };
  const handleEditClick = (note: Note) => { setEditingNote(note); setIsModalOpen(true); };
  const handleTagClick = (tagId: number) => { setSelectedTagId(prev => (prev === tagId ? null : tagId)); };
  
  const handleSaveNote = async (noteData: { title: string; content: string; tagIds: number[] }) => {
    const savedNote = editingNote ? await updateNote({ ...editingNote, ...noteData }) : await addNote(noteData);
    if (savedNote) setSelectedNoteId(savedNote.id);
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const showDetailView = isMobile && selectedNoteId !== null;

  return (
    <>
      <div className="main-layout">
        <div className="left-pane">
          <div className="pane-header">
            <h1><FileText size={20} /> All Notes</h1>
            <button className="icon-button" onClick={handleAddClick} title="Create new note">
              <Plus size={20} />
            </button>
          </div>
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search notes..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {tags.length > 0 && (
            <div className="tags-container">
              <div className="tags-header"><span><Tag size={14} /> Filter by tags</span><Filter size={14} /></div>
              <div className="tags-list">{tags.map(tag => (<TagPill key={tag.id} tag={tag} isSelected={selectedTagId === tag.id} onClick={() => handleTagClick(tag.id)}/>))}</div>
            </div>
          )}
          <div className="filters-container">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="newest-first">Newest first</option>
              <option value="oldest-first">Oldest first</option>
              <option value="title-a-z">Title A-Z</option>
              <option value="title-z-a">Title Z-A</option>
            </select>
            <ChevronsUpDown
              className="sort-select-icon"
              size={16}
            />
          </div>
          <ul className="note-list">
            <AnimatePresence>
              {filteredNotes.map(note => (<NoteListItem key={note.id} note={note} isSelected={selectedNoteId === note.id} onSelect={() => setSelectedNoteId(note.id)} onPinToggle={() => togglePinNote(note.id)}/>))}
            </AnimatePresence>
          </ul>
        </div>
        <div className="right-pane">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <NoteDisplay 
                key={selectedNote.id}
                note={selectedNote}
                onEdit={() => handleEditClick(selectedNote)}
              />
            ) : (
              <div className="empty-state-view"><FileText size={48} className="empty-state-icon" /><p>Select a note to view it.</p></div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <NoteModal 
            note={editingNote} 
            onSave={handleSaveNote} 
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// You'll need to create NoteModal.tsx as well.
// For now, let's create a placeholder to avoid breaking the app.
// I'll create the actual file in the next step.