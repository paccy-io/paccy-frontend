"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../components/AuthProvider";
import { API_BASE_URL } from "../../../config/api";
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
  location: "",
  birthdate: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    github: "",
  },
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
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
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

  // API functions for updating user data
  const updateUserFields = async (fields: any) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`${API_BASE_URL}/users/${user?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user fields");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user fields:", error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData: any) => {
    try {
      const token = localStorage.getItem("auth-token");

      const response = await fetch(
        `${API_BASE_URL}/users/${user?.id}/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile update failed:", errorData);
        throw new Error(errorData.message || "Failed to update user profile");
      }

      const result = await response.json();
      console.log("Profile update success:", result);
      return result;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const updateUserPreferences = async (preferences: any) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(
        `${API_BASE_URL}/users/${user?.id}/preferences`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update user preferences"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  };

  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    planName: string;
  }>({ show: false, planName: "" });
  const [dataLoading, setDataLoading] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [newProfilePictureUrl, setNewProfilePictureUrl] = useState("");
  const [previewImageStatus, setPreviewImageStatus] = useState<
    "loading" | "loaded" | "error" | "idle"
  >("idle");

  // Loading and error states for API calls
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Helper function to convert ISO date to MM-DD-YYYY
  const formatDateToDisplay = (isoDate: string): string => {
    if (!isoDate) return "";
    try {
      const date = new Date(isoDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    } catch (error) {
      console.warn("Invalid date format:", isoDate);
      return "";
    }
  };

  // Helper function to format MM-DD-YYYY for API (keep same format)
  const formatDateToAPI = (mmddyyyy: string): string => {
    if (!mmddyyyy) return "";
    try {
      const parts = mmddyyyy.split("-");
      if (parts.length !== 3) return "";
      const [month, day, year] = parts;
      // Return MM-DD-YYYY format as string (same as input but ensure padding)
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      return `${formattedMonth}-${formattedDay}-${year}`;
    } catch (error) {
      console.warn("Invalid date format:", mmddyyyy);
      return "";
    }
  };

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
        location: user.profile?.location || mockFieldDefaults.location,
        birthdate:
          formatDateToDisplay(user.profile?.birthdate) ||
          mockFieldDefaults.birthdate,
        socialLinks:
          user.profile?.social_links || mockFieldDefaults.socialLinks,

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

        // Notifications - use backend preferences or defaults (reordered)
        notifications: {
          emailNotifications:
            user.preferences?.email_notifications ??
            mockFieldDefaults.notifications.emailNotifications,
          pushNotifications:
            user.preferences?.push_notifications ??
            mockFieldDefaults.notifications.pushNotifications,
          weeklyReports: mockFieldDefaults.notifications.weeklyReports,
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

  // Fetch fresh user data on page refresh/mount
  useEffect(() => {
    const fetchFreshUserData = async () => {
      if (verifyTokenAndFetchUser && !loading) {
        setDataLoading(true);
        try {
          await verifyTokenAndFetchUser();
        } catch (error) {
          console.warn("Failed to fetch fresh user data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchFreshUserData();
  }, []); // Run once when component mounts (page refresh)

  const handleUpgradeClick = () => {
    setAlertInfo({ show: true, planName: "Pro" });
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, planName: "" });
  };

  const handleLogout = () => {
    logout();
  };

  const handleRefreshData = async () => {
    if (verifyTokenAndFetchUser && !dataLoading) {
      setDataLoading(true);
      try {
        await verifyTokenAndFetchUser();
      } catch (error) {
        console.warn("Manual refresh failed:", error);
      } finally {
        setDataLoading(false);
      }
    }
  };

  const handleProfilePictureUpdate = async () => {
    if (newProfilePictureUrl.trim()) {
      const newUrl = newProfilePictureUrl.trim();

      // Check if the profile picture is actually changing
      if (newUrl === userData.profilePicture) {
        setShowProfilePictureModal(false);
        setNewProfilePictureUrl("");
        setUpdateSuccess("No changes detected");
        setTimeout(() => setUpdateSuccess(null), 3000);
        return;
      }

      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(null);

      try {
        // Update profile picture via API only if it's different
        await updateUserProfile({
          avatar_url: newUrl,
        });

        // Update local state
        setUserData((prev: any) => ({
          ...prev,
          profilePicture: newUrl,
        }));
        setEditedData((prev: any) => ({
          ...prev,
          profilePicture: newUrl,
        }));

        setShowProfilePictureModal(false);
        setNewProfilePictureUrl("");
        setUpdateSuccess("Profile picture updated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(null), 3000);
      } catch (error: any) {
        setUpdateError(error.message || "Failed to update profile picture");
        console.error("Error updating profile picture:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleProfilePictureModalClose = () => {
    setShowProfilePictureModal(false);
    setNewProfilePictureUrl("");
    setPreviewImageStatus("idle");
  };

  // Handle preview image URL changes
  useEffect(() => {
    if (newProfilePictureUrl.trim()) {
      setPreviewImageStatus("loading");
    } else {
      setPreviewImageStatus("idle");
    }
  }, [newProfilePictureUrl]);

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

  const handleSave = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const updatedFields: string[] = [];

      // Check for changes in basic user fields (first_name, last_name, username)
      const userFieldsData: any = {};
      if (editedData.firstName !== userData.firstName) {
        userFieldsData.first_name = editedData.firstName;
        updatedFields.push("first name");
      }
      if (editedData.lastName !== userData.lastName) {
        userFieldsData.last_name = editedData.lastName;
        updatedFields.push("last name");
      }
      if (editedData.username !== userData.username) {
        userFieldsData.username = editedData.username;
        updatedFields.push("username");
      }

      // Check for changes in profile data (avatar_url, bio, graduation_year, school, website, location, birthdate, social_links)
      const profileData: any = {};
      if (editedData.profilePicture !== userData.profilePicture) {
        profileData.avatar_url = editedData.profilePicture;
        updatedFields.push("profile picture");
      }
      if (editedData.bio !== userData.bio) {
        profileData.bio = editedData.bio;
        updatedFields.push("bio");
      }
      const newGradYear = editedData.graduationYear
        ? parseInt(editedData.graduationYear)
        : null;
      const oldGradYear = userData.graduationYear
        ? parseInt(userData.graduationYear)
        : null;
      if (newGradYear !== oldGradYear) {
        profileData.graduation_year = newGradYear;
        updatedFields.push("graduation year");
      }
      if (editedData.highSchool !== userData.highSchool) {
        profileData.school = editedData.highSchool;
        updatedFields.push("school");
      }
      if (editedData.website !== userData.website) {
        profileData.website = editedData.website;
        updatedFields.push("website");
      }
      if (editedData.location !== userData.location) {
        profileData.location = editedData.location;
        updatedFields.push("location");
      }
      if (editedData.birthdate !== userData.birthdate) {
        const formattedBirthdate = formatDateToAPI(editedData.birthdate);
        profileData.birthdate = formattedBirthdate;
        updatedFields.push("birthdate");
      }
      if (
        JSON.stringify(editedData.socialLinks) !==
        JSON.stringify(userData.socialLinks)
      ) {
        profileData.social_links = editedData.socialLinks;
        updatedFields.push("social links");
      }

      // Only send requests for endpoints that have changes
      if (Object.keys(userFieldsData).length > 0) {
        await updateUserFields(userFieldsData);
      }
      if (Object.keys(profileData).length > 0) {
        await updateUserProfile(profileData);
      }

      // Update local state
      setUserData(editedData);
      setIsEditing(false);

      if (updatedFields.length > 0) {
        setUpdateSuccess(`Updated: ${updatedFields.join(", ")}`);
      } else {
        setUpdateSuccess("No changes detected");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const updateNotification = async (key: string, value: boolean) => {
    try {
      // Check if the value is actually changing
      const currentValue = userData.notifications[key];
      if (currentValue === value) {
        return; // No change needed
      }

      // Clear any existing error/success messages
      setUpdateError(null);
      setUpdateSuccess(null);

      // Only email_notifications and push_notifications are connected to backend
      if (key === "emailNotifications") {
        await updateUserPreferences({
          email_notifications: value,
        });
      } else if (key === "pushNotifications") {
        await updateUserPreferences({
          push_notifications: value,
        });
      }
      // weeklyReports is not connected to backend yet - only local state

      // Update local state for all
      setUserData((prev: any) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: value,
        },
      }));

      // Show success message with friendly names
      const friendlyNames: { [key: string]: string } = {
        emailNotifications: "Email notifications",
        pushNotifications: "Push notifications",
        weeklyReports: "Weekly reports",
      };

      const friendlyName = friendlyNames[key] || key;
      const status = value ? "enabled" : "disabled";
      setUpdateSuccess(`${friendlyName} ${status} successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      setUpdateError(
        error.message || "Failed to update notification preference"
      );
      console.error("Error updating notification:", error);
    }
  };

  const updatePreference = async (key: string, value: string) => {
    try {
      // Check if the value is actually changing
      const currentValue = userData.preferences[key];
      if (currentValue === value) {
        return; // No change needed
      }

      // Clear any existing error/success messages
      setUpdateError(null);
      setUpdateSuccess(null);

      // Only theme, language, timezone are connected to backend
      if (key === "theme" || key === "language" || key === "timezone") {
        await updateUserPreferences({
          [key]: value,
        });
      }
      // timeFormat, dateFormat, defaultView are not connected to backend yet - only local state

      // Update local state for all
      setUserData((prev: any) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value,
        },
      }));

      // Show success message
      const friendlyKey = key.replace(/([A-Z])/g, " $1").toLowerCase();
      setUpdateSuccess(
        `${
          friendlyKey.charAt(0).toUpperCase() + friendlyKey.slice(1)
        } updated successfully!`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update preference");
      console.error("Error updating preference:", error);
    }
  };

  const updatePrivacy = async (key: string, value: boolean) => {
    try {
      // Check if the value is actually changing
      const currentValue = userData.privacy[key];
      if (currentValue === value) {
        return; // No change needed
      }

      // Clear any existing error/success messages
      setUpdateError(null);
      setUpdateSuccess(null);

      // Privacy settings go to profile endpoint as is_public_profile
      if (key === "isProfilePublic") {
        await updateUserProfile({
          is_public_profile: value,
        });
      } else {
        // For other privacy settings, keep them local for now
        // (these might not have backend endpoints yet)
      }

      // Update local state
      setUserData((prev: any) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          [key]: value,
        },
      }));

      // Show success message with friendly names
      const friendlyNames: { [key: string]: string } = {
        isProfilePublic: "Profile visibility",
        searchableProfile: "Searchable profile",
        showOnlineStatus: "Online status visibility",
        showEmail: "Email visibility",
        showPhone: "Phone visibility",
        allowMessaging: "Messaging permissions",
        dataCollection: "Data collection",
        analytics: "Analytics tracking",
      };

      const friendlyName = friendlyNames[key] || key;
      setUpdateSuccess(`${friendlyName} updated successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update privacy setting");
      console.error("Error updating privacy:", error);
    }
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
              disabled={isUpdating}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save"
              )}
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
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/50 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Profile Picture with enhanced styling */}
            <div
              className="relative mb-6 group cursor-pointer"
              onClick={() => setShowProfilePictureModal(true)}
            >
              {userData?.profilePicture || userData?.avatar || user?.avatar ? (
                <div className="w-32 h-32 relative">
                  <img
                    src={
                      userData?.profilePicture ||
                      userData?.avatar ||
                      user?.avatar
                    }
                    alt={`${userData?.firstName || "User"}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#FEEBD8]/20 shadow-xl group-hover:border-[#FEEBD8]/40 transition-all duration-200"
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
                    className="w-32 h-32 bg-gradient-to-br from-[#FEEBD8] to-[#E5D5B7] rounded-full flex items-center justify-center absolute top-0 left-0 shadow-xl group-hover:from-[#FEEBD8]/90 group-hover:to-[#E5D5B7]/90 transition-all duration-200"
                    style={{ display: "none" }}
                  >
                    <span className="text-[#141414] text-3xl font-bold">
                      {userData?.firstName?.[0] || "U"}
                      {userData?.lastName?.[0] || ""}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-[#FEEBD8] to-[#E5D5B7] rounded-full flex items-center justify-center shadow-xl group-hover:from-[#FEEBD8]/90 group-hover:to-[#E5D5B7]/90 transition-all duration-200">
                  <span className="text-[#141414] text-3xl font-bold">
                    {userData?.firstName?.[0] || "U"}
                    {userData?.lastName?.[0] || ""}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change Avatar
                </span>
              </div>

              {/* Online status indicator - repositioned to bottom right */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-[#1a1a1a] rounded-full"></div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#FEEBD8] mb-2">
                {userData?.firstName} {userData?.lastName}
              </h2>
              {userData?.username && (
                <div className="inline-flex items-center gap-1 bg-[#FEEBD8]/10 backdrop-blur-sm border border-[#FEEBD8]/20 rounded-full px-4 py-2">
                  <span className="text-[#FEEBD8]/90 text-sm font-medium">
                    @{userData.username}
                  </span>
                </div>
              )}
            </div>

            {/* User status badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
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
                disabled={true} // Disabled: Email changes not available yet
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
              <p className="text-[#FEEBD8]/40 text-xs mt-1">
                Email changes coming soon
              </p>
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
                disabled={true} // Disabled: Phone field not available in current API endpoints
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
              <p className="text-[#FEEBD8]/40 text-xs mt-1">
                Phone field coming soon
              </p>
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
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Location
              </label>
              <input
                type="text"
                value={isEditing ? editedData.location : userData.location}
                onChange={(e) =>
                  setEditedData((prev: any) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                disabled={!isEditing}
                placeholder="City, Country"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Birthdate
              </label>
              <input
                type="text"
                value={isEditing ? editedData.birthdate : userData.birthdate}
                onChange={(e) =>
                  setEditedData((prev: any) => ({
                    ...prev,
                    birthdate: e.target.value,
                  }))
                }
                disabled={!isEditing}
                placeholder="MM-DD-YYYY"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              />
            </div>

            {/* Social Links Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Social Links
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#FEEBD8]/50 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={
                      isEditing
                        ? editedData.socialLinks.linkedin
                        : userData.socialLinks.linkedin
                    }
                    onChange={(e) =>
                      setEditedData((prev: any) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          linkedin: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] text-sm focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#FEEBD8]/50 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={
                      isEditing
                        ? editedData.socialLinks.twitter
                        : userData.socialLinks.twitter
                    }
                    onChange={(e) =>
                      setEditedData((prev: any) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          twitter: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://twitter.com/username"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] text-sm focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#FEEBD8]/50 mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={
                      isEditing
                        ? editedData.socialLinks.instagram
                        : userData.socialLinks.instagram
                    }
                    onChange={(e) =>
                      setEditedData((prev: any) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          instagram: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] text-sm focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#FEEBD8]/50 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={
                      isEditing
                        ? editedData.socialLinks.github
                        : userData.socialLinks.github
                    }
                    onChange={(e) =>
                      setEditedData((prev: any) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          github: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] text-sm focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Bio
              </label>
              <textarea
                value={isEditing ? editedData.bio : userData.bio}
                onChange={(e) =>
                  setEditedData((prev: any) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                disabled={!isEditing}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50 resize-none"
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
                  {key === "weeklyReports" && " *"}
                </h3>
                <p className="text-[#FEEBD8]/60 text-sm">
                  {key === "emailNotifications" &&
                    "Get notified via email about deadlines, updates, and new features"}
                  {key === "weeklyReports" &&
                    "Receive weekly progress reports via email (coming soon)"}
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
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Time Format *
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
              Date Format *
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
              Default View *
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

          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Language
            </label>
            <select
              value={userData.preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="en">English</option>
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Español (España)</option>
              <option value="fr-FR">Français (France)</option>
              <option value="de-DE">Deutsch (Deutschland)</option>
              <option value="it-IT">Italiano (Italia)</option>
              <option value="tr-TR">Türkçe (Türkiye)</option>
              <option value="zh-CN">中文 (简体)</option>
              <option value="zh-TW">中文 (繁體)</option>
              <option value="ja-JP">日本語 (日本)</option>
              <option value="ko-KR">한국어 (대한민국)</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="pt-PT">Português (Portugal)</option>
              <option value="ru-RU">Русский (Россия)</option>
              <option value="ar-SA">العربية (السعودية)</option>
              <option value="nl-NL">Nederlands (Nederland)</option>
              <option value="sv-SE">Svenska (Sverige)</option>
              <option value="da-DK">Dansk (Danmark)</option>
              <option value="no-NO">Norsk (Norge)</option>
              <option value="fi-FI">Suomi (Suomi)</option>
              <option value="pl-PL">Polski (Polska)</option>
              <option value="cs-CZ">Čeština (Česká republika)</option>
              <option value="hu-HU">Magyar (Magyarország)</option>
              <option value="el-GR">Ελληνικά (Ελλάδα)</option>
              <option value="he-IL">עברית (ישראל)</option>
              <option value="hi-IN">हिन्दी (भारत)</option>
              <option value="th-TH">ไทย (ไทย)</option>
              <option value="vi-VN">Tiếng Việt (Việt Nam)</option>
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
              <h4 className="text-[#FEEBD8] font-medium">
                Searchable Profile *
              </h4>
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
              <h4 className="text-[#FEEBD8] font-medium">
                Show Online Status *
              </h4>
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
              <h4 className="text-[#FEEBD8] font-medium">
                Show Email Address *
              </h4>
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
              <h4 className="text-[#FEEBD8] font-medium">
                Show Phone Number *
              </h4>
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
              <h4 className="text-[#FEEBD8] font-medium">Allow Messaging *</h4>
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
              <h4 className="text-[#FEEBD8] font-medium">Data Collection *</h4>
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
              <h4 className="text-[#FEEBD8] font-medium">
                Analytics Tracking *
              </h4>
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
              <button
                onClick={handleRefreshData}
                disabled={dataLoading}
                className="flex items-center gap-2 bg-[#FEEBD8]/10 border border-[#FEEBD8]/30 rounded-lg px-3 py-1 hover:bg-[#FEEBD8]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-4 h-4 text-[#FEEBD8] ${
                    dataLoading ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-[#FEEBD8] text-sm">
                  {dataLoading ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>
            <p className="text-[#FEEBD8]/50 text-xs mt-2">
              * Settings marked with asterisk are not connected to backend yet
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
              {/* Feedback Messages */}
              {updateError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {updateError}
                  </div>
                </div>
              )}

              {updateSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {updateSuccess}
                  </div>
                </div>
              )}

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

      {/* Profile Picture Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Change Profile Picture
              </h2>
              <button
                onClick={handleProfilePictureModalClose}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={newProfilePictureUrl}
                  onChange={(e) => setNewProfilePictureUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] placeholder-[#FEEBD8]/40"
                />
                <p className="text-[#FEEBD8]/50 text-xs mt-2">
                  Enter a direct link to an image (JPG, PNG, GIF, WebP)
                </p>
              </div>

              {/* Preview */}
              {newProfilePictureUrl && (
                <div className="text-center">
                  <p className="text-[#FEEBD8]/70 text-sm mb-2">Preview:</p>
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#FEEBD8]/20 bg-neutral-800 flex items-center justify-center relative">
                    {previewImageStatus === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#FEEBD8]/30 border-t-[#FEEBD8] rounded-full animate-spin"></div>
                      </div>
                    )}
                    {previewImageStatus === "error" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                    )}
                    <img
                      src={newProfilePictureUrl}
                      alt="Preview"
                      className={`w-full h-full object-cover transition-opacity duration-200 ${
                        previewImageStatus === "loaded"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() => setPreviewImageStatus("loaded")}
                      onError={() => setPreviewImageStatus("error")}
                    />
                  </div>
                  {previewImageStatus === "error" && (
                    <p className="text-red-400 text-xs mt-2">
                      Failed to load image. Please check the URL.
                    </p>
                  )}
                  {previewImageStatus === "loaded" && (
                    <p className="text-[#FEEBD8]/50 text-xs mt-2">
                      {newProfilePictureUrl.length > 50
                        ? `${newProfilePictureUrl.substring(0, 50)}...`
                        : newProfilePictureUrl}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleProfilePictureModalClose}
                  className="flex-1 px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfilePictureUpdate}
                  disabled={!newProfilePictureUrl.trim() || isUpdating}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#141414] border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
