# Deploying Next.js Frontend to GCP Cloud Run

This guide covers deploying the Sigma Hawk Tua frontend application to Google Cloud Platform using Cloud Run and Terraform.

## Overview

The infrastructure is configured to deploy a Next.js application to Cloud Run with:
- **Container Port**: 3000 (Next.js default)
- **Memory**: 512Mi (dev), 1Gi (prod)
- **CPU**: 1 vCPU
- **Min Instances**: 0 (dev), 1 (prod)
- **Max Instances**: 5 (dev), 10 (prod)
- **Public Access**: Enabled
- **Standalone Build**: Optimized Docker image

## Prerequisites

1. **GCP Project**: Active Google Cloud Platform project
2. **Terraform**: Version >= 1.0 installed
3. **gcloud CLI**: Authenticated with your GCP account
4. **GitHub Repository**: Connected to Cloud Build

## Project Structure

```
infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf                    # Development infrastructure
│   │   ├── variables.tf               # Dev variables
│   │   ├── terraform.tfvars.example   # Example configuration
│   │   └── outputs.tf                 # Dev outputs
│   └── prod/
│       ├── main.tf                    # Production infrastructure
│       ├── variables.tf               # Prod variables
│       ├── terraform.tfvars.example   # Example configuration
│       └── outputs.tf                 # Prod outputs
└── modules/
    ├── artifact-registry/             # Docker image registry
    ├── cloud-build/                   # CI/CD pipeline
    └── cloud-run/                     # Container deployment

Root files:
├── Dockerfile.cloud.run               # Multi-stage production build
├── cloudbuild.dev.yaml                # Dev deployment pipeline
└── cloudbuild.prod.yaml               # Prod deployment pipeline
```

## Initial Setup

### 1. Authenticate with GCP

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login
```

### 2. Enable Required APIs

The Terraform configuration will automatically enable:
- Cloud Run API
- Cloud Build API
- Artifact Registry API

### 3. Configure Environment Variables

#### Development Environment

```bash
cd infrastructure/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_id = "your-gcp-project-id"
region     = "asia-southeast1"

# Application configuration
image_tag   = "latest"

# GitHub configuration
github_owner = "G08SE25-Kikkaksaranungkukuk"
github_repo  = "sigma-hawk-tua-frontend"
```

#### Production Environment

```bash
cd infrastructure/environments/prod
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_id = "your-gcp-project-id"
region     = "asia-southeast1"

# Cloud Run configuration
cloud_run_cpu    = "1"
cloud_run_memory = "1Gi"
min_instances    = "1"   # Keep warm for faster response
max_instances    = "10"

# Application configuration
image_tag           = "latest"
allow_public_access = true

# Backend API URL
backend_url = "https://your-backend-url.run.app"

# GitHub configuration
github_owner = "G08SE25-Kikkaksaranungkukuk"
github_repo  = "sigma-hawk-tua-frontend"
```

## Deployment Steps

### Development Environment

#### 1. Initialize Terraform

```bash
cd infrastructure/environments/dev
terraform init
```

#### 2. Review Infrastructure Plan

```bash
terraform plan
```

#### 3. Apply Infrastructure

```bash
terraform apply
```

Review the changes and type `yes` to confirm.

#### 4. Get Service URL

```bash
terraform output cloud_run_url
```

### Production Environment

Follow the same steps but in the `prod` directory:

```bash
cd infrastructure/environments/prod
terraform init
terraform plan
terraform apply
terraform output cloud_run_url
```

## CI/CD with Cloud Build

### Manual Deployment

After infrastructure is set up, trigger deployments via Cloud Build:

#### Development

```bash
gcloud builds submit --config=cloudbuild.dev.yaml
```

#### Production

```bash
gcloud builds submit --config=cloudbuild.prod.yaml
```

### Automated Deployment (GitHub Triggers)

Cloud Build triggers are created automatically by Terraform. They can be:

1. **Manual triggers**: Manually run from GCP Console
2. **Branch-based**: Configure in Cloud Build settings to auto-deploy on push

To enable auto-deployment:

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Find your trigger (`sigma-hawk-tua-frontend-deploy-dev` or `prod`)
3. Edit the trigger
4. Change from "Manual" to "Push to branch" matching `^main$`

## Docker Build Details

### Multi-Stage Build Process

The `Dockerfile.cloud.run` uses a multi-stage build:

1. **deps**: Installs dependencies using pnpm
2. **builder**: Builds Next.js with standalone output
3. **runner**: Creates minimal production image

### Standalone Output

Next.js is configured with `output: "standalone"` in `next.config.ts`, which:
- Creates a self-contained server bundle
- Reduces image size by ~80%
- Improves deployment speed
- Only includes necessary dependencies

## Environment Variables

### Development

- `NODE_ENV`: `dev`
- `BACKEND_URL`: Backend API URL (default: dev backend)

### Production

- `NODE_ENV`: `production`
- `BACKEND_URL`: Production backend URL

To add more environment variables, update:
1. `infrastructure/environments/{env}/main.tf` - `env_vars` block
2. `infrastructure/environments/{env}/variables.tf` - Add variable definitions

## Infrastructure Resources

### Created Resources

Each environment creates:

1. **Artifact Registry Repository**: Stores Docker images
2. **Cloud Run Service**: Hosts the application
3. **Cloud Build Trigger**: CI/CD pipeline
4. **Service Accounts**: For Cloud Run and Cloud Build

### Resource Naming Convention

- **Dev**: `sigma-hawk-tua-frontend-dev`
- **Prod**: `sigma-hawk-tua-frontend-prod`

## Monitoring & Logs

### View Logs

```bash
# Development
gcloud run services logs read sigma-hawk-tua-frontend-dev --region=asia-southeast1

