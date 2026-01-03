"use client";

import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | Paccy";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-20 pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl border border-neutral-700/50 p-8 md:p-12 shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center font-climate-crisis">
              Terms of Service
            </h1>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-8 text-white/70">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="mb-4">
                    By accessing and using Paccy ("the Service"), you accept and
                    agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please
                    do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    2. Description of Service
                  </h2>
                  <p className="mb-4">
                    Paccy is a college application management platform that
                    helps students organize their college application process,
                    manage deadlines, track progress, and receive guidance
                    throughout their journey.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    3. User Accounts
                  </h2>
                  <p className="mb-4">
                    To access certain features of the Service, you must register
                    for an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      Provide accurate, current, and complete information during
                      registration
                    </li>
                    <li>Maintain and update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>
                      Be responsible for all activities under your account
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    4. Privacy Policy
                  </h2>
                  <p className="mb-4">
                    Your privacy is important to us. We collect, use, and
                    protect your personal information in accordance with our
                    Privacy Policy. By using the Service, you consent to the
                    collection and use of your information as outlined in our
                    Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    5. User Conduct
                  </h2>
                  <p className="mb-4">You agree not to:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Use the Service for any unlawful purposes</li>
                    <li>Impersonate any person or entity</li>
                    <li>
                      Upload or transmit harmful, offensive, or inappropriate
                      content
                    </li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Attempt to gain unauthorized access to the Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    6. Intellectual Property
                  </h2>
                  <p className="mb-4">
                    The Service and its content, features, and functionality are
                    owned by Paccy and are protected by international copyright,
                    trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    7. Payment Terms
                  </h2>
                  <p className="mb-4">
                    Some features of the Service may require payment. All fees
                    are non-refundable unless otherwise stated. You agree to pay
                    all charges incurred in connection with your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    8. Limitation of Liability
                  </h2>
                  <p className="mb-4">
                    In no event shall Paccy be liable for any indirect,
                    incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use,
                    goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    9. Termination
                  </h2>
                  <p className="mb-4">
                    We may terminate or suspend your account and access to the
                    Service immediately, without prior notice, for conduct that
                    we believe violates these Terms or is harmful to other
                    users, us, or third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    10. Changes to Terms
                  </h2>
                  <p className="mb-4">
                    We reserve the right to modify these terms at any time. We
                    will notify users of any material changes via email or
                    through the Service. Your continued use constitutes
                    acceptance of the modified terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    11. Contact Information
                  </h2>
                  <p className="mb-4">
                    If you have any questions about these Terms of Service,
                    please contact us at:
                  </p>
                  <p className="mb-4">
                    <strong>Email:</strong> support@paccy.io
                  </p>
                </section>

                <section className="mt-12 pt-8 border-t border-neutral-700/50">
                  <p className="text-white/40 text-sm">
                    Last updated: August 10, 2025
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
