/**
 * Accessibility utilities
 */
/**
 * Generate a unique ID for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix = "id") {
    return `${prefix}-${++idCounter}`;
}
/**
 * Trap focus within an element (for modals, dialogs, etc.)
 */
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const handleTabKey = (e) => {
        if (e.key !== "Tab")
            return;
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement === null || lastElement === void 0 ? void 0 : lastElement.focus();
            }
        }
        else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement === null || firstElement === void 0 ? void 0 : firstElement.focus();
            }
        }
    };
    element.addEventListener("keydown", handleTabKey);
    firstElement === null || firstElement === void 0 ? void 0 : firstElement.focus();
    return () => {
        element.removeEventListener("keydown", handleTabKey);
    };
}
/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(message) {
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
export function createScreenReaderAnnouncer() {
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
export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/**
 * Check if high contrast is preferred
 */
export function prefersHighContrast() {
    return window.matchMedia("(prefers-contrast: high)").matches;
}
/**
 * Get the appropriate animation duration based on user preferences
 */
export function getAnimationDuration(defaultDuration) {
    return prefersReducedMotion() ? 0 : defaultDuration;
}
/**
 * Handle keyboard navigation for custom components
 */
export function handleKeyboardNavigation(event, actions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    switch (event.key) {
        case "Enter":
            (_a = actions.onEnter) === null || _a === void 0 ? void 0 : _a.call(actions);
            break;
        case " ":
            event.preventDefault();
            (_b = actions.onSpace) === null || _b === void 0 ? void 0 : _b.call(actions);
            break;
        case "Escape":
            (_c = actions.onEscape) === null || _c === void 0 ? void 0 : _c.call(actions);
            break;
        case "ArrowUp":
            event.preventDefault();
            (_d = actions.onArrowUp) === null || _d === void 0 ? void 0 : _d.call(actions);
            break;
        case "ArrowDown":
            event.preventDefault();
            (_e = actions.onArrowDown) === null || _e === void 0 ? void 0 : _e.call(actions);
            break;
        case "ArrowLeft":
            event.preventDefault();
            (_f = actions.onArrowLeft) === null || _f === void 0 ? void 0 : _f.call(actions);
            break;
        case "ArrowRight":
            event.preventDefault();
            (_g = actions.onArrowRight) === null || _g === void 0 ? void 0 : _g.call(actions);
            break;
        case "Home":
            event.preventDefault();
            (_h = actions.onHome) === null || _h === void 0 ? void 0 : _h.call(actions);
            break;
        case "End":
            event.preventDefault();
            (_j = actions.onEnd) === null || _j === void 0 ? void 0 : _j.call(actions);
            break;
    }
}
/**
 * Create ARIA attributes for a button that acts as a toggle
 */
export function createToggleAria(isOpen, label) {
    return {
        "aria-expanded": isOpen,
        "aria-label": label,
        "aria-pressed": isOpen,
    };
}
/**
 * Create ARIA attributes for a dialog/modal
 */
export function createDialogAria(isOpen, title) {
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
export function isVisible(element) {
    return !(element.offsetParent === null ||
        element.getAttribute("aria-hidden") === "true" ||
        element.style.display === "none" ||
        element.style.visibility === "hidden");
}
/**
 * Set focus to the first focusable element in a container
 */
export function setFocusToFirst(container) {
    const focusable = container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable === null || focusable === void 0 ? void 0 : focusable.focus();
}
/**
 * Restore focus to a previously focused element
 */
export function restoreFocus(element) {
    if (element && isVisible(element)) {
        element.focus();
    }
}