# Production
gcloud run services logs read sigma-hawk-tua-frontend-prod --region=asia-southeast1
```

### View in Console

- [Cloud Run Services](https://console.cloud.google.com/run)
- [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
- [Logs Explorer](https://console.cloud.google.com/logs)

## Cost Optimization

### Development
- **Min instances**: 0 (scales to zero when idle)
- **Memory**: 512Mi
- **Cost**: ~$5-10/month with moderate usage

### Production
- **Min instances**: 1 (always warm, faster response)
- **Memory**: 1Gi
- **Cost**: ~$20-50/month depending on traffic

To reduce costs:
- Set `min_instances = "0"` in production (slower cold starts)
- Use Cloud CDN for static assets
- Implement caching strategies

## Troubleshooting

### Build Fails

```bash
# Check Cloud Build logs
gcloud builds list --limit=5

# View specific build
gcloud builds log [BUILD_ID]
```

### Service Not Accessible

```bash
# Check service status
gcloud run services describe sigma-hawk-tua-frontend-dev --region=asia-southeast1

# Verify IAM permissions
gcloud run services get-iam-policy sigma-hawk-tua-frontend-dev --region=asia-southeast1
```

### Container Crashes

```bash
# View recent logs
gcloud run services logs read sigma-hawk-tua-frontend-dev --region=asia-southeast1 --limit=100
```

Common issues:
- Missing environment variables
- Port mismatch (ensure container listens on port 3000)
- Insufficient memory (increase in `variables.tf`)

## Updating Infrastructure

### Change Cloud Run Settings

Edit `infrastructure/environments/{env}/variables.tf` or `terraform.tfvars`:

```hcl
cloud_run_memory = "1Gi"  # Increase memory
max_instances    = "20"    # Increase max instances
```

Apply changes:

```bash
terraform apply
```

### Update Docker Image

Trigger a new build:

```bash
gcloud builds submit --config=cloudbuild.{env}.yaml
```

### Rollback

```bash
# List revisions
gcloud run revisions list --service=sigma-hawk-tua-frontend-dev --region=asia-southeast1

# Rollback to specific revision
gcloud run services update-traffic sigma-hawk-tua-frontend-dev \
  --to-revisions=REVISION_NAME=100 \
  --region=asia-southeast1
```

## Cleanup

### Destroy Environment

```bash
cd infrastructure/environments/{env}
terraform destroy
```

This will remove all created resources.

## Security Best Practices

1. **Never commit** `terraform.tfvars` with sensitive data
2. **Use Secret Manager** for API keys and tokens
3. **Restrict IAM permissions** to minimum required
4. **Enable Cloud Armor** for DDoS protection (production)
5. **Use VPC** for private backend communication

## Next Steps

1. **Custom Domain**: Map your domain to Cloud Run
2. **CDN**: Configure Cloud CDN for static assets
3. **Monitoring**: Set up Cloud Monitoring alerts
4. **Load Testing**: Test with expected traffic patterns
5. **Backup**: Regular infrastructure state backups

## Support

For issues or questions:
- Check [Cloud Run Documentation](https://cloud.google.com/run/docs)
- Review [Terraform GCP Provider Docs](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- Contact team via GitHub issues
