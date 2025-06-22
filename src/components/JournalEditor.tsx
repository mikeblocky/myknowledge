'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect, useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { 
  Bold, Italic, Strikethrough, Code, Underline as UnderlineIcon,
  Heading1, Heading2, Heading3, Pilcrow, List, ListOrdered, Quote, Minus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Paintbrush, Eraser,
  Save, RotateCcw, Download, Share2, Calendar, Clock
} from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <div className="toolbar-section">
        <div className="toolbar-group">
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().setParagraph().run()} 
            className={`toolbar-button ${editor.isActive('paragraph') ? 'is-active' : ''}`}
            title="Paragraph"
          >
            <Pilcrow size={16} />
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        <div className="toolbar-group">
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            className={`toolbar-button ${editor.isActive('underline') ? 'is-active' : ''}`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleCode().run()} 
            className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
            title="Code"
          >
            <Code size={16} />
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        <div className="toolbar-group">
          <input 
            type="color" 
            onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()} 
            value={editor.getAttributes('textStyle').color || '#ffffff'} 
            className="color-input" 
            title="Text Color"
          />
          <button 
            onClick={() => editor.chain().focus().toggleHighlight().run()} 
            className={`toolbar-button ${editor.isActive('highlight') ? 'is-active' : ''}`}
            title="Highlight"
          >
            <Paintbrush size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().unsetAllMarks().run()} 
            className="toolbar-button"
            title="Clear Formatting"
          >
            <Eraser size={16} />
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        <div className="toolbar-group">
          <button 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
            className={`toolbar-button ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        <div className="toolbar-group">
          <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            className={`toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button 
            onClick={() => editor.chain().focus().setHorizontalRule().run()} 
            className="toolbar-button"
            title="Horizontal Rule"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface JournalEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: { title: string; content: string }) => void;
  lastModified?: Date;
}

const JournalEditor = ({ initialTitle = '', initialContent = '', onSave, lastModified }: JournalEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent,
    editorProps: {
      attributes: { 
        class: 'prose-mirror-editor',
        'data-placeholder': 'Start writing your journal entry...'
      },
    },
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true);
    },
  });

  useEffect(() => {
    setTitle(initialTitle);
    editor?.commands.setContent(initialContent);
    setHasUnsavedChanges(false);
  }, [initialTitle, initialContent, editor]);

  const handleSave = useCallback(async () => {
    if (editor && title.trim()) {
      setIsSaving(true);
      try {
        await onSave({ title: title.trim(), content: editor.getHTML() });
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Failed to save journal entry:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [editor, title, onSave]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && title.trim()) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, title, handleSave]);

  const handleExport = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 2rem; }
            h1, h2, h3 { color: #333; }
            blockquote { border-left: 4px solid #ccc; padding-left: 1rem; margin: 1rem 0; }
            code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="journal-editor-wrapper">
      <div className="journal-editor-header">
        <div className="editor-toolbar-container">
          <MenuBar editor={editor} />
        </div>
        
        <div className="journal-editor-actions">
          <div className="editor-status">
            {lastSaved && (
              <span className="last-saved">
                <Clock size={14} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="unsaved-indicator">
                Unsaved changes
              </span>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleExport} 
              className="editor-action-button"
              title="Export as HTML"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={handleSave} 
              className="editor-action-button primary"
              disabled={isSaving || !title.trim()}
              title="Save Entry"
            >
              {isSaving ? <RotateCcw size={16} className="spinning" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="journal-content">
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
          {lastModified && (
            <div className="last-modified">
              <Calendar size={14} />
              Last modified: {lastModified.toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="editor-content-container">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default JournalEditor; 