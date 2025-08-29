#!/bin/bash
# Installation script for improved LLM capabilities

echo "🚀 Setting up improved LLM capabilities for EaseHire..."

# Activate virtual environment
source myenv/bin/activate

# Install base requirements
echo "📦 Installing base requirements..."
pip install -r requirement.txt

# Install optional LLM providers (user can skip by pressing Enter)
echo ""
echo "🔑 LLM API Setup (optional - press Enter to skip any):"
echo ""

read -p "Enter OpenAI API Key (or press Enter to skip): " openai_key
if [ ! -z "$openai_key" ]; then
    echo "OPENAI_API_KEY=$openai_key" >> .env
    echo "✅ OpenAI configured"
fi

read -p "Enter Anthropic API Key (or press Enter to skip): " anthropic_key  
if [ ! -z "$anthropic_key" ]; then
    echo "ANTHROPIC_API_KEY=$anthropic_key" >> .env
    echo "✅ Anthropic configured"
fi

read -p "Enter Google Gemini API Key (or press Enter to skip): " gemini_key
if [ ! -z "$gemini_key" ]; then
    echo "GEMINI_API_KEY=$gemini_key" >> .env
    echo "✅ Gemini configured"  
fi

echo ""
echo "✅ Setup complete! Your application now supports multiple LLM providers with fallback."
echo ""
echo "🎯 Next steps:"
echo "1. Get API keys from:"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - Anthropic: https://console.anthropic.com/"
echo "   - Google AI: https://aistudio.google.com/app/apikey"
echo ""  
echo "2. Update your .env file with the API keys"
echo "3. Restart your application"
echo ""
echo "💡 The system will automatically fallback to Ollama if cloud APIs are unavailable."
