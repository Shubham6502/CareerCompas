import {
  Code2, Database, Brain, Server, Layout, Terminal,
  FileText, Zap, Briefcase, Landmark,
} from 'lucide-react';

export const DOMAINS = [
  { id: 'SWE',    label: 'Software Engineer',      desc: 'Full-stack development, system design, and engineering principles', icon: Code2 },
  { id: 'DA',     label: 'Data Analyst',            desc: 'Data visualization, SQL, statistics, and business intelligence',    icon: Database },
  { id: 'AIML',   label: 'AI / Machine Learning',   desc: 'Neural networks, NLP, computer vision, and MLOps',                 icon: Brain },
  { id: 'DevOps', label: 'DevOps Engineer',          desc: 'CI/CD, cloud infrastructure, containers, and monitoring',          icon: Server },
  { id: 'FE',     label: 'Frontend Developer',       desc: 'React, CSS architecture, performance, and accessibility',           icon: Layout },
  { id: 'BE',     label: 'Backend Developer',        desc: 'APIs, databases, microservices, and system architecture',           icon: Terminal },
];

export const TARGETS = [
  { id: 'faang_product',   label: 'FAANG / Product Companies', difficulty: 'Hard',   tags: ['DSA', 'System Design', 'Behavioral', 'OS', 'Networks'],         icon: FileText },
  { id: 'startup', label: 'Startup Jobs',               difficulty: 'Medium', tags: ['Full Stack', 'System Design', 'Problem Solving', 'Agile'],       icon: Zap },
  { id: 'service', label: 'Service Companies',          difficulty: 'Easy',   tags: ['DSA Basics', 'OOP', 'SQL', 'Aptitude'],                          icon: Briefcase },
  { id: 'government',     label: 'Government / Bank Tech',     difficulty: 'Medium', tags: ['Aptitude', 'Reasoning', 'CS Basics', 'Programming'],             icon: Landmark },
];

export const EXPERIENCE_LEVELS = [
  { id: 'beginner',     label: 'Beginner',      desc: 'New to programming or career switching. Start from fundamentals.' },
  { id: 'intermediate', label: 'Intermediate',  desc: '1–2 years experience. Comfortable with basics, need depth.' },
  { id: 'advanced',     label: 'Advanced',      desc: '3+ years experience. Focus on system design and optimization.' },
];

export const TIMELINES = [
  { id: '30', days: 30, hrs: '4–5' },
  { id: '45', days: 45, hrs: '3–4' },
  { id: '60', days: 60, hrs: '2–3' },
  { id: '90', days: 90, hrs: '1–2' },
];

export const STEPS = [
  { id: 1, label: 'Domain' },
  { id: 2, label: 'Target' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Timeline' },
];