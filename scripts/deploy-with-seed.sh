#!/bin/bash

# Script to deploy the application with automatic seeding
# Usage: ./scripts/deploy-with-seed.sh

# Exit on error
set -e

echo "🚀 Starting deployment with automatic seeding..."

# Build the application
echo "📦 Building the application..."
npm run build

# Set environment variables for production with seeding
export NODE_ENV=production
export AUTO_SEED=true

# Start the application
echo "🌱 Starting the application with automatic seeding..."
npm run start:prod

# Note: The application will automatically run the seeder on startup
# because of the AUTO_SEED=true environment variable 
