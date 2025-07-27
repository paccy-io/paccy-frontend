"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  FaArrowLeft,
  FaUser,
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaCreditCard,
  FaDownload,
  FaSignOutAlt,
  FaCheck,
  FaMoon,
  FaSun,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt,
  FaCrown,
} from "react-icons/fa";

// Mock user data
const mockUserData = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  graduationYear: "2025",
  highSchool: "Lincoln High School",
  gpa: "3.95",
  profilePicture: "/api/placeholder/100/100",
  plan: "Pro",
  planExpiry: "2025-06-15",
  notifications: {
    deadlineReminders: true,
    weeklyReports: true,
    emailUpdates: true,
    pushNotifications: false,
  },
  preferences: {
    theme: "dark",
    timeFormat: "12h",
    dateFormat: "MM/DD/YYYY",
    defaultView: "dashboard",
  },
};

const planFeatures = {
  Free: [
    "Track up to 5 colleges",
    "Basic essay management",
    "Calendar view",
    "Document storage (100MB)",
  ],
  Pro: [
    "Unlimited college tracking",
    "AI essay feedback",
    "Advanced analytics",
    "Document storage (5GB)",
    "Priority support",
    "Export capabilities",
  ],
  Premium: [
    "Everything in Pro",
    "Personal college counselor",
    "Interview preparation",
    "Scholarship matching",
    "Document storage (20GB)",
    "1-on-1 guidance sessions",
  ],
};

