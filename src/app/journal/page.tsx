'use client';

import { useState } from 'react';
import { BookOpen, Plus, Filter } from 'lucide-react';
import SharedSidebar, { FilterPanel } from '../../components/SharedSidebar';
import NoteListItem from '../../components/NoteListItem';
import NoteModal from '../../components/NoteModal';
import { useNotes } from '../../context/NotesContext';

export default function JournalPage() {
  const { notes, addNote, togglePinNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<any>(null);

  // Filter notes to show only journal entries
  const journalNotes = notes.filter(note => note.isJournal);
  
  const handleAddJournalEntry = () => {
    const newJournalEntry = {
      title: 'New Journal Entry',
      content: '',
      tagIds: [],
      isJournal: true
    };
    addNote(newJournalEntry);
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
    console.log('Saving journal entry:', noteData);
  };

  const filteredJournalNotes = journalNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = journalNotes.find(note => note._id === selectedNoteId);

  return (
    <div className="journal-page">
      <SharedSidebar
        title="Journal"
        icon={<BookOpen size={24} />}
        onAdd={handleAddJournalEntry}
        onSearch={handleSearch}
        onFilter={handleFilter}
      >
        <div className="journal-content">
          {filteredJournalNotes.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} className="empty-icon" />
              <h3>No journal entries yet</h3>
              <p>Start writing your thoughts and experiences</p>
              <button className="btn btn-primary" onClick={handleAddJournalEntry}>
                <Plus size={16} />
                Write First Entry
              </button>
            </div>
          ) : (
            <div className="journal-entries-list">
              {filteredJournalNotes.map((note) => (
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