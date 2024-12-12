import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createPageUrl = (path: string, pageNum: number) => {
  const params = new URLSearchParams();
  params.set("page", pageNum.toString());
  return `/${path}?${params.toString()}`;
};