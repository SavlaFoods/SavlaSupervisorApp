// src/theme/colors.ts
//
// Central color palette for the app. One neutral base + four semantic
// colors that follow common warehouse / WMS color-coding conventions
// (pallet labels, zone tags), so a color always means the same thing
// wherever it shows up — search results, lot cards, history, future
// stock/inventory screens:
//
//   Blue (primary)  → brand identity, cold storage / finished goods,
//                      primary links & active states
//   Green (success) → available, cleared, active, eco-cleared
//   Amber (warning) → staging, transitional zones, semi-finished,
//                      "needs attention soon"
//   Red (danger)    → quality holds, damaged goods, hazardous materials
//
// Import this everywhere instead of redefining a local COLORS const per
// screen, so a palette change is a one-file edit.

export const COLORS = {
  // ---- Neutrals ----
  bg: '#f6f7f9', // screen background
  surface: '#ffffff', // cards, sheets, inputs
  border: '#e9ecf0', // card / input borders
  divider: '#f1f2f4', // hairlines inside cards (row separators)
  ink: '#1c222b', // primary text
  subtle: '#6b7280', // secondary text, labels
  faint: '#aeb4bc', // placeholders, least emphasis

  // ---- Brand / primary (Blue) ----
  // Cold storage / finished goods in the warehouse convention; doubles
  // as the app's brand accent — links, active tab, primary badges.
  primary: '#1a5fb4',
  primarySoft: '#e3f2fd',

  // ---- Success (Green) ----
  // Available stock, cleared, active, frequently used.
  success: '#2e9e5b',
  successSoft: '#e7f6ee',

  // ---- Warning (Amber) ----
  // Staging / transitional zones, semi-finished goods, upcoming
  // schedules or anything that needs attention soon but isn't wrong yet.
  warning: '#c9750f',
  warningSoft: '#fff3e0',

  // ---- Danger (Red) ----
  // Quality holds, damaged goods, hazardous materials, or any state
  // that needs immediate attention (e.g. multiple-owner conflicts).
  danger: '#c9432c',
  dangerSoft: '#fbe9e6',
} as const;

// Maps a raw WMS status string (movement STATUS, location type, etc.)
// to one of the four semantic colors above, so any screen can call
// getStatusColor('HOLD') and stay consistent without hardcoding checks.
// Falls back to a neutral gray for statuses that aren't recognized yet
// — safer than guessing, and easy to extend as new statuses show up.
export const getStatusColor = (status?: string): string => {
  const s = (status || '').toUpperCase();

  if (
    ['HOLD', 'ON HOLD', 'DAMAGED', 'HAZARD', 'HAZARDOUS', 'REJECTED'].includes(
      s,
    )
  ) {
    return COLORS.danger;
  }
  if (
    ['STAGING', 'TRANSIT', 'IN TRANSIT', 'PENDING', 'SEMI-FINISHED'].includes(s)
  ) {
    return COLORS.warning;
  }
  if (['CLEARED', 'ACTIVE', 'AVAILABLE', 'NEW', 'COMPLETED'].includes(s)) {
    return COLORS.success;
  }
  return COLORS.subtle;
};
