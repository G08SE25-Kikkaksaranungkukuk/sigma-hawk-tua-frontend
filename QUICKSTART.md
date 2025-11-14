# Quick Deployment Reference

## Prerequisites Checklist

- [ ] GCP account with active project
- [ ] gcloud CLI installed and authenticated
- [ ] Terraform >= 1.0 installed
- [ ] pnpm installed (for local development)

## Quick Start

### 1. One-Time Setup

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login

# Configure Terraform
cd infrastructure/environments/dev
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project_id

# Initialize and deploy
terraform init
terraform apply
```

### 2. Deploy Updates

```bash
# Via Cloud Build (recommended)
gcloud builds submit --config=cloudbuild.dev.yaml

# Or update infrastructure
cd infrastructure/environments/dev
terraform apply
```

## Common Commands

### Terraform

```bash
# Initialize
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply

# Destroy everything
terraform destroy

# View outputs
terraform output
terraform output cloud_run_url
```

### Cloud Build

```bash
# Submit build manually
gcloud builds submit --config=cloudbuild.dev.yaml
gcloud builds submit --config=cloudbuild.prod.yaml

# List recent builds
gcloud builds list --limit=10

# View build logs
gcloud builds log [BUILD_ID]
```

### Cloud Run

```bash
# List services
gcloud run services list

# Describe service
gcloud run services describe sigma-hawk-tua-frontend-dev --region=asia-southeast1

# View logs
gcloud run services logs read sigma-hawk-tua-frontend-dev --region=asia-southeast1

# Update service manually
gcloud run services update sigma-hawk-tua-frontend-dev \
  --region=asia-southeast1 \
  --memory=1Gi

# List revisions
gcloud run revisions list --service=sigma-hawk-tua-frontend-dev --region=asia-southeast1

# Rollback
gcloud run services update-traffic sigma-hawk-tua-frontend-dev \
  --to-revisions=REVISION_NAME=100 \
  --region=asia-southeast1
```

### Docker (Local Testing)

```bash
# Build locally
docker build -t sigma-hawk-tua-frontend:latest -f Dockerfile.cloud.run .

# Run locally
docker run -p 3000:3000 sigma-hawk-tua-frontend:latest

# Test in browser
open http://localhost:3000
```

## File Locations

| File | Purpose |
|------|---------|
| `Dockerfile.cloud.run` | Production Docker build |
| `cloudbuild.dev.yaml` | Dev deployment pipeline |
| `cloudbuild.prod.yaml` | Prod deployment pipeline |
| `infrastructure/environments/dev/` | Dev infrastructure code |
| `infrastructure/environments/prod/` | Prod infrastructure code |
| `next.config.ts` | Next.js configuration |

## Environment Variables

### Add New Environment Variable

1. Edit `infrastructure/environments/{env}/variables.tf`:

```hcl
variable "my_new_var" {
  description = "My new variable"
  type        = string
  default     = "default-value"
}
```

2. Edit `infrastructure/environments/{env}/main.tf`:

```hcl
env_vars = {
  NODE_ENV = var.environment
  BACKEND_URL = var.backend_url
  MY_NEW_VAR = var.my_new_var  # Add this line
}
```

3. Apply:

```bash
terraform apply
```

## Resource URLs

| Resource | URL |
|----------|-----|
| Cloud Run Console | https://console.cloud.google.com/run |
| Cloud Build | https://console.cloud.google.com/cloud-build |
| Artifact Registry | https://console.cloud.google.com/artifacts |
| Logs Explorer | https://console.cloud.google.com/logs |
| Cloud Build Triggers | https://console.cloud.google.com/cloud-build/triggers |

## Infrastructure Outputs

After `terraform apply`, get outputs:

```bash
terraform output cloud_run_url              # Service URL
terraform output cloud_run_service_name     # Service name
terraform output artifact_registry_url      # Docker registry URL
terraform output cloud_build_trigger_id     # Build trigger ID
terraform output frontend_url               # Application URL
```

## Troubleshooting Quick Fixes

### Build Failed

```bash
# Check logs
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]

# Common fixes:
# - Verify Dockerfile.cloud.run exists
# - Check pnpm-lock.yaml is committed
# - Ensure build timeout is sufficient
```

### Service Not Starting

```bash
# Check logs
gcloud run services logs read sigma-hawk-tua-frontend-dev --region=asia-southeast1 --limit=50

# Common fixes:
# - Verify port 3000 is exposed
# - Check environment variables
# - Increase memory allocation
```

### Terraform Errors

```bash
# Refresh state
terraform refresh

# Re-initialize
rm -rf .terraform
terraform init

# Import existing resource
terraform import MODULE.RESOURCE RESOURCE_ID
```

## Cost Monitoring

```bash
# View current month costs
gcloud billing accounts list
gcloud billing budgets list --billing-account=[ACCOUNT_ID]

# Check Cloud Run metrics
gcloud run services describe sigma-hawk-tua-frontend-dev --region=asia-southeast1 --format="value(status.traffic)"
```

## Security Checklist

- [ ] terraform.tfvars added to .gitignore
- [ ] No secrets in environment variables (use Secret Manager)
- [ ] IAM permissions follow principle of least privilege
- [ ] Public access only for frontend (not backend APIs)
- [ ] HTTPS enforced (automatic with Cloud Run)

## Performance Tuning

| Setting | Dev | Prod | When to Increase |
|---------|-----|------|------------------|
| Memory | 512Mi | 1Gi | Out of memory errors |
| CPU | 1 | 1 | High CPU usage |
| Min Instances | 0 | 1 | Reduce cold starts |
| Max Instances | 5 | 10 | Hit max capacity |

Edit in `infrastructure/environments/{env}/main.tf` or `variables.tf`.

## Useful Links

- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
