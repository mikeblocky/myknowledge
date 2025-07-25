// src/app/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import NoteListItem from '@/components/NoteListItem';
import NoteModal from '@/components/NoteModal';
import NoteDisplay from '@/components/NoteDisplay';
import { Plus, Search, Tag, Filter, SortAsc, FileText, ChevronDown, ArrowLeft, ChevronsUpDown, LayoutGrid, List, ArrowDownUp, Menu } from 'lucide-react';
import TagPill from '@/components/TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CustomSelect from '@/components/CustomSelect';
import TagManager from '@/components/TagManager';

type SortOption =
  | 'newest-first'
  | 'oldest-first'
  | 'title-a-z'
  | 'title-z-a';

export default function HomePage() {
  const { notes, tags, addNote, updateNote, togglePinNote } = useNotes();
  // Only show notes that are not journal entries
  const filteredNotesList = useMemo(() => notes.filter(n => !n.isJournal), [notes]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest-first');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [showTagManager, setShowTagManager] = useState(false);
  
  const sortOptions = [
    { value: 'newest-first', label: 'Newest first' },
    { value: 'oldest-first', label: 'Oldest first' },
    { value: 'title-a-z', label: 'Title A-Z' },
    { value: 'title-z-a', label: 'Title Z-A' },
  ];
  
  const sortedNotes = useMemo(() => {
    return [...filteredNotesList].sort((a, b) => {
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
  }, [filteredNotesList, sortOrder]);

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

  const selectedNote = useMemo(() => notes.find(note => selectedNoteId !== null && note._id === String(selectedNoteId)), [notes, selectedNoteId]);

  useEffect(() => {
    if (!selectedNote && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0]._id);
    }
    if (selectedNote && !filteredNotes.some(n => n._id === selectedNote._id)) {
        setSelectedNoteId(filteredNotes.length > 0 ? filteredNotes[0]._id : null);
    }
  }, [filteredNotes, selectedNote]);

  const handleAddClick = () => { setEditingNote(null); setIsModalOpen(true); };
  const handleEditClick = (note: Note) => { setEditingNote(note); setIsModalOpen(true); };
  const handleTagClick = (tagId: string) => { setSelectedTagId(prev => (prev === tagId ? null : tagId)); };
  
  // Close drawer on note select (mobile)
  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    if (isMobile) setDrawerOpen(false);
  };

  const handleSaveNote = async (noteData: { title: string; content: string; tagIds: string[] }) => {
    const savedNote = editingNote ? await updateNote({ ...editingNote, ...noteData }) : await addNote(noteData);
    if (savedNote) setSelectedNoteId(savedNote._id);
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const showDetailView = isMobile && selectedNoteId !== null;

  return (
    <div className={`main-layout${drawerOpen && isMobile ? ' drawer-open' : ''}`}>
      {/* Hamburger menu button for mobile */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{ display: drawerOpen ? 'none' : undefined }}
        >
          <Menu size={28} />
        </button>
      )}
      {/* Overlay for mobile drawer */}
      {drawerOpen && isMobile && (
        <div className="mobile-overlay" onClick={() => setDrawerOpen(false)} aria-label="Close menu" />
      )}
      
      {/* Mobile: Show note list when no note is selected */}
      {isMobile && !selectedNoteId && (
        <div className="mobile-notes-list-view">
          <div className="mobile-list-header">
            <h1><FileText size={20} /> All Notes</h1>
            <div className="mobile-header-actions">
              <button className="mobile-action-btn" onClick={handleAddClick} title="Create new note">
                <Plus size={20} />
              </button>
              <button className="mobile-action-btn" onClick={() => setShowTagManager(prev => !prev)} title="Manage tags">
                <Tag size={20} />
              </button>
            </div>
          </div>
          
          {showTagManager && <TagManager />}
          
          <div className="mobile-search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="mobile-search-input" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {tags.length > 0 && (
            <div className="mobile-tags-container">
              <div className="mobile-tags-header">
                <span><Tag size={14} /> Filter by tags</span>
                <Filter size={14} />
              </div>
              <div className="mobile-tags-list">
                {tags.map(tag => (
                  <TagPill 
                    key={tag._id} 
                    tag={tag} 
                    isSelected={selectedTagId === tag._id} 
                    onClick={() => handleTagClick(tag._id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="mobile-filters-container">
            <CustomSelect
              options={sortOptions}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOption)}
            />
          </div>
          
          <ul className="mobile-note-list">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteListItem
                  note={note} 
                  key={note._id}
                  {...note}
                  isSelected={selectedNoteId !== null && String(selectedNoteId) === note._id}
                  onSelect={() => handleSelectNote(note._id)}
                  onPinToggle={() => togglePinNote(note._id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
      
      {/* Desktop: Always show left pane */}
      {!isMobile && (
        <div className={`left-pane${drawerOpen && isMobile ? ' open' : ''}`}> 
          <div className="pane-header sidebar-header">
            <h1><FileText size={20} /> All Notes</h1>
            <div className="flex gap-2">
              <button className="icon-button" onClick={handleAddClick} title="Create new note">
                <Plus size={20} />
              </button>
              <button className="icon-button" onClick={() => setShowTagManager(prev => !prev)} title="Manage tags">
                <Tag size={20} />
              </button>
            </div>
          </div>
          {showTagManager && <TagManager />}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search notes..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {tags.length > 0 && (
            <div className="tags-container">
              <div className="tags-header"><span><Tag size={14} /> Filter by tags</span><Filter size={14} /></div>
              <div className="tags-list">{tags.map(tag => (<TagPill key={tag._id} tag={tag} isSelected={selectedTagId === tag._id} onClick={() => handleTagClick(tag._id)}/>))}</div>
            </div>
          )}
          <div className="filters-container">
            <CustomSelect
              options={sortOptions}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOption)}
            />
          </div>
          <ul className="note-list scrollable-list">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteListItem
                  note={note} key={note._id}
                  {...note}
                  isSelected={selectedNoteId !== null && String(selectedNoteId) === note._id}
                  onSelect={() => handleSelectNote(note._id)}
                  onPinToggle={() => togglePinNote(note._id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
      
      {/* Mobile: Show drawer when open */}
      {isMobile && selectedNoteId && (
        <div className={`left-pane${drawerOpen ? ' open' : ''}`}> 
          <div className="pane-header sidebar-header">
            <h1><FileText size={20} /> All Notes</h1>
            <div className="flex gap-2">
              <button className="icon-button" onClick={handleAddClick} title="Create new note">
                <Plus size={20} />
              </button>
              <button className="icon-button" onClick={() => setShowTagManager(prev => !prev)} title="Manage tags">
                <Tag size={20} />
              </button>
            </div>
          </div>
          {showTagManager && <TagManager />}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search notes..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {tags.length > 0 && (
            <div className="tags-container">
              <div className="tags-header"><span><Tag size={14} /> Filter by tags</span><Filter size={14} /></div>
              <div className="tags-list">{tags.map(tag => (<TagPill key={tag._id} tag={tag} isSelected={selectedTagId === tag._id} onClick={() => handleTagClick(tag._id)}/>))}</div>
            </div>
          )}
          <div className="filters-container">
            <CustomSelect
              options={sortOptions}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOption)}
            />
          </div>
          <ul className="note-list scrollable-list">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteListItem
                  note={note} key={note._id}
                  {...note}
                  isSelected={selectedNoteId !== null && String(selectedNoteId) === note._id}
                  onSelect={() => handleSelectNote(note._id)}
                  onPinToggle={() => togglePinNote(note._id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
      
      <div className="right-pane">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <NoteDisplay 
              key={selectedNote._id}
              note={selectedNote}
              onEdit={() => handleEditClick(selectedNote)}
              onBack={isMobile ? () => setSelectedNoteId(null) : undefined}
            />
          ) : (
            <div className="empty-state-view">
              <FileText size={48} className="empty-state-icon" />
              <p>{isMobile ? 'No notes yet. Create your first note!' : 'Select a note to view it.'}</p>
              {isMobile && (
                <button className="mobile-add-first-note-btn" onClick={handleAddClick}>
                  <Plus size={20} />
                  Create Note
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
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
    </div>
  );
}

// You'll need to create NoteModal.tsx as well.
// For now, let's create a placeholder to avoid breaking the app.
// I'll create the actual file in the next step.