"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-zinc dark:prose-invert max-w-none"
                >
                    <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using PurrfectHub, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p>
                            PurrfectHub provides a platform for animal shelters to list cats for adoption and for individuals to browse and apply for adoptions. We are a facilitator and do not take ownership of the animals listed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>You must be at least 18 years old to use this service.</li>
                            <li>You agree to provide accurate and complete information during registration and adoption applications.</li>
                            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Shelter Responsibilities</h2>
                        <p>
                            Shelters must ensure that all information provided about the animals is accurate and up-to-date. Shelters are responsible for the health and welfare of the animals until a successful adoption is completed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Donations</h2>
                        <p>
                            Donations made through PurrfectHub are processed via Stripe. By making a donation, you agree to Stripe's terms and conditions. Donations are generally non-refundable unless required by law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                        <p>
                            In no event shall PurrfectHub, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
