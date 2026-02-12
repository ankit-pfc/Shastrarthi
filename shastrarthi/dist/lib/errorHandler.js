/**
 * Error handling utilities
 */
export class AppError extends Error {
    constructor(message, code, statusCode, isUserFacing = true) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.isUserFacing = isUserFacing;
        this.name = "AppError";
    }
}
/**
 * Parse Supabase error and return user-friendly message
 */
export function parseSupabaseError(error) {
    if (!error)
        return "An unexpected error occurred";
    const message = error.message || String(error);
    // Common Supabase error patterns
    if (message.includes("Invalid login credentials")) {
        return "Invalid email or password";
    }
    if (message.includes("Email not confirmed")) {
        return "Please confirm your email before signing in";
    }
    if (message.includes("User already registered")) {
        return "An account with this email already exists";
    }
    if (message.includes("Password should be at least")) {
        return "Password is too weak";
    }
    if (message.includes("duplicate key")) {
        return "This resource already exists";
    }
    if (message.includes("rows affected") && message.includes("0")) {
        return "Resource not found";
    }
    if (message.includes("JWT")) {
        return "Your session has expired. Please sign in again";
    }
    // Return original message if no pattern matches
    return message;
}
/**
 * Safely get error message from unknown error type
 */
export function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unexpected error occurred";
}
/**
 * Check if error is a network error
 */
export function isNetworkError(error) {
    const message = getErrorMessage(error).toLowerCase();
    return (message.includes("network") ||
        message.includes("fetch") ||
        message.includes("timeout") ||
        message.includes("failed to fetch"));
}
/**
 * Check if error is a retryable error
 */
export function isRetryableError(error) {
    const message = getErrorMessage(error).toLowerCase();
    return (message.includes("timeout") ||
        message.includes("network") ||
        message.includes("503") ||
        message.includes("502") ||
        message.includes("504"));
}
/**
 * Create a retry function with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (i < maxRetries - 1 && isRetryableError(error)) {
                const delay = baseDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            else {
                throw lastError;
            }
        }
    }
    throw lastError || new Error("Retry failed");
}
/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input) {
    return input;
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate password strength
 */
export function validatePassword(password) {
    const errors = [];
    if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    if (password.length > 128) {
        errors.push("Password is too long");
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
