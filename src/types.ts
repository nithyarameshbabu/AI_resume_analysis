export interface Skill {
  name: string;
  proficiency: number;
}

export interface Company {
  name: string;
  matchPercentage: number;
  requiredSkills: string[];
}

export interface Alumni {
  name: string;
  role: string;
  company: string;
  matchPercentage: number;
  skills: string[];
}

export interface AnalysisResult {
  extractedSkills: Skill[];
  matchedCompanies: Company[];
  matchedAlumni: Alumni[];
  overallMatch: number;
}