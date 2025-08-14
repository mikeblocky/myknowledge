'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  subMonths,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  getWeek,
  isSameMonth,
  isWeekend,
  addWeeks,
  subWeeks,
  parseISO,
  isValid
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Plus,
  Calendar,
  Clock,
  Search,
  Edit3,
  Trash2,
  Grid3X3,
  List,
  CalendarDays,
  Star,
  Eye,
  EyeOff,
  MoreHorizontal,
  Filter,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import NoteListItem from '@/components/NoteListItem';
import { AnimatePresence, motion } from 'framer-motion';
import NoteModal from '@/components/NoteModal';

type CalendarView = 'month' | 'week' | 'agenda' | 'timeline';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'note' | 'reminder' | 'event';
  priority: 'low' | 'medium' | 'high';
}

export default function CalendarPage() {
  const { notes, togglePinNote, addNote, updateNote, deleteNote } = useNotes();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>('month');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeekends, setShowWeekends] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Enhanced notes organization with better date handling
  const notesByDate = useMemo(() => {
    return notes.reduce((acc, note) => {
      try {
        const date = parseISO(note.date);
        if (isValid(date)) {
          const dateKey = format(date, 'yyyy-MM-dd');
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(note);
        }
      } catch (error) {
        console.warn('Invalid date for note:', note.date);
      }
      return acc;
    }, {} as Record<string, Note[]>);
  }, [notes]);

  // Filtered notes based on search and tags
  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        note.tagIds && note.tagIds.some(tagId => selectedTags.includes(tagId))
      );
    }
    
    return filtered;
  }, [notes, searchQuery, selectedTags]);

  // Sorted notes
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          // For now, use title as fallback since priority isn't implemented
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredNotes, sortBy, sortOrder]);

  // Generate calendar data based on view mode
  const calendarData = useMemo(() => {
    switch (viewMode) {
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const start = startOfWeek(monthStart);
        const end = endOfWeek(monthEnd);
        
        return eachWeekOfInterval({ start, end }).map(weekStart => 
          eachDayOfInterval({
            start: weekStart,
            end: endOfWeek(weekStart)
          })
        );
      
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return [eachDayOfInterval({ start: weekStart, end: weekEnd })];
      
      case 'agenda':
        const agendaStart = subDays(selectedDate, 7);
        const agendaEnd = addDays(selectedDate, 7);
        return eachDayOfInterval({ start: agendaStart, end: agendaEnd });
      
      case 'timeline':
        const timelineStart = subDays(selectedDate, 15);
        const timelineEnd = addDays(selectedDate, 15);
        return eachDayOfInterval({ start: timelineStart, end: timelineEnd });
      
      default:
        return [];
    }
  }, [currentDate, selectedDate, viewMode]);

  // Get notes for selected date
  const selectedDayNotes = notesByDate[format(selectedDate, 'yyyy-MM-dd')] || [];
  const selectedNote = selectedDayNotes.find(n => n._id === selectedNoteId) || null;

  // Navigation handlers
  const handleDateNav = useCallback((direction: 'prev' | 'next') => {
    setIsLoading(true);
    
    setTimeout(() => {
      let newDate: Date;
      
      switch (viewMode) {
        case 'month':
          newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
          break;
        case 'week':
          newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
          break;
        case 'agenda':
        case 'timeline':
          newDate = direction === 'prev' ? subDays(currentDate, 7) : addDays(currentDate, 7);
          break;
        default:
          newDate = currentDate;
      }
      
      setCurrentDate(newDate);
      if (viewMode === 'month') {
        setSelectedDate(newDate);
      }
      setIsLoading(false);
    }, 150);
  }, [currentDate, viewMode]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    if (viewMode === 'month' && !isSameMonth(date, currentDate)) {
      setCurrentDate(date);
    }
    setSelectedNoteId(null);
    setIsEditorOpen(false);
  }, [currentDate, viewMode]);

  const handleViewModeChange = useCallback((mode: CalendarView) => {
    setViewMode(mode);
    if (mode === 'month') {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const handleQuickJump = useCallback(() => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  }, []);

  // Note handlers
  const handleAddNote = useCallback(() => {
    setEditingNote(null);
    setIsEditorOpen(true);
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  }, []);

  const handleSaveNote = useCallback(async (noteData: { title: string; content: string; tagIds: string[] }) => {
    if (editingNote) {
      await updateNote({ ...editingNote, ...noteData });
    } else {
      const newNote = await addNote({ 
        ...noteData, 
        tagIds: noteData.tagIds || []
      });
      if (newNote) setSelectedNoteId(newNote._id);
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  }, [editingNote, addNote, updateNote, selectedDate]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    }
  }, [deleteNote, selectedNoteId]);

  // Render calendar day with improved design
  const renderCalendarDay = useCallback((date: Date, isCurrentMonth: boolean = true) => {
    const dayNotes = notesByDate[format(date, 'yyyy-MM-dd')] || [];
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);
    const isWeekendDay = isWeekend(date);

    return (
      <motion.div
        key={date.toString()}
        className={`calendar-day ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isWeekendDay ? 'weekend' : ''}`}
        onClick={() => handleDateSelect(date)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <div className="day-header">
          <span className="day-number">{format(date, 'd')}</span>
          {dayNotes.length > 0 && (
            <div className="day-indicator">
              <span className="indicator-count">{dayNotes.length}</span>
            </div>
          )}
        </div>
        {dayNotes.length > 0 && (
          <div className="day-notes-preview">
            {dayNotes.slice(0, 2).map(note => (
              <div key={note._id} className="note-preview-item">
                <div className="note-preview-dot" />
                <span className="note-preview-title">{note.title}</span>
              </div>
            ))}
            {dayNotes.length > 2 && (
              <div className="note-preview-more">+{dayNotes.length - 2}</div>
            )}
          </div>
        )}
      </motion.div>
    );
  }, [notesByDate, selectedDate, handleDateSelect]);

  // Render timeline day
  const renderTimelineDay = useCallback((date: Date) => {
    const dayNotes = notesByDate[format(date, 'yyyy-MM-dd')] || [];
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    return (
      <motion.div
        key={date.toString()}
        className={`timeline-day-item ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''}`}
        onClick={() => handleDateSelect(date)}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <div className="timeline-day-header">
          <div className="timeline-day-name">{format(date, 'EEE')}</div>
          <div className="timeline-day-number">{format(date, 'd')}</div>
        </div>
        {dayNotes.length > 0 && (
          <div className="timeline-day-notes">
            <div className="timeline-notes-count">{dayNotes.length} notes</div>
          </div>
        )}
      </motion.div>
    );
  }, [notesByDate, selectedDate, handleDateSelect]);

  return (
    <div className="calendar-page">
      {/* Modern Header */}
      <header className="calendar-header">
        <div className="header-left">
          <div className="calendar-brand">
            <div className="brand-icon">
              <Calendar size={32} />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Calendar</h1>
              <span className="brand-subtitle">Organize your thoughts & schedule</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="date-navigation">
            <button 
              className="nav-btn" 
              onClick={() => handleDateNav('prev')}
              disabled={isLoading}
              aria-label="Previous period"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="current-period">
              <span className="period-main">
                {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
                {viewMode === 'week' && `Week ${getWeek(currentDate)}`}
                {viewMode === 'agenda' && format(currentDate, 'MMM yyyy')}
                {viewMode === 'timeline' && format(currentDate, 'MMM yyyy')}
              </span>
              <span className="period-sub">
                {format(selectedDate, 'EEEE, MMMM do')}
              </span>
            </div>
            
            <button 
              className="nav-btn" 
              onClick={() => handleDateNav('next')}
              disabled={isLoading}
              aria-label="Next period"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="header-right">
          <div className="view-selector">
            <button 
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('month')}
              title="Month view"
            >
              <Grid3X3 size={16} />
              Month
            </button>
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('week')}
              title="Week view"
            >
              <CalendarDays size={16} />
              Week
            </button>
            <button 
              className={`view-btn ${viewMode === 'agenda' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('agenda')}
              title="Agenda view"
            >
              <List size={16} />
              Agenda
            </button>
            <button 
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('timeline')}
              title="Timeline view"
            >
              <Calendar size={16} />
              Timeline
            </button>
          </div>

          <div className="header-actions">
            <button className="today-btn" onClick={handleQuickJump}>
              Today
            </button>
            <button className="add-note-btn" onClick={handleAddNote}>
              <Plus size={18} />
              Add Note
            </button>
          </div>
        </div>
      </header>

      {/* Search and Controls */}
      <div className="calendar-controls">
        <div className="search-section">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes, dates, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="controls-section">
          <button 
            className={`control-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <Filter size={16} />
            Filters
          </button>
          
          <label className="control-toggle">
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
            />
            <span className="toggle-label">Weekends</span>
          </label>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div 
          className="filters-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="filters-content">
            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'priority')}
                className="filter-select"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Order:</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="filter-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Calendar Content */}
      <div className="calendar-content">
        <div className="calendar-main">
          {/* Calendar Grid/List */}
          {viewMode === 'timeline' ? (
            <div className="timeline-view" ref={timelineRef}>
              <div className="timeline-scroll">
                {Array.isArray(calendarData) && calendarData.length > 0 && 
                 (viewMode === 'timeline' ? 
                  (calendarData as Date[]).map((date) => renderTimelineDay(date))
                  :
                  (calendarData as Date[][]).flat().map((date) => renderTimelineDay(date))
                 )
                }
              </div>
            </div>
          ) : (
            <div className="calendar-grid-view" ref={calendarRef}>
              {/* Weekday Headers */}
              <div className="weekday-headers">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday-header">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="calendar-grid">
                {Array.isArray(calendarData) && (calendarData as Date[][]).map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {Array.isArray(week) && week.map((date) => {
                      const isCurrentMonth = isSameMonth(date, currentDate);
                      return renderCalendarDay(date, isCurrentMonth);
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes for Selected Date */}
          <div className="selected-date-section">
            <div className="section-header">
              <div className="header-content">
                <h3 className="section-title">Notes for {format(selectedDate, 'MMMM do, yyyy')}</h3>
                <span className="notes-count-badge">{selectedDayNotes.length} notes</span>
              </div>
              <button className="add-note-btn-small" onClick={handleAddNote}>
                <Plus size={16} />
                Add Note
              </button>
            </div>
            
            <div className="notes-list">
              {selectedDayNotes.map(note => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <NoteListItem
                    note={note}
                    isSelected={selectedNoteId === note._id}
                    onSelect={() => { 
                      setSelectedNoteId(note._id); 
                      setIsEditorOpen(false); 
                    }}
                    onPinToggle={() => togglePinNote(note._id)}
                    onDoubleClick={() => { 
                      setEditingNote(note); 
                      setIsEditorOpen(true); 
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {selectedDayNotes.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileText size={48} />
                </div>
                <h3 className="empty-title">No notes for this date</h3>
                <p className="empty-description">Start planning your day by adding a note</p>
                <button className="empty-action-btn" onClick={handleAddNote}>
                  <Plus size={16} />
                  Create First Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Note Display */}
        <div className="calendar-sidebar">
          {selectedNote ? (
            <div className="note-display">
              <div className="note-header">
                <div className="note-title-section">
                  <h2 className="note-title">{selectedNote.title}</h2>
                  <div className="note-meta">
                    <span className="note-date">
                      <Clock size={16} />
                      {format(new Date(selectedNote.date), 'MMMM do, yyyy')}
                    </span>
                  </div>
                </div>
                
                <div className="note-actions">
                  <button 
                    className="action-btn" 
                    onClick={() => handleEditNote(selectedNote)}
                    title="Edit Note"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    className="action-btn destructive" 
                    onClick={() => handleDeleteNote(selectedNote._id)}
                    title="Delete Note"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="note-content">
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={64} />
              </div>
              <h3 className="empty-title">No Note Selected</h3>
              <p className="empty-description">Select a note from the list or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <NoteModal
            note={editingNote}
            onSave={handleSaveNote}
            onClose={() => { 
              setIsEditorOpen(false); 
              setEditingNote(null); 
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}