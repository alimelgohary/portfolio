import { useState, useEffect } from 'react';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Linkedin, Github, FileText } from 'lucide-react';

const FIELDS = [
  { key: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com' },
  { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 234 567 890' },
  { key: 'location', label: 'Location', icon: MapPin, placeholder: 'City, Country' },
  { key: 'linkedin_url', label: 'LinkedIn URL', icon: Linkedin, placeholder: 'https://linkedin.com/in/...' },
  { key: 'github_url', label: 'GitHub URL', icon: Github, placeholder: 'https://github.com/...' },
  { key: 'cv_url', label: 'CV / Resume URL', icon: FileText, placeholder: 'https://...' },
] as const;

const ContactInfoEditor = () => {
  const { contact, loading, update } = useContactInfo();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
        linkedin_url: contact.linkedin_url || '',
        github_url: contact.github_url || '',
        cv_url: contact.cv_url || '',
      });
    }
  }, [contact]);

  const handleSave = async () => {
    setSaving(true);
    const error = await update({
      email: form.email || null,
      phone: form.phone || null,
      location: form.location || null,
      linkedin_url: form.linkedin_url || null,
      github_url: form.github_url || null,
      cv_url: form.cv_url || null,
    });
    if (error) toast.error('Failed to save contact info');
    else toast.success('Contact info saved');
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key}>
            <Label className="text-sm mb-1.5 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {label}
            </Label>
            <Input
              value={form[key] || ''}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder}
              maxLength={500}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Contact Info'}
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoEditor;
