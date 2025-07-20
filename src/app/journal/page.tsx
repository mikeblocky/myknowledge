'use client';
import { useState, useMemo, useEffect } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import JournalEditor from '@/components/JournalEditor';
import { PlusCircle, FileText, Search, Tag, Filter, ChevronsUpDown, Menu, Pin } from 'lucide-react';
import TagPill from '@/components/TagPill';
import JournalTemplateSelector from '@/components/JournalTemplateSelector';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/CustomSelect';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type SortOption =
  | 'newest-first'
  | 'oldest-first'
  | 'title-a-z'
  | 'title-z-a';

export default function JournalPage() {
  const { journalEntries, tags, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useNotes();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest-first');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sortOptions = [
    { value: 'newest-first', label: 'Newest first' },
    { value: 'oldest-first', label: 'Oldest first' },
    { value: 'title-a-z', label: 'Title A-Z' },
    { value: 'title-z-a', label: 'Title Z-A' },
  ];

  const journalNotes = useMemo(() => {
    const sorted = journalEntries
      .sort((a, b) => {
        // Pinned entries first
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
    
    let filtered = sorted;
    if (selectedTagId) {
        filtered = filtered.filter(note => note.tagIds.includes(selectedTagId));
    }
    if (searchTerm) {
        filtered = filtered.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    return filtered;
  }, [journalEntries, searchTerm, selectedTagId, sortOrder]);

  useEffect(() => {
    if (!selectedEntryId && journalNotes.length > 0) {
        setSelectedEntryId(journalNotes[0]._id);
    }
  }, [journalNotes, selectedEntryId]);
  
  const selectedEntry = journalNotes.find(entry => entry._id === selectedEntryId);

  const handleCreateFromTemplate = (template: { title: string; content: string; }) => {
    addJournalEntry({
      title: `${template.title} - ${new Date().toLocaleDateString()}`,
      content: template.content,
      tagIds: []
    }).then(createdEntry => {
      if (createdEntry) setSelectedEntryId(createdEntry._id);
    });
    setShowTemplateSelector(false);
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTagId(prev => (prev === tagId ? null : tagId));
  };

  const handleSaveEntry = (data: { title: string; content: string; tagIds: string[] }) => {
    if (selectedEntry) {
      updateJournalEntry({ ...selectedEntry, ...data });
    }
  };

  const handleDeleteEntry = async () => {
    if (selectedEntry && window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      await deleteJournalEntry(selectedEntry._id);
      setSelectedEntryId(null);
    }
  };

  const handleDuplicateEntry = async () => {
    if (selectedEntry) {
      const duplicatedEntry = await addJournalEntry({
        title: `${selectedEntry.title} (Copy)`,
        content: selectedEntry.content,
        tagIds: selectedEntry.tagIds
      });
      if (duplicatedEntry) {
        setSelectedEntryId(duplicatedEntry._id);
      }
    }
  };

  const handlePinEntry = async () => {
    if (selectedEntry) {
      updateJournalEntry({ ...selectedEntry, isPinned: !selectedEntry.isPinned });
    }
  };

  const handleArchiveEntry = async () => {
    if (selectedEntry) {
      updateJournalEntry({ ...selectedEntry, isArchived: !selectedEntry.isArchived });
    }
  };

  // Close drawer on journal select (mobile)
  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    if (isMobile) setDrawerOpen(false);
  };

  const showDetailView = isMobile && selectedEntryId !== null;

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
      
      {/* Mobile: Show journal list when no entry is selected */}
      {isMobile && !selectedEntryId && (
        <div className="mobile-notes-list-view">
          <div className="mobile-list-header">
            <h1><FileText size={20} /> Journal entries</h1>
            <div className="mobile-header-actions">
              <button className="mobile-action-btn" onClick={() => setShowTemplateSelector(true)} title="Create new journal entry">
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
          
          {showTemplateSelector && (
            <JournalTemplateSelector onSelect={handleCreateFromTemplate} />
          )}
          
          <div className="mobile-search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search entries..." 
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
              {journalNotes.map(entry => (
                <li 
                  key={entry._id} 
                  className={`note-list-item ${selectedEntryId === entry._id ? 'selected' : ''} ${entry.isPinned ? 'pinned' : ''}`}
                  onClick={() => handleSelectEntry(entry._id)}
                >
                  <div className="note-list-item-header">
                    <div className="note-list-item-title">{entry.title}</div>
                    {entry.isPinned && <Pin size={14} className="pin-indicator" />}
                  </div>
                  <p className="note-list-item-date">{new Date(entry.date).toLocaleDateString()}</p>
                  {entry.tagIds.length > 0 && (
                    <div className="note-list-item-tags">
                      {entry.tagIds.map(tagId => {
                        const tag = tags.find(t => t._id === tagId);
                        return tag ? <TagPill key={tag._id} tag={tag} /> : null;
                      })}
                    </div>
                  )}
                </li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
      
      {/* Desktop: Always show left pane */}
      {!isMobile && (
        <div className={`left-pane${drawerOpen && isMobile ? ' open' : ''}`}> 
          <div className="pane-header">
            <h1>Journal entries</h1>
            <button className="icon-button" onClick={() => setShowTemplateSelector(true)} title="Create new journal entry">
              <PlusCircle size={20} />
            </button>
          </div>
          {showTemplateSelector && (
            <JournalTemplateSelector onSelect={handleCreateFromTemplate} />
          )}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search entries..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <ul className="note-list">
            {journalNotes.map(entry => (
              <li 
                key={entry._id} 
                className={`note-list-item ${selectedEntryId === entry._id ? 'selected' : ''} ${entry.isPinned ? 'pinned' : ''}`}
                onClick={() => handleSelectEntry(entry._id)}
              >
                <div className="note-list-item-header">
                  <div className="note-list-item-title">{entry.title}</div>
                  {entry.isPinned && <Pin size={14} className="pin-indicator" />}
                </div>
                <p className="note-list-item-date">{new Date(entry.date).toLocaleDateString()}</p>
                {entry.tagIds.length > 0 && (
                  <div className="note-list-item-tags">
                    {entry.tagIds.map(tagId => {
                      const tag = tags.find(t => t._id === tagId);
                      return tag ? <TagPill key={tag._id} tag={tag} /> : null;
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Mobile: Show drawer when open */}
      {isMobile && selectedEntryId && (
        <div className={`left-pane${drawerOpen ? ' open' : ''}`}> 
          <div className="pane-header">
            <h1>Journal entries</h1>
            <button className="icon-button" onClick={() => setShowTemplateSelector(true)} title="Create new journal entry">
              <PlusCircle size={20} />
            </button>
          </div>
          {showTemplateSelector && (
            <JournalTemplateSelector onSelect={handleCreateFromTemplate} />
          )}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search entries..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <ul className="note-list">
            {journalNotes.map(entry => (
              <li 
                key={entry._id} 
                className={`note-list-item ${selectedEntryId === entry._id ? 'selected' : ''} ${entry.isPinned ? 'pinned' : ''}`}
                onClick={() => handleSelectEntry(entry._id)}
              >
                <div className="note-list-item-header">
                  <div className="note-list-item-title">{entry.title}</div>
                  {entry.isPinned && <Pin size={14} className="pin-indicator" />}
                </div>
                <p className="note-list-item-date">{new Date(entry.date).toLocaleDateString()}</p>
                {entry.tagIds.length > 0 && (
                  <div className="note-list-item-tags">
                    {entry.tagIds.map(tagId => {
                      const tag = tags.find(t => t._id === tagId);
                      return tag ? <TagPill key={tag._id} tag={tag} /> : null;
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="right-pane">
        <AnimatePresence mode="wait">
          {selectedEntry ? (
            <motion.div
              key={selectedEntry._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="editor-container"
            >
              <JournalEditor
                  initialTitle={selectedEntry.title}
                  initialContent={selectedEntry.content}
                  onSave={({ title, content }) =>
                    handleSaveEntry({
                      title,
                      content,
                      tagIds: selectedEntry?.tagIds ?? []
                    })
                  }
                  lastModified={new Date(selectedEntry.date)}
              />
            </motion.div>
          ) : (
            <div className="empty-state-view">
               <FileText size={48} />
              <p>{isMobile ? 'No journal entries yet. Create your first entry!' : 'Select a journal entry or create a new one.'}</p>
              {isMobile && (
                <button className="mobile-add-first-note-btn" onClick={() => setShowTemplateSelector(true)}>
                  <PlusCircle size={20} />
                  Create Entry
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 