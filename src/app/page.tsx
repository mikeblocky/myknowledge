// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useNotes, Note, Tag } from '@/context/NotesContext';
import NoteListItem from '@/components/NoteListItem';
import Taskbar from '@/components/Taskbar';
import TagPill from '@/components/TagPill';
import TagSelector from '@/components/TagSelector';

export default function HomePage() {
  // 'isLoading' has been removed from this destructuring, fixing the error.
  const { notes, tags, addNote, updateNote, deleteNote } = useNotes();
  
  // State for UI management
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for the modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTagIds, setNoteTagIds] = useState<number[]>([]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const searchMatch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tagMatch = activeTagFilter === null || note.tagIds.includes(activeTagFilter);
      
      return searchMatch && tagMatch;
    });
  }, [notes, searchTerm, activeTagFilter]);

  const selectedNote = useMemo(() => {
    if (selectedNoteId && !filteredNotes.some(note => note.id === selectedNoteId)) {
        setSelectedNoteId(null);
        return null;
    }
    return notes.find(note => note.id === selectedNoteId) || null;
  }, [selectedNoteId, filteredNotes, notes]);

  // --- HANDLER FUNCTIONS ---
  const handleSelectNote = (id: number) => { setSelectedNoteId(id); };
  const handleDeleteAndDeselect = (id: number) => { if (window.confirm('are you sure you want to delete this note?')) { deleteNote(id); setSelectedNoteId(null); }};
  const handleOpenNewNoteModal = () => { setEditingNote(null); setNoteTitle(''); setNoteContent(''); setNoteTagIds([]); setIsModalOpen(true); };
  const handleStartEdit = (note: Note) => { setEditingNote(note); setNoteTitle(note.title); setNoteContent(note.content); setNoteTagIds(note.tagIds); setIsModalOpen(true); };
  const handleSaveNote = () => { if (!noteTitle.trim()) { alert('please enter a title.'); return; } if (editingNote) { updateNote(editingNote.id, noteTitle, noteContent, noteTagIds); } else { addNote(noteTitle, noteContent, noteTagIds); } closeModal(); };
  const closeModal = () => { setIsModalOpen(false); setEditingNote(null); setNoteTitle(''); setNoteContent(''); setNoteTagIds([]); };

  return (
    <>
      <div className="two-column-layout">
        <div className="left-pane">
          <header className="pane-header"><h1>all notes</h1></header>
          <div className="search-bar"><input type="text" placeholder="search..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="tag-filter-container">
            <button className={`tag-filter-all ${activeTagFilter === null ? 'active' : ''}`} onClick={() => setActiveTagFilter(null)}>all notes</button>
            {tags.map(tag => (<TagPill key={tag.id} tag={tag} isActive={activeTagFilter === tag.id} onClick={() => setActiveTagFilter(tag.id)} />))}
          </div>
          <ul className="note-list">
            {filteredNotes.map(note => (<NoteListItem key={note.id} note={note} isSelected={note.id === selectedNoteId} onClick={() => handleSelectNote(note.id)} />))}
          </ul>
        </div>
        <div className="right-pane">
          {selectedNote ? (
            <div className="note-detail-view">
              <header className="note-detail-header">
                <h2>{selectedNote.title}</h2>
                <div className="note-detail-actions"><button onClick={() => handleStartEdit(selectedNote)}>edit</button><button onClick={() => handleDeleteAndDeselect(selectedNote.id)}>delete</button></div>
              </header>
              <p className="note-detail-meta">last updated: {new Date(selectedNote.date).toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <div className="note-detail-tags">
                {selectedNote.tagIds.map(tagId => { const tag = tags.find(t => t.id === tagId); return tag ? <TagPill key={tag.id} tag={tag} /> : null; })}
              </div>
              <div className="note-detail-content">
                {selectedNote.content.split('\n').map((line, i) => <p key={i}>{line || '\u00a0'}</p>)}
              </div>
            </div>
          ) : (
            <div className="empty-state-view"><p>select a note from the left to view its content, or create a new one.</p></div>
          )}
        </div>
      </div>
      <Taskbar actions={<button className="taskbar-button primary-action" onClick={handleOpenNewNoteModal}>+ new note</button>} />
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'edit note' : 'new note'}</h2>
            <form className="note-form" onSubmit={(e) => { e.preventDefault(); handleSaveNote(); }}>
              <div className="form-group"><label htmlFor="title">title</label><input id="title" type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} /></div>
              <div className="form-group"><label htmlFor="content">content</label><textarea id="content" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} /></div>
              <div className="form-group"><label>tags</label><TagSelector selectedTagIds={noteTagIds} onTagChange={setNoteTagIds} /></div>
              <div className="form-actions"><button type="button" className="form-button secondary" onClick={closeModal}>cancel</button><button type="submit" className="form-button primary">save note</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}