export default function Settings() {
  const [userData, setUserData] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    planName: string;
  }>({ show: false, planName: "" });

  useEffect(() => {
    document.title = "Settings | Paccy";
  }, []);

  const handleUpgradeClick = () => {
    setAlertInfo({ show: true, planName: "Pro" });
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, planName: "" });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "preferences", label: "Preferences", icon: <FaPalette /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "billing", label: "Billing", icon: <FaCreditCard /> },
  ];

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const updateNotification = (key: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePreference = (key: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#FEEBD8]">
          Profile Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#FEEBD8] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-[#141414] text-2xl font-bold">
                {userData.firstName[0]}
                {userData.lastName[0]}
              </span>
            </div>
            <button className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors text-sm">
              Change Photo
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={isEditing ? editedData.firstName : userData.firstName}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={isEditing ? editedData.lastName : userData.lastName}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={isEditing ? editedData.email : userData.email}
                onChange={(e) =>
                  setEditedData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={isEditing ? editedData.phone : userData.phone}
                onChange={(e) =>
                  setEditedData((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                High School
              </label>
              <input
                type="text"
                value={isEditing ? editedData.highSchool : userData.highSchool}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    highSchool: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Graduation Year
              </label>
              <input
                type="text"
                value={
                  isEditing
                    ? editedData.graduationYear
                    : userData.graduationYear
                }
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    graduationYear: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FEEBD8]">
        Notification Settings
      </h2>

      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <div className="space-y-4">
          {Object.entries(userData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-[#FEEBD8] font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </h3>
                <p className="text-[#FEEBD8]/60 text-sm">
                  {key === "deadlineReminders" &&
                    "Get notified about upcoming application deadlines"}
                  {key === "weeklyReports" &&
                    "Receive weekly progress reports via email"}
                  {key === "emailUpdates" &&
                    "Get updates about new features and tips"}
                  {key === "pushNotifications" &&
                    "Receive push notifications on your device"}
                </p>
              </div>
              <button
                onClick={() => updateNotification(key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? "bg-[#FEEBD8]" : "bg-neutral-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FEEBD8]">Preferences</h2>

      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Theme
            </label>
            <select
              value={userData.preferences.theme}
              onChange={(e) => updatePreference("theme", e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Time Format
            </label>
            <select
              value={userData.preferences.timeFormat}
              onChange={(e) => updatePreference("timeFormat", e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Date Format
            </label>
            <select
              value={userData.preferences.dateFormat}
              onChange={(e) => updatePreference("dateFormat", e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Default View
            </label>
            <select
              value={userData.preferences.defaultView}
              onChange={(e) => updatePreference("defaultView", e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="dashboard">Dashboard</option>
              <option value="colleges">Colleges</option>
              <option value="calendar">Calendar</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FEEBD8]">Security Settings</h2>

      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#FEEBD8] font-medium">Change Password</h3>
              <p className="text-[#FEEBD8]/60 text-sm">
                Update your account password
              </p>
            </div>
            <button className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#FEEBD8] font-medium">
                Two-Factor Authentication
              </h3>
              <p className="text-[#FEEBD8]/60 text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#FEEBD8] font-medium">Active Sessions</h3>
              <p className="text-[#FEEBD8]/60 text-sm">
                Manage your active login sessions
              </p>
            </div>
            <button className="bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-700 transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FEEBD8]">
        Billing & Subscription
      </h2>

      {/* Payment System Notice */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl">🚧</span>
          <div className="text-center">
            <p className="text-orange-200 font-semibold">
              Payment System Coming Soon!
            </p>
            <p className="text-orange-300/80 text-sm">
              We're currently integrating our payment system. Contact us for
              early access opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-xl font-semibold text-[#FEEBD8]">
                {userData.plan} Plan
              </h3>
              <p className="text-[#FEEBD8]/60">
                Expires on {new Date(userData.planExpiry).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgradeClick}
            className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#FEEBD8]/70">
            Current Plan Features:
          </h4>
          {planFeatures[userData.plan as keyof typeof planFeatures].map(
            (feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <FaCheck className="text-green-400 text-sm" />
                <span className="text-[#FEEBD8]/70 text-sm">{feature}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#FEEBD8]">
            Billing History
          </h3>
          <button className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors flex items-center gap-2">
            <FaDownload />
            <span>Download</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
            <div>
              <p className="text-[#FEEBD8] font-medium">Pro Plan - Annual</p>
              <p className="text-[#FEEBD8]/60 text-sm">December 15, 2024</p>
            </div>
            <p className="text-[#FEEBD8] font-semibold">$99.00</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
            <div>
              <p className="text-[#FEEBD8] font-medium">Pro Plan - Annual</p>
              <p className="text-[#FEEBD8]/60 text-sm">December 15, 2023</p>
            </div>
            <p className="text-[#FEEBD8] font-semibold">$89.00</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/dashboard"
            className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#FEEBD8]">
              Settings & Account
            </h1>
            <p className="text-[#FEEBD8]/70 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#FEEBD8] text-[#141414]"
                        : "text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:bg-neutral-800"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-neutral-700">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors">
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-8">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "notifications" && renderNotificationsTab()}
              {activeTab === "preferences" && renderPreferencesTab()}
              {activeTab === "security" && renderSecurityTab()}
              {activeTab === "billing" && renderBillingTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Payment System Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-2xl border border-orange-400/50 max-w-md w-full mx-4 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-6 border-b border-orange-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl">
                  🚧
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-200">
                    Payment System Coming Soon!
                  </h3>
                  <p className="text-orange-300/80 text-sm">
                    We're working hard to bring you the best experience
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/80 mb-4 leading-relaxed">
                We're currently integrating our payment system for the{" "}
                <span className="font-semibold text-[#FEEBD8]">
                  {alertInfo.planName}
                </span>{" "}
                plan. Our team is working around the clock to make this
                available soon!
              </p>

              <div className="bg-[#141414] rounded-xl p-4 mb-6 border border-[#FEEBD8]/20">
                <h4 className="text-[#FEEBD8] font-semibold mb-2">
                  Want Early Access?
                </h4>
                <p className="text-white/70 text-sm mb-2">
                  Contact us directly and we'll get you set up personally:
                </p>
                <p className="text-blue-400 font-mono text-sm">
                  support@paccy.io
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeAlert}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 text-[#141414] rounded-xl font-bold hover:from-orange-500 hover:to-yellow-600 transition-all duration-300"
                >
                  Got it!
                </button>
                <button
                  onClick={() => {
                    window.open(
                      "mailto:support@paccy.io?subject=Early Access Request for " +
                        alertInfo.planName +
                        " Plan",
                      "_blank"
                    );
                    closeAlert();
                  }}
                  className="flex-1 px-4 py-3 border border-[#FEEBD8] text-[#FEEBD8] rounded-xl font-bold hover:bg-[#FEEBD8]/10 transition-all duration-300"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
