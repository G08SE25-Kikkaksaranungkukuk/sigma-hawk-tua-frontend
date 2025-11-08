import { apiClient } from '@/lib/api';
import type {
  Report,
  ReportTag,
  GetReportsParams,
  GetReportsResponse,
  UpdateReportStatusRequest,
  CreateReportRequest,
  GetReportTagsResponse,
} from '@/lib/types/admin';

/**
 * Report Service
 * Handles all API calls related to reports and report management
 */
export class ReportService {
  private static readonly BASE_PATH = '/api/reports';

  /**
   * Get all reports with optional filtering
   * @param params - Query parameters for filtering reports
   * @returns Promise with paginated reports
   */
  static async getReports(params?: GetReportsParams): Promise<GetReportsResponse> {
    // TODO: Implement API call to fetch reports
    // const queryParams = new URLSearchParams();
    // if (params?.search) queryParams.append('search', params.search);
    // if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    // if (params?.tag && params.tag !== 'all') queryParams.append('tag', params.tag);
    // if (params?.page) queryParams.append('page', params.page.toString());
    // if (params?.limit) queryParams.append('limit', params.limit.toString());
    // 
    // const response = await apiClient.get<GetReportsResponse>(
    //   `${this.BASE_PATH}?${queryParams.toString()}`
    // );
    // return response.data;
    
    throw new Error('getReports not implemented yet');
  }

  /**
   * Get a single report by ID
   * @param reportId - The ID of the report to fetch
   * @returns Promise with the report data
   */
  static async getReportById(reportId: number): Promise<Report> {
    // TODO: Implement API call to fetch a single report
    // const response = await apiClient.get<Report>(`${this.BASE_PATH}/${reportId}`);
    // return response.data;
    
    throw new Error('getReportById not implemented yet');
  }

  /**
   * Update report resolution status
   * @param reportId - The ID of the report to update
   * @param data - The updated status data
   * @returns Promise with the updated report
   */
  static async updateReportStatus(
    reportId: number,
    data: UpdateReportStatusRequest
  ): Promise<Report> {
    // TODO: Implement API call to update report status
    // const response = await apiClient.patch<Report>(
    //   `${this.BASE_PATH}/${reportId}/status`,
    //   data
    // );
    // return response.data;
    
    throw new Error('updateReportStatus not implemented yet');
  }

  /**
   * Create a new report
   * @param data - The report data to create
   * @returns Promise with the created report
   */
  static async createReport(data: CreateReportRequest): Promise<Report> {
    // TODO: Implement API call to create a new report
    // const response = await apiClient.post<Report>(this.BASE_PATH, data);
    // return response.data;
    
    throw new Error('createReport not implemented yet');
  }

  /**
   * Delete a report
   * @param reportId - The ID of the report to delete
   * @returns Promise with success status
   */
  static async deleteReport(reportId: number): Promise<void> {
    // TODO: Implement API call to delete a report
    // await apiClient.delete(`${this.BASE_PATH}/${reportId}`);
    
    throw new Error('deleteReport not implemented yet');
  }

  /**
   * Get all available report tags
   * @returns Promise with all report tags
   */
  static async getReportTags(): Promise<ReportTag[]> {
    // TODO: Implement API call to fetch report tags
    // const response = await apiClient.get<GetReportTagsResponse>('/api/report-tags');
    // return response.data.tags;
    
    throw new Error('getReportTags not implemented yet');
  }
}

// Export singleton instance for convenience
export const reportService = ReportService;
