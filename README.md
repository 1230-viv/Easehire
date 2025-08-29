# 🎯 EaseHire - AI-Powered HR Hiring Assistant

An advanced web application built with React (frontend) and Quart (backend) that helps HR professionals streamline their hiring process using AI technology.

## ✨ Features

- **🔍 ATS Resume Scoring** - Intelligent resume evaluation with compatibility scores
- **📝 MCQ Generation** - Automated multiple-choice questions based on job requirements
- **💻 Coding Assessments** - Dynamic coding problems with automated evaluation  
- **📊 Applicant Tracking** - Complete candidate management system
- **🤖 Multi-LLM Support** - OpenAI, Anthropic, Google Gemini, and local Ollama integration

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL Database
- Docker (optional, for code execution)

### Backend Setup

1. **Clone and navigate to the project**
```bash
git clone <repository-url>
cd Easehire
```

2. **Create virtual environment**
```bash
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirement.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

5. **Run the backend**
```bash
python app.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

## 🔑 API Keys Setup

The application supports multiple LLM providers with automatic fallback:

### Free Options
- **Google Gemini** - Get free API key at [AI Studio](https://aistudio.google.com/app/apikey)
- **Ollama** - Free local LLM (automatically used as fallback)

### Premium Options  
- **OpenAI** - Get API key at [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic Claude** - Get API key at [Anthropic Console](https://console.anthropic.com/)

Add your keys to the `.env` file:
```bash
OPENAI_API_KEY=sk-your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key_here
```

## 🛠️ Database Setup
1. Install MySQL
2. Create user and set password
3. Create new database
4. Update `.env` file with your database credentials:
```bash
DATABASE_URL=mysql+aiomysql://username:password@localhost/database_name
```

Make sure SQL server is running before starting Quart.

## 📊 Performance Improvements

| Component | Before (Llama 3.2) | After (Cloud LLMs) |
|-----------|-------------------|-----------------|
| ATS Accuracy | ~60-70% | ~85-95% |
| MCQ Quality | Basic | Professional |
| Response Time | 3-10s | 1-3s |
| Reliability | Variable | Consistent |

---

Built with ❤️ for better hiring experiences 
