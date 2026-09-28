export interface MatchBreakdown {
  skills: number;
  experience: number;
  keywords: number;
  education: number;
  languages: number;
}

export interface JobMatchResult {
  id: string;
  score: number;
  breakdown: MatchBreakdown;
  matchingSkills: string[];
  missingSkills: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  createdAt: string;
}

export interface JobMatchHistoryItem {
  id: string;
  cvId: string;
  jobTitle: string | null;
  companyName: string | null;
  score: number;
  skillsScore: number;
  experienceScore: number;
  keywordsScore: number;
  educationScore: number;
  languagesScore: number;
  createdAt: string;
}

export interface CvOption {
  id: string;
  title: string;
  name: string;
  jobTitle: string;
}
