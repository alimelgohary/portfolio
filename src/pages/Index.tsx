import { useEffect, useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useContactInfo } from '@/hooks/useContactInfo';
import { SectionType, SECTION_LABELS } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { sanitizeHtml } from '@/lib/sanitize';
import { cn } from '@/lib/utils';
import { ExternalLink, MapPin, Calendar, Award, BookOpen, Heart, Terminal, Mail, Phone, Linkedin, Github, FileText, MessageSquareQuote, User } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';
import profilePlaceholder from '@/assets/profile-placeholder.png';
import profilePic from '@/assets/profile.png';

const NAV_SECTIONS: SectionType[] = ['experience', 'skills', 'projects', 'education', 'certificates', 'trainings', 'volunteering', 'testimonials'];

const SafeHtml = ({ html, className }: { html: string; className?: string }) => (
  <div dir="auto" className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
);

const Index = () => {
  const { getBySection, loading } = usePortfolio();
  const { contact } = useContactInfo();
  const summary = getBySection('summary')[0];

  useEffect(() => { trackPageView(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground font-mono text-sm uppercase tracking-widest">Loading_portfolio...</p>
      </div>
    );
  }

  const hasContact = contact && (contact.email || contact.phone || contact.location || contact.linkedin_url || contact.github_url || contact.cv_url);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-6 overflow-x-auto">
          <a href="#top" className="font-display font-extrabold text-base shrink-0 uppercase tracking-tight">
            <span className="bg-foreground text-background px-2 py-1">ALI</span>
            <span className="ml-2">/ALGOHARY</span>
          </a>
          <div className="flex gap-1 ml-auto">
            {NAV_SECTIONS.filter((s) => getBySection(s).length > 0).map((s) => (
              <a key={s} href={`#${s}`} className="text-xs font-bold uppercase tracking-wider px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0">
                {SECTION_LABELS[s]}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section id="top" className="w-full border-b-2 border-foreground bg-background">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              <Avatar className="h-36 w-36 md:h-48 md:w-48 shrink-0 rounded-none border-2 border-foreground brutal-shadow">
                <AvatarImage src={profilePic} alt="Ali Algohary" className="rounded-none" />
                <AvatarFallback className="text-3xl font-extrabold bg-secondary text-foreground rounded-none font-display">AA</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.3em] mb-4 inline-block bg-foreground text-background px-2 py-1">{'>'} hello_world</p>
                <h1 className="font-display text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-[0.9]">
                  Ali<br/>Algohary<span className="text-primary">.</span>
                </h1>
                <p className="text-xl md:text-2xl font-semibold mb-8">
                  <span className="highlight-accent px-1">Full Stack Developer</span> &amp; DevOps Engineer
                </p>

                {hasContact && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-card font-mono font-medium hover:bg-primary hover:text-primary-foreground transition-colors brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                        <Mail className="h-4 w-4" />{contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-card font-mono font-medium hover:bg-primary hover:text-primary-foreground transition-colors brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                        <Phone className="h-4 w-4" />{contact.phone}
                      </a>
                    )}
                    {contact.location && (
                      <span className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-muted font-mono font-medium">
                        <MapPin className="h-4 w-4" />{contact.location}
                      </span>
                    )}
                    {contact.linkedin_url && (
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-card font-mono font-medium hover:bg-primary hover:text-primary-foreground transition-colors brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                        <Linkedin className="h-4 w-4" />LinkedIn
                      </a>
                    )}
                    {contact.github_url && (
                      <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-card font-mono font-medium hover:bg-primary hover:text-primary-foreground transition-colors brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                        <Github className="h-4 w-4" />GitHub
                      </a>
                    )}
                    {contact.cv_url && (
                      <a href={contact.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-4 py-2.5 brutal-border bg-primary text-primary-foreground font-mono font-bold uppercase tracking-wider brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                        <FileText className="h-4 w-4" />Download CV
                      </a>
                    )}
                  </div>
                )}

                {summary?.description && (
                  <SafeHtml html={summary.description} className="text-base md:text-lg leading-relaxed max-w-2xl rich-content" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        {getBySection('experience').length > 0 && (
        <Section id="experience" title="Experience" bg="bg-background">
          <div className="space-y-8">
            {getBySection('experience').map((e) => (
              <div key={e.id} className="relative pl-6 border-l-4 border-foreground">
                <div className="absolute -left-[10px] top-1 w-4 h-4 bg-primary border-2 border-foreground" />
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-display font-bold text-lg">{e.title}</h3>
                  {e.organization && <span className="font-mono text-sm bg-foreground text-background px-2 py-0.5">@ {e.organization}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  {e.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>}
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</span>
                </div>
                {e.description && <SafeHtml html={e.description} className="text-sm rich-content" />}
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Skills */}
        {getBySection('skills').length > 0 && (
        <Section id="skills" title="Skills" bg="bg-muted">
          {(() => {
            const skills = getBySection('skills');
            const categories = [...new Set(skills.map((s) => s.category || 'Other'))];
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat} className="brutal-card p-5">
                    <h3 className="font-display text-sm font-bold uppercase tracking-widest mb-3 text-primary">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter((s) => (s.category || 'Other') === cat).map((s) => (
                        <Badge key={s.id} variant="secondary" className="font-mono text-xs rounded-none border-2 border-foreground bg-background text-foreground px-2 py-1 hover:bg-accent">
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
        )}

        {/* Projects */}
        {getBySection('projects').length > 0 && (
        <Section id="projects" title="Projects" bg="bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getBySection('projects').map((p) => (
              <div key={p.id} className="brutal-card overflow-hidden flex flex-col transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_hsl(var(--foreground))]">
                {p.imageUrl && (
                  <a
                    href={p.url || p.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video overflow-hidden bg-muted border-b-2 border-foreground"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title || 'Project image'}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-display font-bold text-lg">{p.title}</h3>
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 shrink-0"><ExternalLink className="h-5 w-5" /></a>}
                  </div>
                  {p.description && <SafeHtml html={p.description} className="text-sm mb-3 rich-content" />}
                  {p.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                      {p.technologies.map((t) => (
                        <span key={t} className="text-xs font-mono px-2 py-0.5 border border-foreground bg-accent text-accent-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Education */}
        {getBySection('education').length > 0 && (
        <Section id="education" title="Education" bg="bg-muted">
          <div className="space-y-6">
            {getBySection('education').map((e) => (
              <div key={e.id} className="pl-6 border-l-4 border-foreground relative">
                <div className="absolute -left-[10px] top-1 w-4 h-4 bg-primary border-2 border-foreground" />
                <h3 className="font-display font-bold text-lg">{e.title}</h3>
                {e.organization && <p className="font-mono text-sm">{e.organization}</p>}
                <div className="flex gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1 mb-2">
                  {e.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>}
                  {e.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>}
                </div>
                {e.description && <SafeHtml html={e.description} className="text-sm rich-content" />}
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Certificates */}
        {getBySection('certificates').length > 0 && (
        <Section id="certificates" title="Certificates" bg="bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {getBySection('certificates').map((c) => (
              <div key={c.id} className="brutal-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold">{c.title}</h3>
                    {c.organization && <p className="text-sm font-mono">{c.organization}</p>}
                    {c.startDate && <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">{c.startDate}</p>}
                  </div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 shrink-0"><ExternalLink className="h-5 w-5" /></a>}
                </div>
                {c.description && <SafeHtml html={c.description} className="text-sm mt-2 rich-content" />}
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Trainings */}
        {getBySection('trainings').length > 0 && (
        <Section id="trainings" title="Trainings" bg="bg-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {getBySection('trainings').map((t) => (
              <div key={t.id} className="brutal-card p-5">
                <h3 className="font-display font-bold">{t.title}</h3>
                {t.organization && <p className="text-sm font-mono">{t.organization}</p>}
                {t.startDate && <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">{t.startDate}</p>}
                {t.description && <SafeHtml html={t.description} className="text-sm mt-2 rich-content" />}
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Volunteering */}
        {getBySection('volunteering').length > 0 && (
        <Section id="volunteering" title="Volunteering" bg="bg-background">
          <div className="space-y-6">
            {getBySection('volunteering').map((v) => (
              <div key={v.id} className="pl-6 border-l-4 border-foreground relative">
                <div className="absolute -left-[10px] top-1 w-4 h-4 bg-primary border-2 border-foreground" />
                <h3 className="font-display font-bold text-lg">{v.title}</h3>
                {v.organization && <p className="font-mono text-sm">{v.organization}</p>}
                <div className="flex gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1 mb-2">
                  {v.startDate && <span><Calendar className="h-3 w-3 inline mr-1" />{v.startDate}{v.current ? ' — Present' : v.endDate ? ` — ${v.endDate}` : ''}</span>}
                </div>
                {v.description && <SafeHtml html={v.description} className="text-sm rich-content" />}
              </div>
            ))}
          </div>
        </Section>
        )}

        {/* Testimonials */}
        {getBySection('testimonials').length > 0 && (
          <Section id="testimonials" title="Testimonials" bg="bg-muted">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getBySection('testimonials').map((t) => (
                <div key={t.id} className="brutal-card p-6 flex flex-col gap-4 bg-background">
                  <div className="text-primary text-6xl font-display font-extrabold leading-none">"</div>
                  {t.description && <SafeHtml html={t.description} className="text-sm rich-content flex-1" />}
                  <div className="flex items-center gap-3 pt-3 border-t-2 border-foreground">
                    <Avatar className="h-10 w-10 shrink-0 rounded-none border-2 border-foreground">
                      <AvatarImage src={profilePlaceholder} alt={t.title || 'Anonymous'} className="rounded-none" />
                      <AvatarFallback className="bg-accent text-accent-foreground rounded-none">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{t.title || 'Anonymous'}</p>
                      {t.organization && <p className="text-xs font-mono text-muted-foreground truncate">{t.organization}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-8 bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} ALI ALGOHARY // BUILT_WITH_PASSION</p>
        </div>
      </footer>
    </div>
  );
};

const Section = ({ id, title, children, bg = 'bg-background' }: { id: string; title: string; children: React.ReactNode; bg?: string }) => (
  <section id={id} className={`w-full border-b-2 border-foreground ${bg}`}>
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <h2 className="section-heading">{title}</h2>
      {children}
    </div>
  </section>
);

export default Index;
