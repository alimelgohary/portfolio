import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, []); // mount only

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      <div className="flex gap-1 p-1.5 border-b border-border bg-muted/50">
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => exec('bold')}><Bold className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => exec('italic')}><Italic className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => exec('underline')}><Underline className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleLink}><Link className="h-3.5 w-3.5" /></Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => exec('insertUnorderedList')}><List className="h-3.5 w-3.5" /></Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[100px] p-3 text-sm text-foreground focus:outline-none rich-content"
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
      />
    </div>
  );
};

export default RichTextEditor;