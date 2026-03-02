"""
Chat API Routes
Handles AI chatbot interactions for career guidance
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.chat_service import get_chat_response, chat_service

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message model"""
    message: str
    session_id: Optional[str] = 'default'


class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    intent: str
    entities: dict
    follow_up: Optional[str]
    suggestions: List[str]


class InterviewQuestionsRequest(BaseModel):
    """Interview questions request model"""
    category: Optional[str] = 'behavioral'
    count: Optional[int] = 5


class CourseRecommendationRequest(BaseModel):
    """Course recommendation request model"""
    skill: Optional[str] = None
    category: Optional[str] = None


@router.post("/message", response_model=ChatResponse)
async def send_message(chat_message: ChatMessage):
    """
    Send a message to the AI chatbot and receive a response
    
    Args:
        chat_message: The chat message containing the user's query
        
    Returns:
        ChatResponse with AI-generated response and metadata
    """
    try:
        if not chat_message.message or not chat_message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        result = get_chat_response(chat_message.message, chat_message.session_id)
        
        return ChatResponse(
            response=result['response'],
            intent=result['intent'],
            entities=result['entities'],
            follow_up=result.get('follow_up'),
            suggestions=result.get('suggestions', [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")


@router.get("/interview-questions")
async def get_interview_questions(category: str = 'behavioral', count: int = 5):
    """
    Get interview questions by category
    
    Args:
        category: Question category (behavioral, technical_general, frontend, backend, data_science)
        count: Number of questions to return
        
    Returns:
        List of interview questions
    """
    try:
        questions = chat_service.get_interview_questions(category, count)
        return {
            "category": category,
            "questions": questions,
            "count": len(questions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")


@router.get("/course-recommendations")
async def get_course_recommendations(skill: Optional[str] = None, category: Optional[str] = None):
    """
    Get course recommendations
    
    Args:
        skill: Skill to get courses for
        category: Course category (programming, data_science, cloud, soft_skills)
        
    Returns:
        List of recommended courses
    """
    try:
        courses = chat_service.get_course_recommendations(skill, category)
        return {
            "skill": skill,
            "category": category,
            "courses": courses,
            "count": len(courses)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching courses: {str(e)}")


@router.get("/skill-info/{skill}")
async def get_skill_info(skill: str):
    """
    Get detailed information about a specific skill
    
    Args:
        skill: Skill name to get information for
        
    Returns:
        Detailed skill information
    """
    try:
        skill_lower = skill.lower()
        if skill_lower in chat_service.skill_knowledge:
            info = chat_service.skill_knowledge[skill_lower]
            return {
                "skill": skill,
                "found": True,
                "info": info
            }
        else:
            return {
                "skill": skill,
                "found": False,
                "message": f"No detailed information available for '{skill}'"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching skill info: {str(e)}")


@router.get("/health")
async def chat_health():
    """Health check for chat service"""
    return {
        "status": "healthy",
        "service": "chat",
        "features": [
            "intent_detection",
            "entity_extraction",
            "context_awareness",
            "interview_questions",
            "course_recommendations",
            "skill_information"
        ]
    }