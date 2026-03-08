export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'volunteering'
  | 'trainings'
  | 'certificates'
  | 'skills'
  | 'testimonials';

export interface PortfolioEntry {
  id: string;
  section: SectionType;
  title?: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  url?: string;
  technologies?: string[];
  category?: string;
  level?: number;
  credentialUrl?: string;
  order: number;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  volunteering: 'Volunteering',
  trainings: 'Trainings',
  certificates: 'Certificates',
  skills: 'Skills',
};

export const ALL_SECTIONS: SectionType[] = [
  'summary', 'experience', 'education', 'projects',
  'volunteering', 'trainings', 'certificates', 'skills',
];

export interface FieldConfig {
  name: keyof PortfolioEntry;
  label: string;
  type: 'text' | 'richtext' | 'checkbox' | 'number' | 'technologies';
}

export const SECTION_FIELDS: Record<SectionType, FieldConfig[]> = {
  summary: [
    { name: 'description', label: 'Summary', type: 'richtext' },
  ],
  experience: [
    { name: 'title', label: 'Job Title', type: 'text' },
    { name: 'organization', label: 'Company', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'startDate', label: 'Start Date', type: 'text' },
    { name: 'endDate', label: 'End Date', type: 'text' },
    { name: 'current', label: 'Current Position', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'richtext' },
  ],
  education: [
    { name: 'title', label: 'Degree', type: 'text' },
    { name: 'organization', label: 'Institution', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'startDate', label: 'Start Date', type: 'text' },
    { name: 'endDate', label: 'End Date', type: 'text' },
    { name: 'description', label: 'Description', type: 'richtext' },
  ],
  projects: [
    { name: 'title', label: 'Project Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'richtext' },
    { name: 'technologies', label: 'Technologies (comma-separated)', type: 'technologies' },
    { name: 'url', label: 'Project URL', type: 'text' },
  ],
  volunteering: [
    { name: 'title', label: 'Role', type: 'text' },
    { name: 'organization', label: 'Organization', type: 'text' },
    { name: 'startDate', label: 'Start Date', type: 'text' },
    { name: 'endDate', label: 'End Date', type: 'text' },
    { name: 'current', label: 'Currently Active', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'richtext' },
  ],
  trainings: [
    { name: 'title', label: 'Training Name', type: 'text' },
    { name: 'organization', label: 'Provider', type: 'text' },
    { name: 'startDate', label: 'Date', type: 'text' },
    { name: 'description', label: 'Description', type: 'richtext' },
  ],
  certificates: [
    { name: 'title', label: 'Certificate Name', type: 'text' },
    { name: 'organization', label: 'Issuer', type: 'text' },
    { name: 'startDate', label: 'Date Earned', type: 'text' },
    { name: 'credentialUrl', label: 'Credential URL', type: 'text' },
    { name: 'description', label: 'Description', type: 'richtext' },
  ],
  skills: [
    { name: 'title', label: 'Skill Name', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'level', label: 'Proficiency (1-5)', type: 'number' },
  ],
};