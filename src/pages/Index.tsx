import { useEffect } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useContactInfo } from '@/hooks/useContactInfo';
import { SectionType, SECTION_LABELS } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { sanitizeHtml } from '@/lib/sanitize';
import { ExternalLink, MapPin, Calendar, Award, BookOpen, Heart, Terminal, Mail, Phone, Linkedin, Github, FileText } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';
import profilePlaceholder from '@/assets/profile-placeholder.png';

const NAV_SECTIONS: SectionType[] = ['experience', 'skills', 'projects', 'education', 'certificates', 'trainings', 'volunteering'];

const SafeHtml = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
);

const Index = () => {
  const { getBySection, loading } = usePortfolio();
  const { contact } = useContactInfo();
  const summary = getBySection('summary')[0];

  useEffect(() => { trackPageView(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Loading portfolio...</p>
      </div>
    );
  }

  const hasContact = contact && (contact.email || contact.phone || contact.location || contact.linkedin_url || contact.github_url || contact.cv_url);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 flex items-center h-14 gap-6 overflow-x-auto">
          <a href="#top" className="text-primary font-mono font-medium text-sm shrink-0">~/ali-algohary</a>
          <div className="flex gap-4 ml-auto">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {SECTION_LABELS[s]}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Hero */}
        <section id="top" className="pt-24 pb-16">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Profile Picture */}
            <Avatar className="h-32 w-32 md:h-40 md:w-40 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={profilePlaceholder} alt="Ali Algohary" />
              <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">AA</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-primary font-mono text-sm mb-3">Hello, I'm</p>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Ali Algohary</h1>
              <p className="text-xl text-muted-foreground mb-4">Full Stack Developer & DevOps Engineer</p>

              {/* Contact Info */}
              {hasContact && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                      <Mail className="h-3.5 w-3.5" />{contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                      <Phone className="h-3.5 w-3.5" />{contact.phone}
                    </a>
                  )}
                  {contact.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <MapPin className="h-3.5 w-3.5" />{contact.location}
                    </span>
                  )}
                  {contact.linkedin_url && (
                    <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                      <Linkedin className="h-3.5 w-3.5" />LinkedIn
                    </a>
                  )}
                  {contact.github_url && (
                    <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                      <Github className="h-3.5 w-3.5" />GitHub
                    </a>
                  )}
                  {contact.cv_url && (
                    <a href={contact.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                      <FileText className="h-3.5 w-3.5" />CV
                    </a>
                  )}
                </div>
              )}

              <div className="gradient-line mb-8" />
              {summary?.description && (
                <SafeHtml html={summary.description} className="text-muted-foreground leading-relaxed max-w-2xl rich-content" />
              )}
            </div>
          </div>
        </section>

        {/* Experience */}
        <Section id="experience" title="Experience" icon={<Terminal className="h-5 w-5 text-primary" />}>
          <div className="space-y-8">
            {getBySection('experience').map((e) => (
              <div key={e.id} className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-semibold">{e.title}</h3>
                  {e.organization && <span className="text-primary text-sm">@ {e.organization}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                  {e.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>}
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</span>
                </div>
                {e.description && <SafeHtml html={e.description} className="text-sm text-muted-foreground rich-content" />}
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section id="skills" title="Skills" icon={<Terminal className="h-5 w-5 text-primary" />}>
          {(() => {
            const skills = getBySection('skills');
            const categories = [...new Set(skills.map((s) => s.category || 'Other'))];
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter((s) => (s.category || 'Other') === cat).map((s) => (
                        <Badge key={s.id} variant="secondary" className="font-mono text-xs">
                          {s.title}
                          {s.level && <span className="ml-1.5 text-primary">{'●'.repeat(s.level)}{'○'.repeat(5 - s.level)}</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Section>

        {/* Projects */}
        <Section id="projects" title="Projects" icon={<BookOpen className="h-5 w-5 text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getBySection('projects').map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80"><ExternalLink className="h-4 w-4" /></a>}
                </div>
                {p.description && <SafeHtml html={p.description} className="text-sm text-muted-foreground mb-3 rich-content" />}
                {p.technologies && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.map((t) => (
                      <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section id="education" title="Education" icon={<BookOpen className="h-5 w-5 text-primary" />}>
          <div className="space-y-6">
            {getBySection('education').map((e) => (
              <div key={e.id} className="pl-6 border-l-2 border-border relative">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
                <h3 className="font-semibold">{e.title}</h3>
                {e.organization && <p className="text-primary text-sm">{e.organization}</p>}
                <div className="flex gap-3 text-xs text-muted-foreground mt-1 mb-2">
                  {e.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>}
                  {e.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>}
                </div>
                {e.description && <SafeHtml html={e.description} className="text-sm text-muted-foreground rich-content" />}
              </div>
            ))}
          </div>
        </Section>

        {/* Certificates */}
        <Section id="certificates" title="Certificates" icon={<Award className="h-5 w-5 text-primary" />}>
          <div className="space-y-4">
            {getBySection('certificates').map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    {c.organization && <p className="text-sm text-primary">{c.organization}</p>}
                    {c.startDate && <p className="text-xs text-muted-foreground mt-1">{c.startDate}</p>}
                  </div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80"><ExternalLink className="h-4 w-4" /></a>}
                </div>
                {c.description && <SafeHtml html={c.description} className="text-sm text-muted-foreground mt-2 rich-content" />}
              </div>
            ))}
          </div>
        </Section>

        {/* Trainings */}
        <Section id="trainings" title="Trainings" icon={<BookOpen className="h-5 w-5 text-primary" />}>
          <div className="space-y-4">
            {getBySection('trainings').map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold">{t.title}</h3>
                {t.organization && <p className="text-sm text-primary">{t.organization}</p>}
                {t.startDate && <p className="text-xs text-muted-foreground mt-1">{t.startDate}</p>}
                {t.description && <SafeHtml html={t.description} className="text-sm text-muted-foreground mt-2 rich-content" />}
              </div>
            ))}
          </div>
        </Section>

        {/* Volunteering */}
        <Section id="volunteering" title="Volunteering" icon={<Heart className="h-5 w-5 text-primary" />}>
          <div className="space-y-6">
            {getBySection('volunteering').map((v) => (
              <div key={v.id} className="pl-6 border-l-2 border-border relative">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
                <h3 className="font-semibold">{v.title}</h3>
                {v.organization && <p className="text-primary text-sm">{v.organization}</p>}
                <div className="flex gap-3 text-xs text-muted-foreground mt-1 mb-2">
                  {v.startDate && <span><Calendar className="h-3 w-3 inline mr-1" />{v.startDate}{v.current ? ' — Present' : v.endDate ? ` — ${v.endDate}` : ''}</span>}
                </div>
                {v.description && <SafeHtml html={v.description} className="text-sm text-muted-foreground rich-content" />}
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-muted-foreground">
          <p className="font-mono">© {new Date().getFullYear()} Ali Algohary. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
};

const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="py-12">
    <div className="flex items-center gap-3 mb-8">
      {icon}
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

export default Index;
