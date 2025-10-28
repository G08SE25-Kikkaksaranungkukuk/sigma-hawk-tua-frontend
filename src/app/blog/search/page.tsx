"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Search, Filter, ChevronDown, ChevronUp, HeartIcon } from "lucide-react"
import { apiClient } from "@/lib/api"
import { FloatingElements } from "@/components/shared"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

function BlogSearchPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [showFilters, setShowFilters] = useState(true)
    // interest ids are 1-based indexes (mirrors blog create page behavior)
    const [interestIds, setInterestIds] = useState<number[]>([])
    const [results, setResults] = useState<
        Array<{
            blog_id: string
            title: string
            description?: string
            created_at?: string
            likes?: any[]
        }>
    >([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Prefill from URL params on mount / when params change
    useEffect(() => {
        const keyword = searchParams.get("keyword") ?? ""
        const sort = searchParams.get("sort_by") ?? "newest"
        const interestsParam = searchParams.get("interest_id") ?? ""

        setQuery(keyword)
        setSortBy(sort)

        const activeInterests = interestsParam
            .split(",")
            .filter(Boolean)
            .map((s) => Number(s))
        setInterestIds(activeInterests || [])
    }, [searchParams])

    const toggleInterest = (id: number) => {
        setInterestIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )
    }

    // Navigate to the same page with updated params (idempotent)
    const handleSearch = async () => {
        const params = new URLSearchParams()
        if (query) params.set("keyword", query)
        if (sortBy) params.set("sort_by", sortBy)
        if (interestIds.length) params.set("interest_id", interestIds.join(","))

        const url = `/blog/search?${params.toString()}`
        router.push(url)

        // Also fetch results immediately so UI updates without waiting for navigation
        await fetchResults({
            keyword: query,
            sort_by: sortBy,
            interest_id: interestIds,
        })
    }

    const fetchResults = async (opts?: {
        keyword?: string
        sort_by?: string
        interest_id?: number[]
    }) => {
        const keyword = opts?.keyword ?? searchParams.get("keyword") ?? ""
        const sort = opts?.sort_by ?? searchParams.get("sort_by") ?? "newest"
        const interestsParam = opts?.interest_id
            ? opts.interest_id
            : searchParams.get("interest_id")
            ? searchParams
                  .get("interest_id")!
                  .split(",")
                  .filter(Boolean)
                  .map(Number)
            : []

        setLoading(true)
        setError(null)
        try {
            const params: any = {}
            if (keyword) params.keyword = keyword
            if (sort) params.sort_by = sort
            if (interestsParam && interestsParam.length)
                params.interest_id = Array.isArray(interestsParam)
                    ? interestsParam.join(",")
                    : interestsParam

            const { data } = await apiClient.get(`/api/v1/blog/search`, {
                params,
            })
            setResults((data as any) || [])
        } catch (err: any) {
            setError(err?.message || "Failed to fetch results")
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Fetch when URL params change so direct links/bookmarks work
        fetchResults().catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

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

                        <div className="flex items-center gap-2">
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

                            {/* Move sort select to after the search button */}
                            <div className="w-44">
                                <Select
                                    value={sortBy}
                                    onValueChange={async (val) => {
                                        setSortBy(val)
                                        // Automatically trigger search when sort changes
                                        const params = new URLSearchParams()
                                        if (query) params.set("keyword", query)
                                        params.set("sort_by", val)
                                        if (interestIds.length)
                                            params.set(
                                                "interest_id",
                                                interestIds.join(",")
                                            )

                                        const url = `/blog/search?${params.toString()}`
                                        router.push(url)
                                        await fetchResults({
                                            keyword: query,
                                            sort_by: val,
                                            interest_id: interestIds,
                                        })
                                    }}
                                >
                                    <SelectTrigger className="h-10 bg-gray-800/80 border-orange-500/30 hover:border-orange-500 text-white hover:bg-gray-700/80 transition-all">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-orange-500/30 text-white">
                                        <SelectItem
                                            value="newest"
                                            className="hover:bg-orange-500/20 focus:bg-orange-500/20 cursor-pointer"
                                        >
                                            Newest
                                        </SelectItem>
                                        <SelectItem
                                            value="oldest"
                                            className="hover:bg-orange-500/20 focus:bg-orange-500/20 cursor-pointer"
                                        >
                                            Oldest
                                        </SelectItem>
                                        <SelectItem
                                            value="most_like"
                                            className="hover:bg-orange-500/20 focus:bg-orange-500/20 cursor-pointer"
                                        >
                                            Most liked
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters((s) => !s)}
                                className="h-10 px-2"
                                aria-expanded={showFilters}
                                aria-controls="blog-search-filters"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                <span className="text-sm">Filters</span>
                                <span className="ml-2">
                                    {showFilters ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters panel (hidden by default) */}
                <div className="max-w-3xl mx-auto mb-4">
                    <div
                        id="blog-search-filters"
                        className={`mt-4 p-4 border border-white/10 rounded-md bg-white/5 transition-all w-full ${
                            showFilters ? "block" : "hidden"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="text-sm text-gray-300">
                                    Choose interests to filter results
                                </div>
                            </div>
                            <div className="ml-4">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setInterestIds([])
                                        setSortBy("newest")
                                    }}
                                    variant="outline"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 1, label: "🌊 Sea" },
                                { id: 2, label: "⛰️ Mountain" },
                                { id: 3, label: "💧 Waterfall" },
                                { id: 4, label: "🏞️ National Park" },
                                { id: 5, label: "🏝️ Island" },
                                { id: 6, label: "🙏 Temple" },
                                { id: 7, label: "🛍️ Shopping Mall" },
                                { id: 8, label: "🏪 Market" },
                                { id: 9, label: "☕ Cafe" },
                                { id: 10, label: "🏛️ Historical" },
                                { id: 11, label: "🎢 Amusement Park" },
                                { id: 12, label: "🦁 Zoo" },
                                { id: 13, label: "🎉 Festival" },
                                { id: 14, label: "🏛️ Museum" },
                                { id: 15, label: "🍴 Food Street" },
                                { id: 16, label: "🍹 Beach Bar" },
                                { id: 17, label: "🎭 Theatre" },
                            ].map((it) => (
                                <button
                                    key={it.id}
                                    type="button"
                                    onClick={async () => {
                                        const newInterestIds =
                                            interestIds.includes(it.id)
                                                ? interestIds.filter(
                                                      (p) => p !== it.id
                                                  )
                                                : [...interestIds, it.id]

                                        setInterestIds(newInterestIds)

                                        // Automatically trigger search when interest changes
                                        const params = new URLSearchParams()
                                        if (query) params.set("keyword", query)
                                        if (sortBy)
                                            params.set("sort_by", sortBy)
                                        if (newInterestIds.length)
                                            params.set(
                                                "interest_id",
                                                newInterestIds.join(",")
                                            )

                                        const url = `/blog/search?${params.toString()}`
                                        router.push(url)
                                        await fetchResults({
                                            keyword: query,
                                            sort_by: sortBy,
                                            interest_id: newInterestIds,
                                        })
                                    }}
                                    className="px-2 py-1 rounded-full border-2 text-xs font-medium transition-all"
                                >
                                    <span
                                        className={`${
                                            interestIds.includes(it.id)
                                                ? "bg-orange-500 text-black border-transparent shadow-lg orange-glow px-2 py-1 rounded-full"
                                                : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 px-2 py-1 rounded-full"
                                        }`}
                                    >
                                        {it.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-3xl mx-auto">
                    {loading && (
                        <div className="text-gray-400">Searching...</div>
                    )}
                    {error && <div className="text-red-400">{error}</div>}
                    {!loading && !error && results.length === 0 && (
                        <div className="text-gray-400">No results found.</div>
                    )}

                    <div className="space-y-4 mt-5">
                        {results.map((b) => (
                            <article
                                key={b.blog_id}
                                className="p-4 bg-slate-900/60 hover:bg-slate-900/80 rounded-md border border-slate-700"
                            >
                                <div
                                    className="flex justify-between items-start"
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget)
                                            router.push(`/blog/${b.blog_id}`)
                                    }}
                                >
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-white">
                                                {b.title}
                                            </h3>
                                            <button
                                                className="gap-1.5 justify-center items-center flex flex-row px-3 py-1.5 rounded-full 
                          bg-gradient-to-r from-rose-500/10 to-orange-500/10 
                          hover:from-rose-500/20 hover:to-orange-500/20
                          border border-rose-500/20 hover:border-rose-500/30
                          text-white text-sm transition-all duration-300 ease-in-out
                          shadow-lg hover:shadow-rose-500/20 group"
                                            >
                                                <HeartIcon
                                                    className="text-rose-400 group-hover:text-rose-300 transition-colors"
                                                    size={16}
                                                />
                                                <span className="text-rose-300/90 group-hover:text-rose-200 text-sm">
                                                    {b.likes?.length || 0}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            {b.created_at
                                                ? new Date(
                                                      b.created_at
                                                  ).toLocaleString()
                                                : ""}
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm text-gray-300 line-clamp-4">
                                    {b.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function BlogSearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 flex items-center justify-center text-orange-300">Loading...</div>}>
            <BlogSearchPageContent />
        </Suspense>
    )
}
