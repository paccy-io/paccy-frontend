"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AlphaRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    graduationYear: "",
    reasonForInterest: "",
    referralSource: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - in reality this would send data to a backend
    console.log("Alpha registration submitted:", formData);
    setIsSubmitted(true);
  };

  const goBack = () => {
    router.back();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <Navbar />

        <div className="min-h-screen bg-[#141414] py-20 pt-28 flex items-center justify-center">
          {/* Background decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

          <div className="max-w-md mx-auto px-6 relative z-10 text-center">
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✓</span>
              </div>

              <h1 className="text-3xl font-bold text-[#FEEBD8] mb-4">
                Thank You!
              </h1>

              <p className="text-white/70 mb-6">
                Your alpha registration has been submitted successfully. We'll
                review your application and get back to you soon with next
                steps.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <span className="font-semibold">What's next?</span>
                  <br />
                  We'll send you an email within 3-5 business days with your
                  alpha access status and onboarding instructions.
                </p>
              </div>

              <button
                onClick={goBack}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold hover:opacity-90 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="min-h-screen bg-[#141414] py-20 pt-28">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

        {/* Development Notice Banner */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg p-4 text-center">
            <p className="text-orange-300 text-sm">
              <span className="font-semibold">🚧 Development Notice:</span>{" "}
              Alpha registration system is currently under development. This
              form is for demonstration purposes and submissions are not yet
              processed.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-4 font-climate-crisis">
              Join Paccy Alpha
            </h1>
            <p className="text-white/70 text-lg mb-4">
              Be among the first to experience the future of college application
              management
            </p>
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg p-4">
              <p className="text-purple-300 text-sm">
                <span className="font-semibold">🌟 Exclusive Access:</span>{" "}
                Limited spots available for our closed alpha program. Get early
                access to cutting-edge features and help shape the future of
                Paccy.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* School */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Current School *
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  placeholder="Lincoln High School"
                  required
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Expected Graduation Year *
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

              {/* Reason for Interest */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Why are you interested in Paccy? *
                </label>
                <textarea
                  name="reasonForInterest"
                  value={formData.reasonForInterest}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us what excites you about using Paccy for your college applications..."
                  required
                />
              </div>

              {/* Referral Source */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  How did you hear about us?
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white focus:border-[#FEEBD8] focus:outline-none transition-colors"
                >
                  <option value="">Select an option</option>
                  <option value="social-media">Social Media</option>
                  <option value="friend-referral">Friend/Referral</option>
                  <option value="school">School/Counselor</option>
                  <option value="search-engine">Search Engine</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Submit Alpha Registration
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-2xl p-6 border border-blue-400/30">
              <h3 className="text-[#FEEBD8] font-bold text-lg mb-4">
                What to expect as an alpha tester:
              </h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Early access to all core features
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Direct feedback channel with our development team
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Influence product development and feature prioritization
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Free lifetime access to Paccy when we launch
                </li>
              </ul>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={goBack}
                className="text-[#FEEBD8] hover:underline font-medium"
              >
                ← Back to previous page
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
