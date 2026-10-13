"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, ChevronRight } from 'lucide-react';
import { CATEGORY_TREE } from '@/data/category-tree';
import { normalizeTree } from '@/lib/categories';

const FALLBACK_TOP_LEVEL = [
  { name: 'Desktop PC', fullPath: 'desktop-pc', slug: 'desktop-pc', children: [] },
  { name: 'Gaming Laptop', fullPath: 'laptop', slug: 'laptop', children: [] },
  { name: 'Component', fullPath: 'component', slug: 'component', children: [] },
  { name: 'Monitor', fullPath: 'monitor', slug: 'monitor', children: [] },
  { name: 'UPS', fullPath: 'ups', slug: 'ups', children: [] },
  { name: 'Tablet', fullPath: 'tablet', slug: 'tablet', children: [] },
  { name: 'Office Equipment', fullPath: 'office-equipment', slug: 'office-equipment', children: [] },
  { name: 'Camera', fullPath: 'camera', slug: 'camera', children: [] },
  { name: 'Security', fullPath: 'security', slug: 'security', children: [] },
  { name: 'Networking', fullPath: 'networking', slug: 'networking', children: [] },
  { name: 'Software', fullPath: 'software', slug: 'software', children: [] },
  { name: 'Server & Storage', fullPath: 'server-storage', slug: 'server-storage', children: [] },
  { name: 'Accessories', fullPath: 'accessories', slug: 'accessories', children: [] },
  { name: 'Gadget', fullPath: 'gadget', slug: 'gadget', children: [] },
  { name: 'Gaming', fullPath: 'gaming', slug: 'gaming', children: [] },
  { name: 'TV', fullPath: 'tv', slug: 'tv', children: [] },
  { name: 'Appliance', fullPath: 'appliance', slug: 'appliance', children: [] }
];

/**
 * MobileCategoryMenu: An accessible accordion category menu for the mobile drawer.
 * - Only one sibling may be expanded at a time per level.
 * - Rows with children toggle expansion on tap.
 * - Rows without children are plain links that trigger onNavigate.
 * - Expanded parents display a "Show All {name}" link first.
 * - Smooth CSS-only height transition.
 * - Resets expanded state on close & locks body scroll when open.
 * - Falls back to top-level list if tree is empty or failed.
 */
export default function MobileCategoryMenu({
  tree = [],
  onNavigate = () => {},
  isOpen = false
}) {
  // expandedMap maps parentKey -> currently expanded childId
  // This guarantees only one sibling can be expanded per parent/level
  const [expandedMap, setExpandedMap] = useState({});

  // Reset expanded state whenever the drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setExpandedMap({});
    }
  }, [isOpen]);

  // Lock body scroll while drawer is open and restore on close
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Fallback if tree is empty or failed: use normalized CATEGORY_TREE or top-level list
  let categories = [];
  if (Array.isArray(tree) && tree.length > 0) {
    categories = tree;
  } else {
    try {
      const normalized = normalizeTree(CATEGORY_TREE);
      categories = Array.isArray(normalized) && normalized.length > 0 ? normalized : FALLBACK_TOP_LEVEL;
    } catch {
      categories = FALLBACK_TOP_LEVEL;
    }
  }

  const toggleExpand = (parentKey, childKey) => {
    setExpandedMap((prev) => {
      const current = prev[parentKey];
      if (current === childKey) {
        // Collapse if already open
        const updated = { ...prev };
        delete updated[parentKey];
        return updated;
      }
      // Expand this child and collapse any sibling under this parent
      return {
        ...prev,
        [parentKey]: childKey
      };
    });
  };

  const renderCategoryNode = (node, parentKey = 'root', level = 1) => {
    const nodeChildren = node.children || node.subcategories || [];
    const hasChildren = Array.isArray(nodeChildren) && nodeChildren.length > 0;
    const name = node.name || node.title || '';
    const fullPath = node.fullPath || node.slug || '';
    const nodeKey = `${parentKey}-${node.id || node.slug || name}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const isExpanded = expandedMap[parentKey] === nodeKey;
    const controlsId = `subcat-${nodeKey}`;

    // Indentation based on level
    const paddingLeftClass =
      level === 1
        ? 'pl-1'
        : level === 2
        ? 'pl-4'
        : level === 3
        ? 'pl-7'
        : 'pl-10';

    if (!hasChildren) {
      return (
        <li key={nodeKey} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
          <Link
            href={`/category/${fullPath}`}
            onClick={onNavigate}
            className={`min-h-[44px] flex items-center justify-between py-2.5 pr-2 ${paddingLeftClass} text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 active:text-orange-600 transition-colors`}
          >
            <span>{name}</span>
            <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
          </Link>
        </li>
      );
    }

    return (
      <li key={nodeKey} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
        {/* Row with children: toggles on tap */}
        <button
          type="button"
          onClick={() => toggleExpand(parentKey, nodeKey)}
          aria-expanded={isExpanded}
          aria-controls={controlsId}
          className={`w-full min-h-[44px] flex items-center justify-between py-2.5 pr-2 ${paddingLeftClass} text-left text-sm font-semibold transition-colors select-none ${
            isExpanded
              ? 'text-orange-600 dark:text-orange-500 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
          }`}
        >
          <span>{name}</span>
          <span
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
              isExpanded
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                : 'text-slate-400'
            }`}
          >
            {isExpanded ? <Minus size={15} /> : <Plus size={15} />}
          </span>
        </button>

        {/* Smooth CSS-only Accordion Height Transition */}
        <div
          id={controlsId}
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden bg-slate-50/60 dark:bg-slate-800/30 rounded-lg my-0.5">
            <ul className="flex flex-col py-1">
              {/* "Show All {name}" link */}
              <li className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0">
                <Link
                  href={`/category/${fullPath}`}
                  onClick={onNavigate}
                  className={`min-h-[40px] flex items-center gap-1.5 py-2 pr-2 ${
                    level === 1
                      ? 'pl-4'
                      : level === 2
                      ? 'pl-7'
                      : 'pl-10'
                  } text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline`}
                >
                  <ChevronRight size={13} className="flex-shrink-0" />
                  <span>Show All {name}</span>
                </Link>
              </li>

              {/* Child Rows */}
              {nodeChildren.map((child) =>
                renderCategoryNode(child, nodeKey, level + 1)
              )}
            </ul>
          </div>
        </div>
      </li>
    );
  };

  return (
    <nav aria-label="Mobile Category Navigation" className="w-full">
      <ul className="flex flex-col">
        {categories.map((cat) => renderCategoryNode(cat, 'root', 1))}
      </ul>
    </nav>
  );
}
