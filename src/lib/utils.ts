import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse weight string to kilograms
 * e.g., "500g" -> 0.5, "1kg" -> 1, "250gm" -> 0.25
 */
export function parseWeight(weightStr: string): number {
  if (!weightStr) return 0;
  const lower = weightStr.toLowerCase().replace(/\s/g, '');
  const value = parseFloat(lower);

  if (isNaN(value)) return 0;

  if (lower.includes('kg')) {
    return value;
  } else if (lower.includes('g')) { // Matches 'g', 'gm', 'gms'
    return value / 1000;
  }

  return 0; // Fallback
}
