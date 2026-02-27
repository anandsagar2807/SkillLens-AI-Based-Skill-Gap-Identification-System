"""
Recommend Route
Handles course recommendations based on missing skills
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
import logging

# Import services
from services.recommendation_service import recommendation_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/recommend", tags=["Recommendations"])


class RecommendRequest(BaseModel):
    """Request model for recommendations"""
    missing_skills: List[str] = Field(..., min_items=1, description="List of missing skills")
    top_n: int = Field(default=5, ge=1, le=10, description="Number of recommendations to return")


class CourseRecommendation(BaseModel):
    """Model for a single course recommendation"""
    title: str
    platform: str
    link: str
    matched_skills: List[str]
    duration: str
    rating: float
    relevance_score: float


class RecommendResponse(BaseModel):
    """Response model for recommendations"""
    success: bool
    recommendations: List[CourseRecommendation]
    total_missing_skills: int
    skills_with_courses: int


@router.post("/", response_model=RecommendResponse)
async def get_recommendations(request: RecommendRequest):
    """
    Get course recommendations based on missing skills
    
    Args:
        request: Recommendation request with missing skills list
        
    Returns:
        List of recommended courses
    """
    try:
        if not request.missing_skills:
            raise HTTPException(
                status_code=400,
                detail="Missing skills list cannot be empty"
            )
        
        # Get recommendations
        recommendations = recommendation_service.get_recommendations(
            request.missing_skills,
            request.top_n
        )
        
        # Count skills that have courses available
        available_skills = recommendation_service.get_all_available_skills()
        skills_with_courses = sum(
            1 for skill in request.missing_skills 
            if skill.lower() in available_skills
        )
        
        # Build response
        response = RecommendResponse(
            success=True,
            recommendations=[
                CourseRecommendation(**rec) for rec in recommendations
            ],
            total_missing_skills=len(request.missing_skills),
            skills_with_courses=skills_with_courses
        )
        
        logger.info(f"Generated {len(recommendations)} recommendations for {len(request.missing_skills)} missing skills")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")


@router.post("/skill/{skill}")
async def get_courses_for_skill(skill: str, limit: int = 3):
    """
    Get courses for a specific skill
    
    Args:
        skill: Skill name
        limit: Maximum number of courses to return
        
    Returns:
        List of courses teaching the specified skill
    """
    try:
        courses = recommendation_service.get_courses_for_skill(skill, limit)
        
        if not courses:
            return {
                "success": True,
                "skill": skill,
                "courses": [],
                "message": f"No courses found for skill: {skill}"
            }
        
        return {
            "success": True,
            "skill": skill,
            "courses": courses,
            "total_courses": len(courses)
        }
        
    except Exception as e:
        logger.error(f"Error fetching courses for skill: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch courses: {str(e)}")


@router.get("/stats")
async def get_course_stats():
    """
    Get statistics about the courses database
    
    Returns:
        Course database statistics
    """
    try:
        stats = recommendation_service.get_course_stats()
        return {
            "success": True,
            **stats
        }
    except Exception as e:
        logger.error(f"Error fetching course stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")


@router.get("/available-skills")
async def get_available_skills():
    """
    Get all skills that have associated courses
    
    Returns:
        List of skills with available courses
    """
    try:
        skills = recommendation_service.get_all_available_skills()
        return {
            "success": True,
            "skills": sorted(list(skills)),
            "total_count": len(skills)
        }
    except Exception as e:
        logger.error(f"Error fetching available skills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")