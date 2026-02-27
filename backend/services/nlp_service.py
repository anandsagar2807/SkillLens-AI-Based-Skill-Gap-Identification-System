"""
NLP Service
Handles text preprocessing, skill extraction, and comparison using TF-IDF
"""

import json
import re
import string
from typing import List, Set, Tuple, Dict
from pathlib import Path

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
    
    def extract_skills(self, text: str) -> Set[str]:
        """
        Extract skills from text using the skills dataset
        
        Args:
            text: Text to extract skills from
            
        Returns:
            Set of extracted skills
        """
        if not text:
            return set()
        
        text_lower = text.lower()
        found_skills = set()
        
        # Direct matching
        for skill in self.all_skills:
            # Use word boundary matching for more accuracy
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
        
        # Handle variations and abbreviations
        skill_variations = {
            'ml': 'machine learning',
            'ai': 'artificial intelligence',
            'nlp': 'natural language processing',
            'cv': 'computer vision',
            'dl': 'deep learning',
            'ds': 'data science',
            'js': 'javascript',
            'ts': 'typescript',
            'k8s': 'kubernetes',
            'gcp': 'google cloud platform',
            'aws': 'amazon web services',
            'rdbms': 'sql',
            'nosql': 'mongodb',
        }
        
        for abbrev, full_form in skill_variations.items():
            if re.search(r'\b' + abbrev + r'\b', text_lower):
                if full_form in self.all_skills:
                    found_skills.add(full_form)
        
        return found_skills
    
    def compare_texts(self, resume_text: str, job_description: str) -> Tuple[Set[str], Set[str], float]:
        """
        Compare resume text with job description
        
        Args:
            resume_text: Text extracted from resume
            job_description: Job description text
            
        Returns:
            Tuple of (matched_skills, missing_skills, match_percentage)
        """
        # Extract skills from both texts
        resume_skills = self.extract_skills(resume_text)
        job_skills = self.extract_skills(job_description)
        
        # If no job skills found, try to extract keywords using TF-IDF
        if not job_skills:
            job_skills = self._extract_keywords_tfidf(job_description)
        
        # Calculate matched and missing skills
        matched_skills = resume_skills.intersection(job_skills)
        missing_skills = job_skills - resume_skills
        
        # Calculate match percentage
        if len(job_skills) == 0:
            match_percentage = 0.0
        else:
            match_percentage = (len(matched_skills) / len(job_skills)) * 100
        
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