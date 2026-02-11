import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditableContent } from './EditableContentProvider';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click to edit',
  className = '',
  as: Component = 'span',
}: EditableTextProps) {
  const { isEditMode } = useEditableContent();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(localValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${className} min-h-[100px]`}
          rows={5}
        />
      );
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <Component
      className={`${className} cursor-pointer hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 rounded px-2 py-1 transition-colors border-2 border-dashed border-transparent hover:border-yellow-400`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
    </Component>
  );
}
