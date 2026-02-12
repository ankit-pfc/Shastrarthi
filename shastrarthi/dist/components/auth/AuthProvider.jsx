"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const AuthContext = createContext(undefined);
function getConfiguredAppOrigin() {
    var _a;
    const envUrl = (_a = process.env.NEXT_PUBLIC_APP_URL) === null || _a === void 0 ? void 0 : _a.trim();
    if (envUrl) {
        const withProtocol = /^https?:\/\//i.test(envUrl) ? envUrl : `https://${envUrl}`;
        try {
            return new URL(withProtocol).origin;
        }
        catch (_b) {
            // Fall through to window origin when env value is malformed.
        }
    }
    return window.location.origin;
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const setAuthFlagCookie = (isAuthenticated) => {
            if (isAuthenticated) {
                document.cookie = "sb-local-auth-token=1; path=/; max-age=2592000; samesite=lax";
            }
            else {
                document.cookie = "sb-local-auth-token=; path=/; max-age=0; samesite=lax";
            }
        };
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            var _a;
            setSession(session);
            setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            setAuthFlagCookie(!!(session === null || session === void 0 ? void 0 : session.user));
            setLoading(false);
        });
        // Listen for auth changes
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            var _a;
            setSession(session);
            setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            setAuthFlagCookie(!!(session === null || session === void 0 ? void 0 : session.user));
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw error;
    };
    const signUp = async (email, password, name) => {
        const appOrigin = getConfiguredAppOrigin();
        const emailRedirectTo = new URL("/auth/callback", appOrigin).toString();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                emailRedirectTo,
            },
        });
        if (error)
            throw error;
    };
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
    };
    const signInWithGoogle = async (nextPath) => {
        const appOrigin = getConfiguredAppOrigin();
        const callbackUrl = new URL("/auth/callback", appOrigin);
        if (nextPath === null || nextPath === void 0 ? void 0 : nextPath.startsWith("/")) {
            callbackUrl.searchParams.set("next", nextPath);
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: callbackUrl.toString(),
            },
        });
        if (error)
            throw error;
    };
    return (<AuthContext.Provider value={{
            user,
            session,
            loading,
            signIn,
            signUp,
            signOut,
            signInWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
