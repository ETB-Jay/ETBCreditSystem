// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging class names using clsx and tailwind-merge.
 * @param inputs - List of class names (strings, undefined, null, or false)
 * @returns A single merged class name string
 */
function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(clsx(inputs));
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default cn;
