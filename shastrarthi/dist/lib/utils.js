import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional class names and tailwind-merge to resolve conflicts
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Format a verse reference (e.g., "2.47" -> "2.47")
 */
export function formatVerseRef(ref) {
    return ref;
}
/**
 * Truncate text to a specified length with ellipsis
 */
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trim() + "...";
}
/**
 * Sleep/delay utility for async operations
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Debounce function for search inputs
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
