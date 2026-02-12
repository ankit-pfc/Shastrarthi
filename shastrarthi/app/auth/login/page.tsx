import AuthForm from "@/components/auth/AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm mode="login" />
        </Suspense>
    );
}

export const metadata = {
    title: "Sign In",
    description: "Sign in to Shastrarthi and continue studying the Vedas, Upanishads, Bhagavad Gita, and more with AI-powered explanations.",
};
