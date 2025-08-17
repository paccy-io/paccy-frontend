"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { api, ApiError } from "../../../../lib/api/college-applications";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../config/api";
import {
  CollegeApplication,
  Checklist as BackendChecklist,
  Task as BackendTask,
  Status,
  ApplicationType,
  Priority,
  Category,
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskStatus,
  TaskResponsible,
} from "../../../../lib/types";
import { useToast } from "../../../../lib/hooks/useToast";
import { setGlobalNotificationCallbacks } from "../../../../lib/utils/errorNotification";
import ToastNotification from "../../../../components/ToastNotification";
import {
  FaArrowLeft,
  FaUniversity,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaSave,
  FaTasks,
  FaBell,
  FaChartLine,
  FaClipboardList,
  FaFileAlt,
  FaUser,
  FaGraduationCap,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
  FaTimes,
  FaTrash,
  FaTag,
  FaUpload,
  FaDownload,
  FaEye,
  FaExternalLinkAlt,
  FaStar,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

interface College {
  id: string;
  universityName: string;
  universityCountry: string;
  universityState: string | null;
  universityWebsite: string;
  status: string;
  deadline: string;
  applicationDeadline: string;
  type: string;
  major: string;
  notes: string;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  // Enhanced fields
  applicationFee?: number;
  contactEmail?: string;
  contactPhone?: string;
  campusVisitDate?: string;
  interviewDate?: string;
  priority?: "Safety" | "Target" | "Reach";
  gpa?: number;
  testScores?: {
    sat?: number;
    act?: number;
    satSubject?: { subject: string; score: number }[];
    ap?: { subject: string; score: number }[];
  };
}

// University from autocomplete API
interface UniversityData {
  web_pages: string[];
  name: string;
  alpha_two_code: string;
  "state-province": string;
  domains: string[];
  country: string;
}

interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  deadline?: string;
  notes?: string;
  // Enhanced fields
  priority?: "Low" | "Medium" | "High";
  category?: string;
  taskType?: string;
  appComponent?: string;
  status?: string;
  responsibility?: string;
  assignedTo?: string;
}

interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  progress: number;
  // Enhanced fields
  description?: string;
  category?: string;
  dueDate?: string;
}

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image" | "other";
  size: number;
  uploadDate: string;
  category: "Transcript" | "Essay" | "Recommendation" | "Test Score" | "Other";
  status: "Draft" | "Final" | "Submitted";
}

// Mock data - REMOVE WHEN BACKEND IS READY
const statusColors: Record<string, string> = {
  Researching: "bg-gray-500",
  "In Progress": "bg-yellow-500",
  "Ready to Submit": "bg-blue-500",
  Submitted: "bg-green-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-red-500",
  Waitlisted: "bg-orange-500",
};

const typeColors: Record<string, string> = {
  ED: "bg-purple-500",
  EA: "bg-blue-500",
  RD: "bg-gray-500",
};

// Helper functions for date format conversion
const formatDateForInput = (isoDate: string | undefined | null) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0]; // Extract YYYY-MM-DD from ISO format
};

const formatDateForBackend = (inputDate: string) => {
  if (!inputDate || inputDate.trim() === "") {
    // Use tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    return `${tomorrowISO}T23:59:59Z`;
  }
  return `${inputDate}T23:59:59Z`; // Convert to ISO 8601 format
};

