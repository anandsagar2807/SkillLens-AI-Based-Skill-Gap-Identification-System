"""
AI-Based Skill Gap Identification System
Main FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
import logging
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Import routes
from routes import analyze, classify, recommend

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="AI-Based Skill Gap Identification System",
    description="""
    ## Overview
    
    This API analyzes resumes against job descriptions to identify skill gaps and recommend relevant courses.
    
    ## Features
    
    * **Resume Analysis**: Extract and compare skills from resumes with job descriptions
    * **Skill Classification**: ML-powered classification of skill match levels
    * **Course Recommendations**: Get personalized course suggestions for missing skills
    
    ## Endpoints
    
    * `/analyze` - Analyze resume against job description
    * `/classify` - Classify skill match level
    * `/recommend` - Get course recommendations
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4173",
        "*",  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router)
app.include_router(classify.router)
app.include_router(recommend.router)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "AI-Based Skill Gap Identification System",
        "version": "1.0.0",
        "description": "Analyze resumes, identify skill gaps, and get course recommendations",
        "endpoints": {
            "analyze": "/analyze - Analyze resume against job description",
            "classify": "/classify - Classify skill match level",
            "recommend": "/recommend - Get course recommendations",
            "docs": "/docs - API documentation",
            "redoc": "/redoc - Alternative API documentation"
        },
        "status": "running"
    }


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "skill-gap-api"
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    logger.info("=" * 60)
    logger.info("Starting AI-Based Skill Gap Identification System")
    logger.info("=" * 60)
    logger.info("API server is ready to accept requests")
    logger.info("Documentation available at: /docs")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run shutdown tasks"""
    logger.info("Shutting down API server...")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )