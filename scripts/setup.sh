#!/bin/bash

echo "🚀 Setting up Quiet Hours Scheduler..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

# Create scripts directory if it doesn't exist
mkdir -p scripts

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your credentials"
echo "2. Set up Supabase project and run supabase-setup.sql"
echo "3. Set up MongoDB (local or Atlas)"
echo "4. Configure email settings"
echo "5. Run 'npm run dev' to start the development server"
echo "6. Run 'npm run cron' in another terminal to start the CRON processor"
