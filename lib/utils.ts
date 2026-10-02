import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function taka(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export function cartSubtotal(items: { price: number; quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: { quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
