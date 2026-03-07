import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { SectionType, ALL_SECTIONS, SECTION_LABELS, SECTION_FIELDS, PortfolioEntry } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RichTextEditor from '@/components/RichTextEditor';
import VisitorStats from '@/components/admin/VisitorStats';
import ContactInfoEditor from '@/components/admin/ContactInfoEditor';
import { sanitizeHtml } from '@/lib/sanitize';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { getBySection, addEntry, updateEntry, deleteEntry } = usePortfolio();
  const [activeTab, setActiveTab] = useState<SectionType>('summary');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PortfolioEntry | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioEntry>>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const entries = getBySection(activeTab);
  const fields = SECTION_FIELDS[activeTab];

  const openAdd = () => {
    setEditingEntry(null);
    setFormData({ section: activeTab, order: entries.length });
    setDialogOpen(true);
  };

  const openEdit = (entry: PortfolioEntry) => {
    setEditingEntry(entry);
    setFormData({ ...entry });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sanitize description before saving
      const sanitized = { ...formData };
      if (sanitized.description) {
        sanitized.description = sanitizeHtml(sanitized.description);
      }

      if (editingEntry) {
        await updateEntry(editingEntry.id, sanitized);
      } else {
        await addEntry({ section: activeTab, order: entries.length, ...sanitized } as Omit<PortfolioEntry, 'id'>);
      }
      setDialogOpen(false);
      setFormData({});
      setEditingEntry(null);
      toast.success('Entry saved');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this entry?')) {
      await deleteEntry(id);
      toast.success('Entry deleted');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const updateField = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="font-bold text-lg">Portfolio Admin</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>View Site</Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />Logout</Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <VisitorStats />
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SectionType)}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 mb-6">
            {ALL_SECTIONS.map((s) => (
              <TabsTrigger key={s} value={s} className="text-xs">{SECTION_LABELS[s]}</TabsTrigger>
            ))}
          </TabsList>

          {ALL_SECTIONS.map((s) => (
            <TabsContent key={s} value={s}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{SECTION_LABELS[s]}</h2>
                <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Entry</Button>
              </div>

              {getBySection(s).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                  No entries yet. Click "Add Entry" to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {getBySection(s).map((entry) => (
                    <div key={entry.id} className="border border-border rounded-lg p-4 bg-card flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{entry.title || (entry.section === 'summary' ? 'Summary' : 'Untitled')}</p>
                        {entry.organization && <p className="text-sm text-muted-foreground">{entry.organization}</p>}
                        {entry.startDate && <p className="text-xs text-muted-foreground">{entry.startDate}{entry.endDate ? ` — ${entry.endDate}` : entry.current ? ' — Present' : ''}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(entry)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit' : 'Add'} {SECTION_LABELS[activeTab]} Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {fields.map((field) => (
              <div key={field.name}>
                <Label className="text-sm mb-1.5 block">{field.label}</Label>
                {field.type === 'text' && (
                  <Input
                    value={(formData[field.name] as string) || ''}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    maxLength={500}
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={(formData[field.name] as number) || ''}
                    onChange={(e) => updateField(field.name, parseInt(e.target.value) || 0)}
                  />
                )}
                {field.type === 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={(formData[field.name] as boolean) || false}
                      onCheckedChange={(checked) => updateField(field.name, checked)}
                    />
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                  </div>
                )}
                {field.type === 'technologies' && (
                  <Input
                    value={(formData[field.name] as string[])?.join(', ') || ''}
                    onChange={(e) => updateField(field.name, e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                    placeholder="React, TypeScript, Docker"
                    maxLength={500}
                  />
                )}
                {field.type === 'richtext' && (
                  <RichTextEditor
                    key={editingEntry?.id || 'new'}
                    value={(formData[field.name] as string) || ''}
                    onChange={(val) => updateField(field.name, val)}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
