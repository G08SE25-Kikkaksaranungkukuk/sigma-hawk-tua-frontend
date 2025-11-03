import { apiClient } from '@/lib/api';
import { tokenService } from '@/lib/services/user/tokenService';
import type {
	GetReportsParams,
	UpdateReportStatusRequest,
	CreateReportRequest,
} from '@/lib/types/admin';

/**
 * Frontend ReportService
 * Provides static helpers to call the backend reports API and returns
 * uniform response shapes similar to the provided service reference.
 */
export class ReportService {
	private static readonly BASE_PATH = '/api/v2/reports';

	private static async getAuthHeaders() {
		const token = await tokenService.getAuthToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	static async getReports(params?: GetReportsParams): Promise<any> {
		try {
			const query: Record<string, unknown> = {};
			if (params) {
				if (params.search) query.search = params.search;
				if (params.status && params.status !== 'all') query.status = params.status;
				if (params.tag && params.tag !== 'all') query.tag = params.tag;
				if (params.page) query.page = params.page;
				if (params.limit) query.limit = params.limit;
			}

			const headers = await this.getAuthHeaders();
			const response: any = await apiClient.get(this.BASE_PATH, { params: query, headers });

			return {
				success: true,
				reports: response?.reports ?? [],
				pagination: response?.pagination ?? undefined,
			};
		} catch (error) {
			console.error('reportService.getReports error', error);
			return { success: false, reports: [], pagination: undefined };
		}
	}

	static async getReportById(reportId: number): Promise<any> {
		try {
			const headers = await this.getAuthHeaders();
			const response: any = await apiClient.get(`${this.BASE_PATH}/${reportId}`, { headers });
			return { success: true, report: response?.report ?? response };
		} catch (error) {
			console.error('reportService.getReportById error', error);
			return { success: false, message: 'Failed to fetch report' };
		}
	}

	static async updateReportStatus(reportId: number, data: UpdateReportStatusRequest): Promise<any> {
		try {
			const headers = await this.getAuthHeaders();
			const response: any = await apiClient.patch(`${this.BASE_PATH}/${reportId}/status`, data, { headers });
			return { success: true, report: response };
		} catch (error) {
			console.error('reportService.updateReportStatus error', error);
			return { success: false, message: 'Failed to update report status' };
		}
	}

	static async createReport(user_id: number, data: CreateReportRequest): Promise<any> {
		try {
			const headers = await this.getAuthHeaders();
			const body = { ...data, user_id };
			const response: any = await apiClient.post(this.BASE_PATH, body, { headers });
			return { success: true, message: 'Report created successfully', report: response };
		} catch (error) {
			console.error('reportService.createReport error', error);
			return { success: false, message: 'Failed to create report' };
		}
	}

	static async deleteReport(reportId: number): Promise<any> {
		try {
			const headers = await this.getAuthHeaders();
			await apiClient.delete(`${this.BASE_PATH}/${reportId}`, { headers });
			return { success: true, message: 'Report deleted successfully' };
		} catch (error) {
			console.error('reportService.deleteReport error', error);
			return { success: false, message: 'Failed to delete report' };
		}
	}

	static async getReportTags(): Promise<any> {
		try {
			const response: any = await apiClient.get('/api/report-tags');
			return { success: true, tags: response?.tags ?? [] };
		} catch (error) {
			console.error('reportService.getReportTags error', error);
			return { success: false, tags: [] };
		}
	}

	static async getAllReportsAdmin(page: number = 1, limit: number = 10) {
		try {
			const headers = await this.getAuthHeaders();
			const response: any = await apiClient.get(this.BASE_PATH, { params: { page, limit }, headers });
			return {
				success: true,
				reports: response?.reports ?? [],
				pagination: response?.pagination ?? { current_page: page, total_pages: 1, total_records: response?.total ?? 0, per_page: limit },
			};
		} catch (error) {
			console.error('reportService.getAllReportsAdmin error', error);
			return { success: false, reports: [], pagination: undefined, message: 'Failed to fetch all reports' };
		}
	}

	static async getReportStats(): Promise<any> {
		try {
			const headers = await this.getAuthHeaders();
			const response: any = await apiClient.get(`${this.BASE_PATH}/stats`, { headers });
			return { success: true, stats: response ?? { total_reports: 0 } };
		} catch (error) {
			console.error('reportService.getReportStats error', error);
			return { success: false, stats: { total_reports: 0 } };
		}
	}
}

// Export class as before (static methods) for compatibility
export const reportService = ReportService;

