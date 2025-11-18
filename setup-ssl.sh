#!/bin/bash
# SSL setup script for thamroi.duckdns.org using Let's Encrypt

set -e

echo "🔒 Setting up SSL for thamroi.duckdns.org..."

# Install Certbot
echo "📦 Installing Certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
sudo certbot --nginx -d thamroi.duckdns.org --non-interactive --agree-tos --email thanakirt47@gmail.com --redirect

# Certbot will automatically:
# 1. Obtain the certificate
# 2. Update Nginx configuration
# 3. Setup auto-renewal

echo "✅ SSL certificate obtained successfully!"
echo "🔄 Certbot will automatically renew the certificate before it expires"

# Test auto-renewal
echo "🧪 Testing auto-renewal..."
sudo certbot renew --dry-run

# Show certificate info
echo "📜 Certificate information:"
sudo certbot certificates

echo ""
echo "✅ SSL setup completed!"
echo "🌐 Your site is now available at: https://thamroi.duckdns.org"
echo ""
echo "📝 Certificate details:"
echo "   - Location: /etc/letsencrypt/live/thamroi.duckdns.org/"
echo "   - Auto-renewal: Enabled (runs twice daily)"
echo "   - Manual renewal: sudo certbot renew"
