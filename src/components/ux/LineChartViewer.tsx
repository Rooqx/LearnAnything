"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface ChartPayload {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  data: {
    labels: (string | number)[];
    datasets: {
      label: string;
      values: number[];
    }[];
  };
}

interface LineChartViewerProps {
  payload: ChartPayload;
}

export function LineChartViewer({ payload }: LineChartViewerProps) {
  const chartData = useMemo(() => {
    if (!payload?.data?.labels || !payload?.data?.datasets) return [];
    
    return payload.data.labels.map((label, index) => {
      const dataPoint: Record<string, any> = { xAxisLabel: label };
      payload.data.datasets.forEach((dataset) => {
        dataPoint[dataset.label] = dataset.values[index];
      });
      return dataPoint;
    });
  }, [payload]);

  const colors = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4"];

  if (!payload || !chartData.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full p-6 my-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm"
    >
      {payload.title && (
        <div className="mb-6 text-center">
          <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-text)]">
            {payload.title}
          </h3>
        </div>
      )}

      <div className="h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: payload.xLabel ? 20 : 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              className="opacity-50"
            />
            <XAxis
              dataKey="xAxisLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 13, fontFamily: "var(--font-body)" }}
              dy={10}
              label={
                payload.xLabel
                  ? {
                      value: payload.xLabel,
                      position: "insideBottom",
                      offset: -10,
                      fill: "var(--color-muted)",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                    }
                  : undefined
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 13, fontFamily: "var(--font-body)" }}
              dx={-10}
              label={
                payload.yLabel
                  ? {
                      value: payload.yLabel,
                      angle: -90,
                      position: "insideLeft",
                      offset: 0,
                      fill: "var(--color-muted)",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface-elevated)",
                backdropFilter: "blur(8px)",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                color: "var(--color-text)",
                fontFamily: "var(--font-body)",
              }}
              itemStyle={{ fontWeight: 500 }}
              labelStyle={{ color: "var(--color-muted)", marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "14px", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
            />
            {payload.data.datasets.map((dataset, idx) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={colors[idx % colors.length]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--color-surface)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
