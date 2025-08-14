// src/app/page.tsx
'use client';

import { useState } from 'react';
import { StickyNote, Plus, Filter } from 'lucide-react';
import SharedSidebar, { FilterPanel } from '../components/SharedSidebar';
import NoteListItem from '../components/NoteListItem';
import NoteModal from '../components/NoteModal';
import { useNotes } from '../context/NotesContext';

export default function NotesPage() {
  const { notes, addNote, togglePinNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<any>(null);

  const handleAddNote = () => {
    const newNote = {
      title: 'New Note',
      content: '',
      tagIds: []
    };
    addNote(newNote);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handlePinToggle = (noteId: string) => {
    togglePinNote(noteId);
  };

  const handleSaveNote = (noteData: { title: string; content: string; tagIds: string[] }) => {
    // This would need to be implemented based on your context
    console.log('Saving note:', noteData);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find(note => note._id === selectedNoteId);

  return (
    <div className="notes-page">
      <SharedSidebar
        title="Notes"
        icon={<StickyNote size={24} />}
        onAdd={handleAddNote}
        onSearch={handleSearch}
        onFilter={handleFilter}
      >
        <div className="notes-content">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <StickyNote size={48} className="empty-icon" />
              <h3>No notes yet</h3>
              <p>Create your first note to get started</p>
              <button className="btn btn-primary" onClick={handleAddNote}>
                <Plus size={16} />
                Create First Note
              </button>
            </div>
          ) : (
            <div className="notes-list">
              {filteredNotes.map((note) => (
                <NoteListItem
                  key={note._id}
                  note={note}
                  isSelected={selectedNoteId === note._id}
                  onSelect={() => handleSelectNote(note._id)}
                  onPinToggle={() => handlePinToggle(note._id)}
                />
              ))}
            </div>
          )}
        </div>
      </SharedSidebar>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={showFilterPanel} 
        onClose={() => setShowFilterPanel(false)} 
      />

      {/* Note Modal */}
      {editingNote && (
        <NoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}