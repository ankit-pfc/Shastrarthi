"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface AuthFormProps {
    mode: "login" | "signup";
}

interface ValidationErrors {
    email?: string;
    password?: string;
    name?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Clear success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

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
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || "An error occurred with Google sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-sand-800 rounded-lg shadow-lg border border-sand-200 dark:border-sand-700 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                            {mode === "login" ? "Welcome Back" : "Join Shastra"}
                        </h1>
                        <p className="text-sand-600 dark:text-sand-400">
                            {mode === "login"
                                ? "Sign in to continue your spiritual journey"
                                : "Create an account to begin exploring ancient wisdom"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-sand-700 dark:text-sand-300 mb-1">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
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
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sand-300 dark:border-sand-600 bg-sand-50 dark:bg-sand-900 text-sand-900 dark:text-sand-100 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
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
                            <label htmlFor="email" className="block text-sm font-medium text-sand-700 dark:text-sand-300 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
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
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sand-300 dark:border-sand-600 bg-sand-50 dark:bg-sand-900 text-sand-900 dark:text-sand-100 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                                />
                            </div>
                            {touched.email && validationErrors.email && (
                                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-sand-700 dark:text-sand-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
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
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sand-300 dark:border-sand-600 bg-sand-50 dark:bg-sand-900 text-sand-900 dark:text-sand-100 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
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
                            className="w-full flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-sand-200 dark:border-sand-700" />
                        </div>
                        <span className="relative bg-white dark:bg-sand-800 px-4 text-sm text-sand-500 dark:text-sand-400">
                            Or continue with
                        </span>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 border border-sand-300 dark:border-sand-600 py-2.5 rounded-lg font-medium hover:bg-sand-50 dark:hover:bg-sand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-1.57-.75-3.38-1.81-6.41a1.84 1.84 0 0 0 1.78c0-3.17.75-6.23 1.81-6.41a1.84 1.84 0 0 0 1.78c0-3.17.75-6.23 1.81-6.41zm-1.81 6.41h-3.64v-5.5h3.64v5.5zm-3.64-5.5c0-1.57.75-3.38 1.81-6.41a1.84 1.84 0 0 0 1.78c0-3.17.75-6.23 1.81-6.41a1.84 1.84 0 0 0 1.78c0-3.17.75-6.23 1.81-6.41zm-1.81 6.41h-3.64v-5.5h3.64v5.5z"
                                fill="#4285F4"
                            />
                        </svg>
                        <span className="text-sand-700 dark:text-sand-300">Google</span>
                    </button>

                    {/* Footer Link */}
                    <p className="mt-6 text-center text-sm text-sand-600 dark:text-sand-400">
                        {mode === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <a href="/auth/signup" className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 dark:hover:text-saffron-300 font-medium">
                                    Sign up
                                </a>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <a href="/auth/login" className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 dark:hover:text-saffron-300 font-medium">
                                    Sign in
                                </a>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
