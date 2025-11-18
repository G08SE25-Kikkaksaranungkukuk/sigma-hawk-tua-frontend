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
  default     = "dev"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "sigma-hawk-tua-frontend"
}

# Application variables
variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
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

# Backend variables
variable "backend_url" {
  description = "Backend URL"
  type        = string
  default     = "https://sigma-hawk-tua-backend-dev-1097710273935.asia-southeast1.run.app"
}

variable "rapid_api_key" {
  description = "RapidAPI key for place services"
  type        = string
  sensitive   = true
  default     = "9974f6952amsh0983f1fdbba613fp1f38f0jsn2c9d67db43d1"
}