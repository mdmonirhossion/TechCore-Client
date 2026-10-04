"use client";

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const STATUS_COLORS = {
  Pending: '#f59e0b',     // Amber
  Processing: '#a855f7',  // Purple
  Shipped: '#3b82f6',     // Blue
  Delivered: '#10b981',   // Emerald
  Cancelled: '#ef4444',   // Red
  Returned: '#64748b'     // Slate
};

const DEFAULT_COLOR = '#94a3b8';

export default function OrderStatusChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasData = Array.isArray(data) && data.length > 0 && data.some(d => Number(d.value) > 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Order Status Distribution</h3>
          <p className="text-[11px] text-slate-500">Breakdown of orders by fulfillment stage</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          Statuses
        </span>
      </div>

      <div className="w-full h-[300px]">
        {!mounted ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Loading chart...
          </div>
        ) : !hasData ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="font-semibold text-slate-500 dark:text-slate-400">No data yet</span>
            <span className="text-[11px] text-slate-400">No orders found to display status breakdown.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || DEFAULT_COLOR}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
                formatter={(value, name) => [`${value} Orders`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
