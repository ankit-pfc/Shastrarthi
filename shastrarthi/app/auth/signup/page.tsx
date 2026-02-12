import AuthForm from "@/components/auth/AuthForm";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm mode="signup" />
        </Suspense>
    );
}

export const metadata = {
    title: "Create Free Account",
    description: "Create a free Shastrarthi account to read Sanskrit texts verse-by-verse, get AI explanations, compare traditions, and save your study progress.",
};
