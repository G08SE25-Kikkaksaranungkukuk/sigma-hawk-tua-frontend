"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search } from 'lucide-react';
import BlogList from '@/components/blog/BlogList';
import { FloatingElements } from '@/components/shared';

export default function BlogSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({ travel: true, tips: true, news: true });

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
  const handleSearch = () => {
    const activeFilters = Object.keys(filters).filter((k) => filters[k]);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sortBy) params.set('sort', sortBy);
    if (activeFilters.length) params.set('filters', activeFilters.join(','));

    router.push(`/blog/search?${params.toString()}`);
  };

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

        {/* Results (placeholder) */}
        <div className="max-w-3xl mx-auto">
          {/* For now show BlogList as placeholder for results; wire to real results later */}
          <BlogList />
        </div>
      </main>
    </div>
  );
}
