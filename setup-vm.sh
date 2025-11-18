#!/bin/bash
# Initial VM setup script for Ubuntu/Debian on GCP

set -e

echo "🔧 Setting up GCP VM for Next.js deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
sudo npm install -g pnpm

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Setup PM2 startup script
# echo "🔧 Setting up PM2 startup script..."
# pm2 startup systemd -u $USER --hp $HOME
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Install Git
echo "📦 Installing Git..."
sudo apt-get install -y git

# Create application directory
# echo "📁 Creating application directory..."
# mkdir -p ~/apps
# cd ~/apps

# Clone repository (you'll need to authenticate)
# echo "📦 Cloning repository..."
# echo "⚠️  Please run: git clone https://github.com/G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-frontend.git"

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Create logs directory
# mkdir -p ~/apps/sigma-hawk-tua-frontend/logs

echo "✅ VM setup completed!"
echo "📝 Next steps:"
echo "   1. Clone your repository: cd ~/apps && git clone <your-repo-url>"
echo "   2. Navigate to project: cd sigma-hawk-tua-frontend"
echo "   3. Create .env.production.local with your environment variables"
echo "   4. Run: pnpm install"
echo "   5. Run: pnpm run build"
echo "   6. Run: pm2 start ecosystem.config.js --env production"
echo "   7. Run: pm2 save"
echo "   8. Configure Nginx (see nginx.conf)"
