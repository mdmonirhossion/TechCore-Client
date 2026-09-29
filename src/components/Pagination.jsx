"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 12
}) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
    // Smooth scroll to top of page/grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers range (e.g. 1 2 3 4 5)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 my-8 shadow-sm">
      
      {/* Items Counter Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-900 dark:text-white">{startItem}</span> to{' '}
        <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> of{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> Products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 font-sans">
        
        {/* First Page Button */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageClick(pageNum)}
            className={`min-w-[36px] h-9 px-2 rounded-lg font-bold text-xs transition-all ${
              pageNum === currentPage
                ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/20 scale-105'
                : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>

      </div>

    </div>
  );
}
