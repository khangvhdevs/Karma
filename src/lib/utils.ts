import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  // Using 'M' as a stand-in for Monopoly money symbol.
  // Using a non-breaking space `\u00A0` for better formatting.
  return `M\u00A0${new Intl.NumberFormat('en-US').format(amount)}`;
}
