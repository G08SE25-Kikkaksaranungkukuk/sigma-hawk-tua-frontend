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
  searchQuery: string;
  statusFilter: string;
  tagFilter: string;
  // Optional pre-fetched reports (when the parent fetches them)
  initialReports?: Report[];
  initialLoading?: boolean;
}

export function ReportedIssuesTable({
  searchQuery,
  statusFilter,
  tagFilter,
  initialReports,
  initialLoading,
}: ReportedIssuesTableProps) {
  const [reports, setReports] = useState<Report[]>(initialReports ?? []);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading ?? true);
  const [error, setError] = useState<string | null>(null);

  // If parent passed initialReports, use them and skip internal fetching.
  useEffect(() => {
    if (initialReports) {
      setReports(initialReports);
      setIsLoading(initialLoading ?? false);
      return;
    }

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await reportService.getReports({
          search: searchQuery || undefined,
          status: statusFilter as 'all' | 'resolved' | 'unresolved',
          tag: tagFilter !== 'all' ? tagFilter : undefined,
        });
        setReports(response.reports);
        setReports([]);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [searchQuery, statusFilter, tagFilter, initialReports, initialLoading]);

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchQuery === '' ||
      report.report_id.toString().includes(searchQuery) ||
      report.user_id.toString().includes(searchQuery) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'resolved' && report.is_resolved) ||
      (statusFilter === 'unresolved' && !report.is_resolved);

    const matchesTag =
      tagFilter === 'all' ||
      report.reason.some((r) => r.report_tag.key === tagFilter);

    return matchesSearch && matchesStatus && matchesTag;
  });

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

  const toggleResolved = async (reportId: number) => {
    try {
      const report = reports.find((r) => r.report_id === reportId);
      if (!report) return;

      // TODO: Uncomment when API is ready
      // const updatedReport = await reportService.updateReportStatus(reportId, {
      //   is_resolved: !report.is_resolved,
      // });
      
      // Optimistic update
      const updatedReports = reports.map((r) =>
        r.report_id === reportId
          ? { ...r, is_resolved: !r.is_resolved }
          : r
      );
      setReports(updatedReports);
      
      // Update selected report if it's the one being toggled
      if (selectedReport && selectedReport.report_id === reportId) {
        setSelectedReport({ ...selectedReport, is_resolved: !selectedReport.is_resolved });
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
      // Optionally show error toast/notification
      alert('Failed to update report status. Please try again.');
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  return (
    <>
    <div className="rounded-3xl border border-orange-500/20 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Stats bar */}
      <div className="border-b border-orange-500/20 px-6 py-4 bg-gray-900/40">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-orange-200/60">Total: </span>
            <span className="text-orange-100 font-semibold">{filteredReports.length}</span>
          </div>
          <div className="h-4 w-px bg-orange-500/20"></div>
          <div>
            <span className="text-orange-200/60">Unresolved: </span>
            <span className="text-orange-400 font-semibold">{filteredReports.filter((r) => !r.is_resolved).length}</span>
          </div>
          <div className="h-4 w-px bg-orange-500/20"></div>
          <div>
            <span className="text-orange-200/60">Resolved: </span>
            <span className="text-green-400 font-semibold">{filteredReports.filter((r) => r.is_resolved).length}</span>
          </div>
        </div>
      </div>

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
              filteredReports.map((report) => (
                <TableRow
                  key={report.report_id}
                  className="border-orange-500/10 hover:bg-gray-800/30 transition-colors"
                >
                  <TableCell className="text-orange-400 font-semibold">#{report.report_id}</TableCell>
                  <TableCell className="text-orange-200/80">{report.user_id}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {report.reason.map((r) => (
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
