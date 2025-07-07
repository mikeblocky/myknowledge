'use client';
import { useState, useMemo, useEffect } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import JournalEditor from '@/components/JournalEditor';
import { PlusCircle, FileText, Search, Tag, Filter, ChevronsUpDown } from 'lucide-react';
import TagPill from '@/components/TagPill';
import JournalTemplateSelector from '@/components/JournalTemplateSelector';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/CustomSelect';

type SortOption =
  | 'newest-first'
  | 'oldest-first'
  | 'title-a-z'
  | 'title-z-a';

export default function JournalPage() {
  const { journalEntries, tags, addJournalEntry, updateJournalEntry } = useNotes();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest-first');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const sortOptions = [
    { value: 'newest-first', label: 'Newest first' },
    { value: 'oldest-first', label: 'Oldest first' },
    { value: 'title-a-z', label: 'Title A-Z' },
    { value: 'title-z-a', label: 'Title Z-A' },
  ];

  const journalNotes = useMemo(() => {
    const sorted = journalEntries
      .sort((a, b) => {
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

  const handleSaveEntry = (data: { title: string; content: string }) => {
    if (selectedEntry) {
      updateJournalEntry({ ...selectedEntry, ...data });
    }
  };

  return (
    <div className="main-layout">
       <div className="left-pane">
        <div className="pane-header">
          <h1>Journal entries</h1>
        </div>

        <JournalTemplateSelector onSelect={handleCreateFromTemplate} />

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
              className={`note-list-item ${selectedEntryId === entry._id ? 'selected' : ''}`}
              onClick={() => setSelectedEntryId(entry._id)}
            >
              <div className="note-list-item-title">{entry.title}</div>
              <p className="note-list-item-date">{new Date(entry.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="right-pane journal-page-pane">
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
                onSave={handleSaveEntry}
                lastModified={new Date(selectedEntry.date)}
            />
          </motion.div>
        ) : (
          <div className="empty-state-view">
             <FileText size={48} />
            <p>Select a journal entry or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
} 