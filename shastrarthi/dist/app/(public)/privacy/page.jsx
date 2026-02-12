export const metadata = {
    title: "Privacy Policy",
    description: "Read how Shastrarthi collects, uses, stores, and protects your information across our website and app.",
    alternates: { canonical: "/privacy" },
};
export default function PrivacyPolicyPage() {
    return (<main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <section className="max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                    <p className="text-sm font-medium text-orange-600 mb-2">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: February 13, 2026</p>

                    <div className="space-y-8 text-sm leading-7 text-gray-700">
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h2>
                            <p>
                                This Privacy Policy explains how Shastrarthi (&quot;we,&quot; &quot;our,&quot; or
                                &quot;us&quot;) collects, uses, discloses, and safeguards your information when you
                                use our website and services. By using Shastrarthi, you agree to the practices
                                described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                2. Information We Collect
                            </h2>
                            <p>We may collect the following categories of information:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    <span className="font-medium text-gray-900">Account information:</span> name,
                                    email address, and authentication details.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-900">Usage information:</span> pages
                                    visited, interactions, feature usage, and approximate device/browser details.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-900">User content:</span> prompts, notes,
                                    saved texts, bookmarks, and other content you create in the app.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-900">Technical logs:</span> IP-derived
                                    diagnostics, error logs, and security-related metadata.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Information</h2>
                            <p>We use collected information to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Provide, operate, and improve the Shastrarthi platform.</li>
                                <li>Authenticate users and secure accounts.</li>
                                <li>Personalize your study experience and preserve your saved work.</li>
                                <li>Respond to support requests and communicate important service notices.</li>
                                <li>Monitor reliability, prevent abuse, and comply with legal obligations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                4. Cookies and Similar Technologies
                            </h2>
                            <p>
                                We may use cookies and similar technologies to maintain sessions, remember preferences,
                                and understand product usage. You can manage cookies through your browser settings,
                                though disabling certain cookies may impact service functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Third-Party Services</h2>
                            <p>
                                We rely on third-party infrastructure and services (for example, hosting, database,
                                authentication, and AI providers) to deliver core functionality. These providers may
                                process information on our behalf under their own terms and privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h2>
                            <p>
                                We retain personal information for as long as needed to provide the service, meet
                                legal obligations, resolve disputes, and enforce agreements. You may request deletion
                                of your account data, subject to legal and operational retention requirements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights and Choices</h2>
                            <p>Depending on your location, you may have rights to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Access, correct, or delete your personal information.</li>
                                <li>Object to or restrict certain processing.</li>
                                <li>Request a copy of your data where legally applicable.</li>
                                <li>Withdraw consent where processing is based on consent.</li>
                            </ul>
                            <p className="mt-2">
                                To exercise these rights, contact us using the details in the Contact section.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Data Security</h2>
                            <p>
                                We implement reasonable technical and organizational safeguards intended to protect
                                your data. No method of transmission or storage is fully secure, and we cannot
                                guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Children&apos;s Privacy</h2>
                            <p>
                                Shastrarthi is not intended for children under 13 (or the minimum age required by
                                local law). We do not knowingly collect personal information from children. If you
                                believe a child has provided personal information, please contact us so we can take
                                appropriate action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Policy Updates</h2>
                            <p>
                                We may update this Privacy Policy from time to time. Changes become effective when
                                posted on this page with an updated &quot;Last updated&quot; date. Continued use of the
                                service after updates indicates acceptance of the revised policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Contact</h2>
                            <p>
                                For privacy questions or requests, contact us at{" "}
                                <a className="text-orange-700 hover:text-orange-800 underline" href="mailto:privacy@shastrarthi.com">
                                    privacy@shastrarthi.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </section>
            </div>
        </main>);
}
