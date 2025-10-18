"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search } from 'lucide-react';
import BlogList from '@/components/blog/BlogList';
import { apiClient } from '@/lib/api';
import { FloatingElements } from '@/components/shared';

export default function BlogSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({ travel: true, tips: true, news: true });
  const [results, setResults] = useState<Array<{ blog_id: string; title: string; description?: string; created_at?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from URL params on mount / when params change
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const sort = searchParams.get('sort') ?? 'newest';
    const filtersParam = searchParams.get('filters') ?? '';

    setQuery(q);
    setSortBy(sort);

    const activeFilters = filtersParam.split(',').filter(Boolean);
    setFilters((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { next[k] = activeFilters.length ? activeFilters.includes(k) : true; });
      return next;
    });
  }, [searchParams]);

  const toggleFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Navigate to the same page with updated params (idempotent)
  const handleSearch = async () => {
    const activeFilters = Object.keys(filters).filter((k) => filters[k]);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sortBy) params.set('sort', sortBy);
    if (activeFilters.length) params.set('filters', activeFilters.join(','));

    const url = `/blog/search?${params.toString()}`;
    router.push(url);

    // Also fetch results immediately so UI updates without waiting for navigation
    await fetchResults({ q: query, sort: sortBy, filters: activeFilters });
  };

  const fetchResults = async (opts?: { q?: string; sort?: string; filters?: string[] }) => {
    const q = opts?.q ?? searchParams.get('q') ?? '';
    const sort = opts?.sort ?? searchParams.get('sort') ?? 'newest';
    const filtersParam = opts?.filters ? opts.filters : (searchParams.get('filters') ? searchParams.get('filters')!.split(',').filter(Boolean) : []);

    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (q) params.q = q;
      if (sort) params.sort = sort;
      if (filtersParam && filtersParam.length) params.filters = Array.isArray(filtersParam) ? filtersParam.join(',') : filtersParam;

      const data = await apiClient.get(`/api/v2/blogs/search`, { params });
      setResults((data as any) || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch when URL params change so direct links/bookmarks work
    fetchResults().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <FloatingElements />

      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-12 pb-12">
        {/* Centered search group */}
        <div className="w-full mb-6">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, tags, or authors..."
              aria-label="Search blog"
              className="!h-10 flex-1"
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="h-10 w-10 p-0"
              aria-label="Execute search"
            >
              <Search className="w-4 h-4" />
            </Button>

              <div className="w-44">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="comments">Most commented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filters under search box */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!filters.travel} onChange={() => toggleFilter('travel')} />
              <span>Travel</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!filters.tips} onChange={() => toggleFilter('tips')} />
              <span>Tips</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!filters.news} onChange={() => toggleFilter('news')} />
              <span>News</span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-3xl mx-auto">
          {loading && <div className="text-gray-400">Searching...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !error && results.length === 0 && <div className="text-gray-400">No results found.</div>}

          <div className="space-y-4 mt-5">
            {results.map((b) => (
              <article key={b.blog_id} className="p-4 bg-slate-900/60 hover:bg-slate-900/80 rounded-md border border-slate-700">
                <div className="flex justify-between items-start" onClick={(e)=>{ if(e.target === e.currentTarget) router.push(`/blog/${b.blog_id}`)}}>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                    <div className="text-sm text-gray-400 mt-1">{b.created_at ? new Date(b.created_at).toLocaleString() : ''}</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-300 line-clamp-4">{b.description}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
