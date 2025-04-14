import json
from typing import Dict, List, Tuple

class ResumeSkillMatcher:
    def __init__(self):
        # Predefined skills and their keywords
        self.skill_keywords = {
            "Python": ["python", "django", "flask", "pandas", "numpy"],
            "Data Analysis": ["data analysis", "analytics", "statistics", "excel", "tableau"],
            "Machine Learning": ["machine learning", "ml", "ai", "tensorflow", "scikit-learn"],
            "Java": ["java", "spring", "hibernate", "maven", "junit"],
            "Communication": ["communication", "presentation", "teamwork", "leadership", "collaboration"],
            "Project Management": ["project management", "agile", "scrum", "kanban", "leadership"],
            "Cloud Computing": ["cloud computing", "aws", "azure", "gcp", "docker"],
            "Web Development": ["web development", "html", "css", "javascript", "react"],
            "Database Management": ["database", "sql", "nosql", "mysql", "mongodb"],
            "Cybersecurity": ["cybersecurity", "network security", "encryption", "firewall", "penetration testing"],
            "DevOps": ["devops", "ci/cd", "jenkins", "kubernetes", "ansible"],
            "Data Visualization": ["data visualization", "power bi", "tableau", "matplotlib", "seaborn"],
            "Big Data": ["big data", "hadoop", "spark", "kafka", "data lake"],
            "Artificial Intelligence": ["artificial intelligence", "deep learning", "neural networks", "computer vision"],
            "Blockchain": ["blockchain", "cryptocurrency", "smart contracts", "ethereum", "bitcoin"],
            "Internet of Things": ["iot", "internet of things", "sensor networks", "embedded systems"],
            "Mobile Development": ["mobile development", "android", "ios", "flutter", "react native"],
            "Game Development": ["game development", "unity", "unreal engine", "c#", "c++"],
            "SEO": ["seo", "search engine optimization", "google analytics", "keyword research"],
            "Digital Marketing": ["digital marketing", "social media", "content marketing", "email marketing"],
            "Graphic Design": ["graphic design", "photoshop", "illustrator", "ui/ux", "adobe"], 
            "Content Writing": ["content writing", "blogging", "copywriting", "editing", "proofreading"],
            "Sales": ["sales", "business development", "lead generation", "customer relationship management"],
            "Customer Service": ["customer service", "customer support", "client relations", "problem solving"],
            "Finance": ["finance", "accounting", "financial analysis", "budgeting", "forecasting"],
            "Human Resources": ["human resources", "recruitment", "talent acquisition", "employee relations"],
            "Legal": ["legal", "law", "compliance", "contract management", "litigation"],
            "Education": ["education", "teaching", "curriculum development", "instructional design"],
            "Research": ["research", "data collection", "analysis", "report writing", "academic writing"],
            "Public Relations": ["public relations", "media relations", "press releases", "crisis management"],
            "Event Planning": ["event planning", "event management", "logistics", "scheduling"],
        }
        
        # Sample company database
        self.companies = [
            {
                "name": "TechCorp",
                "required_skills": ["Python", "Machine Learning", "Data Analysis"],
                "weight": [0.4, 0.3, 0.3]
            },
            {
                "name": "DataTech",
                "required_skills": ["Python", "Data Analysis", "Communication"],
                "weight": [0.35, 0.35, 0.3]
            },
            {
                "name": "AI Solutions",
                "required_skills": ["Machine Learning", "Python", "Java"],
                "weight": [0.4, 0.3, 0.3]
            },
            {
                "name": "Analytics Pro",
                "required_skills": ["Data Analysis", "Python", "Communication"],
                "weight": [0.4, 0.3, 0.3]
            },
            {
                "name": "Tech Innovate",
                "required_skills": ["Java", "Python", "Machine Learning"],
                "weight": [0.35, 0.35, 0.3]
            }
        ]
        
        # Sample alumni database
        self.alumni = [
            {
                "name": "Sarah Chen",
                "role": "Data Scientist",
                "company": "Google",
                "skills": ["Python", "Machine Learning", "Data Analysis"]
            },
            {
                "name": "Michael Park",
                "role": "ML Engineer",
                "company": "Meta",
                "skills": ["Python", "Machine Learning", "Java"]
            },
            {
                "name": "Emma Wilson",
                "role": "Data Analyst",
                "company": "Amazon",
                "skills": ["Python", "Data Analysis", "Communication"]
            },
            {
                "name": "James Rodriguez",
                "role": "AI Researcher",
                "company": "OpenAI",
                "skills": ["Python", "Machine Learning", "Communication"]
            },
            {
                "name": "Lisa Wang",
                "role": "Tech Lead",
                "company": "Microsoft",
                "skills": ["Java", "Python", "Communication"]
            }
        ]

    def extract_skills(self, resume_text: str) -> Dict[str, float]:
        """Extract skills and their proficiency from resume text."""
        skills = {}
        resume_text = resume_text.lower()
        
        for skill, keywords in self.skill_keywords.items():
            skill_count = sum(1 for keyword in keywords if keyword in resume_text)
            if skill_count > 0:
                # Calculate proficiency based on keyword matches (simplified)
                proficiency = min(100, (skill_count / len(keywords)) * 100)
                skills[skill] = proficiency
                
        return skills

    def calculate_company_match(self, candidate_skills: Dict[str, float]) -> List[Dict]:
        """Calculate match percentage with companies."""
        company_matches = []
        
        for company in self.companies:
            match_score = 0
            for skill, weight in zip(company["required_skills"], company["weight"]):
                if skill in candidate_skills:
                    match_score += (candidate_skills[skill] / 100) * weight
                    
            match_percentage = round(match_score * 100, 1)
            company_matches.append({
                "name": company["name"],
                "matchPercentage": match_percentage,
                "requiredSkills": company["required_skills"]
            })
            
        return sorted(company_matches, key=lambda x: x["matchPercentage"], reverse=True)

    def calculate_alumni_match(self, candidate_skills: Dict[str, float]) -> List[Dict]:
        """Calculate match percentage with alumni."""
        alumni_matches = []
        
        for alum in self.alumni:
            match_score = 0
            common_skills = set(candidate_skills.keys()) & set(alum["skills"])
            
            if common_skills:
                match_score = sum(candidate_skills[skill] / 100 for skill in common_skills) / len(alum["skills"])
                
            match_percentage = round(match_score * 100, 1)
            alumni_matches.append({
                "name": alum["name"],
                "role": alum["role"],
                "company": alum["company"],
                "matchPercentage": match_percentage,
                "skills": alum["skills"]
            })
            
        return sorted(alumni_matches, key=lambda x: x["matchPercentage"], reverse=True)

    def analyze_resume(self, resume_text: str) -> Dict:
        """Main function to analyze resume and return matches."""
        # Extract skills
        extracted_skills = self.extract_skills(resume_text)
        
        # Calculate matches
        company_matches = self.calculate_company_match(extracted_skills)
        alumni_matches = self.calculate_alumni_match(extracted_skills)
        
        # Calculate overall match
        overall_match = round(sum(extracted_skills.values()) / len(extracted_skills), 1) if extracted_skills else 0
        
        return {
            "extractedSkills": [{"name": k, "proficiency": v} for k, v in extracted_skills.items()],
            "matchedCompanies": company_matches,
            "matchedAlumni": alumni_matches,
            "overallMatch": overall_match
        }