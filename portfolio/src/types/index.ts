export type ProjectCategory = 
  | 'All'
  | 'Live Products'
  | 'Web Applications'
  | 'AI / ML'
  | 'E-Commerce'
  | 'Games'
  | 'Ongoing';

export type ProjectStatus = 'Live Product' | 'Ongoing Project' | 'Prototype' | 'Open Source';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory[];
  description: string;
  techStack: string[];
  status: ProjectStatus;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  categoryKey: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  verified: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  graduationYear: number;
  details: string;
  field: string;
}
