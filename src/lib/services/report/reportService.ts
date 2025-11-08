import { apiClient } from '@/lib/api';
import { tokenService } from '@/lib/services/user/tokenService';

/**
 * ReportService (client-facing)
 * - getReasons(): fetch report reason tags from backend
 * - createReport(): submit a new report
 */
export class ReportService {
  private static readonly BASE_PATH = '/api/v2/reports';

  private static async getAuthHeaders() {
    const token = await tokenService.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async getReasons(): Promise<{ success: boolean; reasons: any[] }> {
    try {
      // apiClient will use NEXT_PUBLIC_BASE_API_URL as baseURL
      const response: any = await apiClient.get(`${this.BASE_PATH}/reasons`);

      // response may be shaped several ways depending on backend envelope
      const reasons: any[] =
        Array.isArray(response?.reasons)
          ? response.reasons
          : Array.isArray(response?.data?.reasons)
          ? response.data.reasons
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      return { success: true, reasons };
    } catch (error) {
      console.error('reportService.getReasons error', error);
      return { success: false, reasons: [] };
    }
  }

  static async createReport(payload: { title: string; reason: string; description: string }): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response: any = await apiClient.post(this.BASE_PATH, payload, { headers });
      return { success: true, report: response };
    } catch (error) {
      console.error('reportService.createReport error', error);
      return { success: false, message: 'Failed to create report' };
    }
  }
}

export const reportService = ReportService;
