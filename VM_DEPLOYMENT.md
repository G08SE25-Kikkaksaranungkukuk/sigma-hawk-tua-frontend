# Deploying Next.js Frontend on GCP VM with PM2

This guide covers deploying the Sigma Hawk Tua frontend application on a Google Cloud Platform Virtual Machine using PM2 as the process manager.

## Overview

**Architecture:**
- **VM Type**: e2-medium (2 vCPU, 4GB RAM) recommended
- **OS**: Ubuntu 22.04 LTS
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **Port**: 3000 (internal), 80/443 (external via Nginx)

---

## Step 1: Create GCP VM Instance

### Using gcloud CLI:

```bash
gcloud compute instances create sigma-hawk-tua-frontend \
  --project=YOUR_PROJECT_ID \
  --zone=asia-southeast1-a \
  --machine-type=e2-medium \
  --network-interface=network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=default \
  --maintenance-policy=MIGRATE \
  --provisioning-model=STANDARD \
  --tags=http-server,https-server \
  --create-disk=auto-delete=yes,boot=yes,device-name=sigma-hawk-tua-frontend,image=projects/ubuntu-os-cloud/global/images/ubuntu-2204-jammy-v20241115,mode=rw,size=20,type=pd-balanced \
  --no-shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --labels=goog-ec-src=vm_add-gcloud \
  --reservation-affinity=any
```

### Using GCP Console:

1. Go to **Compute Engine** > **VM instances**
2. Click **CREATE INSTANCE**
3. Configure:
   - **Name**: `sigma-hawk-tua-frontend`
   - **Region**: `asia-southeast1`
   - **Zone**: `asia-southeast1-a`
   - **Machine type**: `e2-medium` (2 vCPU, 4GB RAM)
   - **Boot disk**: Ubuntu 22.04 LTS (20GB)
   - **Firewall**: Allow HTTP and HTTPS traffic
4. Click **CREATE**

### Configure Firewall Rules:

```bash
# Allow HTTP traffic
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
  --target-tags http-server

# Allow HTTPS traffic
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --target-tags https-server

# Allow custom port (optional, if not using Nginx)
gcloud compute firewall-rules create allow-3000 \
  --allow tcp:3000 \
  --source-ranges 0.0.0.0/0 \
  --target-tags http-server
```

---

## Step 2: Connect to VM

```bash
gcloud compute ssh sigma-hawk-tua-frontend --zone=asia-southeast1-a
```

---

## Step 3: Initial VM Setup

### Run the setup script:

```bash
# Download and run setup script
curl -o setup-vm.sh https://raw.githubusercontent.com/G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-frontend/main/setup-vm.sh
chmod +x setup-vm.sh
./setup-vm.sh
```

### Or manually install dependencies:

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install Git
sudo apt-get install -y git

# Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable
```

---

## Step 4: Clone and Setup Application

```bash
# Create application directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-frontend.git
cd sigma-hawk-tua-frontend

# Create logs directory
mkdir -p logs

# Create environment file
nano .env.production.local
```

**Add to `.env.production.local`:**

```bash
NODE_ENV=production
PORT=3000

# Backend API URLs
NEXT_PUBLIC_BASE_API_URL=https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app
NEXT_PUBLIC_API_BASE=https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app
NEXT_PUBLIC_API_URL=https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app

# RapidAPI Key
NEXT_PUBLIC_RAPID_API_KEY=your_actual_rapid_api_key_here
```

---

## Step 5: Build and Start Application

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command that PM2 outputs (it will be something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user
```

---

## Step 6: Configure Nginx

```bash
# Copy Nginx configuration
sudo nano /etc/nginx/sites-available/sigma-hawk-tua-frontend
```

**Paste the contents from `nginx.conf` file, then:**

```bash
# Get your VM external IP
curl ifconfig.me

# Edit the config and replace 'your-domain.com' with your IP or domain
sudo nano /etc/nginx/sites-available/sigma-hawk-tua-frontend

# Create symlink
sudo ln -s /etc/nginx/sites-available/sigma-hawk-tua-frontend /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 7: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs sigma-hawk-tua-frontend

# Check Nginx status
sudo systemctl status nginx

# Test the application
curl http://localhost:3000
curl http://$(curl -s ifconfig.me)
```

**Access your application:**
```
http://YOUR_VM_EXTERNAL_IP
```

---

## PM2 Commands Reference

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Stop application
pm2 stop sigma-hawk-tua-frontend

