# SkillLens - AI-Powered Skill Gap Analysis Platform

SkillLens is an intelligent platform that analyzes your resume against job descriptions using advanced NLP techniques to identify skill gaps and provide personalized course recommendations.

## 🌟 Features

- **Resume Analysis**: Upload your resume (PDF/DOCX) or paste text directly
- **Skill Extraction**: Automatically extract technical and soft skills using NLP
- **Skill Gap Detection**: Compare your skills against job requirements
- **Match Classification**: ML-powered classification (High/Moderate/Low match)
- **Course Recommendations**: Personalized course suggestions from top platforms
- **Beautiful UI**: Modern, responsive interface built with React & TailwindCSS

## 🏗️ Architecture

```
SkillLens/
├── backend/                 # FastAPI Python backend
│   ├── data/               # Skills and courses database
│   ├── ml_model/           # ML model training scripts
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── utils/              # Utilities (file parsing, etc.)
│   ├── main.py             # FastAPI application entry
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/               # React Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLTK data:**
   ```bash
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('punkt_tab')"
   ```

5. **Train the ML model (optional - pre-trained included):**
   ```bash
   python ml_model/train_model.py
   ```

6. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Analyze Resume
```
POST /api/analyze/
Content-Type: multipart/form-data

Parameters:
- resume: File (PDF/DOCX/TXT)
- job_description: String
```

### Analyze Text
```
POST /api/analyze/text
Content-Type: multipart/form-data

Parameters:
- resume_text: String
- job_description: String
```

### Classify Match
```
POST /api/classify/
Content-Type: application/json

Body:
{
  "match_percentage": 75.5
}
```

### Get Recommendations
```
POST /api/recommend/
Content-Type: application/json

Body:
{
  "missing_skills": ["Python", "Machine Learning", "Docker"],
  "top_n": 5
}
```

### Health Check
```
GET /api/health
```

## 🧠 How It Works

1. **Resume Parsing**: Extracts text from PDF/DOCX files using PyPDF2 and python-docx
2. **Skill Extraction**: Uses NLTK and spaCy for NLP-based skill extraction
3. **Skill Matching**: Compares extracted skills against job description requirements
4. **Classification**: ML model classifies the match level (High/Moderate/Low)
5. **Recommendations**: Suggests relevant courses from the course database

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **NLTK** - Natural language processing
- **spaCy** - Advanced NLP
- **scikit-learn** - Machine learning
- **PyPDF2** - PDF parsing
- **python-docx** - DOCX parsing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📦 Docker Deployment

### Backend
```bash
cd backend
docker build -t skilllens-backend .
docker run -p 8000:8000 skilllens-backend
```

### Full Stack with Docker Compose (create docker-compose.yml)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🎯 Supported Skills

The platform recognizes 150+ technical skills across:
- Programming Languages (Python, JavaScript, Java, etc.)
- Web Development (React, Node.js, Django, etc.)
- Data Science (Machine Learning, TensorFlow, PyTorch, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, etc.)
- Databases (PostgreSQL, MongoDB, Redis, etc.)
- And many more...

## 📚 Course Database

Includes 40+ curated courses from:
- Udemy
- Coursera
- Pluralsight
- LinkedIn Learning
- Microsoft Learn
- Educative

## 🔒 Privacy

- No data is stored on the server
- All processing is done in-memory
- Your resume and job descriptions are not saved

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by SkillLens Team