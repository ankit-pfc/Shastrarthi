import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-serif text-xl font-semibold text-gray-900">Shastrarthi</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Ancient wisdom, illuminated with contextual AI for serious learners and researchers.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/discover">Text Discovery</Link></li>
                            <li><Link href="/library">Library</Link></li>
                            <li><Link href="/app/chat">AI Chat</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/traditions">Traditions</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/app/gallery">Guru Gallery</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/terms">Terms of Service</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
                    © {new Date().getFullYear()} Shastrarthi. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
