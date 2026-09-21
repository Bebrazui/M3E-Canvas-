"use client";

import React from "react";
import type { Palette } from "@/lib/tokens";

export type Box = { l: number; t: number; r: number; b: number };

function Badge({
  x,
  y,
  value,
  z,
}: {
  x: number;
  y: number;
  value: number;
  z: number;
}) {
  if (value <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${1 / z})`,
        transformOrigin: "center center",
        background: "#ef4444",
        color: "#ffffff",
        fontSize: 11,
        lineHeight: "15px",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        padding: "1px 5px",
        borderRadius: 4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 105,
      }}
    >
      {value}
    </div>
  );
}

export function AltMeasurementOverlay({
  selBox,
  targetBox,
  frameBox,
  z,
}: {
  selBox: Box;
  targetBox: Box | null;
  frameBox: Box | null;
  z: number;
  p: Palette;
}) {
  const strokeW = 1.5 / z;
  const red = "#ef4444";

  // Case 1: Target element is hovered
  if (targetBox) {
    const lines: React.ReactNode[] = [];
    const badges: React.ReactNode[] = [];

    // Horizontal relation
    const overlapY = Math.max(0, Math.min(selBox.b, targetBox.b) - Math.max(selBox.t, targetBox.t));
    const midY =
      overlapY > 0
        ? (Math.max(selBox.t, targetBox.t) + Math.min(selBox.b, targetBox.b)) / 2
        : (selBox.t + selBox.b + targetBox.t + targetBox.b) / 4;

    if (selBox.r <= targetBox.l) {
      const dx = Math.round(targetBox.l - selBox.r);
      const xMid = (selBox.r + targetBox.l) / 2;
      lines.push(
        <line
          key="h-line"
          x1={selBox.r}
          y1={midY}
          x2={targetBox.l}
          y2={midY}
          stroke={red}
          strokeWidth={strokeW}
        />,
      );
      badges.push(<Badge key="h-badge" x={xMid} y={midY} value={dx} z={z} />);
    } else if (targetBox.r <= selBox.l) {
      const dx = Math.round(selBox.l - targetBox.r);
      const xMid = (targetBox.r + selBox.l) / 2;
      lines.push(
        <line
          key="h-line"
          x1={targetBox.r}
          y1={midY}
          x2={selBox.l}
          y2={midY}
          stroke={red}
          strokeWidth={strokeW}
        />,
      );
      badges.push(<Badge key="h-badge" x={xMid} y={midY} value={dx} z={z} />);
    }

    // Vertical relation
    const overlapX = Math.max(0, Math.min(selBox.r, targetBox.r) - Math.max(selBox.l, targetBox.l));
    const midX =
      overlapX > 0
        ? (Math.max(selBox.l, targetBox.l) + Math.min(selBox.r, targetBox.r)) / 2
        : (selBox.l + selBox.r + targetBox.l + targetBox.r) / 4;

    if (selBox.b <= targetBox.t) {
      const dy = Math.round(targetBox.t - selBox.b);
      const yMid = (selBox.b + targetBox.t) / 2;
      lines.push(
        <line
          key="v-line"
          x1={midX}
          y1={selBox.b}
          x2={midX}
          y2={targetBox.t}
          stroke={red}
          strokeWidth={strokeW}
        />,
      );
      badges.push(<Badge key="v-badge" x={midX} y={yMid} value={dy} z={z} />);
    } else if (targetBox.b <= selBox.t) {
      const dy = Math.round(selBox.t - targetBox.b);
      const yMid = (targetBox.b + selBox.t) / 2;
      lines.push(
        <line
          key="v-line"
          x1={midX}
          y1={targetBox.b}
          x2={midX}
          y2={selBox.t}
          stroke={red}
          strokeWidth={strokeW}
        />,
      );
      badges.push(<Badge key="v-badge" x={midX} y={yMid} value={dy} z={z} />);
    }

    return (
      <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 100 }}>
        {/* Outline around selection */}
        <div
          style={{
            position: "absolute",
            left: selBox.l,
            top: selBox.t,
            width: selBox.r - selBox.l,
            height: selBox.b - selBox.t,
            border: `${strokeW}px solid ${red}`,
            boxSizing: "border-box",
          }}
        />
        {/* Outline around target */}
        <div
          style={{
            position: "absolute",
            left: targetBox.l,
            top: targetBox.t,
            width: targetBox.r - targetBox.l,
            height: targetBox.b - targetBox.t,
            border: `${strokeW}px solid ${red}`,
            boxSizing: "border-box",
          }}
        />
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          {lines}
        </svg>
        {badges}
      </div>
    );
  }

  // Case 2: Measure to frame boundaries
  if (frameBox) {
    const midX = (selBox.l + selBox.r) / 2;
    const midY = (selBox.t + selBox.b) / 2;

    const dt = Math.round(selBox.t - frameBox.t);
    const db = Math.round(frameBox.b - selBox.b);
    const dl = Math.round(selBox.l - frameBox.l);
    const dr = Math.round(frameBox.r - selBox.r);

    return (
      <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 100 }}>
        {/* Outline around selection */}
        <div
          style={{
            position: "absolute",
            left: selBox.l,
            top: selBox.t,
            width: selBox.r - selBox.l,
            height: selBox.b - selBox.t,
            border: `${strokeW}px solid ${red}`,
            boxSizing: "border-box",
          }}
        />
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          {dt > 0 && <line x1={midX} y1={frameBox.t} x2={midX} y2={selBox.t} stroke={red} strokeWidth={strokeW} strokeDasharray={`${4 / z} ${2 / z}`} />}
          {db > 0 && <line x1={midX} y1={selBox.b} x2={midX} y2={frameBox.b} stroke={red} strokeWidth={strokeW} strokeDasharray={`${4 / z} ${2 / z}`} />}
          {dl > 0 && <line x1={frameBox.l} y1={midY} x2={selBox.l} y2={midY} stroke={red} strokeWidth={strokeW} strokeDasharray={`${4 / z} ${2 / z}`} />}
          {dr > 0 && <line x1={selBox.r} y1={midY} x2={frameBox.r} y2={midY} stroke={red} strokeWidth={strokeW} strokeDasharray={`${4 / z} ${2 / z}`} />}
        </svg>
        {dt > 0 && <Badge x={midX} y={(frameBox.t + selBox.t) / 2} value={dt} z={z} />}
        {db > 0 && <Badge x={midX} y={(selBox.b + frameBox.b) / 2} value={db} z={z} />}
        {dl > 0 && <Badge x={(frameBox.l + selBox.l) / 2} y={midY} value={dl} z={z} />}
        {dr > 0 && <Badge x={(selBox.r + frameBox.r) / 2} y={midY} value={dr} z={z} />}
      </div>
    );
  }

  return null;
}
