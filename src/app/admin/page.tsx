'use client';

import { useState } from 'react';
import { ReportedIssuesTable } from './ReportedIssuesTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NotFound from '@/app/not-found';
import { tokenService } from '@/lib/services/user/tokenService';
import { reportService as reportClientService } from '@/lib/services/report';
import { reportService as adminReportService } from '@/lib/services/admin/reportService';
import { APP_CONFIG } from '@/config/shared/app';

const decodeJwtPayload = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64 decode (handle base64url)
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    const decoded = atob(payload);
    // percent-decode to support utf-8 characters
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to decode token payload', e);
    return null;
  }
};

// Decode escaped unicode sequences like "\\uD83D\\uDCBE" into real emoji characters
const decodeEmojiString = (s: any): string => {
  if (!s && s !== 0) return '';
  if (typeof s !== 'string') return String(s);
  try {
    // If string contains literal backslash-u sequences, JSON.parse will decode them
    if (/\\u[0-9a-fA-F]{4}/.test(s)) {
      return JSON.parse('"' + s.replace(/"/g, '\\"') + '"');
    }
  } catch (e) {
    // ignore and fallback
  }
  return s;
};

const isAdminUser = (payload: any): boolean => {
  const role = payload?.role ?? payload?.roles ?? payload?.isAdmin ?? payload?.is_admin;
  return (typeof role === 'string' && role.toUpperCase() === 'ADMIN') || role === true;
};

const getNormalizedReasons = (json: any): any[] => {
  if (Array.isArray(json?.data?.reasons)) return json.data.reasons;
  if (Array.isArray(json?.reasons)) return json.reasons;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  return [];
};

const buildReasonsMap = (rawTags: any[]): Record<string, any> => {
  const reasonsMap: Record<string, any> = {};
  (rawTags || []).forEach((t) => {
    if (!t) return;
    const key = t.key ?? t.label ?? String(t.id ?? '');
    if (key) reasonsMap[String(key).toUpperCase()] = t;
    if (t.label) reasonsMap[String(t.label).toUpperCase()] = t;
  });
  return reasonsMap;
};

const mapReason = (rr: any, idx: number, reportId: any, reasonsMap: Record<string, any>) => {
  if (rr.report_tag) {
    const existing = rr.report_tag;
    return {
      id: rr.id ?? existing.id ?? idx + 1,
      report_id: reportId,
      report_tag_id: existing.id ?? 0,
      created_at: rr.created_at ?? existing.created_at ?? existing.createdAt ?? undefined,
      report_tag: {
        id: existing.id ?? 0,
        key: existing.key ?? existing.label ?? String(existing.id ?? ''),
        label: existing.label ?? existing.key ?? String(existing.id ?? ''),
        emoji: decodeEmojiString(existing.emoji ?? ''),
        description: existing.description ?? existing.desc ?? undefined,
      },
    };
  }

  const lookupKey = (rr.label ?? rr.key ?? rr.report_tag?.label ?? String(rr)).toString().toUpperCase();
  const matchedTag = reasonsMap[lookupKey];

  if (matchedTag) {
    return {
      id: rr.id ?? matchedTag.id ?? idx + 1,
      report_id: reportId,
      report_tag_id: matchedTag.id ?? 0,
      created_at: rr.created_at ?? rr.createdAt ?? undefined,
      report_tag: {
        id: matchedTag.id ?? 0,
        key: matchedTag.key ?? matchedTag.label ?? String(matchedTag.id ?? ''),
        label: matchedTag.label ?? matchedTag.key ?? String(matchedTag.id ?? ''),
        emoji: decodeEmojiString(matchedTag.emoji ?? (rr.emoji ?? '')),
        description: matchedTag.description ?? rr.description ?? undefined,
      },
    };
  }

  const tagLabel = rr.label ?? rr.key ?? rr.report_tag?.label ?? String(rr);
  const tagEmoji = rr.emoji ?? rr.report_tag?.emoji ?? '';

  return {
    id: rr.id ?? idx + 1,
    report_id: reportId,
    report_tag_id: 0,
    created_at: rr.created_at ?? rr.createdAt ?? undefined,
    report_tag: {
      id: 0,
      key: tagLabel,
      label: tagLabel,
      emoji: tagEmoji,
      description: rr.description ?? undefined,
    },
  };
};

const mapReport = (r: any, reasonsMap: Record<string, any>, canonicalTags: any[]): any => {
  const reportId = r.report_id ?? r.id ?? r.reportId;
  const userId = r.user_id ?? r.userId ?? r.user?.id ?? r.user;

  let rawReasons = Array.isArray(r.reason)
    ? r.reason
    : Array.isArray(r.reasons)
    ? r.reasons
    : [];

  if ((!rawReasons || rawReasons.length === 0) && (r.report_tag || r.reportTag || r.reportTagId || r.report_tag_id)) {
    const embedded = r.report_tag ?? r.reportTag ?? undefined;
    if (embedded) rawReasons = [{ report_tag: embedded }];
    else if (r.reportTagId || r.report_tag_id) {
      rawReasons = [{ report_tag: { id: r.reportTagId ?? r.report_tag_id, key: String(r.reportTagId ?? r.report_tag_id), label: String(r.reportTagId ?? r.report_tag_id) } }];
    }
  }

  const reasonArr = rawReasons.map((rr: any, idx: number) => mapReason(rr, idx, reportId, reasonsMap));

  return {
    report_id: reportId,
    user_id: userId,
    title: r.title ?? r.subject ?? r.name,
    description: r.description ?? r.body ?? r.details,
    created_at: r.created_at ?? r.createdAt ?? r.created,
    is_resolved: !!(r.is_resolved ?? r.isResolved ?? r.resolved),
    reason: reasonArr,
  };
};

const normalizeReports = (response: any): any[] => {
  const anyJson: any = { data: { reports: response.reports ?? [] }, pagination: response.pagination };
  if (Array.isArray(anyJson?.data?.reports)) return anyJson.data.reports;
  if (Array.isArray(anyJson?.reports)) return anyJson.reports;
  if (Array.isArray(anyJson?.data)) return anyJson.data;
  if (Array.isArray(anyJson)) return anyJson;
  return [];
};

export default function App() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = checking
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [reportTags, setReportTags] = useState<any[]>([]);
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCanonicalTags = async (): Promise<any[]> => {
    try {
      const tagsRes = await reportClientService.getReasons();
      return (tagsRes?.reasons ?? []).map((t: any) => ({
        ...t,
        emoji: decodeEmojiString(t?.emoji ?? ''),
      }));
    } catch (err) {
      console.warn('reportService.getReasons() failed', err);
      return [];
    }
  };

  const fetchCanonicalTagsFallback = async (): Promise<any[]> => {
    try {
      const baseUrl = APP_CONFIG.BASE_API_URL.replace(/\/$/, '');
      const token = await tokenService.getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const reasonsRes = await fetch(`${baseUrl}/api/v2/reports/reasons`, { headers });
      if (reasonsRes.ok) {
        const reasonsJson = await reasonsRes.json();
        const canonical = getNormalizedReasons(reasonsJson);
        return canonical.map((t: any) => ({
          ...t,
          emoji: decodeEmojiString(t?.emoji ?? ''),
        }));
      }
    } catch (err) {
      console.warn('Direct fetch fallback for report tags failed', err);
    }
    return [];
  };

  const buildParams = () => {
    const params: any = { page: currentPage, limit: 10 };
    if (statusFilter && statusFilter !== 'all') {
      params.is_resolved = statusFilter === 'resolved';
    }
    if (tagFilter && tagFilter !== 'all') params.reason = tagFilter;
    if (searchQuery) {
      const num = parseInt(searchQuery);
      if (!isNaN(num)) {
        params.id = num;
      } else {
        params.title = searchQuery;
      }
    }
    return params;
  };

  const normalizeReports = (response: any): any[] => {
    const anyJson: any = { data: { reports: response.reports ?? [] }, pagination: response.pagination };
    if (Array.isArray(anyJson?.data?.reports)) return anyJson.data.reports;
    if (Array.isArray(anyJson?.reports)) return anyJson.reports;
    if (Array.isArray(anyJson?.data)) return anyJson.data;
    if (Array.isArray(anyJson)) return anyJson;
    return [];
  };

  const fetchReports = async (canonicalTags: any[] = []) => {
    try {
      setIsLoadingReports(true);
      setReportsError(null);

      const params = buildParams();
      const response = await adminReportService.getReports(params as any);
      console.log('Raw response from backend in admin page:', response);

      const reasonsMap = buildReasonsMap(canonicalTags.length ? canonicalTags : reportTags);
      const rawReports = normalizeReports(response);
      const mapped = rawReports.map((r: any) => mapReport(r, reasonsMap, canonicalTags));

      setReports(mapped);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      setReportsError(err instanceof Error ? err.message : 'Failed to fetch reports');
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const checkAuthAndFetch = async () => {
    if (isAuthorized === false) return;

    if (isAuthorized === null) {
      try {
        const token = await tokenService.getAuthToken();
        if (!token) {
          setIsAuthorized(false);
          return;
        }
        const payload = decodeJwtPayload(token);
        if (!isAdminUser(payload)) {
          setIsAuthorized(false);
          return;
        }
        setIsAuthorized(true);

        let canonical = await fetchCanonicalTags();
        if (!canonical || canonical.length === 0) {
          canonical = await fetchCanonicalTagsFallback();
        }
        setReportTags(canonical);
        await fetchReports(canonical);
      } catch (e) {
        console.error('Auth check failed', e);
        setIsAuthorized(false);
      }
    } else if (isAuthorized === true) {
      await fetchReports();
    }
  };

  useEffect(() => {
    // First, check authorization. If isAuthorized is null we are still checking.
    checkAuthAndFetch();
    // Only re-run when authorization status changes, page changes, or search is triggered
  }, [isAuthorized, router, currentPage, isSearching]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter]);

  const handleSearch = () => {
    setIsSearching(prev => !prev);
  };

  // While we are checking authorization, show a small loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <p className="text-orange-200/90">Checking admin access...</p>
      </div>
    );
  }

  // If not authorized, render the app's NotFound component
  if (isAuthorized === false) return <NotFound />;

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
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by ID, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoadingReports}
              className="bg-[#ff6600] hover:bg-[#ff6600]/80 text-white"
            >
              {isLoadingReports ? 'Searching...' : 'Search'}
            </Button>
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
                {reportTags && reportTags.length > 0
                  ? reportTags.map((tag) => (
                      <SelectItem key={tag.id ?? tag.key} value={tag.key ?? String(tag.id)}>
                        {(tag.emoji ? `${tag.emoji} ` : '') + (tag.label ?? tag.key)}
                      </SelectItem>
                    ))
                  : null}
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
          initialPagination={pagination}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
