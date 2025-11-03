'use client';

import { useState } from 'react';
import { ReportedIssuesTable } from '@/components/admin/ReportedIssuesTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useEffect } from 'react';
import { tokenService } from '@/lib/services/user/tokenService';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchReports = async () => {
      try {
        setIsLoadingReports(true);
        setReportsError(null);
        const token = await tokenService.getAuthToken();
        if (!token) {
          throw new Error('Not authenticated: access token missing');
        }

        const res = await fetch('http://localhost:8080/api/v2/reports', {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();

        // Expecting shape { success, data: { reports: [...] } }
        const rawReports = json?.data?.reports ?? [];

        // Map backend report items into the Report type expected by the table.
        // The backend example doesn't include `reason`/tags, so default to empty array.
        const mapped = rawReports.map((r: any) => ({
          report_id: r.report_id,
          user_id: r.user_id,
          title: r.title,
          description: r.description,
          created_at: r.created_at,
          is_resolved: !!r.is_resolved,
          reason: r.reason ?? [],
        }));

        setReports(mapped);
      } catch (err) {
        if ((err as any).name === 'AbortError') return;
        console.error('Failed to fetch reports', err);
        setReportsError(err instanceof Error ? err.message : 'Failed to fetch reports');
        setReports([]);
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b0f]">

      {/* Main content */}
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Admin Dashboard</h1>
          <p className="text-orange-200/80">Manage and resolve reported issues</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by ID, user ID, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-orange-300" />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white focus:border-[#ff6600] focus:ring-[#ff6600]/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[180px] bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white focus:border-[#ff6600] focus:ring-[#ff6600]/30">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="BUG">🐛 Bug/Error</SelectItem>
                <SelectItem value="PERFORMANCE">⚡ Performance</SelectItem>
                <SelectItem value="UI_UX">🎨 UI/UX</SelectItem>
                <SelectItem value="DATA_LOSS">💾 Data Loss</SelectItem>
                <SelectItem value="LOGIN_AUTH">🔐 Login/Auth</SelectItem>
                <SelectItem value="NETWORK">📡 Network</SelectItem>
                <SelectItem value="FEATURE_REQUEST">✨ Feature Request</SelectItem>
                <SelectItem value="OTHER">❓ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <ReportedIssuesTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          initialReports={reports ?? undefined}
          initialLoading={isLoadingReports}
        />
      </div>
    </div>
  );
}
