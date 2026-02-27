"""
Recommendation Service
Provides course recommendations based on missing skills using content-based filtering
"""

import json
from typing import List, Dict, Set
from pathlib import Path
from collections import defaultdict


class RecommendationService:
    """Service for recommending courses based on skill gaps"""
    
    def __init__(self):
        """Initialize recommendation service with courses dataset"""
        self.courses_data = self._load_courses_data()
        self.skill_to_courses = self._build_skill_index()
    
    def _load_courses_data(self) -> List[Dict]:
        """Load courses dataset from JSON file"""
        courses_path = Path(__file__).parent.parent / 'data' / 'courses.json'
        try:
            with open(courses_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('courses', [])
        except FileNotFoundError:
            return []
    
    def _build_skill_index(self) -> Dict[str, List[Dict]]:
        """
        Build an inverted index mapping skills to courses
        
        Returns:
            Dictionary mapping skill names to list of courses
        """
        skill_index = defaultdict(list)
        
        for course in self.courses_data:
            course_skills = course.get('skills', [])
            for skill in course_skills:
                skill_lower = skill.lower()
                skill_index[skill_lower].append(course)
        
        return skill_index
    
    def get_recommendations(self, missing_skills: List[str], top_n: int = 5) -> List[Dict]:
        """
        Get course recommendations based on missing skills
        
        Args:
            missing_skills: List of missing skill names
            top_n: Number of recommendations to return
            
        Returns:
            List of recommended courses with match scores
        """
        if not missing_skills:
            return []
        
        # Normalize missing skills to lowercase
        missing_skills_lower = [skill.lower() for skill in missing_skills]
        
        # Score courses based on how many missing skills they cover
        course_scores = defaultdict(lambda: {'course': None, 'matched_skills': [], 'score': 0})
        
        for skill in missing_skills_lower:
            # Find courses that teach this skill
            matching_courses = self.skill_to_courses.get(skill, [])
            
            for course in matching_courses:
                course_id = course.get('id')
                if course_scores[course_id]['course'] is None:
                    course_scores[course_id]['course'] = course
                
                course_scores[course_id]['matched_skills'].append(skill)
                course_scores[course_id]['score'] += 1
        
        # Sort by score (number of matched skills) and rating
        sorted_courses = sorted(
            course_scores.values(),
            key=lambda x: (x['score'], x['course'].get('rating', 0) if x['course'] else 0),
            reverse=True
        )
        
        # Format recommendations
        recommendations = []
        for item in sorted_courses[:top_n]:
            course = item['course']
            if course:
                recommendations.append({
                    'title': course.get('title'),
                    'platform': course.get('platform'),
                    'link': course.get('link'),
                    'matched_skills': list(set(item['matched_skills'])),
                    'duration': course.get('duration'),
                    'rating': course.get('rating'),
                    'relevance_score': round(item['score'] / len(missing_skills) * 100, 1)
                })
        
        return recommendations
    
    def get_courses_for_skill(self, skill: str, limit: int = 3) -> List[Dict]:
        """
        Get courses that teach a specific skill
        
        Args:
            skill: Skill name to find courses for
            limit: Maximum number of courses to return
            
        Returns:
            List of courses teaching the skill
        """
        skill_lower = skill.lower()
        courses = self.skill_to_courses.get(skill_lower, [])
        
        # Sort by rating
        sorted_courses = sorted(
            courses,
            key=lambda x: x.get('rating', 0),
            reverse=True
        )[:limit]
        
        return [{
            'title': c.get('title'),
            'platform': c.get('platform'),
            'link': c.get('link'),
            'duration': c.get('duration'),
            'rating': c.get('rating')
        } for c in sorted_courses]
    
    def get_all_available_skills(self) -> Set[str]:
        """
        Get all skills that have associated courses
        
        Returns:
            Set of skill names with available courses
        """
        return set(self.skill_to_courses.keys())
    
    def get_course_stats(self) -> Dict:
        """
        Get statistics about the courses database
        
        Returns:
            Dictionary with course statistics
        """
        platforms = defaultdict(int)
        total_courses = len(self.courses_data)
        total_skills = len(self.skill_to_courses)
        
        for course in self.courses_data:
            platform = course.get('platform', 'Unknown')
            platforms[platform] += 1
        
        return {
            'total_courses': total_courses,
            'total_skills_covered': total_skills,
            'platforms': dict(platforms)
        }


# Create singleton instance
recommendation_service = RecommendationService()


# Convenience functions
def get_recommendations(missing_skills: List[str], top_n: int = 5) -> List[Dict]:
    """Get course recommendations for missing skills"""
    return recommendation_service.get_recommendations(missing_skills, top_n)


def get_courses_for_skill(skill: str, limit: int = 3) -> List[Dict]:
    """Get courses for a specific skill"""
    return recommendation_service.get_courses_for_skill(skill, limit)