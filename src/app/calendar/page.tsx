// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useNotes, Note, Tag } from '@/context/NotesContext';
import Taskbar from '@/components/Taskbar';
import TagPill from '@/components/TagPill';
import TagSelector from '@/components/TagSelector';

export default function CalendarPage() {
  const { notes, tags, addNote, updateNote, deleteNote } = useNotes();
  
  // State for UI management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for the modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTagIds, setNoteTagIds] = useState<number[]>([]);

  // Get current month's calendar data
  const calendarData = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      calendar.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendar;
  }, [selectedDate]);

  // Filter notes based on search and tag selection
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const searchMatch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tagMatch = activeTagFilter === null || note.tagIds.includes(activeTagFilter);
      
      return searchMatch && tagMatch;
    });
  }, [notes, searchTerm, activeTagFilter]);

  // Get notes for the selected date
  const selectedDateNotes = useMemo(() => {
    return filteredNotes.filter(note => {
      const noteDate = new Date(note.date);
      return noteDate.toDateString() === selectedDate.toDateString();
    });
  }, [filteredNotes, selectedDate]);

  // Get notes for a specific date (for calendar display)
  const getNotesForDate = (date: Date) => {
    return filteredNotes.filter(note => {
      const noteDate = new Date(note.date);
      return noteDate.toDateString() === date.toDateString();
    });
  };

  // Find the selected note
  const selectedNote = useMemo(() => {
    if (selectedNoteId && !filteredNotes.some(note => note.id === selectedNoteId)) {
      setSelectedNoteId(null);
      return null;
    }
    return notes.find(note => note.id === selectedNoteId) || null;
  }, [selectedNoteId, filteredNotes, notes]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Handler functions
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedNoteId(null); // Clear selected note when changing date
  };

  const handleSelectNote = (id: number) => {
    setSelectedNoteId(id);
  };

  const handleDeleteAndDeselect = (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      setSelectedNoteId(null);
    }
  };

  const handleOpenNewNoteModal = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTagIds([]);
    setIsModalOpen(true);
  };
  
  const handleStartEdit = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTagIds(note.tagIds);
    setIsModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) { 
      alert('Please enter a title.'); 
      return; 
    }
    
    if (editingNote) {
      updateNote(editingNote.id, noteTitle, noteContent, noteTagIds);
    } else {
      // Create note - the date will be set to current date by the context
      addNote(noteTitle, noteContent, noteTagIds);
    }
    closeModal();
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTagIds([]);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <>
      <div className="two-column-layout">
        {/* --- LEFT PANE: CALENDAR --- */}
        <div className="left-pane">
          <header className="pane-header">
            <div className="calendar-navigation">
              <button onClick={goToPreviousMonth}>&lt;</button>
              <h1>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h1>
              <button onClick={goToNextMonth}>&gt;</button>
            </div>
            <button onClick={goToToday} className="today-button">Today</button>
          </header>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="search-input" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="tag-filter-container">
            <button
              className={`tag-filter-all ${activeTagFilter === null ? 'active' : ''}`}
              onClick={() => setActiveTagFilter(null)}
            >
              All notes
            </button>
            {tags.map(tag => (
              <TagPill
                key={tag.id}
                tag={tag}
                isActive={activeTagFilter === tag.id}
                onClick={() => setActiveTagFilter(tag.id)}
              />
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day headers */}
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="calendar-days">
              {calendarData.map((date, index) => {
                const dayNotes = getNotesForDate(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);
                const isSelectedDateDay = isSelectedDate(date);
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${!isCurrentMonthDay ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${isSelectedDateDay ? 'selected-date' : ''}`}
                    onClick={() => handleSelectDate(date)}
                  >
                    <div className="calendar-day-number">{date.getDate()}</div>
                    <div className="calendar-day-notes">
                      {dayNotes.slice(0, 2).map(note => (
                        <div 
                          key={note.id} 
                          className="calendar-note-preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectNote(note.id);
                          }}
                        >
                          <div className="note-preview-title">{note.title}</div>
                        </div>
                      ))}
                      {dayNotes.length > 2 && (
                        <div className="calendar-note-more">+{dayNotes.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- RIGHT PANE: NOTES FOR SELECTED DATE --- */}
        <div className="right-pane">
          <header className="pane-header">
            <h2>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <button className="taskbar-button primary-action" onClick={handleOpenNewNoteModal}>
              + New Note
            </button>
          </header>

          {selectedDateNotes.length > 0 ? (
            <div className="notes-for-date">
              {selectedDateNotes.map(note => (
                <div 
                  key={note.id} 
                  className={`note-card ${selectedNoteId === note.id ? 'selected' : ''}`}
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="note-card-header">
                    <h3>{note.title}</h3>
                    <div className="note-card-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(note);
                      }}>Edit</button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAndDeselect(note.id);
                      }}>Delete</button>
                    </div>
                  </div>
                  <div className="note-card-content">
                    {note.content.split('\n').slice(0, 3).map((line, i) => (
                      <p key={i}>{line || '\u00a0'}</p>
                    ))}
                    {note.content.split('\n').length > 3 && (
                      <p className="note-preview-more">...</p>
                    )}
                  </div>
                  <div className="note-card-footer">
                    <div className="note-card-tags">
                      {note.tagIds.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? <TagPill key={tag.id} tag={tag} /> : null;
                      })}
                    </div>
                    <span className="note-card-time">
                      {new Date(note.date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-view">
              <p>No notes for this date. Click "New Note" to create one!</p>
            </div>
          )}

          {/* Selected Note Detail */}
          {selectedNote && (
            <div className="selected-note-detail">
              <header className="note-detail-header">
                <h3>{selectedNote.title}</h3>
                <div className="note-detail-actions">
                  <button onClick={() => handleStartEdit(selectedNote)}>Edit</button>
                  <button onClick={() => handleDeleteAndDeselect(selectedNote.id)}>Delete</button>
                </div>
              </header>
              <div className="note-detail-tags">
                {selectedNote.tagIds.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? <TagPill key={tag.id} tag={tag} /> : null;
                })}
              </div>
              <div className="note-detail-content">
                {selectedNote.content.split('\n').map((line, i) => <p key={i}>{line || '\u00a0'}</p>)}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Taskbar actions={<button className="taskbar-button primary-action" onClick={handleOpenNewNoteModal}>+ New Note</button>} />

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'Edit Note' : 'New Note'}</h2>
            <form className="note-form" onSubmit={(e) => { e.preventDefault(); handleSaveNote(); }}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea id="content" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <TagSelector selectedTagIds={noteTagIds} onTagChange={setNoteTagIds} />
              </div>

              <div className="form-actions">
                <button type="button" className="form-button secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="form-button primary">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}