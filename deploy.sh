#!/bin/bash
# Deployment script for GCP VM

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📦 Pulling latest code from git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "🔨 Building Next.js application..."
pnpm run build

# Reload PM2
echo "♻️  Reloading PM2 process..."
pm2 reload ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at http://$(curl -s ifconfig.me):3000"
