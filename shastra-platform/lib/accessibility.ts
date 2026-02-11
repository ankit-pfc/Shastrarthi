/**
 * Accessibility utilities
 */

/**
 * Generate a unique ID for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix = "id"): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Trap focus within an element (for modals, dialogs, etc.)
 */
export function trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    element.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
        element.removeEventListener("keydown", handleTabKey);
    };
}

/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(message: string): void {
    const announcer = document.getElementById("sr-announcer");
    if (announcer) {
        announcer.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = "";
        }, 1000);
    }
}

/**
 * Create a screen reader announcer element
 */
export function createScreenReaderAnnouncer(): HTMLElement {
    let announcer = document.getElementById("sr-announcer");
    if (!announcer) {
        announcer = document.createElement("div");
        announcer.id = "sr-announcer";
        announcer.setAttribute("aria-live", "polite");
        announcer.setAttribute("aria-atomic", "true");
        announcer.className = "sr-only";
        document.body.appendChild(announcer);
    }
    return announcer;
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if high contrast is preferred
 */
export function prefersHighContrast(): boolean {
    return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Get the appropriate animation duration based on user preferences
 */
export function getAnimationDuration(defaultDuration: number): number {
    return prefersReducedMotion() ? 0 : defaultDuration;
}

/**
 * Handle keyboard navigation for custom components
 */
export function handleKeyboardNavigation(
    event: KeyboardEvent,
    actions: {
        onEnter?: () => void;
        onSpace?: () => void;
        onEscape?: () => void;
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
        onHome?: () => void;
        onEnd?: () => void;
    }
): void {
    switch (event.key) {
        case "Enter":
            actions.onEnter?.();
            break;
        case " ":
            event.preventDefault();
            actions.onSpace?.();
            break;
        case "Escape":
            actions.onEscape?.();
            break;
        case "ArrowUp":
            event.preventDefault();
            actions.onArrowUp?.();
            break;
        case "ArrowDown":
            event.preventDefault();
            actions.onArrowDown?.();
            break;
        case "ArrowLeft":
            event.preventDefault();
            actions.onArrowLeft?.();
            break;
        case "ArrowRight":
            event.preventDefault();
            actions.onArrowRight?.();
            break;
        case "Home":
            event.preventDefault();
            actions.onHome?.();
            break;
        case "End":
            event.preventDefault();
            actions.onEnd?.();
            break;
    }
}

/**
 * Create ARIA attributes for a button that acts as a toggle
 */
export function createToggleAria(isOpen: boolean, label: string) {
    return {
        "aria-expanded": isOpen,
        "aria-label": label,
        "aria-pressed": isOpen,
    };
}

/**
 * Create ARIA attributes for a dialog/modal
 */
export function createDialogAria(isOpen: boolean, title: string) {
    return {
        role: "dialog",
        "aria-modal": isOpen,
        "aria-labelledby": title,
        "aria-hidden": !isOpen,
    };
}

/**
 * Check if an element is visible to screen readers
 */
export function isVisible(element: HTMLElement): boolean {
    return !(
        element.offsetParent === null ||
        element.getAttribute("aria-hidden") === "true" ||
        element.style.display === "none" ||
        element.style.visibility === "hidden"
    );
}

/**
 * Set focus to the first focusable element in a container
 */
export function setFocusToFirst(container: HTMLElement): void {
    const focusable = container.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
}

/**
 * Restore focus to a previously focused element
 */
export function restoreFocus(element: HTMLElement | null): void {
    if (element && isVisible(element)) {
        element.focus();
    }
}
