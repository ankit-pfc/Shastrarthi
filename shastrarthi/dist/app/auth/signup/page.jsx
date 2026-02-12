import AuthForm from "@/components/auth/AuthForm";
import { Suspense } from "react";
export default function SignupPage() {
    return (<Suspense fallback={null}>
            <AuthForm mode="signup"/>
        </Suspense>);
}
export const metadata = {
    title: "Sign Up - Shastrarthi",
    description: "Create your Shastrarthi account",
};
