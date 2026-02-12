import AuthForm from "@/components/auth/AuthForm";
import { Suspense } from "react";
export default function LoginPage() {
    return (<Suspense fallback={null}>
            <AuthForm mode="login"/>
        </Suspense>);
}
export const metadata = {
    title: "Sign In - Shastrarthi",
    description: "Sign in to your Shastrarthi account",
};
