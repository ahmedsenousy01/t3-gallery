import { customAlphabet } from "nanoid";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const alphabet = "123456789abcdefghijkmnpqrstuvwxyz";
export const nanoid = customAlphabet(alphabet, 20);

export function hardRefresh(destination?: string) {
  window.location.href = `/refresh?destination=${destination ?? "/"}`;
}
