/**
 * Shared TypeScript types for the application
 */

// --- CV Types ---

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVFormData {
  title: string;
  template: "BASIC" | "MODERN" | "EXECUTIVE";
  // Personal
  name: string;
  photoUrl?: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  // Sections
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
}

export type CV = {
  id: string;
  userId: string;
  title: string;
  template: "BASIC" | "MODERN" | "EXECUTIVE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  name: string;
  jobTitle: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  summary?: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  generatedContent?: string | null;
  atsScore?: number | null;
  coverLetter?: string | null;
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// --- Subscription Types ---

export type SubscriptionPlan = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE";

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeCurrentPeriodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- User Types ---

export interface UserProfile {
  id: string;
  supabaseId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  subscription?: Subscription | null;
  cvCount: number;
}

// --- API Response Types ---

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// --- AI Feature Types ---

export interface ATSAnalysis {
  score: number;
  suggestions: string[];
  keywords: string[];
}

export interface JobMatchResult {
  matchScore: number;
  improvements: string[];
  keywords: string[];
}
