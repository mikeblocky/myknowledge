'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Rocket, Sun, Moon, StickyNote, Book, Calendar, Settings, Plus, Search, Menu } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Notes', icon: StickyNote },
    { href: '/journal', label: 'Journal', icon: Book },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
];

export default function Taskbar() {
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    const { theme, toggleTheme } = useTheme();
    const isMobile = useMediaQuery('(max-width: 600px)');

    if (isMobile) {
        return (
            <motion.div 
                className="mobile-taskbar"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            >
                {/* Mobile Taskbar - Compact Design */}
                <div className="mobile-taskbar-content">
                    {/* Left: Navigation */}
                    <div className="mobile-nav-section">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Link 
                                    href={item.href} 
                                    className={`mobile-nav-button ${pathname === item.href ? 'active' : ''}`}
                                >
                                    <item.icon size={20} />
                                    {pathname === item.href && (
                                        <motion.div
                                            className="mobile-active-indicator"
                                            layoutId="mobileActiveIndicator"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="mobile-actions-section">
                        <motion.button 
                            onClick={toggleTheme} 
                            className="mobile-action-button"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={theme}
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 180, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {theme === 'light' ? <Moon size={18}/> : <Sun size={18} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                        
                        {isSignedIn ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mobile-user-button-container"
                            >
                                <UserButton 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "mobile-user-avatar",
                                            userButtonPopoverCard: "mobile-user-popover",
                                            userButtonPopoverActionButton: "mobile-user-action",
                                            userButtonPopoverActionButtonText: "mobile-user-action-text",
                                            userButtonPopoverFooter: "mobile-user-footer"
                                        }
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Link href="/sign-in" className="mobile-auth-button">Log In</Link>
                                <Link href="/sign-up" className="mobile-auth-button primary">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Desktop version (existing design)
    return (
        <motion.div 
            className="taskbar"
            style={{ marginTop: '24px' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
        >
            <nav className="taskbar-navigation">
                {navItems.map((item, index) => (
                    <motion.div
                        key={item.href}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <motion.div
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <Link 
                                href={item.href} 
                                className={`taskbar-button ${pathname === item.href ? 'active' : ''}`}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                                {pathname === item.href && (
                                    <motion.div
                                        className="active-indicator"
                                        layoutId="activeIndicator"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    </motion.div>
                ))}
            </nav>
            
            <div className="taskbar-actions">
                <motion.button 
                    onClick={toggleTheme} 
                    className="taskbar-button theme-toggle"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    whileHover={{ y: -5, scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9, rotate: -15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {theme === 'light' ? <Moon size={18}/> : <Sun size={18} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
                
                {isSignedIn ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 rounded-full overflow-hidden",
                                    userButtonPopoverCard: "bg-surface-1 border border-border-color shadow-lg",
                                    userButtonPopoverActionButton: "hover:bg-surface-2 text-text-main",
                                    userButtonPopoverActionButtonText: "text-text-main",
                                    userButtonPopoverFooter: "border-t border-border-color"
                                }
                            }}
                        />
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href="/sign-in" className="taskbar-button">Log In</Link>
                        <Link href="/sign-up" className="taskbar-button">Sign Up</Link>
                    </div>
                )}
            </div>
        </motion.div>
    )
} 