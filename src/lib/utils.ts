import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format cat age from months to readable format
export function formatCatAge(ageInMonths: number): string {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
  }

  const years = Math.floor(ageInMonths / 12);
  const remainingMonths = ageInMonths % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'yr' : 'yrs'}`;
  }

  return `${years} ${years === 1 ? 'yr' : 'yrs'} ${remainingMonths} ${remainingMonths === 1 ? 'mo' : 'mos'}`;
}

// Helper to get short age format (for badges/cards)
export function formatCatAgeShort(ageInMonths: number): string {
  if (ageInMonths < 12) {
    return `${ageInMonths}mo`;
  }

  const years = Math.floor(ageInMonths / 12);
  const remainingMonths = ageInMonths % 12;

  if (remainingMonths === 0) {
    return `${years}yr`;
  }

  return `${years}yr ${remainingMonths}mo`;
}
