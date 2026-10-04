"use client";

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function TopProductsChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Top Selling Products</h3>
          <p className="text-[11px] text-slate-500">Best-selling hardware units</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          Units Sold
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
            <span className="text-[11px] text-slate-400">Product sales rankings will appear once orders are placed.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} horizontal={false} />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={120}
                tickFormatter={(val) => (val && val.length > 16 ? `${val.substring(0, 16)}...` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
                formatter={(value, name, item) => {
                  const revenueText = item?.payload?.revenue ? ` (৳${Number(item.payload.revenue).toLocaleString()})` : '';
                  return [`${value} sold${revenueText}`, 'Quantity'];
                }}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="sales"
                fill="#3b82f6"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
