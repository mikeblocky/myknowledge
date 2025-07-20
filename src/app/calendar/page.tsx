// src/app/page.tsx
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import { 
  format, 
  addDays,
  subDays,
  isToday,
  isSameDay,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Plus
} from 'lucide-react';
import NoteListItem from '@/components/NoteListItem';
import { AnimatePresence, motion } from 'framer-motion';
import NoteModal from '@/components/NoteModal';
// If NoteEditor exists elsewhere, update the path accordingly, for example:
// import NoteEditor from '../components/NoteEditor';
// Or create the file at src/components/NoteEditor.tsx if missing.

export default function CalendarPage() {
  const { notes, togglePinNote, addNote, updateNote } = useNotes();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timelineDates, setTimelineDates] = useState<Date[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const notesByDate = useMemo(() => {
    return notes.reduce((acc, note) => {
      const date = format(new Date(note.date), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(note);
      return acc;
    }, {} as Record<string, Note[]>);
  }, [notes]);

  useEffect(() => {
    const startDate = subDays(selectedDate, 30);
    const endDate = addDays(selectedDate, 30);
    setTimelineDates(eachDayOfInterval({ start: startDate, end: endDate }));
  }, [selectedDate]);

  useEffect(() => {
    const selectedEl = scrollerRef.current?.querySelector('.timeline-day.selected');
    if (selectedEl && scrollerRef.current) {
      const scrollerWidth = scrollerRef.current.clientWidth;
      const selectedLeft = (selectedEl as HTMLElement).offsetLeft;
      const selectedWidth = selectedEl.clientWidth;
      scrollerRef.current.scrollTo({
        left: selectedLeft - scrollerWidth / 2 + selectedWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [timelineDates]);

  const selectedDayNotes = notesByDate[format(selectedDate, 'yyyy-MM-dd')] || [];
  const selectedNote = selectedDayNotes.find(n => n._id === selectedNoteId) || null;

  const handleMonthNav = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setSelectedDate(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if(format(date, 'yyyy-MM') !== format(currentMonth, 'yyyy-MM')) {
      setCurrentMonth(date);
    }
    setSelectedNoteId(null);
    setIsEditorOpen(false);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (noteData: { title: string; content: string; }) => {
    if (editingNote) {
      await updateNote({ ...editingNote, ...noteData });
    } else {
      // Remove 'date' from addNote if not supported by the context
      const newNote = await addNote({ ...noteData, tagIds: [] });
      if (newNote) setSelectedNoteId(newNote._id);
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="main-layout agenda-layout">
      <div className="agenda-left-pane">
        <div className="agenda-header">
          <h1 className="agenda-title">{format(selectedDate, 'MMMM do, yyyy')}</h1>
          <div className="agenda-month-nav">
            <button className="icon-button" onClick={() => handleMonthNav('prev')} title="Previous month">
              <ChevronLeft size={20} />
            </button>
            <span className="current-month-label">{format(currentMonth, 'MMMM yyyy')}</span>
            <button className="icon-button" onClick={() => handleMonthNav('next')} title="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="timeline-scroller-container" ref={scrollerRef}>
          {timelineDates.map((day) => {
            const dayNotes = notesByDate[format(day, 'yyyy-MM-dd')] || [];
            const isSelected = isSameDay(day, selectedDate);
            return (
              <motion.div
                key={day.toString()}
                className={`timeline-day ${isSelected ? 'selected' : ''} ${isToday(day) ? 'today' : ''}`}
                onClick={() => handleDateSelect(day)}
                whileHover={{ scale: 1.05 }}
                layout
              >
                <div className="timeline-day-name">{format(day, 'EEE')}</div>
                <div className="timeline-day-number">{format(day, 'd')}</div>
                {dayNotes.length > 0 && <div className="timeline-note-indicator" />}
              </motion.div>
            );
          })}
        </div>
        <div className="agenda-view-container">
          <div className="agenda-view-header">
            <button className="form-button primary" onClick={handleAddNote} style={{ marginBottom: 12 }}>
              <Plus size={16} /> Add Note
            </button>
          </div>
          <ul className="note-list">
            {selectedDayNotes.map(note => (
              <li key={note._id}>
                <NoteListItem
                  note={note}
                  isSelected={selectedNoteId === note._id}
                  onSelect={() => { setSelectedNoteId(note._id); setIsEditorOpen(false); }}
                  onPinToggle={() => togglePinNote(note._id)}
                  onDoubleClick={() => { setEditingNote(note); setIsEditorOpen(true); }}
                />
              </li>
            ))}
          </ul>
          {selectedDayNotes.length === 0 && (
            <div className="empty-state-view">
              <FileText size={48} />
              <p>No notes for this date.</p>
              <button className="empty-state-button" onClick={handleAddNote}>
                <Plus size={16} /> Add Note
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="agenda-right-pane">
        {selectedNote ? (
          <div className="note-display-container">
            <div className="note-display-header">
              <h2>{selectedNote.title}</h2>
              <div className="note-display-actions">
                <button className="icon-button" onClick={() => handleEditNote(selectedNote)} title="Edit note">
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="note-display-meta">
              <span>{format(new Date(selectedNote.date), 'MMMM do, yyyy')}</span>
            </div>
            <div className="note-display-content">
              {selectedNote.content}
            </div>
          </div>
        ) : (
          <div className="note-display-container empty-state-view">
            <FileText size={48} />
            <p>Select a note or create a new one to get started.</p>
          </div>
        )}
        <AnimatePresence>
          {isEditorOpen && (
            <NoteModal
              note={editingNote}
              onSave={handleSaveNote}
              onClose={() => { setIsEditorOpen(false); setEditingNote(null); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}