export default function CollegeDetail() {
  const router = useRouter();
  const params = useParams();
  const collegeId = params.id as string;
  const {
    success: showSuccess,
    error: showError,
    toasts,
    removeToast,
  } = useToast();

  // Initialize global notification callbacks for API errors
  useEffect(() => {
    setGlobalNotificationCallbacks(showError, showSuccess);
  }, [showError, showSuccess]);

  // Backend integration states
  const [college, setCollege] = useState<College | null>(null);
  const [backendApplication, setBackendApplication] =
    useState<CollegeApplication | null>(null);
  const [backendChecklists, setBackendChecklists] = useState<
    BackendChecklist[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(
    new Set()
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Modal states
  const [showEditCollegeModal, setShowEditCollegeModal] = useState(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditChecklistModal, setShowEditChecklistModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  // Edit states
  const [selectedChecklistForTask, setSelectedChecklistForTask] = useState<
    string | null
  >(null);
  const [editingChecklist, setEditingChecklist] =
    useState<BackendChecklist | null>(null);
  const [editingTask, setEditingTask] = useState<BackendTask | null>(null);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(
    null
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  // Form data
  const [editForm, setEditForm] = useState<Partial<College>>({});
  const [newChecklistForm, setNewChecklistForm] = useState({
    name: "",
    description: "",
    category: "Application",
  });
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    deadline: "",
    priority: "Medium",
    taskType: "",
    appComponent: "",
    status: "Not Started",
    responsibility: "",
    notes: "",
  });

  useEffect(() => {
    loadCollegeData();
  }, [collegeId]);

  // Initialize edit form when modal opens
  useEffect(() => {
    if (showEditCollegeModal && college) {
      setEditForm({
        universityName: college.universityName,
        universityCountry: college.universityCountry,
        universityState: college.universityState,
        universityWebsite: college.universityWebsite,
        contactEmail: college.contactEmail,
        major: college.major,
        status: college.status,
        type: college.type,
        deadline: college.deadline,
        applicationFee: college.applicationFee,
        tags: college.tags,
        notes: college.notes,
      });
    }
  }, [showEditCollegeModal, college]);

  const loadCollegeData = async () => {
    try {
      setIsLoading(true);

      // Load college application from backend
      const application = await api.collegeApplications.getById(collegeId);
      setBackendApplication(application);

      // Transform backend data to UI format
      const transformedCollege: College = {
        id: application.id,
        universityName: application.name,
        universityCountry: application.location?.split(", ").pop() || "Unknown",
        universityState: application.location?.split(", ")[0] || null,
        universityWebsite: application.websites?.[0] || "",
        status: application.status,
        deadline: application.deadline || "",
        applicationDeadline: application.deadline || "",
        type: application.application_type,
        major: application.major || "",
        notes: application.notes || "",
        tags: application.tags || [],
        progress: application.progress || 0,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
        applicationFee: application.application_fee,
        contactEmail: application.contact_email,
      };

      setCollege(transformedCollege);
      setBackendChecklists(application.checklists || []);
      document.title = `${application.name} | Paccy`;
    } catch (error) {
      console.error("Failed to load college data:", error);
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to load college data"
      );

      // Fallback to URL params if backend fails
      const urlParams = new URLSearchParams(window.location.search);
      const universityData = urlParams.get("university");

      if (universityData) {
        try {
          const university: UniversityData = JSON.parse(
            decodeURIComponent(universityData)
          );
          setCollege({
            id: collegeId,
            universityName: university.name,
            universityCountry: university.country,
            universityState: university["state-province"] || null,
            universityWebsite: university.web_pages?.[0] || "",
            status: "Researching",
            deadline: "",
            applicationDeadline: "",
            type: "RD",
            major: "Undecided",
            notes: "",
            tags: [],
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          document.title = `${university.name} | Paccy`;
        } catch (parseError) {
          console.error("Error parsing university data:", parseError);
          router.push("/dashboard/colleges");
        }
      } else {
        router.push("/dashboard/colleges");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChecklist = (checklistId: string) => {
    setExpandedChecklists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(checklistId)) {
        newSet.delete(checklistId);
      } else {
        newSet.add(checklistId);
      }
      return newSet;
    });
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // CRUD operations for checklists
  const handleCreateChecklist = async (name: string, description?: string) => {
    try {
      const checklistData = {
        application_id: collegeId,
        name,
        category: Category.APPLICATION,
        description: description || "",
      };

      const result = await api.checklists.create(checklistData);
      showSuccess(`Created checklist "${name}" successfully`);

      // Reload college data to get updated checklists
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to create checklist:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to create checklist"
      );
    }
  };

  const handleUpdateChecklist = async (
    checklistId: string,
    name: string,
    description?: string
  ) => {
    try {
      const updateData = {
        name,
        description: description || undefined,
      };

      await api.checklists.update(collegeId, checklistId, updateData);
      showSuccess("Checklist updated successfully");

      // Reload college data to get updated checklists
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to update checklist:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to update checklist"
      );
    }
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    if (!confirm("Are you sure you want to delete this checklist?")) {
      return;
    }

    try {
      await api.checklists.delete(collegeId, checklistId);
      showSuccess("Checklist deleted successfully");

      // Reload college data to get updated checklists
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to delete checklist:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to delete checklist"
      );
    }
  };

  // CRUD operations for tasks
  const handleCreateTask = async (
    checklistId: string,
    taskData: {
      name: string;
      deadline: string | null;
      priority: TaskPriority;
      type: TaskType;
      component: TaskComponent;
      status: TaskStatus;
      responsible: TaskResponsible;
      notes?: string;
    }
  ) => {
    try {
      if (!collegeId || !checklistId) {
        throw new Error("Missing required IDs: collegeId or checklistId");
      }

      const createData = {
        application_id: collegeId,
        checklist_id: checklistId,
        ...taskData,
      };

      // Enhanced debug logging
      console.log("=== HANDLE CREATE TASK DEBUG ===");
      console.log("College ID:", collegeId);
      console.log("Checklist ID:", checklistId);
      console.log("Input taskData:", JSON.stringify(taskData, null, 2));
      console.log(
        "Final createData being sent to API:",
        JSON.stringify(createData, null, 2)
      );
      console.log(
        "API endpoint will be:",
        `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATION_TASKS}`
      );
      console.log("===================================");

      await api.tasks.create(createData);
      showSuccess(`Created task "${taskData.name}" successfully`);

      // Reload college data to get updated tasks
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to create task:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to create task"
      );
    }
  };

  const handleUpdateTask = async (
    checklistId: string,
    taskId: string,
    taskData: {
      name?: string;
      deadline?: string | null;
      priority?: TaskPriority;
      type?: TaskType;
      component?: TaskComponent;
      status?: TaskStatus;
      responsible?: TaskResponsible;
      notes?: string;
      completed?: boolean;
    }
  ) => {
    try {
      await api.tasks.update(collegeId, checklistId, taskId, taskData);
      showSuccess("Task updated successfully");

      // Reload college data to get updated tasks
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to update task:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to update task"
      );
    }
  };

  const handleDeleteTask = async (checklistId: string, taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.tasks.delete(collegeId, checklistId, taskId);
      showSuccess("Task deleted successfully");

      // Reload college data to get updated tasks
      await loadCollegeData();
    } catch (error) {
      console.error("Failed to delete task:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to delete task"
      );
    }
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return "No deadline set";
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Enhanced functionality functions
  const handleSaveCollege = async () => {
    if (!college || !backendApplication) return;

    // Transform UI form data to backend format (only include changed fields)
    const updateData: any = {};

    if (
      editForm.universityName &&
      editForm.universityName !== college.universityName
    ) {
      updateData.name = editForm.universityName;
    }

    // Handle location (Country and State)
    if (editForm.universityCountry || editForm.universityState) {
      const location =
        editForm.universityState && editForm.universityCountry
          ? `${editForm.universityState}, ${editForm.universityCountry}`
          : editForm.universityCountry || editForm.universityState || "";

      const currentLocation = `${
        college.universityState ? college.universityState + ", " : ""
      }${college.universityCountry}`;
      if (location !== currentLocation) {
        updateData.location = location;
      }
    }

    // Handle major
    if (editForm.major && editForm.major !== college.major) {
      updateData.major = editForm.major;
    }

    // Handle website
    if (
      editForm.universityWebsite &&
      editForm.universityWebsite !== college.universityWebsite
    ) {
      updateData.websites = [editForm.universityWebsite];
    }

    // Handle contact email
    if (
      editForm.contactEmail &&
      editForm.contactEmail !== college.contactEmail
    ) {
      updateData.contact_email = editForm.contactEmail;
    }

    // Handle tags
    if (
      editForm.tags &&
      JSON.stringify(editForm.tags) !== JSON.stringify(college.tags)
    ) {
      updateData.tags = editForm.tags;
    }

    if (editForm.status && editForm.status !== college.status) {
      // Status values are now directly from the API, no need to map
      updateData.status = editForm.status;
    }
    if (editForm.type && editForm.type !== college.type) {
      // Application type values are now directly from the API
      updateData.application_type = editForm.type;
    }
    if (editForm.deadline && editForm.deadline !== college.deadline) {
      updateData.deadline = editForm.deadline;
    }
    if (editForm.notes !== undefined && editForm.notes !== college.notes) {
      updateData.notes = editForm.notes;
    }
    if (
      editForm.applicationFee !== undefined &&
      editForm.applicationFee !== college.applicationFee
    ) {
      updateData.application_fee = editForm.applicationFee;
    }

    // Only proceed if there are changes to update
    if (Object.keys(updateData).length === 0) {
      console.log("No changes detected, skipping update");
      setShowEditCollegeModal(false);
      setEditForm({});
      return;
    }

    try {
      // Debug: Log the data being sent
      console.log("Updating college with data:", updateData);
      console.log("College ID:", collegeId);

      // Check if auth token exists
      const token = localStorage.getItem("auth-token");
      console.log("Auth token exists:", !!token);
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Call the API to update the college application
      await api.collegeApplications.update(collegeId, updateData);

      // Reload college data to get updated information
      await loadCollegeData();

      setShowEditCollegeModal(false);
      setEditForm({});
      showSuccess("College information updated successfully!");
    } catch (error) {
      // Error notification is handled automatically by the API
      console.error("Failed to update college:", error);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!college) return;

    setCollege((prev) =>
      prev
        ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
        : null
    );
  };

  const handleAddTag = () => {
    if (!college || !newTag.trim()) return;

    const updatedTags = [...college.tags, newTag.trim()];
    setCollege((prev) => (prev ? { ...prev, tags: updatedTags } : null));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!college) return;

    const updatedTags = college.tags.filter((tag) => tag !== tagToRemove);
    setCollege((prev) => (prev ? { ...prev, tags: updatedTags } : null));
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-300";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300";
      case "Low":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Note: formatDateForInput and formatDateForBackend functions are defined at the top of the file

  if (isLoading || !college) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-[#FEEBD8] text-lg">
            {isLoading ? "Loading college application..." : "College not found"}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const overallProgress =
    backendChecklists.length > 0
      ? Math.round(
          backendChecklists.reduce((acc, checklist) => {
            const completedTasks = checklist.tasks.filter(
              (task) => task.completed
            ).length;
            const progress =
              checklist.tasks.length > 0
                ? (completedTasks / checklist.tasks.length) * 100
                : 0;
            return acc + progress;
          }, 0) / backendChecklists.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/dashboard/colleges"
            className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-[#FEEBD8]">
                {college.universityName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm text-white ${
                  statusColors[college.status]
                }`}
              >
                {college.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm text-white ${
                  typeColors[college.type]
                }`}
              >
                {college.type}
              </span>
            </div>
            <p className="text-[#FEEBD8]/70">
              {college.universityState && `${college.universityState}, `}
              {college.universityCountry}
            </p>
            {college.major && (
              <div className="flex items-center gap-2 mt-2">
                <FaGraduationCap className="text-blue-400" />
                <span className="text-blue-400 font-medium">
                  {college.major}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditCollegeModal(true)}
              className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
            >
              <FaEdit />
              <span>Edit College</span>
            </button>
          </div>
        </div>

        {/* College Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4 flex items-center gap-2">
              <FaUniversity />
              College Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[#FEEBD8]/70 text-sm">Full Name</label>
                <div className="text-[#FEEBD8] font-medium">
                  {college.universityName}
                </div>
              </div>

              {(college.universityState || college.universityCountry) && (
                <div>
                  <label className="text-[#FEEBD8]/70 text-sm">Location</label>
                  <div className="text-[#FEEBD8]">
                    {college.universityState && college.universityCountry
                      ? `${college.universityState}, ${college.universityCountry}`
                      : college.universityState || college.universityCountry}
                  </div>
                </div>
              )}

              {college.major && (
                <div>
                  <label className="text-[#FEEBD8]/70 text-sm">
                    Intended Major
                  </label>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-blue-400" />
                    <span className="text-blue-400 font-medium">
                      {college.major}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#FEEBD8]/70 text-sm">
                  Application Deadline
                </label>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-[#FEEBD8]/50" />
                  <span className="text-[#FEEBD8]">
                    {formatDeadline(college.deadline)}
                    {college.deadline &&
                      (() => {
                        const days = getDaysUntilDeadline(college.deadline);
                        if (days !== null && days > 0) {
                          return (
                            <span
                              className={`ml-2 ${
                                days <= 7 ? "text-red-400" : "text-yellow-400"
                              }`}
                            >
                              ({days} days)
                            </span>
                          );
                        }
                        return null;
                      })()}
                  </span>
                </div>
              </div>

              {college.applicationFee !== undefined &&
                college.applicationFee !== null && (
                  <div>
                    <label className="text-[#FEEBD8]/70 text-sm">
                      Application Fee
                    </label>
                    <div className="text-[#FEEBD8]">
                      {college.applicationFee === 0
                        ? "Free"
                        : `$${college.applicationFee}`}
                    </div>
                  </div>
                )}

              {college.contactEmail && (
                <div>
                  <label className="text-[#FEEBD8]/70 text-sm">
                    Contact Email
                  </label>
                  <div className="text-[#FEEBD8]">
                    <a
                      href={`mailto:${college.contactEmail}`}
                      className="text-blue-400 hover:underline"
                    >
                      {college.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {college.universityWebsite && (
                <div>
                  <label className="text-[#FEEBD8]/70 text-sm">
                    Website{college.universityWebsite.includes(",") ? "s" : ""}
                  </label>
                  <div className="space-y-1">
                    {college.universityWebsite
                      .split(",")
                      .slice(0, 3)
                      .map((website, index) => (
                        <div key={index}>
                          <a
                            href={
                              website.trim().startsWith("http")
                                ? website.trim()
                                : `https://${website.trim()}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <FaExternalLinkAlt size={12} />
                            {website.trim()}
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {college.tags && college.tags.length > 0 && (
                <div>
                  <label className="text-[#FEEBD8]/70 text-sm">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {college.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-neutral-800 text-[#FEEBD8]/70 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4 flex items-center gap-2">
              <FaChartLine />
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-[#FEEBD8]/70 mb-2">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {backendChecklists.reduce(
                      (acc, checklist) =>
                        acc +
                        checklist.tasks.filter((task) => task.completed).length,
                      0
                    )}
                  </div>
                  <div className="text-[#FEEBD8]/70 text-sm">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {backendChecklists.reduce(
                      (acc, checklist) =>
                        acc +
                        checklist.tasks.filter((task) => !task.completed)
                          .length,
                      0
                    )}
                  </div>
                  <div className="text-[#FEEBD8]/70 text-sm">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4 flex items-center gap-2">
              <FaTasks />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-[#FEEBD8]/10 border border-[#FEEBD8]/30 text-[#FEEBD8] px-4 py-2 rounded-lg hover:bg-[#FEEBD8]/20 transition-colors flex items-center gap-2">
                <FaFileAlt />
                <span>View Essays</span>
              </button>
              <button className="w-full bg-[#FEEBD8]/10 border border-[#FEEBD8]/30 text-[#FEEBD8] px-4 py-2 rounded-lg hover:bg-[#FEEBD8]/20 transition-colors flex items-center gap-2">
                <FaBell />
                <span>Set Reminder</span>
              </button>
              <button className="w-full bg-[#FEEBD8]/10 border border-[#FEEBD8]/30 text-[#FEEBD8] px-4 py-2 rounded-lg hover:bg-[#FEEBD8]/20 transition-colors flex items-center gap-2">
                <FaCalendar />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {college.notes && (
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">Notes</h3>
            <p className="text-[#FEEBD8]/70">{college.notes}</p>
          </div>
        )}

        {/* Checklists */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FEEBD8] flex items-center gap-3">
              <FaClipboardList />
              Application Checklists
            </h2>
            <button
              onClick={() => setShowAddChecklistModal(true)}
              className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Add Checklist</span>
            </button>
          </div>

          {backendChecklists.map((checklist) => (
            <div
              key={checklist.id}
              className="bg-[#141414] border border-neutral-700/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleChecklist(checklist.id)}
                className="w-full p-6 text-left hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {expandedChecklists.has(checklist.id) ? (
                      <FaChevronDown className="text-[#FEEBD8]/50" />
                    ) : (
                      <FaChevronRight className="text-[#FEEBD8]/50" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-[#FEEBD8]">
                        {checklist.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm text-[#FEEBD8]/70">
                          {
                            checklist.tasks.filter((task) => task.completed)
                              .length
                          }{" "}
                          of {checklist.tasks.length} completed
                        </div>
                        <div className="w-32 bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                checklist.tasks.length > 0
                                  ? Math.round(
                                      (checklist.tasks.filter(
                                        (task) => task.completed
                                      ).length /
                                        checklist.tasks.length) *
                                        100
                                    )
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-[#FEEBD8]/70">
                          {checklist.tasks.length > 0
                            ? Math.round(
                                (checklist.tasks.filter(
                                  (task) => task.completed
                                ).length /
                                  checklist.tasks.length) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setEditingChecklist(checklist);
                        setEditingChecklistId(checklist.id);
                        setShowEditChecklistModal(true);
                      }}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
                      title="Edit Checklist"
                    >
                      <FaEdit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChecklist(checklist.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      title="Delete Checklist"
                    >
                      <FaTrash size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </button>

              {expandedChecklists.has(checklist.id) && (
                <div className="border-t border-neutral-700/50">
                  <div className="p-6 space-y-3">
                    {checklist.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-neutral-800/30 rounded-lg border border-neutral-700/30 cursor-pointer hover:bg-neutral-800/40 transition-colors"
                        onClick={() => {
                          if (
                            task.priority ||
                            task.status ||
                            task.responsible ||
                            task.type ||
                            task.component ||
                            task.notes
                          ) {
                            toggleTask(task.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newStatus = task.completed
                                  ? TaskStatus.NOT_STARTED
                                  : TaskStatus.COMPLETED;

                                handleUpdateTask(checklist.id, task.id, {
                                  completed: !task.completed,
                                  status: newStatus,
                                });
                              }}
                              className={`text-xl flex-shrink-0 ${
                                task.completed
                                  ? "text-green-400 hover:text-green-300"
                                  : "text-neutral-500 hover:text-neutral-400"
                              } transition-colors`}
                            >
                              {task.completed ? (
                                <FaCheckCircle />
                              ) : (
                                <FaTimesCircle />
                              )}
                            </button>
                            <div className="flex-1">
                              <h4
                                className={`text-lg font-medium ${
                                  task.completed
                                    ? "text-[#FEEBD8]/70 line-through"
                                    : "text-[#FEEBD8]"
                                }`}
                              >
                                {task.name}
                              </h4>
                              {task.deadline && (
                                <div className="text-sm text-[#FEEBD8]/50 mt-1 flex items-center gap-1">
                                  <FaCalendar />
                                  Due: {formatDeadline(task.deadline)}
                                  {(() => {
                                    const days = getDaysUntilDeadline(
                                      task.deadline
                                    );
                                    if (days !== null && days > 0) {
                                      return (
                                        <span
                                          className={`ml-2 ${
                                            days <= 7
                                              ? "text-red-400"
                                              : "text-yellow-400"
                                          }`}
                                        >
                                          ({days} days remaining)
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(task.priority ||
                              task.status ||
                              task.responsible ||
                              task.type ||
                              task.component ||
                              task.notes) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTask(task.id);
                                }}
                                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors flex-shrink-0"
                                title={
                                  expandedTasks.has(task.id)
                                    ? "Show less"
                                    : "Show more"
                                }
                              >
                                {expandedTasks.has(task.id) ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask(task);
                                setEditingChecklistId(checklist.id);
                                setEditingTaskId(task.id);
                                setShowEditTaskModal(true);
                              }}
                              className="text-[#FEEBD8]/50 hover:text-yellow-400 transition-colors flex-shrink-0"
                              title="Edit Task"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(checklist.id, task.id);
                              }}
                              className="text-[#FEEBD8]/50 hover:text-red-400 transition-colors flex-shrink-0"
                              title="Delete Task"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                        {/* Task Details - Only show when expanded */}
                        {expandedTasks.has(task.id) && (
                          <>
                            {(task.priority ||
                              task.status ||
                              task.responsible ||
                              task.type) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                {task.priority && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Priority:
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                        task.priority
                                      )}`}
                                    >
                                      {task.priority}
                                    </span>
                                  </div>
                                )}
                                {task.status && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Status:
                                    </span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                      {task.status}
                                    </span>
                                  </div>
                                )}
                                {task.responsible && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Assigned:
                                    </span>
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                      {task.responsible}
                                    </span>
                                  </div>
                                )}
                                {task.type && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Type:
                                    </span>
                                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                                      {task.type}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {(task.component || task.notes) && (
                              <div className="mt-3 pt-3 border-t border-neutral-700/30">
                                {task.component && (
                                  <div className="mb-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Component:{" "}
                                    </span>
                                    <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-medium">
                                      {task.component}
                                    </span>
                                  </div>
                                )}
                                {task.notes && (
                                  <div>
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Notes:{" "}
                                    </span>
                                    <span className="text-[#FEEBD8]/70 text-sm">
                                      {task.notes}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedChecklistForTask(checklist.id);
                        setShowAddTaskModal(true);
                      }}
                      className="w-full p-3 border border-neutral-600 border-dashed rounded-lg text-[#FEEBD8]/50 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlus />
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {/* Edit College Modal */}
      {showEditCollegeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Edit College Information
              </h2>
              <button
                onClick={() => {
                  setShowEditCollegeModal(false);
                  setEditForm({});
                }}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  University Name
                </label>
                <input
                  type="text"
                  value={
                    editForm.universityName || college?.universityName || ""
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      universityName: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={
                      editForm.universityState || college?.universityState || ""
                    }
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        universityState: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    placeholder="e.g., California"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={
                      editForm.universityCountry ||
                      college?.universityCountry ||
                      ""
                    }
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        universityCountry: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    placeholder="e.g., United States"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Major
                </label>
                <input
                  type="text"
                  value={editForm.major || college?.major || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      major: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Website(s)
                </label>
                <input
                  type="text"
                  value={
                    editForm.universityWebsite ||
                    college?.universityWebsite ||
                    ""
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      universityWebsite: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., https://www.university.edu"
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={editForm.contactEmail || college?.contactEmail || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="admissions@university.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status || college?.status || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="deferred">Deferred</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Type
                  </label>
                  <select
                    value={editForm.type || college?.type || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="early_decision">Early Decision (ED)</option>
                    <option value="early_action">Early Action (EA)</option>
                    <option value="regular_decision">
                      Regular Decision (RD)
                    </option>
                    <option value="rolling_admission">Rolling Admission</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(
                      editForm.deadline || college?.deadline
                    )}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        deadline: formatDateForBackend(e.target.value),
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Fee ($)
                  </label>
                  <input
                    type="number"
                    value={
                      editForm.applicationFee || college?.applicationFee || ""
                    }
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        applicationFee: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={
                    editForm.tags?.join(", ") || college?.tags?.join(", ") || ""
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Ivy League, Engineering, Research"
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={editForm.notes || college?.notes || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-24 resize-none"
                  placeholder="Add any notes about this college..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveCollege}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditCollegeModal(false);
                    setEditForm({});
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Checklist Modal */}
      {showEditChecklistModal && editingChecklist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Edit Checklist
              </h2>
              <button
                onClick={() => {
                  setShowEditChecklistModal(false);
                  setEditingChecklist(null);
                  setEditingChecklistId(null);
                }}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Checklist Name
                </label>
                <input
                  type="text"
                  value={editingChecklist.name}
                  onChange={(e) =>
                    setEditingChecklist((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Category
                </label>
                <select
                  value={editingChecklist.category}
                  onChange={(e) =>
                    setEditingChecklist((prev) =>
                      prev
                        ? { ...prev, category: e.target.value as Category }
                        : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                >
                  <option value="application">Application</option>
                  <option value="financial_aid">Financial Aid</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="housing">Housing</option>
                  <option value="academic">Academic</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={editingChecklist.description || ""}
                  onChange={(e) =>
                    setEditingChecklist((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-20 resize-none"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={async () => {
                    if (editingChecklistId && editingChecklist) {
                      try {
                        await api.checklists.update(
                          collegeId,
                          editingChecklistId,
                          {
                            name: editingChecklist.name,
                            category: editingChecklist.category,
                            description: editingChecklist.description,
                          }
                        );
                        await loadCollegeData();
                        setShowEditChecklistModal(false);
                        setEditingChecklist(null);
                        setEditingChecklistId(null);
                        showSuccess("Checklist updated successfully!");
                      } catch (error) {
                        console.error("Failed to update checklist:", error);
                        showError("Failed to update checklist");
                      }
                    }
                  }}
                  disabled={!editingChecklist?.name.trim()}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditChecklistModal(false);
                    setEditingChecklist(null);
                    setEditingChecklistId(null);
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Checklist Modal */}
      {showAddChecklistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Add New Checklist
              </h2>
              <button
                onClick={() => setShowAddChecklistModal(false)}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                if (name.trim()) {
                  handleCreateChecklist(name.trim());
                  setShowAddChecklistModal(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Checklist Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Essay Requirements"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  Add Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChecklistModal(false)}
                  className="px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && selectedChecklistForTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Add New Task
              </h2>
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setSelectedChecklistForTask(null);
                }}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                console.log("=== TASK CREATION DEBUG ===");
                console.log("Raw form data:");
                for (let [key, value] of formData.entries()) {
                  console.log(`  ${key}:`, value);
                }

                const deadlineValue = formatDateForBackend(
                  formData.get("deadline") as string
                );
                const notesValue = formData.get("notes") as string;

                console.log("Formatted deadline value:", deadlineValue);
                console.log("Notes value:", notesValue);

                const taskData: any = {
                  name: (formData.get("name") as string).trim(),
                  priority: formData.get("priority") as TaskPriority,
                  type: formData.get("type") as TaskType,
                  component: formData.get("component") as TaskComponent,
                  status: formData.get("status") as TaskStatus,
                  responsible: formData.get("responsible") as TaskResponsible,
                  deadline: deadlineValue, // Always include deadline (either user input or tomorrow)
                };

                // Only include notes if it has a value
                if (notesValue && notesValue.trim()) {
                  taskData.notes = notesValue.trim();
                }

                // Validate required fields
                if (!taskData.name) {
                  showError("Task name is required");
                  return;
                }

                console.log(
                  "Final taskData to be sent:",
                  JSON.stringify(taskData, null, 2)
                );
                console.log(
                  "selectedChecklistForTask:",
                  selectedChecklistForTask
                );
                console.log("===========================");

                handleCreateTask(selectedChecklistForTask, taskData);
                setShowAddTaskModal(false);
                setSelectedChecklistForTask(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Task Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Write personal statement"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Deadline
                  </label>
                  <input
                    name="deadline"
                    type="date"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    defaultValue="medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Task Type
                  </label>
                  <select
                    name="type"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    defaultValue="document_preparation"
                  >
                    <option value="document_preparation">
                      Document Preparation
                    </option>
                    <option value="submission">Submission</option>
                    <option value="review">Review</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="research">Research</option>
                    <option value="writing">Writing</option>
                    <option value="scheduling">Scheduling</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Component
                  </label>
                  <select
                    name="component"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    defaultValue="common_app"
                  >
                    <option value="common_app">Common App</option>
                    <option value="supplemental_essay">
                      Supplemental Essay
                    </option>
                    <option value="academic_records">Academic Records</option>
                    <option value="standardized_tests">
                      Standardized Tests
                    </option>
                    <option value="supporting_documents">
                      Supporting Documents
                    </option>
                    <option value="financial_documents">
                      Financial Documents
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    defaultValue="not_started"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Responsible Person
                  </label>
                  <select
                    name="responsible"
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                    defaultValue="student"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="counselor">Counselor</option>
                    <option value="teacher">Teacher</option>
                    <option value="school_office">School Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-24 resize-none"
                  placeholder="Additional notes or details"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setSelectedChecklistForTask(null);
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && editingChecklistId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Edit Task
              </h2>
              <button
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                  setEditingChecklistId(null);
                  setEditingTaskId(null);
                }}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Write personal statement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(editingTask.deadline)}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              deadline: formatDateForBackend(e.target.value),
                            }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              priority: e.target.value as TaskPriority,
                            }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Task Type
                  </label>
                  <select
                    value={editingTask.type}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? { ...prev, type: e.target.value as TaskType }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="document_preparation">
                      Document Preparation
                    </option>
                    <option value="submission">Submission</option>
                    <option value="review">Review</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="research">Research</option>
                    <option value="writing">Writing</option>
                    <option value="scheduling">Scheduling</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Component
                  </label>
                  <select
                    value={editingTask.component}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              component: e.target.value as TaskComponent,
                            }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="common_app">Common App</option>
                    <option value="supplemental_essay">
                      Supplemental Essay
                    </option>
                    <option value="academic_records">Academic Records</option>
                    <option value="standardized_tests">
                      Standardized Tests
                    </option>
                    <option value="supporting_documents">
                      Supporting Documents
                    </option>
                    <option value="financial_documents">
                      Financial Documents
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? { ...prev, status: e.target.value as TaskStatus }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Responsible Person
                  </label>
                  <select
                    value={editingTask.responsible}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              responsible: e.target.value as TaskResponsible,
                            }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="counselor">Counselor</option>
                    <option value="teacher">Teacher</option>
                    <option value="school_office">School Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={editingTask.notes || ""}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-24 resize-none"
                  placeholder="Additional notes or details"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="completed-edit"
                  checked={editingTask.completed}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, completed: e.target.checked } : null
                    )
                  }
                  className="w-4 h-4 text-[#FEEBD8] bg-[#141414] border-neutral-700/50 rounded focus:ring-[#FEEBD8] focus:ring-2"
                />
                <label
                  htmlFor="completed-edit"
                  className="text-[#FEEBD8]/70 text-sm"
                >
                  Mark as completed
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={async () => {
                    if (editingChecklistId && editingTask && editingTaskId) {
                      try {
                        await handleUpdateTask(
                          editingChecklistId,
                          editingTaskId,
                          {
                            name: editingTask.name,
                            deadline: editingTask.deadline,
                            priority: editingTask.priority,
                            type: editingTask.type,
                            component: editingTask.component,
                            status: editingTask.status,
                            responsible: editingTask.responsible,
                            notes: editingTask.notes,
                            completed: editingTask.completed,
                          }
                        );
                        setShowEditTaskModal(false);
                        setEditingTask(null);
                        setEditingChecklistId(null);
                        setEditingTaskId(null);
                        showSuccess("Task updated successfully!");
                      } catch (error) {
                        console.error("Failed to update task:", error);
                        showError("Failed to update task");
                      }
                    }
                  }}
                  disabled={!editingTask?.name.trim()}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                    setEditingChecklistId(null);
                    setEditingTaskId(null);
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-lg text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:border-[#FEEBD8]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastNotification toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
