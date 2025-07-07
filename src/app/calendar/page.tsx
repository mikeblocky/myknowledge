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
<<<<<<< HEAD
import NoteEditor from '@/components/NoteEditor';
// If NoteEditor exists elsewhere, update the path accordingly, for example:
// import NoteEditor from '../components/NoteEditor';
// Or create the file at src/components/NoteEditor.tsx if missing.
=======
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa

export default function CalendarPage() {
  const { notes, togglePinNote, addNote } = useNotes();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timelineDates, setTimelineDates] = useState<Date[]>([]);
<<<<<<< HEAD
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
=======
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
  const scrollerRef = useRef<HTMLDivElement>(null);

  const notesByDate = useMemo(() => {
    return notes.reduce((acc, note) => {
      const date = format(new Date(note.date), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(note);
      return acc;
    }, {} as Record<string, Note[]>);
  }, [notes]);
  
  // Generate a rolling 3-month timeline of dates
  useEffect(() => {
    const startDate = subDays(selectedDate, 30);
    const endDate = addDays(selectedDate, 30);
    setTimelineDates(eachDayOfInterval({ start: startDate, end: endDate }));
  }, [selectedDate]);
  
  // Center the selected date in the timeline view
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
  }

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
            <AnimatePresence mode="wait">
                <motion.div
                    key={format(selectedDate, 'yyyy-MM-dd')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {selectedDayNotes.length > 0 ? (
                    <ul className="note-list">
                        {selectedDayNotes.map(note => (
                            <NoteListItem
<<<<<<< HEAD
                                key={note._id}
                                note={note}
                                isSelected={selectedNoteId === note._id}
                                onSelect={() => setSelectedNoteId(note._id)}
                                onPinToggle={() => togglePinNote(note._id)}
=======
                                key={note.id}
                                note={note}
                                isSelected={false}
                                onSelect={() => {}}
                                onPinToggle={() => togglePinNote(note.id)}
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
                            />
                        ))}
                    </ul>
                    ) : (
                    <div className="empty-state-view">
                        <FileText size={48} />
                        <p>No notes for this date.</p>
                        <button className="empty-state-button">
                            <Plus size={16} />
                            Add Note
                        </button>
                    </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
<<<<<<< HEAD

        {selectedNoteId && (
          <NoteEditor
            note={notes.find(n => n._id === selectedNoteId)}
            onClose={() => setSelectedNoteId(null)}
            // ...other props for editing/deleting...
          />
        )}
=======
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
      </div>
    </div>
  );
}