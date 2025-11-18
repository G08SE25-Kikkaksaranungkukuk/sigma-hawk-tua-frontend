output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = module.cloud_run.service_url
}

output "cloud_run_service_name" {
  description = "Cloud Run service name"
  value       = module.cloud_run.service_name
}

output "artifact_registry_url" {
  description = "Artifact Registry repository URL"
  value       = module.artifact_registry.repository_url
}

output "cloud_build_trigger_id" {
  description = "Cloud Build trigger ID"
  value       = module.cloud_build.trigger_id
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = module.cloud_run.service_url
}