# Restart application
pm2 restart sigma-hawk-tua-frontend

# Reload (zero-downtime)
pm2 reload sigma-hawk-tua-frontend

# View logs
pm2 logs sigma-hawk-tua-frontend

# View logs (last 100 lines)
pm2 logs sigma-hawk-tua-frontend --lines 100

# Monitor
pm2 monit

# List all processes
pm2 list

# Delete process
pm2 delete sigma-hawk-tua-frontend

# Save current configuration
pm2 save

# Resurrect saved configuration
pm2 resurrect
```

---

## Deployment Script Usage

For future deployments:

```bash
cd ~/apps/sigma-hawk-tua-frontend
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Pull latest code from git
2. Install dependencies
3. Build the application
4. Reload PM2 (zero-downtime)

---

## Optional: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring and Logs

### PM2 Logs:
```bash
# Real-time logs
pm2 logs

# Log files location
~/apps/sigma-hawk-tua-frontend/logs/pm2-error.log
~/apps/sigma-hawk-tua-frontend/logs/pm2-out.log
```

### Nginx Logs:
```bash
# Access logs
sudo tail -f /var/log/nginx/sigma-hawk-tua-access.log

# Error logs
sudo tail -f /var/log/nginx/sigma-hawk-tua-error.log
```

### System Resources:
```bash
# CPU and Memory usage
pm2 monit

# Or use htop
sudo apt-get install -y htop
htop
```

---

## Environment-specific Deployment

### Development Environment:
```bash
pm2 start ecosystem.config.js --env development
```

### Production Environment:
```bash
pm2 start ecosystem.config.js --env production
```

---

## Troubleshooting

### Application won't start:
```bash
# Check build errors
pnpm run build

# Check PM2 logs
pm2 logs sigma-hawk-tua-frontend --err

# Check Node.js version
node --version  # Should be v20.x
```

### Port 3000 already in use:
```bash
# Find process using port
sudo lsof -i :3000

# Kill the process
pm2 delete all
```

### Nginx configuration errors:
```bash
# Test configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Cannot connect from browser:
```bash
# Check firewall
sudo ufw status

# Ensure Nginx is running
sudo systemctl status nginx

# Check if app is running
pm2 status
curl http://localhost:3000
```

---

## Performance Optimization

### PM2 Cluster Mode:
The `ecosystem.config.js` is already configured to use all CPU cores with cluster mode.

### Nginx Caching:
The provided `nginx.conf` includes caching for static files.

### Memory Optimization:
```bash
# Adjust max memory in ecosystem.config.js
max_memory_restart: '1G'  # Restart if memory exceeds 1GB
```

---

## Cost Estimation

**e2-medium VM (2 vCPU, 4GB RAM):**
- **Monthly**: ~$30-40
- **With sustained use discount**: ~$20-30

**To reduce costs:**
- Use `e2-small` (2 vCPU, 2GB RAM) for ~$15/month
- Use preemptible instances (up to 80% cheaper, but can be terminated)

---

## Backup Strategy

### Automated Git Push:
```bash
# Add to crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd ~/apps/sigma-hawk-tua-frontend && git add . && git commit -m "Auto backup $(date)" && git push
```

### VM Snapshots:
```bash
gcloud compute disks snapshot sigma-hawk-tua-frontend \
  --snapshot-names=frontend-backup-$(date +%Y%m%d) \
  --zone=asia-southeast1-a
```

---

## Next Steps

1. **Setup Custom Domain**: Point your domain to VM IP
2. **Enable SSL**: Use Certbot for HTTPS
3. **Setup Monitoring**: Use GCP Cloud Monitoring or PM2 Plus
4. **Configure Auto-scaling**: Add load balancer if needed
5. **Setup CI/CD**: Automate deployments with GitHub Actions

---

## Support

For issues:
- Check PM2 logs: `pm2 logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- View system logs: `journalctl -xe`

---

## Quick Reference

**VM Info:**
- **Type**: e2-medium (2 vCPU, 4GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **Region**: asia-southeast1-a
- **Internal Port**: 3000
- **External Ports**: 80 (HTTP), 443 (HTTPS)

**Important Paths:**
- **Application**: `~/apps/sigma-hawk-tua-frontend`
- **Logs**: `~/apps/sigma-hawk-tua-frontend/logs/`
- **Nginx Config**: `/etc/nginx/sites-available/sigma-hawk-tua-frontend`
- **PM2 Config**: `~/apps/sigma-hawk-tua-frontend/ecosystem.config.js`
