"""
Classify Route
Handles skill match level classification using ML model
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import logging

# Import ML model
from ml_model.train_model import load_model, predict_match_level

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/classify", tags=["Classification"])

# Load model on startup
try:
    model = load_model()
    logger.info("ML model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load ML model: {str(e)}")
    model = None


class ClassifyRequest(BaseModel):
    """Request model for classification"""
    match_percentage: float = Field(..., ge=0, le=100, description="Match percentage (0-100)")


class BatchClassifyRequest(BaseModel):
    """Request model for batch classification"""
    percentages: List[float] = Field(default_factory=list, description="List of match percentages")


class ClassifyResponse(BaseModel):
    """Response model for classification"""
    success: bool
    match_percentage: float
    classification: str
    confidence_scores: Dict[str, float]
    description: str


# Classification descriptions
CLASSIFICATION_DESCRIPTIONS = {
    "High Match": "The candidate has a strong alignment with the job requirements. Most required skills are present in the resume.",
    "Medium Match": "The candidate has a moderate alignment with the job requirements. Several key skills are present, but some gaps exist.",
    "Low Match": "The candidate has limited alignment with the job requirements. Significant skill gaps need to be addressed."
}


@router.post("/", response_model=ClassifyResponse)
async def classify_match(request: ClassifyRequest):
    """
    Classify the skill match level based on match percentage
    
    Args:
        request: Classification request with match percentage
        
    Returns:
        Classification result with confidence scores
    """
    try:
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="ML model is not available. Please ensure the model is trained."
            )
        
        # Get prediction
        classification, probabilities = predict_match_level(model, request.match_percentage)
        
        # Build response
        response = ClassifyResponse(
            success=True,
            match_percentage=request.match_percentage,
            classification=classification,
            confidence_scores=probabilities,
            description=CLASSIFICATION_DESCRIPTIONS.get(classification, "")
        )
        
        logger.info(f"Classification: {request.match_percentage}% -> {classification}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


@router.post("/batch")
async def classify_batch(percentages: List[float] = Body(..., embed=True)):
    """
    Classify multiple match percentages
    
    Args:
        percentages: List of match percentages (embedded in request body)
        
    Returns:
        List of classification results
    """
    try:
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="ML model is not available."
            )
        
        results = []
        for pct in percentages:
            if 0 <= pct <= 100:
                classification, probabilities = predict_match_level(model, pct)
                results.append({
                    "match_percentage": pct,
                    "classification": classification,
                    "confidence_scores": probabilities,
                    "description": CLASSIFICATION_DESCRIPTIONS.get(classification, "")
                })
        
        return {
            "success": True,
            "results": results,
            "total_classified": len(results)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch classification failed: {str(e)}")


@router.get("/info")
async def get_model_info():
    """
    Get information about the classification model
    
    Returns:
        Model information and class labels
    """
    return {
        "success": True,
        "model_type": "Logistic Regression",
        "classes": ["Low Match", "Medium Match", "High Match"],
        "thresholds": {
            "low_match": "0-39%",
            "medium_match": "40-69%",
            "high_match": "70-100%"
        },
        "descriptions": CLASSIFICATION_DESCRIPTIONS
    }