"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../components/AuthProvider";
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

// Mock data for fields not available in backend
const mockFieldDefaults = {
  phone: "+1 (555) 123-4567",
  graduationYear: "2025",
  highSchool: "Lincoln High School",
  gpa: "3.95",
  plan: "Pro",
  planExpiry: "2025-06-15",
  privacy: {
    isProfilePublic: false,
    showEmail: false,
    showPhone: false,
    allowMessaging: true,
    dataCollection: true,
    analytics: false,
    showOnlineStatus: true,
    searchableProfile: false,
  },
  notifications: {
    deadlineReminders: true,
    weeklyReports: true,
    emailUpdates: true,
    pushNotifications: false,
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
  const { user, loading, logout, verifyTokenAndFetchUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    planName: string;
  }>({ show: false, planName: "" });
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    document.title = "Settings | Paccy";
  }, []);

  // Create user data from AuthProvider user or use mock data for missing fields
  useEffect(() => {
    if (user) {
      const combinedUserData = {
        // Real data from backend
        firstName: user.first_name || user.name?.split(" ")[0] || "User",
        lastName: user.last_name || user.name?.split(" ")[1] || "",
        email: user.email,
        username: user.username || "",

        // Backend profile data or mock defaults
        phone: user.profile?.phone || mockFieldDefaults.phone,
        graduationYear:
          user.profile?.graduation_year?.toString() ||
          mockFieldDefaults.graduationYear,
        highSchool: user.profile?.school || mockFieldDefaults.highSchool,
        gpa: user.profile?.gpa || mockFieldDefaults.gpa,
        profilePicture: user.profile?.avatar_url || user.avatar,
        bio: user.profile?.bio || "",
        website: user.profile?.website || "",

        // Subscription data (mock for now)
        plan: mockFieldDefaults.plan,
        planExpiry: mockFieldDefaults.planExpiry,

        // Privacy settings - merge backend with defaults
        privacy: {
          ...mockFieldDefaults.privacy,
          isProfilePublic:
            user.profile?.is_public_profile ??
            mockFieldDefaults.privacy.isProfilePublic,
        },

        // Notifications - use backend preferences or defaults
        notifications: {
          deadlineReminders:
            user.preferences?.email_notifications ??
            mockFieldDefaults.notifications.deadlineReminders,
          weeklyReports: mockFieldDefaults.notifications.weeklyReports,
          emailUpdates:
            user.preferences?.email_notifications ??
            mockFieldDefaults.notifications.emailUpdates,
          pushNotifications:
            user.preferences?.push_notifications ??
            mockFieldDefaults.notifications.pushNotifications,
        },

        // App preferences - use backend preferences or defaults
        preferences: {
          theme: user.preferences?.theme || "dark",
          timeFormat: "12h",
          dateFormat: "MM/DD/YYYY",
          defaultView: "dashboard",
          language: user.preferences?.language || "en",
          timezone: user.preferences?.timezone || "UTC",
        },
      };

      setUserData(combinedUserData);
      setEditedData(combinedUserData);
    }
  }, [user]);

  // Optional: Try to fetch fresh user data in background (non-blocking)
  useEffect(() => {
    if (user && verifyTokenAndFetchUser && !dataLoading) {
      setDataLoading(true);
      verifyTokenAndFetchUser()
        .catch((error) => {
          console.warn("Background user data fetch failed:", error);
        })
        .finally(() => {
          setDataLoading(false);
        });
    }
  }, []); // Only run once on mount

  const handleUpgradeClick = () => {
    setAlertInfo({ show: true, planName: "Pro" });
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, planName: "" });
  };

  const handleLogout = () => {
    logout();
  };

  // Show loading if auth is loading or we don't have user data yet
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#FEEBD8] text-lg mb-4">
            Loading your settings...
          </div>
          <div className="text-[#FEEBD8]/60 text-sm">
            This should only take a moment
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "preferences", label: "Preferences", icon: <FaPalette /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "privacy", label: "Privacy", icon: <FaShieldAlt /> },
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
    setUserData((prev: any) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePreference = (key: string, value: string) => {
    setUserData((prev: any) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const updatePrivacy = (key: string, value: boolean) => {
    setUserData((prev: any) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
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
            {userData?.profilePicture || userData?.avatar || user?.avatar ? (
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <img
                  src={
                    userData?.profilePicture || userData?.avatar || user?.avatar
                  }
                  alt={`${userData?.firstName || "User"}'s profile`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#FEEBD8]/30"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                {/* Fallback initials (hidden by default) */}
                <div
                  className="w-24 h-24 bg-[#FEEBD8] rounded-full flex items-center justify-center absolute top-0 left-0"
                  style={{ display: "none" }}
                >
                  <span className="text-[#141414] text-2xl font-bold">
                    {userData?.firstName?.[0] || "U"}
                    {userData?.lastName?.[0] || ""}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#FEEBD8] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#141414] text-2xl font-bold">
                  {userData?.firstName?.[0] || "U"}
                  {userData?.lastName?.[0] || ""}
                </span>
              </div>
            )}
            <button className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors text-sm">
              Change Photo
            </button>

            {/* User status badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {user?.verification_level && user.verification_level > 0 && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1">
                  <span className="text-blue-400 text-xs font-medium">
                    ✓ Verified
                  </span>
                </div>
              )}
              {userData?.plan && userData.plan !== "Free" && (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-full px-3 py-1">
                  <span className="text-yellow-400 text-xs font-medium">
                    ⭐ {userData.plan}
                  </span>
                </div>
              )}
            </div>
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
                  setEditedData((prev: any) => ({
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
                  setEditedData((prev: any) => ({
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
                  setEditedData((prev: any) => ({
                    ...prev,
                    email: e.target.value,
                  }))
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
                  setEditedData((prev: any) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
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
                  setEditedData((prev: any) => ({
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
                  setEditedData((prev: any) => ({
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

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#FEEBD8]">Privacy Settings</h2>

      {/* Profile Privacy */}
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">
          Profile Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Profile Visibility</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                {userData.privacy.isProfilePublic
                  ? "Your profile is visible to other users and can be found in search results"
                  : "Your profile is private and only visible to you"}
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy(
                  "isProfilePublic",
                  !userData.privacy.isProfilePublic
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.isProfilePublic
                  ? "bg-[#FEEBD8]"
                  : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.isProfilePublic
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Searchable Profile</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Allow your profile to appear in search results
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy(
                  "searchableProfile",
                  !userData.privacy.searchableProfile
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.searchableProfile
                  ? "bg-[#FEEBD8]"
                  : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.searchableProfile
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Show Online Status</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Let others see when you're online
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy(
                  "showOnlineStatus",
                  !userData.privacy.showOnlineStatus
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.showOnlineStatus
                  ? "bg-[#FEEBD8]"
                  : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.showOnlineStatus
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {userData.privacy.isProfilePublic && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 mt-1">ℹ️</div>
              <div>
                <p className="text-blue-200 text-sm font-medium">
                  Public Profile Benefits
                </p>
                <p className="text-blue-300/80 text-sm mt-1">
                  Other students can find and connect with you, share
                  experiences, and you'll appear in our student directory.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information Privacy */}
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Show Email Address</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Display your email address on your public profile
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy("showEmail", !userData.privacy.showEmail)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.showEmail ? "bg-[#FEEBD8]" : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.showEmail ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Show Phone Number</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Display your phone number on your public profile
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy("showPhone", !userData.privacy.showPhone)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.showPhone ? "bg-[#FEEBD8]" : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.showPhone ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Allow Messaging</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Let other users send you direct messages
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy(
                  "allowMessaging",
                  !userData.privacy.allowMessaging
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.allowMessaging
                  ? "bg-[#FEEBD8]"
                  : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.allowMessaging
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Analytics */}
      <div className="bg-[#1a1a1a] border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">
          Data & Analytics
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Data Collection</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Allow us to collect usage data to improve your experience
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy(
                  "dataCollection",
                  !userData.privacy.dataCollection
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.dataCollection
                  ? "bg-[#FEEBD8]"
                  : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.dataCollection
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#FEEBD8] font-medium">Analytics Tracking</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Enable analytics to help us understand how you use Paccy
              </p>
            </div>
            <button
              onClick={() =>
                updatePrivacy("analytics", !userData.privacy.analytics)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData.privacy.analytics ? "bg-[#FEEBD8]" : "bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData.privacy.analytics ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 mt-1">🔒</div>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-2">
              Your Privacy Matters
            </p>
            <p className="text-blue-300/80 text-sm">
              We're committed to protecting your privacy. You can change these
              settings at any time. For more information, check out our{" "}
              <button className="text-[#FEEBD8] underline hover:text-[#E5D5B7]">
                Privacy Policy
              </button>
              .
            </p>
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
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/50 rounded-xl p-4 ">
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
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#FEEBD8]">
              Settings & Account
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#FEEBD8]/70">
                Manage your account settings and preferences
              </p>
              {user && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-600/30 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Live Data</span>
                </div>
              )}
              {dataLoading && (
                <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-600/30 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm">Syncing...</span>
                </div>
              )}
            </div>
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

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors mt-4"
              >
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-8">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "notifications" && renderNotificationsTab()}
              {activeTab === "preferences" && renderPreferencesTab()}
              {activeTab === "security" && renderSecurityTab()}
              {activeTab === "privacy" && renderPrivacyTab()}
              {activeTab === "billing" && renderBillingTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Payment System Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
