export const metadata = {
    title: "Terms of Service",
    description: "Review the Terms of Service for using Shastrarthi, including acceptable use, account responsibilities, and legal limitations.",
    alternates: { canonical: "/terms" },
};
export default function TermsPage() {
    return (<main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <section className="max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                    <p className="text-sm font-medium text-orange-600 mb-2">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: February 13, 2026</p>

                    <div className="space-y-8 text-sm leading-7 text-gray-700">
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                            <p>
                                These Terms of Service (&quot;Terms&quot;) govern your use of Shastrarthi. By accessing
                                or using the website and application, you agree to be bound by these Terms. If you do
                                not agree, you must not use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Eligibility and Accounts</h2>
                            <p>
                                You must be legally capable of entering into a binding agreement to use Shastrarthi.
                                You are responsible for maintaining the confidentiality of your login credentials and
                                for all activities under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                3. Acceptable Use and Restrictions
                            </h2>
                            <p>You agree not to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Use the service for unlawful, harmful, or fraudulent purposes.</li>
                                <li>Attempt unauthorized access to systems, data, or other accounts.</li>
                                <li>Interfere with the platform&apos;s reliability, security, or availability.</li>
                                <li>Upload or transmit malicious code, spam, or abusive content.</li>
                                <li>Scrape or harvest data in ways not permitted by law or these Terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. User Content</h2>
                            <p>
                                You retain ownership of content you submit to Shastrarthi, such as notes and prompts.
                                You grant us a limited license to host, process, and display that content solely for
                                operating and improving the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                5. Intellectual Property Rights
                            </h2>
                            <p>
                                The Shastrarthi platform, including software, branding, and original materials, is
                                owned by us or our licensors and protected by applicable intellectual property laws.
                                Except as expressly permitted, no rights are granted to reproduce, modify, distribute,
                                or create derivative works.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Service Availability</h2>
                            <p>
                                We may modify, suspend, or discontinue any part of the service at any time. We do not
                                guarantee uninterrupted or error-free operation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Disclaimers</h2>
                            <p>
                                Shastrarthi is provided on an &quot;as is&quot; and &quot;as available&quot; basis to
                                the maximum extent permitted by law. We disclaim all warranties, express or implied,
                                including merchantability, fitness for a particular purpose, and non-infringement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                8. Limitation of Liability
                            </h2>
                            <p>
                                To the fullest extent permitted by law, Shastrarthi and its affiliates will not be
                                liable for any indirect, incidental, consequential, special, or punitive damages, or
                                any loss of profits, data, goodwill, or business opportunity arising from your use of
                                the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Termination</h2>
                            <p>
                                You may stop using the service at any time. We may suspend or terminate access if you
                                violate these Terms or if required for legal or security reasons.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Governing Law</h2>
                            <p>
                                These Terms are governed by applicable laws of the jurisdiction where Shastrarthi
                                operates, without regard to conflict-of-law principles. You agree to submit to
                                competent courts in that jurisdiction unless otherwise required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Updates to Terms</h2>
                            <p>
                                We may revise these Terms periodically. Updated Terms become effective when posted with
                                a revised &quot;Last updated&quot; date. Your continued use of the service after
                                updates constitutes acceptance of the revised Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">12. Contact</h2>
                            <p>
                                For legal inquiries regarding these Terms, contact us at{" "}
                                <a className="text-orange-700 hover:text-orange-800 underline" href="mailto:legal@shastrarthi.com">
                                    legal@shastrarthi.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </section>
            </div>
        </main>);
}
