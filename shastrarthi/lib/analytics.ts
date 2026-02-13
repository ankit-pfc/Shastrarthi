import { sendGAEvent } from "@next/third-parties/google";

type EventName =
    | "chat_started"
    | "message_sent"
    | "guru_changed"
    | "tool_quiz_started"
    | "tool_quiz_completed"
    | "signup_completed"
    | "upgrade_viewed";

interface AnalyticsEvent {
    action: EventName;
    category?: string;
    label?: string;
    value?: number;
    [key: string]: string | number | undefined;
}

export function trackEvent({ action, ...props }: AnalyticsEvent) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${action}`, props);
    }

    sendGAEvent("event", action, props);
}
