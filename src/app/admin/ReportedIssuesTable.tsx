import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { IssueDetailDialog } from './IssueDetailDialog';
import { reportService } from '@/lib/services/admin/reportService';
import type { Report } from '@/lib/types/admin';

interface ReportedIssuesTableProps {
  readonly searchQuery: string;
  readonly statusFilter: string;
  readonly tagFilter: string;
  // Optional pre-fetched reports (when the parent fetches them)
  readonly initialReports?: Report[];
  readonly initialLoading?: boolean;
  readonly initialPagination?: {
    readonly current_page?: number;
    readonly total_pages?: number;
    readonly total_records?: number;
    readonly per_page?: number;
  };
  readonly onPageChange?: (page: number) => void;
}

export function ReportedIssuesTable({
  searchQuery,
  statusFilter,
  tagFilter,
  initialReports,
  initialLoading,
  initialPagination,
  onPageChange,
}: ReportedIssuesTableProps) {
  const [reports, setReports] = useState<Report[]>(initialReports ?? []);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading ?? true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchReports = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reportService.getReports({
        search: searchQuery || undefined,
        status: statusFilter as 'all' | 'resolved' | 'unresolved',
        tag: tagFilter !== 'all' ? tagFilter : undefined,
        page,
        limit: perPage,
      });

      console.log('Raw response from backend:', response);

      setReports(response.reports ?? []);

      // Wire pagination info if available from the backend
      const pagination = response.pagination ?? {};
      setCurrentPage(pagination.current_page ?? pagination.page ?? page);
      setTotalPages(pagination.total_pages ?? pagination.totalPages ?? 1);
      setPerPage(pagination.per_page ?? pagination.perPage ?? perPage);
      setTotalRecords(pagination.total_records ?? pagination.totalRecords ?? pagination.total ?? 0);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const doesReportMatchFilters = (report: Report, searchQuery: string, statusFilter: string, tagFilter: string): boolean => {
    const reasons = Array.isArray(report.reason) ? report.reason : [];

    const matchesSearch =
      searchQuery === '' ||
      (report.report_id ?? '').toString().includes(searchQuery) ||
      (report.user_id ?? '').toString().includes(searchQuery) ||
      (report.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'resolved' && report.is_resolved) ||
      (statusFilter === 'unresolved' && !report.is_resolved);

    const matchesTag =
      tagFilter === 'all' ||
      reasons.some((r) => (r?.report_tag?.key ?? r?.report_tag ?? '').toString() === tagFilter);

    return matchesSearch && matchesStatus && matchesTag;
  };

  // If parent passed initialReports, use them and skip internal fetching.
  useEffect(() => {
    if (initialReports) {
      setReports(initialReports);
      setIsLoading(initialLoading ?? false);
      // When parent provides initial reports we skip internal pagination.
      return;
    }

    // fetch the current page
    fetchReports(currentPage);
  }, [searchQuery, statusFilter, tagFilter, initialReports, initialLoading, currentPage]);

  // When filters change, reset to page 1
  useEffect(() => {
    if (initialReports) return; // parent-controlled
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter, initialReports]);

  // Set currentPage from initialPagination if provided
  useEffect(() => {
    if (initialPagination?.current_page) {
      setCurrentPage(initialPagination.current_page);
    }
  }, [initialPagination]);

  // Filter reports based on search and filters
  const filteredReports = initialPagination
    ? (initialReports || [])
    : reports.filter((report) => doesReportMatchFilters(report, searchQuery, statusFilter, tagFilter));

  const getEffectivePagination = () => {
    const effectiveTotalRecords = initialPagination
      ? initialPagination.total_records ?? 0
      : initialReports && Array.isArray(initialReports)
      ? filteredReports.length
      : totalRecords;
    const effectiveTotalPages = initialPagination
      ? initialPagination.total_pages ?? 1
      : initialReports && Array.isArray(initialReports)
      ? Math.max(1, Math.ceil(effectiveTotalRecords / perPage))
      : totalPages;
    return { effectiveTotalRecords, effectiveTotalPages };
  };

  const { effectiveTotalRecords, effectiveTotalPages } = getEffectivePagination();

  // Ensure currentPage is within range for client-side pagination
  if (currentPage > effectiveTotalPages) {
    setCurrentPage(effectiveTotalPages);
  }

  const displayedReports = initialPagination
    ? filteredReports
    : initialReports && Array.isArray(initialReports)
    ? filteredReports.slice((currentPage - 1) * perPage, currentPage * perPage)
    : filteredReports;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const applyOptimisticUpdate = (reportId: number, toggled: boolean) => {
    const updatedReports = reports.map((r) => (r.report_id === reportId ? { ...r, is_resolved: toggled } : r));
    setReports(updatedReports);
    if (selectedReport && selectedReport.report_id === reportId) {
      setSelectedReport({ ...selectedReport, is_resolved: toggled });
    }
  };

  const revertOptimisticUpdate = (reportId: number, originalResolved: boolean) => {
    const reverted = reports.map((r) => (r.report_id === reportId ? { ...r, is_resolved: originalResolved } : r));
    setReports(reverted);
    if (selectedReport && selectedReport.report_id === reportId) {
      setSelectedReport({ ...selectedReport, is_resolved: originalResolved });
    }
  };

  const toggleResolved = async (reportId: number) => {
    try {
      const report = reports.find((r) => r.report_id === reportId);
      if (!report) return;

      // Optimistic update
      const toggled = !report.is_resolved;
      applyOptimisticUpdate(reportId, toggled);

      // Persist to backend using PUT /api/v2/reports/:id
      const res = await reportService.updateReport(reportId, { is_resolved: toggled });
      if (!res || res.success === false) {
        // Revert optimistic update on failure
        revertOptimisticUpdate(reportId, report.is_resolved);
        console.error('Failed to persist report status update', res?.message ?? res);
        alert('Failed to update report status. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
      // Optionally show error toast/notification
      alert('Failed to update report status. Please try again.');
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > effectiveTotalPages || page === currentPage) return;
    if (initialPagination) {
      onPageChange?.(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  return (
    <>
    <div className="rounded-3xl border border-orange-500/20 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-orange-500/20 hover:bg-gray-800/40">
              <TableHead className="text-orange-300">ID</TableHead>
              <TableHead className="text-orange-300">User ID</TableHead>
              <TableHead className="text-orange-300">Tags</TableHead>
              <TableHead className="text-orange-300">Title & Description</TableHead>
              <TableHead className="text-orange-300">Status</TableHead>
              <TableHead className="text-orange-300">Created</TableHead>
              <TableHead className="text-orange-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-300">
                    <div className="w-5 h-5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                    Loading reports...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-red-400">
                    <AlertCircle className="w-6 h-6" />
                    <p>{error}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="mt-2 border-orange-600/50 bg-orange-950/30 text-orange-100 hover:bg-orange-900/40"
                    >
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-orange-200/60">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              displayedReports.map((report) => (
                <TableRow
                  key={report.report_id}
                  className="border-orange-500/10 hover:bg-gray-800/30 transition-colors"
                >
                  <TableCell className="text-orange-400 font-semibold">#{report.report_id}</TableCell>
                  <TableCell className="text-orange-200/80">{report.user_id}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(Array.isArray(report.reason) ? report.reason : []).map((r) => (
                        <Badge
                          key={r.id}
                          variant="outline"
                          className="bg-gray-800/60 text-orange-200 border-gray-600"
                        >
                          <span className="mr-1">{r.report_tag.emoji}</span>
                          {r.report_tag.label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="text-white text-sm mb-1 font-medium">{report.title}</div>
                      <div className="text-orange-200/60 text-xs line-clamp-2">{report.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.is_resolved ? (
                      <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-950/30 text-orange-400 border-orange-900/50">
                        Unresolved
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-orange-200/80 text-sm">{formatDate(report.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-orange-300 hover:text-orange-100 hover:bg-gray-800/60"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-gray-900 border-gray-700">
                        <DropdownMenuItem 
                          onClick={() => handleViewDetails(report)}
                          className="text-orange-200 focus:bg-gray-800 focus:text-orange-100"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.is_resolved ? (
                          <DropdownMenuItem
                            onClick={() => toggleResolved(report.report_id)}
                            className="text-orange-400 focus:bg-gray-800 focus:text-orange-300"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Mark Unresolved
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => toggleResolved(report.report_id)}
                            className="text-green-400 focus:bg-gray-800 focus:text-green-300"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination bar */}
        {effectiveTotalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-orange-500/10 bg-gray-900/40">
            <div className="text-sm text-orange-200/70">
              {effectiveTotalRecords > 0 ? (
                <>
                  Showing {(currentPage - 1) * perPage + 1} - {Math.min(effectiveTotalRecords, currentPage * perPage)} of {effectiveTotalRecords}
                </>
              ) : (
                <>No results</>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className={`px-3 py-1 rounded-md text-sm ${currentPage <= 1 || isLoading ? 'text-gray-500 bg-gray-800/20' : 'text-orange-200 bg-gray-800/60 hover:bg-gray-800/80'}`}>
                Prev
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages: number[] = [];
                  let start = Math.max(1, currentPage - 2);
                  let end = Math.min(effectiveTotalPages, start + 4);
                  if (end - start < 4) start = Math.max(1, end - 4);
                  for (let p = start; p <= end; p++) pages.push(p);
                  return pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      disabled={isLoading}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-sm ${p === currentPage ? 'bg-orange-500 text-black font-semibold' : 'bg-gray-800/60 text-orange-200 hover:bg-gray-800/80'}`}>
                      {p}
                    </button>
                  ));
                })()}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= effectiveTotalPages || isLoading}
                className={`px-3 py-1 rounded-md text-sm ${currentPage >= effectiveTotalPages || isLoading ? 'text-gray-500 bg-gray-800/20' : 'text-orange-200 bg-gray-800/60 hover:bg-gray-800/80'}`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Report Detail Dialog */}
    <IssueDetailDialog
      report={selectedReport}
      isOpen={isDetailOpen}
      onOpenChange={setIsDetailOpen}
      onToggleResolved={toggleResolved}
    />
    </>
  );
}
