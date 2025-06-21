// src/components/TagPill.tsx
import { Tag } from "@/context/NotesContext";

interface TagPillProps {
  tag: Tag;
  onClick?: (tagId: number) => void;
  isActive?: boolean;
}

const TagPill = ({ tag, onClick, isActive }: TagPillProps) => {
  return (
    <button
      className={`tag-pill ${isActive ? 'active' : ''}`}
      style={{
        backgroundColor: isActive ? tag.color : 'transparent',
        borderColor: tag.color,
        color: isActive ? '#fff' : tag.color,
      }}
      onClick={() => onClick?.(tag.id)}
    >
      {tag.name}
    </button>
  );
};

export default TagPill;