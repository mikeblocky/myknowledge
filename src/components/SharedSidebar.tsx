'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  Settings,
  BookOpen,
  StickyNote,
  Calendar,
  Tag,
  Star,
  Archive,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

interface SharedSidebarProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onAdd?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  className?: string;
}

export default function SharedSidebar({
  title,
  icon,
  children,
  onAdd,
  onSearch,
  onFilter,
  className = ''
}: SharedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <motion.div
      className={`shared-sidebar ${isCollapsed ? 'collapsed' : ''} ${className}`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-content">
          <div className="header-icon">
            {icon}
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                className="header-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="header-title">{title}</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button
          className="collapse-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search Bar */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            className="search-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Bar */}
      <div className="actions-section">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="actions-content"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {onAdd && (
                <button className="action-btn primary" onClick={onAdd}>
                  <Plus size={16} />
                  <span>Add New</span>
                </button>
              )}
              
              {onFilter && (
                <button className="action-btn secondary" onClick={onFilter}>
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="collapsed-actions">
            {onAdd && (
              <button className="collapsed-action-btn primary" onClick={onAdd} title="Add New">
                <Plus size={20} />
              </button>
            )}
            {onFilter && (
              <button className="collapsed-action-btn secondary" onClick={onFilter} title="Filter">
                <Filter size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="sidebar-content">
        {children}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="footer-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button className="footer-btn">
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <button className="collapsed-footer-btn" title="Settings">
            <Settings size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Quick Actions Component for collapsed state
export function QuickActions() {
  return (
    <div className="quick-actions">
      <button className="quick-action-btn" title="Notes">
        <StickyNote size={20} />
      </button>
      <button className="quick-action-btn" title="Journal">
        <BookOpen size={20} />
      </button>
      <button className="quick-action-btn" title="Calendar">
        <Calendar size={20} />
      </button>
    </div>
  );
}

// Filter Panel Component
export function FilterPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="filter-panel"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2 }}
        >
          <div className="filter-header">
            <h3>Filters</h3>
            <button onClick={onClose} className="close-btn">
              <ChevronLeft size={16} />
            </button>
          </div>
          
          <div className="filter-content">
            <div className="filter-group">
              <label>Sort by</label>
              <select className="filter-select">
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" defaultChecked />
                  <span>Active</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Archived</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Pinned</span>
                </label>
              </div>
            </div>
            
            <div className="filter-group">
              <label>Tags</label>
              <div className="tag-filters">
                <span className="tag-filter">Work</span>
                <span className="tag-filter">Personal</span>
                <span className="tag-filter">Ideas</span>
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="btn btn-secondary">Clear</button>
            <button className="btn btn-primary">Apply</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 