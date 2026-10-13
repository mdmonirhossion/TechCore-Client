"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function DesktopCategoryNav({ tree = [] }) {
  const pathname = usePathname();

  // If tree is empty or invalid, hide the bar gracefully
  if (!Array.isArray(tree) || tree.length === 0) {
    return null;
  }

  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(tree.length);

  // Hover & Active States
  const [activeL1, setActiveL1] = useState(null); // id/fullPath of level-1 item
  const [activeL2, setActiveL2] = useState(null); // id/fullPath of level-2 item
  const [flipLeft, setFlipLeft] = useState(false); // flip level-3 flyout to left if near right edge

  // Timers for hover intent
  const l1OpenTimerRef = useRef(null);
  const l1CloseTimerRef = useRef(null);
  const l2OpenTimerRef = useRef(null);
  const l2CloseTimerRef = useRef(null);

  // Close all open menus
  const closeAll = useCallback(() => {
    if (l1OpenTimerRef.current) clearTimeout(l1OpenTimerRef.current);
    if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
    if (l2OpenTimerRef.current) clearTimeout(l2OpenTimerRef.current);
    if (l2CloseTimerRef.current) clearTimeout(l2CloseTimerRef.current);
    setActiveL1(null);
    setActiveL2(null);
  }, []);

  // Close on route change
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Close on Escape & Close on Scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAll();
      }
    };

    const handleScroll = () => {
      closeAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [closeAll]);

  // Measure container and items to calculate items that fit vs "More" dropdown
  useEffect(() => {
    const calculateOverflow = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      if (containerWidth <= 0) return;

      const itemEls = Array.from(container.querySelectorAll('[data-level1-btn]'));
      if (itemEls.length === 0) return;

      const moreButtonWidth = 85;
      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < itemEls.length; i++) {
        const itemWidth = itemEls[i].offsetWidth || 110;
        // If not the very last item, budget for "More" button
        if (i < tree.length - 1 && totalWidth + itemWidth + moreButtonWidth > containerWidth) {
          break;
        } else if (i === tree.length - 1 && totalWidth + itemWidth > containerWidth) {
          break;
        }
        totalWidth += itemWidth;
        count++;
      }

      setVisibleCount(Math.max(1, count));
    };

    calculateOverflow();

    const resizeObserver = new ResizeObserver(() => {
      calculateOverflow();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [tree]);

  // Check if an item matches the current route
  const isItemActive = (fullPath) => {
    if (!pathname || !fullPath) return false;
    const cleanPath = String(fullPath).replace(/^\/+|\/+$/g, '');
    const target = `/category/${cleanPath}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  // Hover Handlers for Level-1: Opens immediately
  const handleL1MouseEnter = (catKey) => {
    if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
    if (l2CloseTimerRef.current) clearTimeout(l2CloseTimerRef.current);
    setActiveL1(catKey);
    setActiveL2(null);
  };

  const handleL1MouseLeave = () => {
    l1CloseTimerRef.current = setTimeout(() => {
      setActiveL1(null);
      setActiveL2(null);
    }, 150);
  };

  // Hover Handlers for Level-2: Opens flyout immediately
  const handleL2MouseEnter = (e, l2Key) => {
    if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
    if (l2CloseTimerRef.current) clearTimeout(l2CloseTimerRef.current);

    // Check viewport overflow to flip left if flyout would exceed viewport width
    const targetEl = e?.currentTarget;
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      if (rect.right + 250 > window.innerWidth) {
        setFlipLeft(true);
      } else {
        setFlipLeft(false);
      }
    }

    setActiveL2(l2Key);
  };

  const handleL2MouseLeave = () => {
    l2CloseTimerRef.current = setTimeout(() => {
      setActiveL2(null);
    }, 120);
  };

  // Keyboard Navigation Handlers
  const handleL1KeyDown = (e, cat, catKey, index, totalItems) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % totalItems;
      const nextEl = containerRef.current?.querySelectorAll('[data-level1-link]')[nextIdx];
      nextEl?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + totalItems) % totalItems;
      const prevEl = containerRef.current?.querySelectorAll('[data-level1-link]')[prevIdx];
      prevEl?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveL1(catKey);
      setTimeout(() => {
        const firstL2 = document.querySelector(`[data-l2-menu="${catKey}"] [data-l2-link]`);
        firstL2?.focus();
      }, 50);
    }
  };

  const handleL2KeyDown = (e, l2, l2Key, catKey) => {
    const currentMenu = document.querySelector(`[data-l2-menu="${catKey}"]`);
    if (!currentMenu) return;
    const l2Links = Array.from(currentMenu.querySelectorAll('[data-l2-link]'));
    const currentIndex = l2Links.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % l2Links.length;
      l2Links[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex === 0) {
        const l1Link = containerRef.current?.querySelector(`[data-l1-id="${catKey}"] [data-level1-link]`);
        l1Link?.focus();
        setActiveL1(null);
      } else {
        const prevIndex = (currentIndex - 1 + l2Links.length) % l2Links.length;
        l2Links[prevIndex]?.focus();
      }
    } else if (e.key === 'ArrowRight' && l2.children && l2.children.length > 0) {
      e.preventDefault();
      setActiveL2(l2Key);
      setTimeout(() => {
        const firstL3 = document.querySelector(`[data-l3-menu="${l2Key}"] [data-l3-link]`);
        firstL3?.focus();
      }, 50);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const l1Link = containerRef.current?.querySelector(`[data-l1-id="${catKey}"] [data-level1-link]`);
      l1Link?.focus();
      setActiveL1(null);
    }
  };

  const handleL3KeyDown = (e, l3Key, l2Key) => {
    const currentMenu = document.querySelector(`[data-l3-menu="${l2Key}"]`);
    if (!currentMenu) return;
    const l3Links = Array.from(currentMenu.querySelectorAll('[data-l3-link]'));
    const currentIndex = l3Links.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % l3Links.length;
      l3Links[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + l3Links.length) % l3Links.length;
      l3Links[prevIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveL2(null);
      const l2Link = document.querySelector(`[data-l2-id="${l2Key}"] [data-l2-link]`);
      l2Link?.focus();
    }
  };

  const visibleItems = tree.slice(0, visibleCount);
  const moreItems = tree.slice(visibleCount);
  const totalL1Count = visibleItems.length + (moreItems.length > 0 ? 1 : 0);

  return (
    <nav
      aria-label="Desktop Category Navigation"
      className="hidden lg:block bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors relative z-40 select-none shadow-sm"
    >
      <div className="max-w-[1320px] mx-auto px-4">
        <ul
          ref={containerRef}
          role="menubar"
          className="flex items-center justify-between font-sans text-xs font-bold text-slate-800 dark:text-slate-200 relative"
        >
          {visibleItems.map((cat, index) => {
            const catChildren = Array.isArray(cat.children) ? cat.children : [];
            const hasChildren = catChildren.length > 0;
            const catKey = cat.fullPath || cat.slug || String(index);
            const isOpen = activeL1 === catKey;
            const isActive = isItemActive(cat.fullPath || cat.slug);

            return (
              <li
                key={catKey}
                role="none"
                data-level1-item
                data-l1-id={catKey}
                className="relative py-3.5"
                onMouseEnter={() => handleL1MouseEnter(catKey)}
                onMouseLeave={handleL1MouseLeave}
              >
                <div data-level1-btn className="flex items-center">
                  <Link
                    href={`/category/${cat.fullPath || cat.slug}`}
                    role="menuitem"
                    data-level1-link
                    aria-haspopup={hasChildren ? 'true' : undefined}
                    aria-expanded={hasChildren ? (isOpen ? 'true' : 'false') : undefined}
                    onFocus={() => handleL1MouseEnter(catKey)}
                    onKeyDown={(e) => handleL1KeyDown(e, cat, catKey, index, totalL1Count)}
                    className={`flex items-center gap-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 rounded px-1.5 py-0.5 ${
                      isActive
                        ? 'text-orange-600 dark:text-orange-500 font-extrabold border-b-2 border-orange-600 -mb-0.5'
                        : ''
                    }`}
                  >
                    <span>{cat.name || cat.title}</span>
                    {hasChildren && (
                      <ChevronDown
                        size={12}
                        className={`text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-orange-600' : 'group-hover:text-orange-600'
                        }`}
                      />
                    )}
                  </Link>
                </div>

                {/* Level-2 Cascading Panel (NO SCROLLBAR, FULL OVERFLOW-VISIBLE FOR CRISP FLYOUT) */}
                {hasChildren && isOpen && (
                  <div
                    role="menu"
                    data-l2-menu={catKey}
                    aria-label={cat.name || cat.title}
                    onMouseEnter={() => {
                      if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
                    }}
                    onMouseLeave={handleL1MouseLeave}
                    className="absolute left-0 top-full mt-0 w-[240px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-2xl z-[100] py-1 divide-y divide-slate-100 dark:divide-slate-800/60 rounded-b-md"
                  >
                    {catChildren.map((l2) => {
                      const l2Children = Array.isArray(l2.children) ? l2.children : [];
                      const hasL2Children = l2Children.length > 0;
                      const l2Key = l2.fullPath || l2.slug;
                      const isL2Open = activeL2 === l2Key;
                      const isL2Active = isItemActive(l2.fullPath);

                      return (
                        <div
                          key={l2Key}
                          role="none"
                          data-l2-id={l2Key}
                          className="relative"
                          onMouseEnter={(e) => handleL2MouseEnter(e, l2Key)}
                          onMouseLeave={handleL2MouseLeave}
                        >
                          <Link
                            href={`/category/${l2.fullPath}`}
                            role="menuitem"
                            data-l2-link
                            aria-haspopup={hasL2Children ? 'true' : undefined}
                            aria-expanded={hasL2Children ? (isL2Open ? 'true' : 'false') : undefined}
                            onFocus={(e) => handleL2MouseEnter(e, l2Key)}
                            onKeyDown={(e) => handleL2KeyDown(e, l2, l2Key, catKey)}
                            className={`w-full px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors ${
                              isL2Open
                                ? 'bg-[#ea580c] text-white font-bold'
                                : isL2Active
                                ? 'bg-orange-50/80 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-semibold'
                                : 'text-slate-800 dark:text-slate-200 hover:bg-[#ea580c] hover:text-white'
                            }`}
                          >
                            <span className="truncate pr-2">{l2.name || l2.title}</span>
                            {hasL2Children && (
                              <ChevronRight
                                size={13}
                                className={`shrink-0 transition-colors ${
                                  isL2Open ? 'text-white' : 'text-orange-500/80 group-hover:text-white'
                                }`}
                              />
                            )}
                          </Link>

                          {/* Level-3 Flyout Panel (Positioned adjacent to hovered item without any scrollbars) */}
                          {hasL2Children && isL2Open && (
                            <div
                              role="menu"
                              data-l3-menu={l2Key}
                              aria-label={l2.name || l2.title}
                              onMouseEnter={() => {
                                if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
                                if (l2CloseTimerRef.current) clearTimeout(l2CloseTimerRef.current);
                              }}
                              onMouseLeave={handleL2MouseLeave}
                              className={`absolute top-0 w-[240px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-2xl z-[110] py-1 divide-y divide-slate-100 dark:divide-slate-800/60 rounded-md ${
                                flipLeft ? 'right-full' : 'left-full'
                              }`}
                            >
                              {l2Children.map((l3) => {
                                const l4Children = Array.isArray(l3.children) ? l3.children : [];
                                const hasL4 = l4Children.length > 0;
                                const l3Key = l3.fullPath || l3.slug;
                                const isL3Active = isItemActive(l3.fullPath);

                                return (
                                  <div key={l3Key} role="none" className="relative">
                                    <Link
                                      href={`/category/${l3.fullPath}`}
                                      role="menuitem"
                                      data-l3-link
                                      onKeyDown={(e) => handleL3KeyDown(e, l3Key, l2Key)}
                                      className={`w-full px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                        isL3Active
                                          ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-50/50'
                                          : 'text-slate-800 dark:text-slate-200'
                                      }`}
                                    >
                                      <span className="truncate">{l3.name || l3.title}</span>
                                    </Link>

                                    {/* Level-4 items as plain sub-links if any */}
                                    {hasL4 && (
                                      <ul className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
                                        {l4Children.map((l4) => (
                                          <li key={l4.fullPath || l4.name}>
                                            <Link
                                              href={`/category/${l4.fullPath}`}
                                              role="menuitem"
                                              className="text-xs text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 block py-0.5 transition-colors"
                                            >
                                              {l4.name || l4.title}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Show All {cat.name} at bottom (Star Tech style) */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href={`/category/${cat.fullPath || cat.slug}`}
                        role="menuitem"
                        className="w-full px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 block transition-colors"
                      >
                        Show All {cat.name || cat.title}
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          {/* "More" Overflow Dropdown for remaining Level-1 items */}
          {moreItems.length > 0 && (
            <li
              role="none"
              data-level1-item
              data-l1-id="more-overflow"
              className="relative py-3.5"
              onMouseEnter={() => handleL1MouseEnter('more-overflow')}
              onMouseLeave={handleL1MouseLeave}
            >
              <div data-level1-btn className="flex items-center">
                <button
                  type="button"
                  role="menuitem"
                  data-level1-link
                  aria-haspopup="true"
                  aria-expanded={activeL1 === 'more-overflow' ? 'true' : 'false'}
                  onFocus={() => handleL1MouseEnter('more-overflow')}
                  onKeyDown={(e) => handleL1KeyDown(e, { name: 'More' }, 'more-overflow', visibleItems.length, totalL1Count)}
                  className="flex items-center gap-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 rounded px-1.5 py-0.5 cursor-pointer"
                >
                  <MoreHorizontal size={14} className="text-slate-500" />
                  <span>More</span>
                  <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 ${
                      activeL1 === 'more-overflow' ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>
              </div>

              {/* "More" Level-1 overflow panel */}
              {activeL1 === 'more-overflow' && (
                <div
                  role="menu"
                  data-l2-menu="more-overflow"
                  aria-label="More Categories"
                  onMouseEnter={() => {
                    if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
                  }}
                  onMouseLeave={handleL1MouseLeave}
                  className="absolute right-0 top-full mt-0 w-[240px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-2xl z-50 py-1 divide-y divide-slate-100 dark:divide-slate-800/60 rounded-b-md"
                >
                  {moreItems.map((cat) => {
                    const catChildren = Array.isArray(cat.children) ? cat.children : [];
                    const hasChildren = catChildren.length > 0;
                    const catKey = cat.fullPath || cat.slug;
                    const isL2Open = activeL2 === catKey;

                    return (
                      <div
                        key={catKey}
                        role="none"
                        data-l2-id={catKey}
                        className="relative"
                        onMouseEnter={(e) => handleL2MouseEnter(e, catKey)}
                        onMouseLeave={handleL2MouseLeave}
                      >
                        <Link
                          href={`/category/${cat.fullPath}`}
                          role="menuitem"
                          data-l2-link
                          aria-haspopup={hasChildren ? 'true' : undefined}
                          aria-expanded={hasChildren ? (isL2Open ? 'true' : 'false') : undefined}
                          onFocus={(e) => handleL2MouseEnter(e, catKey)}
                          onKeyDown={(e) => handleL2KeyDown(e, cat, catKey, 'more-overflow')}
                          className={`w-full px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors ${
                            isL2Open
                              ? 'bg-[#ea580c] text-white font-bold'
                              : 'text-slate-800 dark:text-slate-200 hover:bg-[#ea580c] hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">{cat.name || cat.title}</span>
                          {hasChildren && (
                            <ChevronRight
                              size={13}
                              className={`shrink-0 transition-colors ${
                                isL2Open ? 'text-white' : 'text-orange-500/80 group-hover:text-white'
                              }`}
                            />
                          )}
                        </Link>

                        {/* Flyout for overflowed category */}
                        {hasChildren && isL2Open && (
                          <div
                            role="menu"
                            data-l3-menu={catKey}
                            aria-label={cat.name || cat.title}
                            onMouseEnter={() => {
                              if (l1CloseTimerRef.current) clearTimeout(l1CloseTimerRef.current);
                              if (l2CloseTimerRef.current) clearTimeout(l2CloseTimerRef.current);
                            }}
                            onMouseLeave={handleL2MouseLeave}
                            className="absolute top-0 right-full w-[240px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-2xl z-[110] py-1 divide-y divide-slate-100 dark:divide-slate-800/60 rounded-md"
                          >
                            {catChildren.map((l2) => (
                              <div key={l2.fullPath || l2.slug} role="none" className="relative">
                                <Link
                                  href={`/category/${l2.fullPath}`}
                                  role="menuitem"
                                  data-l3-link
                                  className="w-full px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                                >
                                  <span className="truncate">{l2.name || l2.title}</span>
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
