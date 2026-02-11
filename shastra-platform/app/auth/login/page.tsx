import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
    return <AuthForm mode="login" />;
}

export const metadata = {
    title: "Sign In - Shastra Platform",
    description: "Sign in to your Shastra Platform account",
};
