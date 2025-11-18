// Report Types based on Prisma schema

export interface ReportTag {
  id: number;
  key: string;
  label: string;
  emoji: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportReason {
  id: number;
  report_id: number;
  report_tag_id: number;
  created_at?: string;
  report_tag: ReportTag;
}

export interface Report {
  report_id: number;
  user_id: number;
  title: string;
  reason: ReportReason[];
  description: string;
  created_at: string;
  is_resolved: boolean;
}

// API Request/Response Types

export interface GetReportsParams {
  search?: string;
  status?: 'all' | 'resolved' | 'unresolved';
  tag?: string;
  page?: number;
  limit?: number;
}

export interface GetReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateReportStatusRequest {
  is_resolved: boolean;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  report_tag_ids: number[];
}

export interface GetReportTagsResponse {
  tags: ReportTag[];
}
