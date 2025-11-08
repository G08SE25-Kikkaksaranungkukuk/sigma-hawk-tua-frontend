'use client';

import { useState } from 'react';
import { ReportedIssuesTable } from './ReportedIssuesTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NotFound from '@/app/not-found';
import { tokenService } from '@/lib/services/user/tokenService';
import { reportService as reportClientService } from '@/lib/services/report';
import { reportService as adminReportService } from '@/lib/services/admin/reportService';

export default function App() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = checking

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [reportTags, setReportTags] = useState<any[]>([]);
  const [reports, setReports] = useState<any[] | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  useEffect(() => {
    // First, check authorization. If isAuthorized is null we are still checking.
  const checkAuthAndFetch = async () => {
      // If we've already checked and found not authorized, skip.
      if (isAuthorized === false) return;

      const controller = new AbortController();
      const fetchReports = async (canonicalTags: any[] = []) => {
        try {
          setIsLoadingReports(true);
          setReportsError(null);
          // Use the adminReportService which wraps apiClient and respects NEXT_PUBLIC_BASE_API_URL
          const params: any = {};
          if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
          if (tagFilter && tagFilter !== 'all') params.tag = tagFilter;
          if (searchQuery) params.search = searchQuery;

          const response = await adminReportService.getReports(params as any);
          const json = { data: { reports: response.reports ?? [] }, pagination: response.pagination };
        // Build lookup by key and label using canonicalTags (passed in) or fallback to state
        let reasonsMap: Record<string, any> = {};
        try {
          const rawTags: any[] = Array.isArray(canonicalTags) && canonicalTags.length ? canonicalTags : reportTags;
          (rawTags || []).forEach((t) => {
            if (!t) return;
            const key = t.key ?? t.label ?? String(t.id ?? '');
            if (key) reasonsMap[String(key).toUpperCase()] = t;
            if (t.label) reasonsMap[String(t.label).toUpperCase()] = t;
          });
        } catch (err) {
          console.warn('Failed to build report reasons map', err);
        }

  // Backend may return several shapes. Normalize to an array of report objects.
  const anyJson: any = json as any;
  let rawReports: any[] = [];
  if (Array.isArray(anyJson?.data?.reports)) rawReports = anyJson.data.reports;
  else if (Array.isArray(anyJson?.reports)) rawReports = anyJson.reports;
  else if (Array.isArray(anyJson?.data)) rawReports = anyJson.data;
  else if (Array.isArray(anyJson)) rawReports = anyJson;

        // Map backend report items into the Report type expected by the table.
        const mapped = rawReports.map((r: any) => {
          // normalize common id fields
          const reportId = r.report_id ?? r.id ?? r.reportId;
          const userId = r.user_id ?? r.userId ?? r.user?.id ?? r.user;

          // normalize reason/tags: backend may send [{ emoji, label }] or nested report_reason objects
          let rawReasons = Array.isArray(r.reason)
            ? r.reason
            : Array.isArray(r.reasons)
            ? r.reasons
            : [];

          // Some backend responses embed a single report_tag on the report object
          // instead of an array under `reason`/`reasons`. Normalize that shape.
          if ((!rawReasons || rawReasons.length === 0) && (r.report_tag || r.reportTag || r.reportTagId || r.report_tag_id)) {
            const embedded = r.report_tag ?? r.reportTag ?? undefined;
            if (embedded) rawReasons = [ { report_tag: embedded } ];
            else if (r.reportTagId || r.report_tag_id) {
              // minimal placeholder when only id is present
              rawReasons = [ { report_tag: { id: r.reportTagId ?? r.report_tag_id, key: String(r.reportTagId ?? r.report_tag_id), label: String(r.reportTagId ?? r.report_tag_id) } } ];
            }
          }

          const reasonArr = rawReasons.map((rr: any, idx: number) => {
            // If already has report_tag shape, normalize and use it
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

            // Try to match rr to a canonical tag from reasonsMap (by label or key)
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

            // Fallback: construct a lightweight report_reason with embedded report_tag from rr
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
          });

          return {
            report_id: reportId,
            user_id: userId,
            title: r.title ?? r.subject ?? r.name,
            description: r.description ?? r.body ?? r.details,
            created_at: r.created_at ?? r.createdAt ?? r.created,
            is_resolved: !!(r.is_resolved ?? r.isResolved ?? r.resolved),
            reason: reasonArr,
          };
        });

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
      // Only fetch reports if we have confirmed admin access
      if (isAuthorized === null) {
        // check token role quickly before fetching
        try {
          const token = await tokenService.getAuthToken();
          if (!token) {
            setIsAuthorized(false);
            // don't redirect; we'll render the app's NotFound component on the client
            return;
          }
          const payload = decodeJwtPayload(token);
          const role = payload?.role ?? payload?.roles ?? payload?.isAdmin ?? payload?.is_admin;
          const adminDetected = (typeof role === 'string' && role.toUpperCase() === 'ADMIN') || role === true;
          if (!adminDetected) {
            setIsAuthorized(false);
            // don't redirect; we'll render the app's NotFound component on the client
            return;
          }
          setIsAuthorized(true);
          // fetch canonical report tags from backend
          try {
            let canonical: any[] = [];
            try {
              const tagsRes = await reportClientService.getReasons();
              canonical = (tagsRes?.reasons ?? []).map((t: any) => ({
                ...t,
                emoji: decodeEmojiString(t?.emoji ?? ''),
              }));
            } catch (err) {
              console.warn('reportService.getReasons() failed', err);
            }

            // Fallback: if no tags returned, try direct fetch to backend base URL
            if (!canonical || canonical.length === 0) {
              try {
                const baseUrl = (process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
                const token = await tokenService.getAuthToken();
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                if (token) headers.Authorization = `Bearer ${token}`;
                const reasonsRes = await fetch(`${baseUrl}/api/v2/reports/reasons`, { headers });
                    if (reasonsRes.ok) {
                      const reasonsJson = await reasonsRes.json();
                      canonical = Array.isArray(reasonsJson?.data?.reasons)
                        ? reasonsJson.data.reasons
                        : Array.isArray(reasonsJson?.reasons)
                        ? reasonsJson.reasons
                        : Array.isArray(reasonsJson?.data)
                        ? reasonsJson.data
                        : Array.isArray(reasonsJson)
                        ? reasonsJson
                        : [];
                      // decode emoji fields if they are escaped sequences
                      canonical = canonical.map((t: any) => ({
                        ...t,
                        emoji: decodeEmojiString(t?.emoji ?? ''),
                      }));
                    }
              } catch (err) {
                console.warn('Direct fetch fallback for report tags failed', err);
              }
            }

            setReportTags(canonical);
            // now actually fetch reports with canonical tags
            await fetchReports(canonical);
          } catch (err) {
            // if tags fetch fails, still attempt to fetch reports without canonical tags
            console.warn('Failed to load canonical report tags, continuing without them', err);
            await fetchReports([]);
          }
        } catch (e) {
          console.error('Auth check failed', e);
          setIsAuthorized(false);
          // on error we'll render NotFound instead of redirecting
        }
      } else if (isAuthorized === true) {
        // authorized and can fetch
        await fetchReports();
      }

      return () => controller.abort();
    };

    checkAuthAndFetch();
    // Only re-run when authorization status changes
  }, [isAuthorized, router]);

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
        />
      </div>
    </div>
  );
}
