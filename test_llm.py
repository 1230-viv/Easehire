#!/usr/bin/env python3
"""
Test script for the new LLM service
"""
import asyncio
import sys
import os
sys.path.append('/home/zoro/Documents/Easehire')

from llm_service import llm_service

async def test_llm_service():
    print("🧪 Testing EaseHire LLM Service...")
    print("=" * 50)
    
    # Test 1: Basic response generation
    print("\n1. Testing basic response generation...")
    response = await llm_service.generate_response(
        "What is Python?", 
        "You are a helpful programming assistant."
    )
    if response:
        print(f"✅ Basic response: {response[:100]}...")
    else:
        print("❌ Basic response failed")
    
    # Test 2: MCQ Generation
    print("\n2. Testing MCQ generation...")
    mcqs = await llm_service.generate_mcqs(
        "Python Developer", 
        ["Python", "Django", "REST API"], 
        count=3
    )
    if mcqs:
        print(f"✅ Generated {len(mcqs)} MCQs")
        for i, mcq in enumerate(mcqs[:2]):  # Show first 2
            print(f"   Q{i+1}: {mcq.get('question', 'N/A')}")
    else:
        print("❌ MCQ generation failed")
    
    # Test 3: ATS Score (mock)
    print("\n3. Testing ATS evaluation...")
    ats_score = await llm_service.evaluate_ats_score(
        "John Doe\nSoftware Engineer\nPython, Django, SQL experience",
        "Looking for Python Developer with Django experience"
    )
    if ats_score is not None:
        print(f"✅ ATS Score: {ats_score}")
    else:
        print("❌ ATS evaluation failed")
    
    # Test 4: Code evaluation
    print("\n4. Testing code evaluation...")
    result = await llm_service.evaluate_code(
        "Write a function to add two numbers",
        "def add(a, b):\n    return a + b",
        "python"
    )
    if result:
        print(f"✅ Code evaluation: {result}")
    else:
        print("❌ Code evaluation failed")
    
    # Test 5: Coding problem generation
    print("\n5. Testing coding problem generation...")
    problem = await llm_service.generate_coding_problem(
        "Python Developer",
        ["Python", "Algorithms"],
        "easy"
    )
    if problem:
        print(f"✅ Generated coding problem: {problem.get('title', 'N/A')}")
    else:
        print("❌ Coding problem generation failed")
    
    print("\n" + "=" * 50)
    print("🎉 LLM Service test completed!")

if __name__ == "__main__":
    asyncio.run(test_llm_service())
