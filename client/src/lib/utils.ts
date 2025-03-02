import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getRandomGradient(): string {
  const gradients = [
    "from-blue-500 to-purple-500",
    "from-green-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-blue-500 to-cyan-500",
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
}
