"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            p === currentPage
              ? "bg-orange-500 text-black"
              : "bg-slate-800 text-gray-300 hover:bg-slate-700"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
