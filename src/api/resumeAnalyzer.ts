import { Skill, Company, Alumni, AnalysisResult } from '../types';

// Predefined skills and their keywords (expanded for better matching)
const skillKeywords: Record<string, string[]> = {
  "Python": ["python", "django", "flask", "pandas", "numpy", "pip", "pytest", "jupyter", "scikit", "scipy"],
  "Data Analysis": [
    "data analysis", "analytics", "statistics", "excel", "tableau",
    "data visualization", "power bi", "sql", "database", "reporting",
    "metrics", "kpi", "dashboard", "analysis", "insights"
  ],
  "Machine Learning": [
    "machine learning", "ml", "ai", "artificial intelligence",
    "tensorflow", "scikit-learn", "keras", "pytorch", "deep learning",
    "neural networks", "nlp", "computer vision", "predictive modeling"
  ],
  "Java": [
    "java", "spring", "hibernate", "maven", "junit",
    "j2ee", "jsp", "servlets", "jdbc", "jpa",
    "springboot", "microservices", "gradle", "android"
  ],
  "Communication": [
    "communication", "presentation", "teamwork", "leadership", "collaboration",
    "interpersonal", "public speaking", "written communication",
    "team management", "client relations", "stakeholder", "coordination"
  ]
};

// Sample company database
const companies: Array<{
  name: string;
  required_skills: string[];
  weight: number[];
}> = [
  {
    name: "TechCorp",
    required_skills: ["Python", "Machine Learning", "Data Analysis"],
    weight: [0.4, 0.3, 0.3]
  },
  {
    name: "DataTech",
    required_skills: ["Python", "Data Analysis", "Communication"],
    weight: [0.35, 0.35, 0.3]
  },
  {
    name: "AI Solutions",
    required_skills: ["Machine Learning", "Python", "Java"],
    weight: [0.4, 0.3, 0.3]
  },
  {
    name: "Analytics Pro",
    required_skills: ["Data Analysis", "Python", "Communication"],
    weight: [0.4, 0.3, 0.3]
  },
  {
    name: "Tech Innovate",
    required_skills: ["Java", "Python", "Machine Learning"],
    weight: [0.35, 0.35, 0.3]
  }
];

// Sample alumni database
const alumni: Array<{
  name: string;
  role: string;
  company: string;
  skills: string[];
}> = [
  {
    name: "Sarah Chen",
    role: "Data Scientist",
    company: "Google",
    skills: ["Python", "Machine Learning", "Data Analysis"]
  },
  {
    name: "Michael Park",
    role: "ML Engineer",
    company: "Meta",
    skills: ["Python", "Machine Learning", "Java"]
  },
  {
    name: "Emma Wilson",
    role: "Data Analyst",
    company: "Amazon",
    skills: ["Python", "Data Analysis", "Communication"]
  },
  {
    name: "James Rodriguez",
    role: "AI Researcher",
    company: "OpenAI",
    skills: ["Python", "Machine Learning", "Communication"]
  },
  {
    name: "Lisa Wang",
    role: "Tech Lead",
    company: "Microsoft",
    skills: ["Java", "Python", "Communication"]
  }
];

function extractSkills(resumeText: string): Record<string, number> {
  const skills: Record<string, number> = {};
  const lowerText = resumeText.toLowerCase();
  const words = lowerText.split(/\W+/); // Split by non-word characters

  for (const [skill, keywords] of Object.entries(skillKeywords)) {
    let totalMatches = 0;
    let uniqueMatches = new Set<string>();

    // Check for exact phrases first
    keywords.forEach(keyword => {
      const phrase = keyword.toLowerCase();
      const regex = new RegExp(phrase, 'g');
      const matches = lowerText.match(regex);
      if (matches) {
        totalMatches += matches.length;
        uniqueMatches.add(phrase);
      }
    });

    // Check for individual word matches
    keywords.forEach(keyword => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      keywordWords.forEach(word => {
        if (words.includes(word)) {
          uniqueMatches.add(word);
        }
      });
    });

    if (uniqueMatches.size > 0) {
      // Calculate proficiency based on unique matches and total occurrences
      const uniqueMatchScore = (uniqueMatches.size / keywords.length) * 70;
      const frequencyScore = Math.min(30, (totalMatches / keywords.length) * 30);
      const proficiency = Math.min(100, uniqueMatchScore + frequencyScore);
      skills[skill] = Number(proficiency.toFixed(1));
    }
  }

  return skills;
}

function calculateCompanyMatch(candidateSkills: Record<string, number>): Company[] {
  return companies.map(company => {
    const matchScore = company.required_skills.reduce((score, skill, index) => {
      if (skill in candidateSkills) {
        return score + (candidateSkills[skill] / 100) * company.weight[index];
      }
      return score;
    }, 0);

    return {
      name: company.name,
      matchPercentage: Number((matchScore * 100).toFixed(1)),
      requiredSkills: company.required_skills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

function calculateAlumniMatch(candidateSkills: Record<string, number>): Alumni[] {
  return alumni.map(alum => {
    const commonSkills = alum.skills.filter(skill => skill in candidateSkills);
    let matchScore = 0;

    if (commonSkills.length > 0) {
      matchScore = commonSkills.reduce((score, skill) => 
        score + candidateSkills[skill] / 100, 0) / alum.skills.length;
    }

    return {
      name: alum.name,
      role: alum.role,
      company: alum.company,
      matchPercentage: Number((matchScore * 100).toFixed(1)),
      skills: alum.skills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function analyzeResume(file: File): Promise<AnalysisResult> {
  try {
    const text = await file.text();
    const extractedSkills = extractSkills(text);
    const matchedCompanies = calculateCompanyMatch(extractedSkills);
    const matchedAlumni = calculateAlumniMatch(extractedSkills);
    
    const overallMatch = Object.values(extractedSkills).length > 0
      ? Number((Object.values(extractedSkills).reduce((a, b) => a + b, 0) / Object.values(extractedSkills).length).toFixed(1))
      : 0;

    return {
      extractedSkills: Object.entries(extractedSkills).map(([name, proficiency]) => ({
        name,
        proficiency
      })),
      matchedCompanies,
      matchedAlumni,
      overallMatch
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}