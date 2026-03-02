"""
AI-Based Skill Gap Identification System
Main FastAPI Application Entry Point
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
import logging
import sys
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Import routes
from routes import analyze, classify, recommend, chat

# Get environment variables
APP_NAME = os.getenv("APP_NAME", "SkillLens-API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Configure logging
log_level = logging.DEBUG if DEBUG else logging.INFO
logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=APP_NAME,
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
    version=APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS from environment variable
# In production, add "*" to allowed origins or set specific domains
all_origins = ALLOWED_ORIGINS.copy()
if ENVIRONMENT == "development" or "*" not in all_origins:
    all_origins.append("*")  # Allow all origins in development

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router)
app.include_router(classify.router)
app.include_router(recommend.router)
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "description": "Analyze resumes, identify skill gaps, and get course recommendations",
        "environment": ENVIRONMENT,
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
        "service": "skill-gap-api",
        "environment": ENVIRONMENT
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    logger.info("=" * 60)
    logger.info(f"Starting {APP_NAME} v{APP_VERSION}")
    logger.info(f"Environment: {ENVIRONMENT}")
    logger.info(f"Debug Mode: {DEBUG}")
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
            "detail": str(exc) if DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        log_level="debug" if DEBUG else "info"
    )