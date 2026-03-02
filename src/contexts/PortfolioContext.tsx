import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioEntry, SectionType } from '@/types/portfolio';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type DbEntry = Tables<'portfolio_entries'>;

const toFrontend = (row: DbEntry): PortfolioEntry => ({
  id: row.id,
  section: row.section as SectionType,
  title: row.title ?? undefined,
  organization: row.organization ?? undefined,
  location: row.location ?? undefined,
  startDate: row.start_date ?? undefined,
  endDate: row.end_date ?? undefined,
  current: row.is_current ?? undefined,
  description: row.description ?? undefined,
  url: row.url ?? undefined,
  technologies: row.technologies ?? undefined,
  category: row.category ?? undefined,
  level: row.level ?? undefined,
  credentialUrl: row.credential_url ?? undefined,
  order: row.sort_order,
});

const toDb = (entry: Partial<PortfolioEntry>): Partial<TablesInsert<'portfolio_entries'>> => {
  const result: Record<string, unknown> = {};
  if (entry.section !== undefined) result.section = entry.section;
  if (entry.title !== undefined) result.title = entry.title;
  if (entry.organization !== undefined) result.organization = entry.organization;
  if (entry.location !== undefined) result.location = entry.location;
  if (entry.startDate !== undefined) result.start_date = entry.startDate;
  if (entry.endDate !== undefined) result.end_date = entry.endDate;
  if (entry.current !== undefined) result.is_current = entry.current;
  if (entry.description !== undefined) result.description = entry.description;
  if (entry.url !== undefined) result.url = entry.url;
  if (entry.technologies !== undefined) result.technologies = entry.technologies;
  if (entry.category !== undefined) result.category = entry.category;
  if (entry.level !== undefined) result.level = entry.level;
  if (entry.credentialUrl !== undefined) result.credential_url = entry.credentialUrl;
  if (entry.order !== undefined) result.sort_order = entry.order;
  return result as Partial<TablesInsert<'portfolio_entries'>>;
};

interface PortfolioContextType {
  entries: PortfolioEntry[];
  loading: boolean;
  getBySection: (section: SectionType) => PortfolioEntry[];
  addEntry: (entry: Omit<PortfolioEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<PortfolioEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('portfolio_entries')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setEntries(data.map(toFrontend));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const getBySection = (section: SectionType) =>
    entries.filter((e) => e.section === section).sort((a, b) => a.order - b.order);

  const addEntry = async (entry: Omit<PortfolioEntry, 'id'>) => {
    const dbData = toDb(entry) as TablesInsert<'portfolio_entries'>;
    const { error } = await supabase.from('portfolio_entries').insert(dbData);
    if (!error) await fetchEntries();
  };

  const updateEntry = async (id: string, data: Partial<PortfolioEntry>) => {
    const dbData = toDb(data);
    const { error } = await supabase.from('portfolio_entries').update(dbData).eq('id', id);
    if (!error) await fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('portfolio_entries').delete().eq('id', id);
    if (!error) await fetchEntries();
  };

  return (
    <PortfolioContext.Provider value={{ entries, loading, getBySection, addEntry, updateEntry, deleteEntry, refetch: fetchEntries }}>
      {children}
    </PortfolioContext.Provider>
  );
};
