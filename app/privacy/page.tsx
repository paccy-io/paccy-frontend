"use client";

import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Paccy";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-20 pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl border border-neutral-700/50 p-8 md:p-12 shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center font-climate-crisis">
              Privacy Policy
            </h1>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-8 text-white/70">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="mb-4">
                    We collect information you provide directly to us, such as
                    when you create an account, use our services, or contact us
                    for support.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Personal Information
                  </h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Name, email address, and contact information</li>
                    <li>Username and password</li>
                    <li>Profile information and preferences</li>
                    <li>Academic information and college application data</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Usage Information
                  </h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Device information and IP address</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and time spent on the platform</li>
                    <li>Features used and interactions with our service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>
                      Send technical notices, updates, and support messages
                    </li>
                    <li>
                      Respond to your comments, questions, and customer service
                      requests
                    </li>
                    <li>Communicate about products, services, and events</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>
                      Detect, investigate, and prevent fraudulent transactions
                    </li>
                    <li>Personalize and improve the user experience</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    3. Information Sharing and Disclosure
                  </h2>
                  <p className="mb-4">
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties without your consent, except as
                    described in this policy.
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    We may share information in the following situations:
                  </h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>With your consent or at your direction</li>
                    <li>
                      With service providers who perform services on our behalf
                    </li>
                    <li>For legal reasons or to protect rights and safety</li>
                    <li>In connection with a merger, sale, or acquisition</li>
                    <li>
                      In aggregated or de-identified form that cannot reasonably
                      identify you
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    4. Data Security
                  </h2>
                  <p className="mb-4">
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                    These measures include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    5. Data Retention
                  </h2>
                  <p className="mb-4">
                    We retain your personal information for as long as necessary
                    to provide our services, comply with legal obligations,
                    resolve disputes, and enforce our agreements. When we no
                    longer need your information, we will securely delete or
                    anonymize it.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    6. Your Rights and Choices
                  </h2>
                  <p className="mb-4">
                    Depending on your location, you may have certain rights
                    regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong>Access:</strong> Request a copy of the personal
                      information we hold about you
                    </li>
                    <li>
                      <strong>Correction:</strong> Request correction of
                      inaccurate information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your
                      personal information
                    </li>
                    <li>
                      <strong>Portability:</strong> Request transfer of your
                      data to another service
                    </li>
                    <li>
                      <strong>Opt-out:</strong> Unsubscribe from marketing
                      communications
                    </li>
                  </ul>
                  <p className="mb-4">
                    To exercise these rights, please contact us at
                    privacy@paccy.io.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    7. Cookies and Tracking Technologies
                  </h2>
                  <p className="mb-4">
                    We use cookies and similar tracking technologies to collect
                    and track information about your use of our service. You can
                    control cookies through your browser settings, but disabling
                    cookies may affect the functionality of our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    8. Third-Party Services
                  </h2>
                  <p className="mb-4">
                    Our service may contain links to third-party websites or
                    integrate with third-party services. We are not responsible
                    for the privacy practices of these third parties. We
                    encourage you to review their privacy policies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    9. Children's Privacy
                  </h2>
                  <p className="mb-4">
                    Our service is not intended for children under the age of
                    13. We do not knowingly collect personal information from
                    children under 13. If we become aware that we have collected
                    personal information from a child under 13, we will take
                    steps to delete such information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    10. International Data Transfers
                  </h2>
                  <p className="mb-4">
                    Your information may be transferred to and processed in
                    countries other than your own. We ensure appropriate
                    safeguards are in place to protect your information in
                    accordance with this privacy policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="mb-4">
                    We may update this privacy policy from time to time. We will
                    notify you of any material changes by posting the new
                    privacy policy on this page and updating the "Last updated"
                    date. Your continued use of our service constitutes
                    acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    12. Contact Us
                  </h2>
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us at:
                  </p>
                  <div className="mb-4">
                    <p>
                      <strong>Email:</strong> privacy@paccy.io
                    </p>
                    <p>
                      <strong>Support:</strong> support@paccy.io
                    </p>
                  </div>
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
