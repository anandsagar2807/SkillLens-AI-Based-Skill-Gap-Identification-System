"""
Analyze Route
Handles resume and job description analysis
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional
import logging
import io
from datetime import datetime

# Import services
from services.nlp_service import nlp_service
from utils.file_parser import FileParser
from utils.pdf_report import pdf_generator

# Import ML model for classification
from ml_model.train_model import load_model, predict_match_level

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/analyze", tags=["Analysis"])

# Load ML model on startup
try:
    model = load_model()
    logger.info("ML model loaded successfully for classification")
except Exception as e:
    logger.warning(f"Could not load ML model: {str(e)}. Using fallback classification.")
    model = None


def get_classification(match_percentage: float) -> tuple:
    """Get classification from ML model or fallback to rule-based"""
    if model is not None:
        try:
            return predict_match_level(model, match_percentage)
        except Exception:
            pass
    
    # Fallback rule-based classification
    if match_percentage >= 70:
        return "High Match", {"low_match": 0, "medium_match": 0, "high_match": 100}
    elif match_percentage >= 40:
        return "Medium Match", {"low_match": 0, "medium_match": 100, "high_match": 0}
    else:
        return "Low Match", {"low_match": 100, "medium_match": 0, "high_match": 0}


@router.post("/")
async def analyze_resume(
    resume: UploadFile = File(..., description="Resume file (PDF/DOCX)"),
    job_description: str = Form(..., description="Job description text")
):
    """
    Analyze resume against job description
    
    Args:
        resume: Uploaded resume file (PDF/DOCX)
        job_description: Job description text
        
    Returns:
        Analysis results including matched skills, missing skills, and match percentage
    """
    try:
        # Validate file type
        allowed_extensions = ['pdf', 'docx', 'doc', 'txt']
        filename = resume.filename.lower()
        extension = filename.split('.')[-1] if '.' in filename else ''
        
        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        file_content = await resume.read()
        
        if not file_content:
            raise HTTPException(status_code=400, detail="Empty file provided")
        
        # Extract text from resume
        logger.info(f"Extracting text from {filename}")
        resume_text = FileParser.extract_text(file_content, filename)
        
        if not resume_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the resume. Please ensure the file is not corrupted."
            )
        
        # Validate job description
        if not job_description or len(job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 50 characters long"
            )
        
        # Perform analysis
        logger.info("Performing skill analysis")
        matched_skills, missing_skills, match_percentage = nlp_service.compare_texts(
            resume_text, job_description
        )
        
        # Categorize skills
        categorized_matched = nlp_service.categorize_skills(matched_skills)
        categorized_missing = nlp_service.categorize_skills(missing_skills)
        
        # Get additional similarity score
        similarity_score = nlp_service.get_skill_similarity_score(resume_text, job_description)
        
        # Get classification
        classification, confidence_scores = get_classification(match_percentage)
        
        # Prepare response
        response = {
            "success": True,
            "matched_skills": sorted(list(matched_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "match_percentage": match_percentage,
            "similarity_score": similarity_score,
            "classification": classification,
            "confidence": confidence_scores,
            "categorized_skills": {
                "matched": categorized_matched,
                "missing": categorized_missing
            },
            "resume_length": len(resume_text),
            "job_description_length": len(job_description),
            "total_job_skills": len(matched_skills) + len(missing_skills),
            "message": "Analysis completed successfully"
        }
        
        logger.info(f"Analysis complete: {match_percentage}% match - {classification}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/text")
async def analyze_text(
    resume_text: str = Form(..., description="Resume text content"),
    job_description: str = Form(..., description="Job description text")
):
    """
    Analyze resume text against job description (without file upload)
    
    Args:
        resume_text: Raw resume text
        job_description: Job description text
        
    Returns:
        Analysis results
    """
    try:
        # Validate inputs
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume text must be at least 50 characters long"
            )
        
        if not job_description or len(job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 50 characters long"
            )
        
        # Perform analysis
        matched_skills, missing_skills, match_percentage = nlp_service.compare_texts(
            resume_text, job_description
        )
        
        # Categorize skills
        categorized_matched = nlp_service.categorize_skills(matched_skills)
        categorized_missing = nlp_service.categorize_skills(missing_skills)
        
        # Get similarity score
        similarity_score = nlp_service.get_skill_similarity_score(resume_text, job_description)
        
        # Get classification
        classification, confidence_scores = get_classification(match_percentage)
        
        # Prepare response
        response = {
            "success": True,
            "matched_skills": sorted(list(matched_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "match_percentage": match_percentage,
            "similarity_score": similarity_score,
            "classification": classification,
            "confidence": confidence_scores,
            "categorized_skills": {
                "matched": categorized_matched,
                "missing": categorized_missing
            },
            "total_job_skills": len(matched_skills) + len(missing_skills),
            "message": "Analysis completed successfully"
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during text analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/skills")
async def get_available_skills():
    """
    Get all available skills in the dataset
    
    Returns:
        List of all skills organized by category
    """
    try:
        skills = nlp_service.skills_data
        return {
            "success": True,
            "skills": skills,
            "total_count": len(nlp_service.all_skills)
        }
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")


@router.post("/report")
async def generate_pdf_report(
    matched_skills: str = Form(..., description="JSON string of matched skills"),
    missing_skills: str = Form(..., description="JSON string of missing skills"),
    match_percentage: float = Form(..., description="Match percentage"),
    similarity_score: float = Form(default=0, description="Similarity score"),
    classification: str = Form(default="Unknown", description="Classification result"),
    recommendations: str = Form(default="[]", description="JSON string of recommendations")
):
    """
    Generate a PDF report from analysis results
    
    Args:
        All analysis parameters as form data
        
    Returns:
        PDF file as downloadable response
    """
    try:
        import json
        
        # Parse JSON strings
        matched = json.loads(matched_skills) if matched_skills else []
        missing = json.loads(missing_skills) if missing_skills else []
        recs = json.loads(recommendations) if recommendations else []
        
        # Prepare analysis data
        analysis_data = {
            "match_percentage": match_percentage,
            "similarity_score": similarity_score,
            "classification": classification,
            "matched_skills": matched,
            "missing_skills": missing,
        }
        
        # Generate PDF
        logger.info("Generating PDF report")
        pdf_bytes = pdf_generator.generate_report(analysis_data, recs)
        
        # Return as downloadable file
        filename = f"skilllens_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating PDF report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")


@router.post("/full-analysis")
async def full_analysis_with_report(
    resume: UploadFile = File(..., description="Resume file (PDF/DOCX)"),
    job_description: str = Form(..., description="Job description text"),
    include_report: bool = Form(default=False, description="Include PDF report")
):
    """
    Full analysis with optional PDF report generation
    
    Args:
        resume: Uploaded resume file
        job_description: Job description text
        include_report: Whether to include PDF report in response
        
    Returns:
        Analysis results (and optionally PDF report)
    """
    try:
        # Validate file type
        allowed_extensions = ['pdf', 'docx', 'doc', 'txt']
        filename = resume.filename.lower()
        extension = filename.split('.')[-1] if '.' in filename else ''
        
        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        file_content = await resume.read()
        
        if not file_content:
            raise HTTPException(status_code=400, detail="Empty file provided")
        
        # Extract text from resume
        logger.info(f"Extracting text from {filename}")
        resume_text = FileParser.extract_text(file_content, filename)
        
        if not resume_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the resume."
            )
        
        # Perform analysis
        matched_skills, missing_skills, match_percentage = nlp_service.compare_texts(
            resume_text, job_description
        )
        
        # Categorize skills
        categorized_matched = nlp_service.categorize_skills(matched_skills)
        categorized_missing = nlp_service.categorize_skills(missing_skills)
        
        # Get similarity score
        similarity_score = nlp_service.get_skill_similarity_score(resume_text, job_description)
        
        # Get classification
        classification, confidence_scores = get_classification(match_percentage)
        
        # Prepare response
        response = {
            "success": True,
            "matched_skills": sorted(list(matched_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "match_percentage": match_percentage,
            "similarity_score": similarity_score,
            "classification": classification,
            "confidence": confidence_scores,
            "categorized_skills": {
                "matched": categorized_matched,
                "missing": categorized_missing
            },
            "resume_length": len(resume_text),
            "job_description_length": len(job_description),
            "total_job_skills": len(matched_skills) + len(missing_skills),
        }
        
        # Include PDF report if requested
        if include_report:
            pdf_bytes = pdf_generator.generate_report(response)
            filename = f"skilllens_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}"
                }
            )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during full analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
