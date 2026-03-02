import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioEntry, SectionType } from '@/types/portfolio';

const generateId = () => crypto.randomUUID();

const SEED_DATA: PortfolioEntry[] = [
  {
    id: generateId(), section: 'summary', order: 0,
    description: 'Full-stack developer with extensive experience in the <b>.NET ecosystem</b> and <b>DevOps</b> practices. Passionate about building scalable, maintainable applications and streamlining deployment pipelines. Committed to clean architecture and continuous improvement.',
  },
  {
    id: generateId(), section: 'experience', order: 0,
    title: 'Senior .NET Developer', organization: 'TechCorp Solutions', location: 'Remote',
    startDate: '2021', endDate: '', current: true,
    description: '<ul><li>Led development of microservices architecture using <b>.NET 6/7/8</b></li><li>Implemented CI/CD pipelines with <b>Azure DevOps</b></li><li>Mentored junior developers and conducted code reviews</li><li>Reduced deployment time by 60% through automation</li></ul>',
  },
  {
    id: generateId(), section: 'experience', order: 1,
    title: 'DevOps Engineer', organization: 'CloudSoft Inc.', location: 'Berlin, Germany',
    startDate: '2019', endDate: '2021', current: false,
    description: '<ul><li>Managed <b>Kubernetes</b> clusters on Azure AKS</li><li>Automated infrastructure provisioning with <b>Terraform</b></li><li>Built monitoring solutions using Prometheus and Grafana</li></ul>',
  },
  {
    id: generateId(), section: 'education', order: 0,
    title: 'BSc Computer Science', organization: 'University of Technology', location: 'Berlin, Germany',
    startDate: '2015', endDate: '2019',
    description: 'Focus on distributed systems and software engineering. Graduated with honors.',
  },
  {
    id: generateId(), section: 'projects', order: 0,
    title: 'Cloud Deployment Platform', url: 'https://github.com/ali',
    technologies: ['C#', '.NET 8', 'Azure', 'Docker', 'Terraform'],
    description: 'An automated deployment tool that simplifies cloud infrastructure management. Supports <b>multi-cloud</b> deployments with a single configuration file.',
  },
  {
    id: generateId(), section: 'projects', order: 1,
    title: 'API Gateway Service',
    technologies: ['ASP.NET Core', 'Redis', 'Docker', 'Kubernetes'],
    description: 'High-performance API gateway handling <b>10k+ requests/sec</b> with built-in rate limiting, caching, and circuit breaker patterns.',
  },
  {
    id: generateId(), section: 'skills', order: 0, title: 'C# / .NET', category: 'Backend', level: 5,
  },
  {
    id: generateId(), section: 'skills', order: 1, title: 'ASP.NET Core', category: 'Backend', level: 5,
  },
  {
    id: generateId(), section: 'skills', order: 2, title: 'Docker', category: 'DevOps', level: 4,
  },
  {
    id: generateId(), section: 'skills', order: 3, title: 'Kubernetes', category: 'DevOps', level: 4,
  },
  {
    id: generateId(), section: 'skills', order: 4, title: 'Azure / Azure DevOps', category: 'Cloud', level: 5,
  },
  {
    id: generateId(), section: 'skills', order: 5, title: 'Terraform', category: 'DevOps', level: 4,
  },
  {
    id: generateId(), section: 'skills', order: 6, title: 'SQL Server', category: 'Database', level: 4,
  },
  {
    id: generateId(), section: 'skills', order: 7, title: 'React / TypeScript', category: 'Frontend', level: 3,
  },
  {
    id: generateId(), section: 'certificates', order: 0,
    title: 'Azure Solutions Architect Expert', organization: 'Microsoft',
    startDate: '2022', credentialUrl: 'https://learn.microsoft.com/en-us/credentials/',
    description: 'Demonstrated expertise in designing and implementing solutions on Microsoft Azure.',
  },
  {
    id: generateId(), section: 'trainings', order: 0,
    title: 'Advanced Kubernetes Administration', organization: 'Linux Foundation',
    startDate: '2021',
    description: 'Intensive training on production-grade Kubernetes cluster management, security, and troubleshooting.',
  },
  {
    id: generateId(), section: 'volunteering', order: 0,
    title: 'Coding Mentor', organization: 'Code.org',
    startDate: '2020', endDate: '', current: true,
    description: 'Mentoring students in programming fundamentals and guiding them through their first software projects.',
  },
];

const STORAGE_KEY = 'portfolio_entries';

interface PortfolioContextType {
  entries: PortfolioEntry[];
  getBySection: (section: SectionType) => PortfolioEntry[];
  addEntry: (entry: Omit<PortfolioEntry, 'id'>) => void;
  updateEntry: (id: string, data: Partial<PortfolioEntry>) => void;
  deleteEntry: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<PortfolioEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SEED_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const getBySection = (section: SectionType) =>
    entries.filter((e) => e.section === section).sort((a, b) => a.order - b.order);

  const addEntry = (entry: Omit<PortfolioEntry, 'id'>) => {
    setEntries((prev) => [...prev, { ...entry, id: generateId() }]);
  };

  const updateEntry = (id: string, data: Partial<PortfolioEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <PortfolioContext.Provider value={{ entries, getBySection, addEntry, updateEntry, deleteEntry }}>
      {children}
    </PortfolioContext.Provider>
  );
};