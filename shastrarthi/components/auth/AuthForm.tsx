"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
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
    const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const requestedRedirect = searchParams.get("redirect");
    const redirectTo = requestedRedirect?.startsWith("/") ? requestedRedirect : "/app";

    // Clear success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

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
        setSuccess("");

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
                setSuccess("Account created successfully! Please check your email to verify.");
            } else {
                await signIn(email, password);
                setSuccess("Signed in successfully!");
            }
            // Redirect will be handled by middleware or page logic
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

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGoogle(redirectTo);
        } catch (err: any) {
            setError(err.message || "An error occurred with Google sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-7 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-7">
                        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-gray-900 mb-1.5">
                            {mode === "login" ? "Welcome Back" : "Join Shastrarthi"}
                        </h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {mode === "login"
                                ? "Sign in to continue your spiritual journey"
                                : "Create an account to begin exploring ancient wisdom"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                        className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
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
                            className="w-full flex h-12 items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Divider */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex h-12 items-center justify-center gap-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.6 12 2.6A9.4 9.4 0 0 0 2.6 12 9.4 9.4 0 0 0 12 21.4c5.4 0 9-3.8 9-9 0-.6-.1-1.1-.2-1.6H12z" />
                            <path fill="#34A853" d="M2.6 7.9l3.2 2.3c.9-1.8 2.7-3 5.2-3 1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.6 12 2.6c-3.6 0-6.8 2-8.4 5.3z" />
                            <path fill="#FBBC05" d="M12 21.4c2.6 0 4.8-.9 6.4-2.5l-3-2.4c-.8.6-1.8 1-3.4 1-2.5 0-4.6-1.7-5.3-3.9l-3.2 2.5c1.6 3.3 4.9 5.3 8.5 5.3z" />
                            <path fill="#4285F4" d="M21 12.4c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.4-1.1 2.6-2.1 3.5l3 2.4c1.7-1.6 2.6-4 2.6-8.2z" />
                        </svg>
                        <span className="text-gray-700">Google</span>
                    </button>

                    {/* Footer Link */}
                    <p className="mt-7 text-center text-sm text-gray-600">
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
