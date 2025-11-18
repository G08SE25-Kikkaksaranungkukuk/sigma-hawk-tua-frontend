variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "sigma-hawk-tua-frontend"
}

# Cloud Run variables
variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum number of Cloud Run instances"
  type        = string
  default     = "1"  # Keep 1 instance warm in production
}

variable "max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = string
  default     = "10"
}

variable "allow_public_access" {
  description = "Allow public access to Cloud Run"
  type        = bool
  default     = true
}

# Application variables
variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "backend_url" {
  description = "Backend API URL"
  type        = string
  default     = "https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app"
}

# GitHub variables for Cloud Build
variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "G08SE25-Kikkaksaranungkukuk"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "sigma-hawk-tua-frontend"
}
