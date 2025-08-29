"""
Unified LLM Service for EaseHire Application
Supports multiple LLM providers with fallback mechanisms
"""
import logging
import asyncio
import json
import re
import os
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from enum import Enum

# Optional imports - install as needed
try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    import ollama
    HAS_OLLAMA = True
except ImportError:
    HAS_OLLAMA = False

logging.basicConfig(level=logging.INFO)

class LLMProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    OLLAMA = "ollama"

@dataclass
class LLMConfig:
    provider: LLMProvider
    model: str
    api_key: Optional[str] = None
    max_tokens: int = 4000
    temperature: float = 0.7

class LLMService:
    def __init__(self):
        self.providers = self._initialize_providers()
        self.fallback_order = [
            LLMProvider.OPENAI,
            LLMProvider.ANTHROPIC, 
            LLMProvider.GEMINI,
            LLMProvider.OLLAMA
        ]
    
    def _initialize_providers(self) -> Dict[LLMProvider, LLMConfig]:
        """Initialize available LLM providers based on API keys and installations"""
        providers = {}
        
        # OpenAI
        if HAS_OPENAI and os.getenv("OPENAI_API_KEY"):
            providers[LLMProvider.OPENAI] = LLMConfig(
                provider=LLMProvider.OPENAI,
                model="gpt-4o-mini",  # Cost-effective but powerful
                api_key=os.getenv("OPENAI_API_KEY"),
                max_tokens=4000,
                temperature=0.7
            )
            
        # Anthropic Claude
        if HAS_ANTHROPIC and os.getenv("ANTHROPIC_API_KEY"):
            providers[LLMProvider.ANTHROPIC] = LLMConfig(
                provider=LLMProvider.ANTHROPIC,
                model="claude-3-haiku-20240307",  # Fast and cost-effective
                api_key=os.getenv("ANTHROPIC_API_KEY"),
                max_tokens=4000,
                temperature=0.7
            )
            
        # Google Gemini
        if HAS_GEMINI and os.getenv("GEMINI_API_KEY"):
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            providers[LLMProvider.GEMINI] = LLMConfig(
                provider=LLMProvider.GEMINI,
                model="gemini-1.5-flash",  # Fast and free tier available
                api_key=os.getenv("GEMINI_API_KEY"),
                max_tokens=4000,
                temperature=0.7
            )
            
        # Ollama (Local fallback)
        if HAS_OLLAMA:
            providers[LLMProvider.OLLAMA] = LLMConfig(
                provider=LLMProvider.OLLAMA,
                model="llama3.2",
                max_tokens=4000,
                temperature=0.7
            )
            
        return providers
    
    async def generate_response(self, prompt: str, system_prompt: str = "", 
                              preferred_provider: Optional[LLMProvider] = None) -> Optional[str]:
        """Generate response with fallback mechanism"""
        
        # Determine provider order
        if preferred_provider and preferred_provider in self.providers:
            provider_order = [preferred_provider] + [p for p in self.fallback_order if p != preferred_provider]
        else:
            provider_order = self.fallback_order
        
        # Try providers in order
        for provider in provider_order:
            if provider not in self.providers:
                continue
                
            try:
                config = self.providers[provider]
                response = await self._call_provider(provider, config, prompt, system_prompt)
                if response:
                    logging.info(f"✅ Successfully used {provider.value} for generation")
                    return response
            except Exception as e:
                logging.warning(f"❌ {provider.value} failed: {e}")
                continue
        
        logging.error("❌ All LLM providers failed")
        return None
    
    async def _call_provider(self, provider: LLMProvider, config: LLMConfig, 
                           prompt: str, system_prompt: str) -> Optional[str]:
        """Call specific LLM provider"""
        
        if provider == LLMProvider.OPENAI:
            return await self._call_openai(config, prompt, system_prompt)
        elif provider == LLMProvider.ANTHROPIC:
            return await self._call_anthropic(config, prompt, system_prompt)
        elif provider == LLMProvider.GEMINI:
            return await self._call_gemini(config, prompt, system_prompt)
        elif provider == LLMProvider.OLLAMA:
            return await self._call_ollama(config, prompt, system_prompt)
        
        return None
    
    async def _call_openai(self, config: LLMConfig, prompt: str, system_prompt: str) -> Optional[str]:
        """Call OpenAI API"""
        client = openai.AsyncOpenAI(api_key=config.api_key)
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await client.chat.completions.create(
            model=config.model,
            messages=messages,
            max_tokens=config.max_tokens,
            temperature=config.temperature
        )
        
        return response.choices[0].message.content
    
    async def _call_anthropic(self, config: LLMConfig, prompt: str, system_prompt: str) -> Optional[str]:
        """Call Anthropic API"""
        client = anthropic.AsyncAnthropic(api_key=config.api_key)
        
        full_prompt = f"{system_prompt}\n\nHuman: {prompt}\n\nAssistant:"
        
        response = await client.completions.create(
            model=config.model,
            prompt=full_prompt,
            max_tokens_to_sample=config.max_tokens,
            temperature=config.temperature
        )
        
        return response.completion
    
    async def _call_gemini(self, config: LLMConfig, prompt: str, system_prompt: str) -> Optional[str]:
        """Call Google Gemini API"""
        model = genai.GenerativeModel(config.model)
        
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        def _sync_generate():
            response = model.generate_content(full_prompt)
            return response.text
        
        return await asyncio.to_thread(_sync_generate)
    
    async def _call_ollama(self, config: LLMConfig, prompt: str, system_prompt: str) -> Optional[str]:
        """Call Ollama (local)"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        def _sync_chat():
            response = ollama.chat(model=config.model, messages=messages)
            return response['message']['content']
        
        return await asyncio.to_thread(_sync_chat)

# Specialized methods for your use cases
class EaseHireLLMService(LLMService):
    """Specialized LLM service for EaseHire application"""
    
    async def evaluate_ats_score(self, pdf_content: str, job_description: str = "") -> Optional[float]:
        """Evaluate ATS score for resume"""
        system_prompt = """You are an expert ATS (Applicant Tracking System) evaluator. 
        Analyze resumes and provide compatibility scores based on modern ATS standards including:
        - Keyword matching
        - Format compatibility
        - Section organization
        - Skills alignment
        Return ONLY a number between 0-100."""
        
        prompt = f"""
        Analyze this resume content and provide an ATS compatibility score (0-100):
        
        Resume Content: {pdf_content}
        Job Description: {job_description}
        
        Score (0-100):"""
        
        response = await self.generate_response(prompt, system_prompt)
        if response:
            try:
                # Extract number from response
                score_match = re.search(r'\b(\d+(?:\.\d+)?)\b', response)
                if score_match:
                    score = float(score_match.group(1))
                    return min(max(score, 0), 100)  # Clamp between 0-100
            except:
                pass
        return None
    
    async def generate_mcqs(self, job_title: str, job_skills: List[str], count: int = 10) -> List[Dict]:
        """Generate MCQs for technical assessment"""
        system_prompt = """You are an expert technical interviewer. Generate high-quality multiple-choice questions 
        that accurately test job-relevant skills. Each question should be unambiguous with one clear correct answer.
        Return valid JSON only."""
        
        skills_text = ", ".join(job_skills)
        prompt = f"""
        Generate {count} multiple-choice questions for: {job_title}
        Required skills: {skills_text}
        
        Format as JSON array:
        [
            {{
                "question": "Clear, specific question text",
                "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                "answer": "A",
                "explanation": "Brief explanation of correct answer"
            }}
        ]"""
        
        response = await self.generate_response(prompt, system_prompt, 
                                              preferred_provider=LLMProvider.OPENAI)
        
        if response:
            try:
                # Extract JSON from response
                json_match = re.search(r'\[.*\]', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                logging.error("Failed to parse MCQ JSON")
        
        return []
    
    async def generate_coding_problem(self, job_title: str, job_skills: List[str], 
                                    difficulty: str = "medium") -> Optional[Dict]:
        """Generate coding problem for assessment"""
        system_prompt = f"""You are an expert coding interviewer. Generate appropriate coding problems 
        for {difficulty} difficulty level that test relevant skills for the job role."""
        
        skills_text = ", ".join(job_skills)
        prompt = f"""
        Generate a coding problem for: {job_title}
        Skills to test: {skills_text}
        Difficulty: {difficulty}
        
        Return JSON format:
        {{
            "title": "Problem title",
            "description": "Clear problem statement with examples",
            "constraints": ["List of constraints"],
            "examples": [
                {{"input": "example input", "output": "expected output"}}
            ],
            "difficulty": "{difficulty}",
            "time_limit": 30,
            "test_cases": [
                {{"input": "test input", "expected_output": "expected result"}}
            ]
        }}"""
        
        response = await self.generate_response(prompt, system_prompt,
                                              preferred_provider=LLMProvider.OPENAI)
        
        if response:
            try:
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                logging.error("Failed to parse coding problem JSON")
        
        return None
    
    async def evaluate_code(self, problem: str, code: str, language: str) -> Optional[str]:
        """Evaluate submitted code solution"""
        system_prompt = """You are a code reviewer. Evaluate if the code correctly solves the problem.
        Consider correctness, efficiency, and code quality. Return ONLY 'PASS' or 'FAIL'."""
        
        prompt = f"""
        Problem: {problem}
        
        Code ({language}):
        {code}
        
        Evaluation (PASS/FAIL):"""
        
        response = await self.generate_response(prompt, system_prompt)
        
        if response:
            decision = response.strip().upper()
            return "PASS" if decision == "PASS" else "FAIL"
        
        return "FAIL"

# Global instance
llm_service = EaseHireLLMService()
