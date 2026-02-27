"""
NLP Service
Handles text preprocessing, skill extraction, and comparison using TF-IDF
with enhanced AI-powered skill matching and accurate percentage calculation
"""

import json
import re
import string
from typing import List, Set, Tuple, Dict, Optional
from pathlib import Path
from collections import Counter

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Download required NLTK data
import os

# Ensure NLTK data is downloaded
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)


class NLPService:
    """Service for NLP operations including skill extraction and comparison"""
    
    def __init__(self):
        """Initialize NLP service with skills dataset"""
        self.skills_data = self._load_skills_data()
        self.all_skills = self._get_all_skills()
        self.skill_synonyms = self._build_skill_synonyms()
        self.skill_variations = self._build_skill_variations()
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words='english',
            ngram_range=(1, 3),  # Include bigrams and trigrams
            max_features=10000
        )
    
    def _load_skills_data(self) -> Dict:
        """Load skills dataset from JSON file"""
        skills_path = Path(__file__).parent.parent / 'data' / 'skills.json'
        try:
            with open(skills_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback to default skills
            return {
                "technical_skills": [],
                "soft_skills": [],
                "domain_skills": []
            }
    
    def _get_all_skills(self) -> Set[str]:
        """Combine all skills from different categories"""
        all_skills = set()
        for category in self.skills_data.values():
            if isinstance(category, list):
                for skill in category:
                    all_skills.add(skill.lower())
        return all_skills
    
    def _build_skill_synonyms(self) -> Dict[str, str]:
        """Build a mapping of skill synonyms to canonical skill names"""
        synonyms = {
            # Programming languages
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'golang': 'go',
            'cpp': 'c++',
            'csharp': 'c#',
            'objective-c': 'objective c',
            
            # Frameworks & Libraries
            'reactjs': 'react',
            'react.js': 'react',
            'vuejs': 'vue',
            'vue.js': 'vue',
            'angularjs': 'angular',
            'nodejs': 'node.js',
            'node': 'node.js',
            'expressjs': 'express',
            'express.js': 'express',
            'django framework': 'django',
            'flask framework': 'flask',
            
            # Cloud & DevOps
            'amazon web services': 'aws',
            'amazon aws': 'aws',
            'google cloud platform': 'gcp',
            'google cloud': 'gcp',
            'azure cloud': 'azure',
            'microsoft azure': 'azure',
            'k8s': 'kubernetes',
            'cicd': 'ci/cd',
            'ci cd': 'ci/cd',
            'ci-cd': 'ci/cd',
            'continuous integration': 'ci/cd',
            'continuous deployment': 'ci/cd',
            
            # AI/ML
            'artificial intelligence': 'ai',
            'machine learning': 'ml',
            'deep learning': 'dl',
            'neural network': 'neural networks',
            'natural language processing': 'nlp',
            'computer vision': 'cv',
            'tensorflow': 'tensorflow',
            'tf': 'tensorflow',
            'pytorch': 'pytorch',
            'scikit-learn': 'scikit-learn',
            'sklearn': 'scikit-learn',
            'sk-learn': 'scikit-learn',
            
            # Databases
            'database': 'sql',
            'relational database': 'sql',
            'sql database': 'sql',
            'postgres': 'postgresql',
            'mongo': 'mongodb',
            'nosql database': 'mongodb',
            
            # Web Technologies
            'html5': 'html',
            'css3': 'css',
            'cascading style sheets': 'css',
            'hypertext markup language': 'html',
            'restful api': 'rest api',
            'restful services': 'rest api',
            'restful': 'rest api',
            
            # Data Science
            'data scientist': 'data science',
            'data analytics': 'data analysis',
            'data visualization': 'matplotlib',
            'pandas library': 'pandas',
            'numpy library': 'numpy',
            
            # Mobile
            'android development': 'android',
            'ios development': 'ios',
            'mobile app development': 'mobile development',
            'react-native': 'react native',
            'react native development': 'react native',
            
            # Version Control
            'version control': 'git',
            'git version control': 'git',
            'github actions': 'github',
            'gitlab ci': 'gitlab',
            
            # Security
            'infosec': 'security',
            'information security': 'security',
            'cyber security': 'cybersecurity',
            'infosec': 'cybersecurity',
            
            # Soft Skills
            'team player': 'teamwork',
            'team work': 'teamwork',
            'team collaboration': 'teamwork',
            'communicating': 'communication',
            'communicate': 'communication',
            'problem-solving': 'problem solving',
            'problem solver': 'problem solving',
            'analytical': 'analytical skills',
            'analyze': 'analytical skills',
            'lead': 'leadership',
            'leading': 'leadership',
            'manage': 'project management',
            'managing': 'project management',
        }
        return synonyms
    
    def _build_skill_variations(self) -> Dict[str, List[str]]:
        """Build variations of skill names for flexible matching"""
        variations = {
            'python': ['python3', 'python 3', 'python2', 'python 2', 'py'],
            'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'javascript es6'],
            'typescript': ['ts', 'typescript lang'],
            'react': ['reactjs', 'react.js', 'react js', 'react native'],
            'angular': ['angularjs', 'angular.js', 'angular js', 'angular2', 'angular 2'],
            'vue': ['vuejs', 'vue.js', 'vue js', 'vue2', 'vue3'],
            'node.js': ['nodejs', 'node js', 'node'],
            'aws': ['amazon web services', 'amazon aws', 'aws cloud'],
            'azure': ['microsoft azure', 'azure cloud', 'ms azure'],
            'gcp': ['google cloud platform', 'google cloud', 'gcp cloud'],
            'docker': ['docker container', 'docker engine', 'containerization'],
            'kubernetes': ['k8s', 'kubernetes container', 'k8s orchestration'],
            'machine learning': ['ml', 'ml algorithms', 'ml models'],
            'deep learning': ['dl', 'deep neural networks', 'dnn'],
            'sql': ['structured query language', 'sql query', 'sql database'],
            'mongodb': ['mongo', 'mongo database', 'nosql'],
            'postgresql': ['postgres', 'pg', 'psql'],
            'git': ['git version control', 'git vcs'],
            'ci/cd': ['cicd', 'ci cd', 'ci-cd', 'continuous integration continuous deployment'],
        }
        return variations
    
    def preprocess_text(self, text: str) -> str:
        """
        Preprocess text for analysis
        
        Args:
            text: Raw text string
            
        Returns:
            Preprocessed text string
        """
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters but keep important ones
        text = re.sub(r'[^a-zA-Z0-9\s\+\#\.\-]', ' ', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove stopwords (but keep some important ones)
        tokens = word_tokenize(text)
        filtered_tokens = [
            token for token in tokens 
            if token not in self.stop_words and len(token) > 1
        ]
        
        return ' '.join(filtered_tokens)
    
    def _normalize_skill(self, skill: str) -> str:
        """Normalize a skill name to its canonical form"""
        skill_lower = skill.lower().strip()
        
        # Check if it's a known synonym
        if skill_lower in self.skill_synonyms:
            return self.skill_synonyms[skill_lower]
        
        return skill_lower
    
    def _fuzzy_match_skill(self, text: str, skill: str) -> bool:
        """
        Check if skill exists in text with fuzzy matching
        
        Args:
            text: Text to search in (already lowercase)
            skill: Skill to search for (already lowercase)
            
        Returns:
            True if skill found, False otherwise
        """
        # Direct word boundary match
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text):
            return True
        
        # Check variations
        if skill in self.skill_variations:
            for variation in self.skill_variations[skill]:
                var_pattern = r'\b' + re.escape(variation) + r'\b'
                if re.search(var_pattern, text):
                    return True
        
        # Check synonyms
        for synonym, canonical in self.skill_synonyms.items():
            if canonical == skill:
                syn_pattern = r'\b' + re.escape(synonym) + r'\b'
                if re.search(syn_pattern, text):
                    return True
        
        # Handle skills with special characters (e.g., C++, C#, .NET)
        skill_escaped = skill.replace('+', r'\+').replace('#', r'\#').replace('.', r'\.?')
        escaped_pattern = r'\b' + skill_escaped + r'\b'
        if re.search(escaped_pattern, text, re.IGNORECASE):
            return True
        
        return False
    
    def extract_skills(self, text: str) -> Set[str]:
        """
        Extract skills from text using the skills dataset with enhanced matching
        
        Args:
            text: Text to extract skills from
            
        Returns:
            Set of extracted skills in canonical form
        """
        if not text:
            return set()
        
        text_lower = text.lower()
        found_skills = set()
        
        # Direct and fuzzy matching against known skills
        for skill in self.all_skills:
            if self._fuzzy_match_skill(text_lower, skill):
                found_skills.add(skill)
        
        # Check for synonyms in text and add canonical forms
        for synonym, canonical in self.skill_synonyms.items():
            if re.search(r'\b' + re.escape(synonym) + r'\b', text_lower):
                if canonical in self.all_skills:
                    found_skills.add(canonical)
        
        return found_skills
    
    def extract_skills_with_confidence(self, text: str) -> Dict[str, float]:
        """
        Extract skills with confidence scores
        
        Args:
            text: Text to extract skills from
            
        Returns:
            Dictionary mapping skill to confidence score (0-1)
        """
        if not text:
            return {}
        
        text_lower = text.lower()
        skill_confidence = {}
        
        for skill in self.all_skills:
            # Direct match - highest confidence
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                skill_confidence[skill] = 1.0
                continue
            
            # Variation match - medium-high confidence
            if skill in self.skill_variations:
                for variation in self.skill_variations[skill]:
                    var_pattern = r'\b' + re.escape(variation) + r'\b'
                    if re.search(var_pattern, text_lower):
                        skill_confidence[skill] = 0.9
                        break
            
            # Synonym match - medium confidence
            for synonym, canonical in self.skill_synonyms.items():
                if canonical == skill:
                    syn_pattern = r'\b' + re.escape(synonym) + r'\b'
                    if re.search(syn_pattern, text_lower):
                        skill_confidence[skill] = 0.85
                        break
        
        return skill_confidence
    
    def _extract_required_skills_from_jd(self, job_description: str) -> Set[str]:
        """
        Extract explicitly required skills from job description
        by looking for patterns like "required:", "must have:", "skills:", etc.
        """
        text_lower = job_description.lower()
        required_skills = set()
        
        # Patterns that indicate required skills
        patterns = [
            r'(?:required|requirement|must have|essential|mandatory|prerequisite)[s]?\s*[:\-]?\s*([^\n\.]+)',
            r'(?:technical\s+)?skills\s*[:\-]?\s*([^\n\.]+)',
            r'(?:qualifications|qualify)\s*[:\-]?\s*([^\n\.]+)',
            r'(?:experience\s+(?:with|in|using))\s*[:\-]?\s*([^\n\.]+)',
            r'(?:proficiency|proficient)\s+(?:in|with)\s*[:\-]?\s*([^\n\.]+)',
            r'(?:knowledge\s+(?:of|in))\s*[:\-]?\s*([^\n\.]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                # Extract skills from the matched text
                extracted = self.extract_skills(match)
                required_skills.update(extracted)
        
        return required_skills
    
    def _calculate_skill_importance(self, skill: str, job_description: str) -> float:
        """
        Calculate the importance weight of a skill based on how it's mentioned
        in the job description
        
        Returns a weight between 0.5 and 1.5
        """
        text_lower = job_description.lower()
        weight = 1.0
        
        # Check for importance indicators
        skill_pattern = r'\b' + re.escape(skill) + r'\b'
        
        # Look for "required", "must have" near the skill
        if re.search(r'(?:required|must have|essential|mandatory)[^.]*' + skill_pattern, text_lower):
            weight += 0.3
        elif re.search(skill_pattern + r'[^.]*?(?:required|must have|essential|mandatory)', text_lower):
            weight += 0.3
        
        # Look for "preferred", "nice to have", "bonus"
        if re.search(r'(?:preferred|nice to have|bonus|optional|desired)[^.]*' + skill_pattern, text_lower):
            weight -= 0.2
        
        # Look for "experience with X years" - indicates importance
        years_pattern = r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)\s+(?:with|in|using)\s*' + skill_pattern
        if re.search(years_pattern, text_lower):
            weight += 0.2
        
        # Multiple mentions indicate importance
        mention_count = len(re.findall(skill_pattern, text_lower))
        if mention_count >= 3:
            weight += 0.2
        elif mention_count >= 2:
            weight += 0.1
        
        return min(max(weight, 0.5), 1.5)  # Clamp between 0.5 and 1.5
    
    def compare_texts(self, resume_text: str, job_description: str) -> Tuple[Set[str], Set[str], float]:
        """
        Compare resume text with job description with enhanced accuracy
        
        Args:
            resume_text: Text extracted from resume
            job_description: Job description text
            
        Returns:
            Tuple of (matched_skills, missing_skills, match_percentage)
        """
        # Extract skills from both texts
        resume_skills = self.extract_skills(resume_text)
        resume_skills_with_conf = self.extract_skills_with_confidence(resume_text)
        job_skills = self.extract_skills(job_description)
        
        # Also extract explicitly required skills
        required_job_skills = self._extract_required_skills_from_jd(job_description)
        job_skills.update(required_job_skills)
        
        # If no job skills found, try to extract keywords using TF-IDF
        if not job_skills:
            job_skills = self._extract_keywords_tfidf(job_description)
        
        # Calculate matched and missing skills
        matched_skills = resume_skills.intersection(job_skills)
        missing_skills = job_skills - resume_skills
        
        # Calculate weighted match percentage
        if len(job_skills) == 0:
            match_percentage = 0.0
        else:
            total_weight = 0.0
            matched_weight = 0.0
            
            for skill in job_skills:
                # Get importance weight for this skill
                importance = self._calculate_skill_importance(skill, job_description)
                total_weight += importance
                
                if skill in matched_skills:
                    # Base match weight
                    match_weight = importance
                    
                    # Adjust based on confidence if we have it
                    if skill in resume_skills_with_conf:
                        match_weight *= resume_skills_with_conf[skill]
                    
                    matched_weight += match_weight
            
            match_percentage = (matched_weight / total_weight) * 100
        
        return matched_skills, missing_skills, round(match_percentage, 2)
    
    def _extract_keywords_tfidf(self, text: str, top_n: int = 20) -> Set[str]:
        """
        Extract keywords using TF-IDF when direct skill matching fails
        
        Args:
            text: Text to extract keywords from
            top_n: Number of top keywords to return
            
        Returns:
            Set of extracted keywords
        """
        if not text:
            return set()
        
        try:
            # Fit and transform the text
            tfidf_matrix = self.vectorizer.fit_transform([text])
            
            # Get feature names and scores
            feature_names = self.vectorizer.get_feature_names_out()
            scores = tfidf_matrix.toarray()[0]
            
            # Get top scoring features
            top_indices = np.argsort(scores)[::-1][:top_n]
            keywords = {feature_names[i] for i in top_indices if scores[i] > 0}
            
            # Filter by skills
            return keywords.intersection(self.all_skills)
            
        except Exception:
            return set()
    
    def get_skill_similarity_score(self, resume_text: str, job_description: str) -> float:
        """
        Calculate cosine similarity between resume and job description
        
        Args:
            resume_text: Text from resume
            job_description: Job description text
            
        Returns:
            Similarity score between 0 and 1
        """
        try:
            # Preprocess texts
            processed_resume = self.preprocess_text(resume_text)
            processed_jd = self.preprocess_text(job_description)
            
            # Create TF-IDF vectors
            tfidf_matrix = self.vectorizer.fit_transform([processed_resume, processed_jd])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return round(similarity * 100, 2)
        except Exception:
            return 0.0
    
    def categorize_skills(self, skills: Set[str]) -> Dict[str, List[str]]:
        """
        Categorize skills into technical, soft, and domain skills
        
        Args:
            skills: Set of skills to categorize
            
        Returns:
            Dictionary with categorized skills
        """
        categorized = {
            "technical_skills": [],
            "soft_skills": [],
            "domain_skills": [],
            "other": []
        }
        
        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in [s.lower() for s in self.skills_data.get('technical_skills', [])]:
                categorized["technical_skills"].append(skill)
            elif skill_lower in [s.lower() for s in self.skills_data.get('soft_skills', [])]:
                categorized["soft_skills"].append(skill)
            elif skill_lower in [s.lower() for s in self.skills_data.get('domain_skills', [])]:
                categorized["domain_skills"].append(skill)
            else:
                categorized["other"].append(skill)
        
        return categorized
    
    def get_detailed_analysis(self, resume_text: str, job_description: str) -> Dict:
        """
        Get detailed analysis including skill breakdown and recommendations
        
        Args:
            resume_text: Text from resume
            job_description: Job description text
            
        Returns:
            Detailed analysis dictionary
        """
        matched, missing, percentage = self.compare_texts(resume_text, job_description)
        
        # Get skill importance for each matched/missing skill
        matched_with_importance = {
            skill: self._calculate_skill_importance(skill, job_description)
            for skill in matched
        }
        missing_with_importance = {
            skill: self._calculate_skill_importance(skill, job_description)
            for skill in missing
        }
        
        return {
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "match_percentage": percentage,
            "matched_with_importance": matched_with_importance,
            "missing_with_importance": missing_with_importance,
            "total_job_skills": len(matched) + len(missing),
            "resume_skill_count": len(self.extract_skills(resume_text)),
        }


# Create singleton instance
nlp_service = NLPService()


# Convenience functions
def preprocess_text(text: str) -> str:
    """Preprocess text using NLP service"""
    return nlp_service.preprocess_text(text)


def extract_skills(text: str) -> Set[str]:
    """Extract skills from text"""
    return nlp_service.extract_skills(text)


def compare_resume_with_jd(resume_text: str, job_description: str) -> Tuple[Set[str], Set[str], float]:
    """Compare resume with job description"""
    return nlp_service.compare_texts(resume_text, job_description)