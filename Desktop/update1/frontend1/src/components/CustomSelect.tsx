'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({ options, value, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container" ref={selectRef}>
      <button className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption?.label}</span>
        <ChevronsUpDown size={16} className="custom-select-icon" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-select-options"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {options.map(option => (
              <motion.div
                key={option.value}
                className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                whileHover={{ backgroundColor: 'var(--surface-2)' }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={16} />}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 