"use client";

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component:
 * - Preserves all query parameters while updating page
 * - Generates accessible page links
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const nextParams = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(page));
    }

    const queryStr = nextParams.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: true });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 pt-8">
      {/* Previous Page */}
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${
          currentPage <= 1
            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
            : 'border-slate-300 dark:border-slate-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 text-slate-700 dark:text-slate-300'
        }`}
      >
        <ChevronLeft size={14} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Number Buttons */}
      {getPageNumbers().map((num, idx) => {
        if (num === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs">
              ...
            </span>
          );
        }

        const isCurrent = num === currentPage;
        return (
          <button
            key={num}
            type="button"
            onClick={() => goToPage(num)}
            className={`min-w-[36px] h-9 px-3 text-xs font-bold rounded-lg border transition-all ${
              isCurrent
                ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600'
            }`}
          >
            {num}
          </button>
        );
      })}

      {/* Next Page */}
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${
          currentPage >= totalPages
            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
            : 'border-slate-300 dark:border-slate-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 text-slate-700 dark:text-slate-300'
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
