import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
    return <AuthForm mode="signup" />;
}

export const metadata = {
    title: "Sign Up - Shastra Platform",
    description: "Create a new Shastra Platform account",
};
