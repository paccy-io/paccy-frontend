import Contact from "../../components/Contact";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Paccy team. Have questions about college applications or need support? We're here to help you succeed in your higher education journey.",
  keywords:
    "contact paccy, college application support, customer service, help with college apps, paccy support",
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background behind everything, including under navbar */}
      <div
        className="fixed inset-0 z-0 bg-[#0a0a0a] pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <div className="pt-20 relative z-10">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
