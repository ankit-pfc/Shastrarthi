import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 flex items-center justify-center px-4">
            <section className="max-w-lg w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm font-medium text-orange-600 mb-2">404</p>
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-600 mb-6">
                    The page you are looking for does not exist or may have been moved.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/app"
                        className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                        Go to App
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back Home
                    </Link>
                </div>
            </section>
        </main>
    );
}
