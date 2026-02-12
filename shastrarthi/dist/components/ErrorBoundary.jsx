"use client";
import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleReset = () => {
            this.setState({ hasError: false, error: null });
        };
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    render() {
        var _a;
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900 px-4">
                    <div className="max-w-md w-full bg-white dark:bg-sand-800 rounded-lg shadow-lg border border-sand-200 dark:border-sand-700 p-8 text-center">
                        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4"/>
                        <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-sand-600 dark:text-sand-400 mb-6">
                            {((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || "An unexpected error occurred"}
                        </p>
                        <button onClick={this.handleReset} className="inline-flex items-center gap-2 px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg font-medium transition-colors">
                            <RefreshCw className="h-4 w-4"/>
                            Try Again
                        </button>
                    </div>
                </div>);
        }
        return this.props.children;
    }
}
