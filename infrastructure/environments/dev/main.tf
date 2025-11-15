terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry
module "artifact_registry" {
  source = "../../modules/artifact-registry"

  region        = var.region
  repository_id = "${var.app_name}-repo-${var.environment}"
  description   = "Docker repository for ${var.app_name} (${var.environment})"
  
  labels = {
    environment = var.environment
    app         = var.app_name
  }

  depends_on = [google_project_service.required_apis]
}

# Cloud Run Service
module "cloud_run" {
  source = "../../modules/cloud-run"

  project_id                    = var.project_id
  region                        = var.region
  service_name                  = "${var.app_name}-${var.environment}"
  service_account_id            = "sigma-run-sa-${var.environment}"
  service_account_display_name  = "Cloud Run SA for ${var.app_name} (${var.environment})"

  image          = "${var.region}-docker.pkg.dev/${var.project_id}/${module.artifact_registry.repository_id}/${var.app_name}:${var.image_tag}"
  container_port = 3000

  cpu    = "1"
  memory = "512Mi"

  min_instances = "0"
  max_instances = "5"

  env_vars = {
    NODE_ENV = var.environment
    BACKEND_URL = var.backend_url
    NEXT_PUBLIC_BASE_API_URL = var.backend_url
    NEXT_PUBLIC_API_BASE = var.backend_url
    NEXT_PUBLIC_API_URL = "${var.backend_url}"
  }
  
  secret_env_vars = {}

  secret_ids = []

  allow_public_access      = true

  depends_on = [
    google_project_service.required_apis
  ]
}

# Cloud Build (Manual trigger only for dev)
module "cloud_build" {
  source = "../../modules/cloud-build"

  project_id                   = var.project_id
  service_account_id           = "sigma-build-sa-${var.environment}"
  service_account_display_name = "Cloud Build SA for ${var.app_name} (${var.environment})"

  trigger_name        = "${var.app_name}-deploy-${var.environment}"
  trigger_description = "Deploy ${var.app_name} to ${var.environment} (manual trigger)"
  
  github_owner   = var.github_owner
  github_repo    = var.github_repo
  trigger_branch = "^main$"

  cloudbuild_yaml_path = "cloudbuild.${var.environment}.yaml"

  substitutions = {
    _ENVIRONMENT        = var.environment
    _REGION             = var.region
    _SERVICE_NAME       = module.cloud_run.service_name
    _ARTIFACT_REGISTRY  = module.artifact_registry.repository_url
    _IMAGE_NAME         = var.app_name
  }

  depends_on = [google_project_service.required_apis]
}
