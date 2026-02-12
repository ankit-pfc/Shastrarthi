"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthFormProps {
    mode: "login" | "signup";
}

interface ValidationErrors {
    email?: string;
    password?: string;
    name?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
    const { signIn, signUp, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [signupComplete, setSignupComplete] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const requestedRedirect = searchParams.get("redirect");
    const redirectTo = requestedRedirect?.startsWith("/") ? requestedRedirect : "/app";

    useEffect(() => {
        if (!authLoading && user) {
            router.push(redirectTo);
            router.refresh();
        }
    }, [authLoading, user, router, redirectTo]);

    const validateEmail = (email: string): string | undefined => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        if (password.length > 128) return "Password is too long";
        if (mode === "signup") {
            if (!/[A-Za-z]/.test(password)) return "Password must include at least one letter";
            if (!/\d/.test(password)) return "Password must include at least one number";
        }
        return undefined;
    };

    const validateName = (name: string): string | undefined => {
        if (mode === "signup" && !name) return "Name is required";
        if (name && name.length > 100) return "Name is too long";
        return undefined;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        const errors: ValidationErrors = {};
        if (field === "email") errors.email = validateEmail(email);
        if (field === "password") errors.password = validatePassword(password);
        if (field === "name" && mode === "signup") errors.name = validateName(name);

        setValidationErrors(prev => ({ ...prev, ...errors }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate all fields
        const errors: ValidationErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
            name: mode === "signup" ? validateName(name) : undefined,
        };

        setValidationErrors(errors);
        setTouched({ email: true, password: true, name: true });

        if (Object.values(errors).some(Boolean)) {
            return;
        }

        setLoading(true);

        try {
            if (mode === "signup") {
                await signUp(email, password, name);
                setSignupComplete(true);
            } else {
                await signIn(email, password);
                router.push(redirectTo);
                router.refresh();
            }
        } catch (err: any) {
            // Handle specific Supabase error messages
            let errorMessage = "An error occurred. Please try again.";

            if (err?.message) {
                if (err.message.includes("Invalid login credentials")) {
                    errorMessage = "Invalid email or password";
                } else if (err.message.includes("Email not confirmed")) {
                    errorMessage = "Please confirm your email before signing in";
                } else if (err.message.includes("User already registered")) {
                    errorMessage = "An account with this email already exists";
                } else if (err.message.includes("Password should be at least")) {
                    errorMessage = "Password is too weak";
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 px-4 py-8">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="text-2xl font-semibold font-serif text-gray-900 mb-1.5">
                            {mode === "login" ? "Welcome Back" : "Join Shastrarthi"}
                        </h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {mode === "login"
                                ? "Sign in to continue your spiritual journey"
                                : "Create an account to begin exploring ancient wisdom"}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {signupComplete ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-center">
                            <Mail className="mx-auto h-8 w-8 text-green-700" />
                            <h2 className="mt-3 text-lg font-semibold text-gray-900">Check your email</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                We have sent a confirmation link to <span className="font-medium">{email}</span>. Click
                                the link in your email to activate your account.
                            </p>
                            <Link
                                href="/auth/login"
                                className="mt-4 inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (touched.name) {
                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    name: validateName(e.target.value)
                                                }));
                                            }
                                        }}
                                        onBlur={() => handleBlur("name")}
                                        placeholder="Your name"
                                        required
                                        maxLength={100}
                                        aria-invalid={touched.name && !!validationErrors.name}
                                        aria-describedby={validationErrors.name ? "name-error" : undefined}
                                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                {touched.name && validationErrors.name && (
                                    <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {validationErrors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (touched.email) {
                                            setValidationErrors(prev => ({
                                                ...prev,
                                                email: validateEmail(e.target.value)
                                            }));
                                        }
                                    }}
                                    onBlur={() => handleBlur("email")}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                    aria-invalid={touched.email && !!validationErrors.email}
                                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            {touched.email && validationErrors.email && (
                                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) {
                                            setValidationErrors(prev => ({
                                                ...prev,
                                                password: validatePassword(e.target.value)
                                            }));
                                        }
                                    }}
                                    onBlur={() => handleBlur("password")}
                                    placeholder="•••••••"
                                    required
                                    minLength={6}
                                    maxLength={128}
                                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                                    aria-invalid={touched.password && !!validationErrors.password}
                                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            {mode === "signup" && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 6 characters with a mix of letters and numbers.
                                </p>
                            )}
                            {touched.password && validationErrors.password && (
                                <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex h-10 items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {mode === "login" ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                <>
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                </>
                            )}
                        </button>
                        </form>
                    )}

                    {/* TODO: Re-enable Google OAuth button when provider is configured in Supabase dashboard. */}

                    {/* Footer Link */}
                    <p className="mt-5 text-center text-sm text-gray-600">
                        {mode === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
