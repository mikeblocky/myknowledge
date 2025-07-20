'use client';

import { motion } from 'framer-motion';
import { FilePlus, Sun, Star, ChevronsRight } from 'lucide-react';

export const journalTemplates = [
  {
    title: 'Daily Reflection',
    content: '## Daily Reflection\n\n**How was my day?**\n\n\n**What am I grateful for?**\n\n\n**What could I improve on tomorrow?**\n\n',
    icon: Sun,
  },
  {
    title: 'Weekly Goals',
    content: '## Weekly Goals\n\n**Last Week\'s Wins:**\n\n- \n\n**Top 3 Goals for This Week:**\n\n1. \n2. \n3. \n\n**How I\'ll achieve them:**\n\n',
    icon: Star,
  },
  {
    title: 'Freeform',
    content: '## \n\n',
    icon: ChevronsRight,
  },
];

interface JournalTemplateSelectorProps {
  onSelect: (template: { title: string; content: string }) => void;
}

export default function JournalTemplateSelector({ onSelect }: JournalTemplateSelectorProps) {
  return (
    <div className="new-entry-container">
      <button className="new-entry-button" onClick={() => onSelect(journalTemplates[2])}>
        <FilePlus size={20} />
        <span>New Blank Entry</span>
      </button>
      <div className="template-list">
        <p className="template-list-header">Or create from a template:</p>
        {journalTemplates.slice(0, 2).map((template) => (
          <button
            key={template.title}
            className="template-item"
            onClick={() => onSelect(template)}
          >
            <template.icon size={16} />
            <span>{template.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 