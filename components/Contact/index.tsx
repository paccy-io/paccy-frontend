"use client";

import { useState } from "react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: "success" | "info";
  }>({ show: false, type: "info" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo({ show: true, type: "info" });
  };

  const handleEmailCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("support@paccy.io");
      setAlertInfo({ show: true, type: "success" });
    }
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, type: "info" });
  };

  const contactInfo = [
    {
      title: "Email",
      description: "support@paccy.io",
      icon: <MdEmail className="w-8 h-8 text-[#FEEBD8]" />,
      action: handleEmailCopy,
    },
    {
      title: "Location",
      description: "Global Remote Team",
      icon: <MdLocationOn className="w-8 h-8 text-[#FEEBD8]" />,
      action: () => {},
    },
    {
      title: "Response Time",
      description: "24-48 hours",
      icon: <MdPhone className="w-8 h-8 text-[#FEEBD8]" />,
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-[#141414] py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-6 font-climate-crisis">
            Get in Touch
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Have questions about Paccy? Need help with your college
            applications? We're here to support your journey to higher
            education.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20">
            <h2 className="text-2xl font-bold text-[#FEEBD8] mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white/80 font-semibold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/30 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white/80 font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/30 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-white/80 font-semibold mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/30 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-white/80 font-semibold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/30 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us more about your question or how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold hover:opacity-90 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20 flex items-center space-x-4 cursor-pointer hover:bg-[#1A1A1A]/80 transition-all duration-300"
                  onClick={info.action}
                >
                  <div className="flex-shrink-0">{info.icon}</div>
                  <div>
                    <h3 className="text-[#FEEBD8] font-semibold text-lg">
                      {info.title}
                    </h3>
                    <p className="text-white/70">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20">
              <h3 className="text-[#FEEBD8] font-semibold text-lg mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/paccy-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <FaGithub className="w-6 h-6 text-[#FEEBD8]" />
                </a>
                <a
                  href="https://instagram.com/paccy.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <FaInstagram className="w-6 h-6 text-[#FEEBD8]" />
                </a>
                <a
                  href="https://twitter.com/paccyio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <FaTwitter className="w-6 h-6 text-[#FEEBD8]" />
                </a>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 rounded-xl p-6 border border-blue-400/50">
              <h3 className="text-[#FEEBD8] font-semibold text-lg mb-4">
                Quick Help
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">Getting Started</h4>
                  <p className="text-white/70 text-sm">
                    New to Paccy? Check out our onboarding guide.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium">Technical Support</h4>
                  <p className="text-white/70 text-sm">
                    Having technical issues? We're here to help 24/7.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium">Feature Requests</h4>
                  <p className="text-white/70 text-sm">
                    Got ideas for new features? We'd love to hear them!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-2xl border border-blue-400/50 max-w-md w-full mx-4 overflow-hidden">
            {alertInfo.type === "success" ? (
              <>
                {/* Email Copied Success */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border-b border-green-400/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                      ✅
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-200">
                        Email Copied!
                      </h3>
                      <p className="text-green-300/80 text-sm">
                        The email address has been copied to your clipboard
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/80 mb-4">
                    You can now paste{" "}
                    <span className="font-semibold text-[#FEEBD8]">
                      support@paccy.io
                    </span>{" "}
                    into your email client to get in touch with us directly!
                  </p>
                  <button
                    onClick={closeAlert}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-[#141414] rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-300"
                  >
                    Got it!
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Form Submission Info */}
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 border-b border-blue-400/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl">
                      📧
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-200">
                        Contact Form Coming Soon!
                      </h3>
                      <p className="text-blue-300/80 text-sm">
                        We're setting up our contact system
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Our contact form integration is currently in development.
                    For now, please reach out to us directly via email and we'll
                    get back to you within 24 hours!
                  </p>

                  <div className="bg-[#141414] rounded-xl p-4 mb-6 border border-[#FEEBD8]/20">
                    <h4 className="text-[#FEEBD8] font-semibold mb-2">
                      Email us directly:
                    </h4>
                    <p className="text-blue-400 font-mono text-sm">
                      support@paccy.io
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={closeAlert}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-600 transition-all duration-300"
                    >
                      Understood
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          "mailto:support@paccy.io?subject=" +
                            encodeURIComponent(
                              formData.subject || "Contact from Paccy Website"
                            ) +
                            "&body=" +
                            encodeURIComponent(
                              `Hi Paccy Team,\n\n${
                                formData.message ||
                                "I would like to get in touch about..."
                              }\n\nBest regards,\n${formData.name || ""}`
                            ),
                          "_blank"
                        );
                        closeAlert();
                      }}
                      className="flex-1 px-4 py-3 border border-[#FEEBD8] text-[#FEEBD8] rounded-xl font-bold hover:bg-[#FEEBD8]/10 transition-all duration-300"
                    >
                      Email Us
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
