"use client";

import { memo } from "react";

export type GridMode = "off" | "8dp" | "4dp" | "columns" | "dots";

export const GridOverlay = memo(function GridOverlay({
  mode,
  width,
  height,
  dark,
  id,
}: {
  mode: GridMode;
  width: number;
  height: number;
  dark: boolean;
  id: string;
}) {
  if (mode === "off") return null;

  // High-precision colors adapted to dark/light theme
  const fineLine = dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const majorLine = dark ? "rgba(255, 255, 255, 0.20)" : "rgba(0, 0, 0, 0.14)";
  const colFill = dark ? "rgba(208, 188, 255, 0.08)" : "rgba(103, 80, 164, 0.07)";
  const colStroke = dark ? "rgba(208, 188, 255, 0.26)" : "rgba(103, 80, 164, 0.22)";
  const dotColor = dark ? "rgba(255, 255, 255, 0.24)" : "rgba(0, 0, 0, 0.18)";
  const majorDotColor = dark ? "rgba(255, 255, 255, 0.44)" : "rgba(0, 0, 0, 0.32)";

  const patId = `grid-${mode}-${id}`;

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <defs>
        {mode === "8dp" && (
          <pattern id={patId} width="32" height="32" patternUnits="userSpaceOnUse">
            {/* 8dp fine line grid */}
            <path
              d="M 8 0 L 8 32 M 16 0 L 16 32 M 24 0 L 24 32 M 0 8 L 32 8 M 0 16 L 32 16 M 0 24 L 32 24"
              fill="none"
              stroke={fineLine}
              strokeWidth="1"
            />
            {/* 32dp major section lines */}
            <path
              d="M 32 0 L 32 32 M 0 32 L 32 32"
              fill="none"
              stroke={majorLine}
              strokeWidth="1"
            />
          </pattern>
        )}

        {mode === "4dp" && (
          <pattern id={patId} width="16" height="16" patternUnits="userSpaceOnUse">
            {/* 4dp fine line grid */}
            <path
              d="M 4 0 L 4 16 M 8 0 L 8 16 M 12 0 L 12 16 M 0 4 L 16 4 M 0 8 L 16 8 M 0 12 L 16 12"
              fill="none"
              stroke={fineLine}
              strokeWidth="0.75"
            />
            {/* 16dp major section lines */}
            <path
              d="M 16 0 L 16 16 M 0 16 L 16 16"
              fill="none"
              stroke={majorLine}
              strokeWidth="1"
            />
          </pattern>
        )}

        {mode === "dots" && (
          <pattern id={patId} width="16" height="16" patternUnits="userSpaceOnUse">
            {/* 8dp sub-dots */}
            <circle cx="8" cy="8" r="0.9" fill={dotColor} />
            <circle cx="0" cy="8" r="0.9" fill={dotColor} />
            <circle cx="8" cy="0" r="0.9" fill={dotColor} />
            <circle cx="16" cy="8" r="0.9" fill={dotColor} />
            <circle cx="8" cy="16" r="0.9" fill={dotColor} />
            {/* 16dp major intersection dots */}
            <circle cx="0" cy="0" r="1.35" fill={majorDotColor} />
            <circle cx="16" cy="0" r="1.35" fill={majorDotColor} />
            <circle cx="0" cy="16" r="1.35" fill={majorDotColor} />
            <circle cx="16" cy="16" r="1.35" fill={majorDotColor} />
          </pattern>
        )}
      </defs>

      {/* Tiled patterns for 8dp, 4dp, and dots */}
      {(mode === "8dp" || mode === "4dp" || mode === "dots") && (
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
      )}

      {/* Material 3 4-Column Responsive Mobile Layout Grid */}
      {mode === "columns" && (
        <g>
          {(() => {
            const margin = 16;
            const gutter = 8;
            const colCount = 4;
            const availableW = width - margin * 2 - gutter * (colCount - 1);
            const colW = Math.max(10, availableW / colCount);

            return Array.from({ length: colCount }).map((_, i) => {
              const x = margin + i * (colW + gutter);
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={0}
                    width={colW}
                    height={height}
                    fill={colFill}
                    stroke={colStroke}
                    strokeWidth="1"
                  />
                  {/* Subtle center line for each column */}
                  <line
                    x1={x + colW / 2}
                    y1={0}
                    x2={x + colW / 2}
                    y2={height}
                    stroke={colStroke}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                </g>
              );
            });
          })()}
        </g>
      )}
    </svg>
  );
});
