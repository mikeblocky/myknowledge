'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect, useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { 
  Bold, Italic, Strikethrough, Code, Underline as UnderlineIcon,
  Heading1, Heading2, Heading3, Pilcrow, List, ListOrdered, Quote, Minus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Paintbrush, Eraser,
  Save, RotateCcw, Download, Share2, Calendar, Clock, ChevronDown, ChevronUp,
  Type, Palette, AlignJustify as AlignJustifyIcon, MoreHorizontal, X
} from 'lucide-react';

const NewMenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  // Professional, organized ribbon: horizontal button groups with subtle group label
  const ribbonGroups = [
    {
      label: 'Text',
      buttons: [
        { label: 'Heading 1', icon: <Heading1 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
        { label: 'Heading 2', icon: <Heading2 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
        { label: 'Heading 3', icon: <Heading3 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
        { label: 'Paragraph', icon: <Pilcrow size={18} />, action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
      ]
    },
    {
      label: 'Format',
      buttons: [
        { label: 'Bold', icon: <Bold size={18} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
        { label: 'Italic', icon: <Italic size={18} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
        { label: 'Underline', icon: <UnderlineIcon size={18} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
        { label: 'Strike', icon: <Strikethrough size={18} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
        { label: 'Code', icon: <Code size={18} />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
      ]
    },
    {
      label: 'Align',
      buttons: [
        { label: 'Align Left', icon: <AlignLeft size={18} />, action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
        { label: 'Align Center', icon: <AlignCenter size={18} />, action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
        { label: 'Align Right', icon: <AlignRight size={18} />, action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
        { label: 'Justify', icon: <AlignJustifyIcon size={18} />, action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
      ]
    },
    {
      label: 'Insert',
      buttons: [
        { label: 'Bullet List', icon: <List size={18} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
        { label: 'Numbered List', icon: <ListOrdered size={18} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
        { label: 'Quote', icon: <Quote size={18} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
        { label: 'Horizontal Rule', icon: <Minus size={18} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
      ]
    }
  ];

  return (
    <div className="ribbon-toolbar professional-ribbon modern-ribbon organized-ribbon">
      {ribbonGroups.map((group, idx) => (
        <div className="organized-ribbon-group" key={group.label}>
          <div className="organized-ribbon-label">{group.label}</div>
          <div className="organized-ribbon-btns">
            {group.buttons.map((btn) => (
              <button
                key={btn.label}
                className={`toolbar-button professional-btn modern-btn organized-btn${btn.active ? ' active' : ''}`}
                onClick={btn.action}
                title={btn.label}
                aria-label={btn.label}
                type="button"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MobileFormattingBar = ({ editor, onSave, isSaving, canSave }: { editor: any, onSave: () => void, isSaving: boolean, canSave: boolean }) => {
  const [showMore, setShowMore] = useState(false);
  if (!editor) return null;

  // Essential actions for mobile bar
  const essentials = [
    { label: 'Bold', icon: <Bold size={22} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'Italic', icon: <Italic size={22} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'Underline', icon: <UnderlineIcon size={22} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { label: 'Bullet List', icon: <List size={22} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: 'More', icon: <MoreHorizontal size={22} />, action: () => setShowMore(true), active: false },
  ];

  // All actions for modal
  const allActions = [
    { label: 'Heading 1', icon: <Heading1 size={22} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'Heading 2', icon: <Heading2 size={22} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'Heading 3', icon: <Heading3 size={22} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { label: 'Paragraph', icon: <Pilcrow size={22} />, action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
    { label: 'Strike', icon: <Strikethrough size={22} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { label: 'Code', icon: <Code size={22} />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { label: 'Align Left', icon: <AlignLeft size={22} />, action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
    { label: 'Align Center', icon: <AlignCenter size={22} />, action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
    { label: 'Align Right', icon: <AlignRight size={22} />, action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
    { label: 'Justify', icon: <AlignJustifyIcon size={22} />, action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
    { label: 'Numbered List', icon: <ListOrdered size={22} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: 'Quote', icon: <Quote size={22} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { label: 'Horizontal Rule', icon: <Minus size={22} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
  ];

  return (
    <>
      <div className="mobile-format-bar">
        {essentials.map(btn => (
          <button
            key={btn.label}
            className={`mobile-format-btn${btn.active ? ' active' : ''}`}
            onClick={btn.action}
            title={btn.label}
            aria-label={btn.label}
            type="button"
          >
            {btn.icon}
          </button>
        ))}
      </div>
      {showMore && (
        <div className="mobile-format-modal" onClick={() => setShowMore(false)}>
          <div className="mobile-format-modal-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-format-modal-title">Formatting</div>
            <div className="mobile-format-modal-grid">
              {allActions.map(btn => (
                <button
                  key={btn.label}
                  className={`mobile-format-btn${btn.active ? ' active' : ''}`}
                  onClick={() => { btn.action(); setShowMore(false); }}
                  title={btn.label}
                  aria-label={btn.label}
                  type="button"
                >
                  {btn.icon}
                </button>
              ))}
            </div>
            <button className="mobile-format-modal-close" onClick={() => setShowMore(false)} type="button">Close</button>
          </div>
        </div>
      )}
      <button
        className="mobile-save-fab"
        onClick={onSave}
        disabled={!canSave || isSaving}
        title="Save"
        aria-label="Save"
        type="button"
      >
        {isSaving ? <RotateCcw size={22} className="spinning" /> : <Save size={22} />}
      </button>
    </>
  );
};

interface JournalEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: { title: string; content: string }) => void;
  lastModified?: Date;
}

const JournalEditor = ({ initialTitle = '', initialContent = '', onSave, lastModified }: JournalEditorProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isLargeScreen = useMediaQuery('(min-width: 900px)');
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true);
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor || !title.trim()) return;
    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: editor.getHTML(),
      });
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, onSave]);

  const handleExport = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'journal-entry'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (initialTitle !== title) {
      setTitle(initialTitle);
    }
    if (initialContent && editor && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialTitle, initialContent, editor]);

  return (
    <div className={`journal-editor-card unified-editor-card expanded-journal-editor${isMobile ? ' mobile' : ''}`.trim()}>
      <div className="journal-header professional-header">
        <div className="journal-title-section">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Journal entry title..."
            className="journal-title-input"
          />
          <div className="journal-meta">
            {lastModified && (
              <span className="journal-date">
                <Calendar size={14} />
                {lastModified.toLocaleDateString()}
              </span>
            )}
            {lastSaved && (
              <span className="journal-saved">
                <Clock size={14} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="journal-unsaved">
                <RotateCcw size={14} />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
        <div className="journal-header-actions">
          <button 
            onClick={handleExport} 
            className="action-button secondary professional-header-btn"
            title="Export as HTML"
            type="button"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          {!isMobile && (
            <button 
              onClick={handleSave} 
              className="action-button primary professional-header-btn"
              disabled={isSaving || !title.trim()}
              title="Save Entry"
              type="button"
            >
              {isSaving ? <RotateCcw size={18} className="spinning" /> : <Save size={18} />}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>
      {isLargeScreen && <NewMenuBar editor={editor} />}
      <div className="journal-content unified-editor-content">
        <EditorContent editor={editor} />
      </div>
      {isMobile && (
        <MobileFormattingBar
          editor={editor}
          onSave={handleSave}
          isSaving={isSaving}
          canSave={!!title.trim()}
        />
      )}
    </div>
  );
};

export default JournalEditor; 