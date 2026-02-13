import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Image
                                src="/logo.png"
                                alt="Shastrarthi Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <h3 className="font-serif text-xl font-semibold text-white">Shastrarthi</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                            Read the Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras verse by verse with AI explanations and multi-tradition comparison. Free for students, practitioners, and researchers.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/discover" className="hover:text-white transition-colors">Text Discovery</Link></li>
                            <li><Link href="/library" className="hover:text-white transition-colors">Library</Link></li>
                            <li><Link href="/app/chat" className="hover:text-white transition-colors">AI Chat</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/traditions" className="hover:text-white transition-colors">Traditions</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/app/gallery" className="hover:text-white transition-colors">Guru Gallery</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-800 text-sm text-gray-500">
                    © {new Date().getFullYear()} Shastrarthi. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
