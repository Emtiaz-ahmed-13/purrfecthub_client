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

// Helper to format time ago
export function formatTimeAgo(date: string | Date | number): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
