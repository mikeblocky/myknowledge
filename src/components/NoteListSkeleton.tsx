import { motion } from 'framer-motion';

const NoteListItemSkeleton = () => (
    <div className="note-list-item-skeleton">
        <div className="skeleton-line title" />
        <div className="skeleton-line content" />
        <div className="skeleton-line content short" />
        <div className="skeleton-footer">
            <div className="skeleton-line tag" />
            <div className="skeleton-line date" />
        </div>
    </div>
);

const NoteListSkeleton = () => {
    return (
        <motion.div className="note-list" layout>
            {[...Array(5)].map((_, i) => (
                <NoteListItemSkeleton key={i} />
            ))}
        </motion.div>
    );
};

export default NoteListSkeleton; 