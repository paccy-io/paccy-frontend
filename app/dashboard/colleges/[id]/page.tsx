"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Footer from "../../../../components/Footer";
import { api, ApiError } from "../../../../lib/api/college-applications";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../config/api";
import DatePicker from "../../../../components/DatePicker";
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

// Color mappings for status, type, and priority badges
const statusColors: Record<string, string> = {
  not_started: "bg-gray-500",
  in_progress: "bg-yellow-500",
  submitted: "bg-blue-500",
  under_review: "bg-indigo-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  deferred: "bg-orange-500",
  waitlisted: "bg-amber-500",
  withdrawn: "bg-gray-600",
};

const typeColors: Record<string, string> = {
  early_decision: "bg-purple-500",
  early_action: "bg-blue-500",
  regular_decision: "bg-gray-500",
  rolling_admission: "bg-teal-500",
};

const priorityColors: Record<string, string> = {
  reach: "bg-red-500",
  target: "bg-yellow-500",
  safety: "bg-green-500",
};

// Custom Select Component for Safari compatibility
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white text-left flex items-center justify-between hover:border-neutral-600/50 transition-colors"
      >
        <span className={!selectedOption ? "text-white/50" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          className={`text-white/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-[#1a1a1a] border border-neutral-700/50 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  option.value === value
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Helper functions for date format conversion
const formatDateForInput = (isoDate: string | undefined | null) => {
  if (!isoDate) return "";
  // Extract date components directly to avoid timezone conversion issues
  const dateOnly = isoDate.split("T")[0]; // Get just the YYYY-MM-DD part
  return dateOnly;
};

const formatDateForBackend = (inputDate: string) => {
  if (!inputDate || inputDate.trim() === "") {
    // Use tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T23:59:59Z`;
  }
  // Parse input date as local date and format for backend
  const [year, month, day] = inputDate.split("-");
  return `${year}-${month}-${day}T23:59:59Z`;
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
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(
    new Set()
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Modal states
  const [showEditCollegeModal, setShowEditCollegeModal] = useState(false);

  // Function to set banner image using Lorem Picsum with seed for consistency
  const fetchBannerImage = async (universityName: string) => {
    try {
      console.log("Setting banner for:", universityName);

      // Use Lorem Picsum with the university name as seed for consistent, high-quality images
      // This will give the same image for the same university each time
      const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(
        universityName
      )}/1600/400`;

      console.log("Banner image URL:", imageUrl);
      setBannerImageUrl(imageUrl);
    } catch (error) {
      console.error("Failed to set banner image:", error);
      // Keep gradient as fallback
    }
  };
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
  const [tagsInput, setTagsInput] = useState("");
  const [showStatusEditor, setShowStatusEditor] = useState(false);

  // Tab state for edit modal
  const [activeEditTab, setActiveEditTab] = useState("basic");

  // Form data
  const [editForm, setEditForm] = useState<Partial<College>>({});
  const [newChecklistForm, setNewChecklistForm] = useState({
    name: "",
    description: "",
    category: "Application",
  });
  const [newTaskForm, setNewTaskForm] = useState({
    name: "",
    deadline: "",
    priority: "medium" as TaskPriority,
    type: "document_preparation" as TaskType,
    component: "common_app" as TaskComponent,
    status: "not_started" as TaskStatus,
    responsible: "student" as TaskResponsible,
    notes: "",
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
        priority: college.priority,
      });
      // Initialize tags input with current tags
      setTagsInput(college.tags?.join(", ") || "");
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
        priority: application.priority
          ? ((application.priority.charAt(0).toUpperCase() +
              application.priority.slice(1)) as "Safety" | "Target" | "Reach")
          : undefined,
      };

      setCollege(transformedCollege);
      setBackendChecklists(application.checklists || []);
      document.title = `${application.name} | Paccy`;

      // Fetch banner image from Wikipedia
      fetchBannerImage(application.name);
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
    // Parse date avoiding timezone issues
    const dateOnly = deadline.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day to avoid time comparison issues

    // Parse deadline date avoiding timezone issues
    const dateOnly = deadline.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const deadlineDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    deadlineDate.setHours(0, 0, 0, 0); // Set to start of day

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

    // Handle priority
    if (editForm.priority !== college.priority) {
      updateData.priority = editForm.priority
        ? editForm.priority.toLowerCase()
        : null;
    }

    // Only proceed if there are changes to update
    if (Object.keys(updateData).length === 0) {
      setShowEditCollegeModal(false);
      setEditForm({});
      setTagsInput("");
      return;
    }

    try {
      // Check if auth token exists
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Call the API to update the college application
      await api.collegeApplications.update(collegeId, updateData);

      // Reload college data to get updated information
      await loadCollegeData();

      setShowEditCollegeModal(false);
      setEditForm({});
      setTagsInput("");
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
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-white text-lg">
            {isLoading ? "Loading college application..." : "College not found"}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const overallProgress =
    backendChecklists.length > 0
      ? (() => {
          const totalTasks = backendChecklists.reduce(
            (acc, checklist) => acc + checklist.tasks.length,
            0
          );
          const completedTasks = backendChecklists.reduce(
            (acc, checklist) =>
              acc + checklist.tasks.filter((task) => task.completed).length,
            0
          );
          return totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;
        })()
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Banner with Gradient */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Banner Image */}
        {bannerImageUrl && (
          <img
            src={bannerImageUrl}
            alt={`${college.universityName} campus`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {/* Decorative circles (shown when no image) */}
        {!bannerImageUrl && (
          <>
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-indigo-400/20 rounded-full blur-3xl"></div>
          </>
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-screen-xl mx-auto">
            <Link
              href="/dashboard/colleges"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl"
            >
              <FaArrowLeft size={16} />
              <span className="text-sm">Back to Applications</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {college.universityName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
                {college.type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              {college.priority && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    college.priority.toLowerCase() === "reach"
                      ? "bg-purple-500/90"
                      : college.priority.toLowerCase() === "target"
                      ? "bg-blue-500/90"
                      : "bg-green-500/90"
                  } text-white`}
                >
                  {college.priority}
                </span>
              )}
              <div className="text-white/80 text-sm flex items-center gap-1">
                <FaMapMarkerAlt className="text-xs" />
                <span>
                  {college.universityState && `${college.universityState}, `}
                  {college.universityCountry}
                </span>
              </div>
            </div>
            {college.applicationDeadline && (
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <FaCalendar className="text-xs" />
                <span>
                  Deadline:{" "}
                  {new Date(college.applicationDeadline).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-8">
        {/* Status and Application Type Badges */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm text-white ${
                  statusColors[college.status]
                }`}
              >
                {college.status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowStatusEditor(!showStatusEditor)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  title="Change status"
                >
                  <FaEdit className="text-xs" />
                </button>
                {showStatusEditor && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowStatusEditor(false)}
                    />
                    <div className="absolute z-20 left-0 mt-2 w-56">
                      <CustomSelect
                        value={college.status}
                        onChange={async (value) => {
                          try {
                            await api.collegeApplications.update(collegeId, {
                              status: value as Status,
                            });
                            setCollege((prev) =>
                              prev ? { ...prev, status: value as Status } : null
                            );
                            showSuccess("Status updated successfully");
                            setShowStatusEditor(false);
                          } catch (error: any) {
                            console.error("Status update error:", error);
                            showError(
                              error?.message || "Failed to update status"
                            );
                          }
                        }}
                        options={[
                          { value: "not_started", label: "Not Started" },
                          { value: "in_progress", label: "In Progress" },
                          { value: "submitted", label: "Submitted" },
                          { value: "under_review", label: "Under Review" },
                          { value: "accepted", label: "Accepted" },
                          { value: "rejected", label: "Rejected" },
                          { value: "deferred", label: "Deferred" },
                          { value: "waitlisted", label: "Waitlisted" },
                          { value: "withdrawn", label: "Withdrawn" },
                        ]}
                        placeholder="Select status"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            {college.major && (
              <div className="flex items-center gap-2">
                <FaGraduationCap className="text-blue-400" />
                <span className="text-blue-400 font-medium">
                  {college.major}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowEditCollegeModal(true)}
            className="bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <FaEdit />
            <span>Edit College</span>
          </button>
        </div>

        {/* College Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <FaUniversity className="text-blue-400" />
              </div>
              College Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/70 text-sm">Full Name</label>
                <div className="text-white font-medium">
                  {college.universityName}
                </div>
              </div>

              {(college.universityState || college.universityCountry) && (
                <div>
                  <label className="text-white/70 text-sm">Location</label>
                  <div className="text-white">
                    {college.universityState && college.universityCountry
                      ? `${college.universityState}, ${college.universityCountry}`
                      : college.universityState || college.universityCountry}
                  </div>
                </div>
              )}

              {college.major && (
                <div>
                  <label className="text-white/70 text-sm">
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
                <label className="text-white/70 text-sm">
                  Application Deadline
                </label>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-white/50" />
                  <span className="text-white">
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
                    <label className="text-white/70 text-sm">
                      Application Fee
                    </label>
                    <div className="text-white">
                      {college.applicationFee === 0
                        ? "Free"
                        : `$${college.applicationFee}`}
                    </div>
                  </div>
                )}

              {college.priority && (
                <div>
                  <label className="text-white/70 text-sm">
                    Priority Level
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white font-medium ${
                        priorityColors[college.priority.toLowerCase()]
                      }`}
                    >
                      {college.priority}
                    </span>
                  </div>
                </div>
              )}

              {college.contactEmail && (
                <div>
                  <label className="text-white/70 text-sm">Contact Email</label>
                  <div className="text-white">
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
                  <label className="text-white/70 text-sm">
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
                  <label className="text-white/70 text-sm">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {college.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-neutral-800 text-white/70 text-xs rounded-full"
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
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <FaChartLine className="text-green-400" />
              </div>
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-neutral-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
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
                  <div className="text-white/70 text-sm">Completed</div>
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
                  <div className="text-white/70 text-sm">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <FaTasks className="text-purple-400" />
              </div>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href={`/dashboard/essays?college=${encodeURIComponent(
                  backendApplication?.name || ""
                )}&major=${encodeURIComponent(
                  backendApplication?.major || ""
                )}`}
                className="w-full bg-white/5 border border-neutral-700/30 text-white px-4 py-2 rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex items-center gap-2"
              >
                <FaFileAlt />
                <span>View Essays</span>
              </Link>
              <button className="w-full bg-white/5 border border-neutral-700/30 text-white px-4 py-2 rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex items-center gap-2">
                <FaBell />
                <span>Set Reminder</span>
              </button>
              <button className="w-full bg-white/5 border border-neutral-700/30 text-white px-4 py-2 rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex items-center gap-2">
                <FaCalendar />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {college.notes && (
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <p className="text-white/70">{college.notes}</p>
          </div>
        )}

        {/* Checklists */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaClipboardList className="text-white text-lg" />
                </div>
                Application Checklists
              </h2>
              <p className="text-white/60 text-sm">
                Track your application progress and stay organized
              </p>
            </div>
            <button
              onClick={() => setShowAddChecklistModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              <FaPlus className="text-sm" />
              <span>Add Checklist</span>
            </button>
          </div>

          {backendChecklists.length === 0 ? (
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-2 border-dashed border-neutral-700/50 rounded-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <FaClipboardList className="text-4xl text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No checklists yet
              </h3>
              <p className="text-white/60 mb-6">
                Create your first checklist to start tracking your application
                progress
              </p>
              <button
                onClick={() => setShowAddChecklistModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center gap-2"
              >
                <FaPlus />
                Create Checklist
              </button>
            </div>
          ) : (
            backendChecklists.map((checklist) => {
              const completedTasks = checklist.tasks.filter(
                (task) => task.completed
              ).length;
              const totalTasks = checklist.tasks.length;
              const completionPercentage =
                totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0;
              const isExpanded = expandedChecklists.has(checklist.id);

              return (
                <div
                  key={checklist.id}
                  className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-2 border-neutral-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all shadow-lg hover:shadow-xl"
                >
                  <button
                    onClick={() => toggleChecklist(checklist.id)}
                    className="w-full p-6 text-left hover:bg-neutral-800/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          {isExpanded ? (
                            <FaChevronDown className="text-white/70 text-lg transition-transform" />
                          ) : (
                            <FaChevronRight className="text-white/70 text-lg transition-transform" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white">
                              {checklist.name}
                            </h3>
                            {completionPercentage === 100 && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold flex items-center gap-1">
                                <FaCheckCircle className="text-xs" />
                                Complete
                              </span>
                            )}
                          </div>

                          {checklist.description && (
                            <p className="text-white/60 text-sm mb-3">
                              {checklist.description}
                            </p>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="text-sm text-white/70 font-medium">
                              <span className="text-white font-bold">
                                {completedTasks}
                              </span>{" "}
                              of{" "}
                              <span className="text-white font-bold">
                                {totalTasks}
                              </span>{" "}
                              tasks completed
                            </div>
                            <div className="flex items-center gap-3 flex-1 max-w-md">
                              <div className="flex-1 bg-neutral-700/50 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    completionPercentage === 100
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                      : completionPercentage >= 50
                                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                      : "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  }`}
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-sm font-bold min-w-[3rem] ${
                                  completionPercentage === 100
                                    ? "text-green-400"
                                    : completionPercentage >= 50
                                    ? "text-blue-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {completionPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex flex-row sm:flex-row items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditingChecklist(checklist);
                            setEditingChecklistId(checklist.id);
                            setShowEditChecklistModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                          title="Edit Checklist"
                        >
                          <FaEdit className="text-sm" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteChecklist(checklist.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                          title="Delete Checklist"
                        >
                          <FaTrash className="text-sm" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t-2 border-neutral-700/50 bg-[#0a0a0a]/50">
                      <div className="p-6 space-y-3">
                        {checklist.tasks.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                              <FaTasks className="text-2xl text-white/30" />
                            </div>
                            <p className="text-white/60 mb-4">
                              No tasks yet in this checklist
                            </p>
                            <button
                              onClick={() => {
                                setSelectedChecklistForTask(checklist.id);
                                setShowAddTaskModal(true);
                              }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center gap-2"
                            >
                              <FaPlus />
                              Add First Task
                            </button>
                          </div>
                        ) : (
                          checklist.tasks.map((task) => {
                            const isTaskExpanded = expandedTasks.has(task.id);
                            const hasDetails =
                              task.priority ||
                              task.status ||
                              task.responsible ||
                              task.type ||
                              task.component ||
                              task.notes;
                            const daysUntilDeadline = task.deadline
                              ? getDaysUntilDeadline(task.deadline)
                              : null;

                            return (
                              <div
                                key={task.id}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                  task.completed
                                    ? "bg-green-500/5 border-green-500/30 hover:border-green-500/50"
                                    : "bg-neutral-800/30 border-neutral-700/30 hover:border-blue-500/30 hover:bg-neutral-800/50"
                                }`}
                                onClick={() => {
                                  if (hasDetails) {
                                    toggleTask(task.id);
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-start gap-3 flex-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newStatus = task.completed
                                          ? TaskStatus.NOT_STARTED
                                          : TaskStatus.COMPLETED;

                                        handleUpdateTask(
                                          checklist.id,
                                          task.id,
                                          {
                                            completed: !task.completed,
                                            status: newStatus,
                                          }
                                        );
                                      }}
                                      className={`text-2xl flex-shrink-0 mt-0.5 transition-all hover:scale-110 ${
                                        task.completed
                                          ? "text-green-400 hover:text-green-300"
                                          : "text-neutral-600 hover:text-white"
                                      }`}
                                    >
                                      {task.completed ? (
                                        <FaCheckCircle />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-neutral-600 hover:border-white"></div>
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`text-base font-semibold mb-1 ${
                                          task.completed
                                            ? "text-white/50 line-through"
                                            : "text-white"
                                        }`}
                                      >
                                        {task.name}
                                      </h4>
                                      {task.deadline && (
                                        <div
                                          className={`text-sm flex items-center gap-1.5 ${
                                            task.completed
                                              ? "text-white/40"
                                              : daysUntilDeadline !== null &&
                                                daysUntilDeadline <= 3
                                              ? "text-red-400"
                                              : daysUntilDeadline !== null &&
                                                daysUntilDeadline <= 7
                                              ? "text-yellow-400"
                                              : "text-white/60"
                                          }`}
                                        >
                                          <FaClock className="text-xs" />
                                          <span>
                                            Due: {formatDeadline(task.deadline)}
                                          </span>
                                          {daysUntilDeadline !== null &&
                                            daysUntilDeadline > 0 &&
                                            !task.completed && (
                                              <span
                                                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                  daysUntilDeadline <= 3
                                                    ? "bg-red-500/20 text-red-400"
                                                    : daysUntilDeadline <= 7
                                                    ? "bg-yellow-500/20 text-yellow-400"
                                                    : "bg-blue-500/20 text-blue-400"
                                                }`}
                                              >
                                                {daysUntilDeadline}d left
                                              </span>
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    {hasDetails && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTask(task.id);
                                        }}
                                        className="p-2 text-white/50 hover:text-white hover:bg-neutral-700/50 rounded-lg transition-all"
                                        title={
                                          isTaskExpanded
                                            ? "Show less"
                                            : "Show more"
                                        }
                                      >
                                        {isTaskExpanded ? (
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
                                      className="p-2 text-white/50 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
                                      title="Edit Task"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(checklist.id, task.id);
                                      }}
                                      className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                      title="Delete Task"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>

                                {/* Task Details - Only show when expanded */}
                                {isTaskExpanded && hasDetails && (
                                  <div className="mt-4 pt-4 border-t border-neutral-700/30">
                                    {(task.priority ||
                                      task.status ||
                                      task.responsible ||
                                      task.type) && (
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {task.priority && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-white/50 text-xs font-medium">
                                              Priority:
                                            </span>
                                            <span
                                              className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                                                task.priority
                                              )}`}
                                            >
                                              {task.priority.toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        {task.status && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-white/50 text-xs font-medium">
                                              Status:
                                            </span>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold">
                                              {task.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        {task.responsible && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-white/50 text-xs font-medium">
                                              Assigned:
                                            </span>
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                                              <FaUser className="text-xs" />
                                              {task.responsible
                                                .replace("_", " ")
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        {task.type && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-white/50 text-xs font-medium">
                                              Type:
                                            </span>
                                            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-xs font-bold">
                                              {task.type
                                                .replace("_", " ")
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {(task.component || task.notes) && (
                                      <div className="space-y-3">
                                        {task.component && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-white/50 text-xs font-medium">
                                              Component:
                                            </span>
                                            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold">
                                              {task.component
                                                .replace("_", " ")
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        {task.notes && (
                                          <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/30">
                                            <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-1">
                                              <FaFileAlt className="text-xs" />
                                              Notes:
                                            </div>
                                            <p className="text-white/80 text-sm leading-relaxed">
                                              {task.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        <button
                          onClick={() => {
                            setSelectedChecklistForTask(checklist.id);
                            setShowAddTaskModal(true);
                          }}
                          className="w-full p-4 border-2 border-dashed border-neutral-600 rounded-xl text-white/60 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 font-semibold group"
                        >
                          <FaPlus className="group-hover:scale-110 transition-transform" />
                          <span>Add Task</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {/* Edit College Modal */}
      {showEditCollegeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Edit College Information
              </h2>
              <button
                onClick={() => {
                  setShowEditCollegeModal(false);
                  setEditForm({});
                  setTagsInput("");
                  setActiveEditTab("basic");
                }}
                className="text-white/50 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-neutral-800/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveEditTab("basic")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeEditTab === "basic"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-white/70 hover:text-white hover:bg-neutral-700/50"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveEditTab("application")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeEditTab === "application"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-white/70 hover:text-white hover:bg-neutral-700/50"
                }`}
              >
                Application
              </button>
              <button
                onClick={() => setActiveEditTab("additional")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeEditTab === "additional"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-white/70 hover:text-white hover:bg-neutral-700/50"
                }`}
              >
                Additional
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Basic Info Tab */}
              {activeEditTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
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
                      className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={
                          editForm.universityState ||
                          college?.universityState ||
                          ""
                        }
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            universityState: e.target.value,
                          }))
                        }
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="e.g., California"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">
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
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="e.g., United States"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
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
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Priority Level
                      </label>
                      <CustomSelect
                        value={editForm.priority || college?.priority || ""}
                        onChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            priority: value
                              ? (value as "Safety" | "Target" | "Reach")
                              : undefined,
                          }))
                        }
                        options={[
                          { value: "", label: "Select Priority Level" },
                          { value: "Safety", label: "Safety" },
                          { value: "Target", label: "Target" },
                          { value: "Reach", label: "Reach" },
                        ]}
                        placeholder="Select Priority Level"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
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
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="e.g., https://www.university.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={
                          editForm.contactEmail || college?.contactEmail || ""
                        }
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="admissions@university.edu"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Application Tab */}
              {activeEditTab === "application" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Status
                      </label>
                      <CustomSelect
                        value={editForm.status || college?.status || ""}
                        onChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            status: value,
                          }))
                        }
                        options={[
                          { value: "not_started", label: "Not Started" },
                          { value: "in_progress", label: "In Progress" },
                          { value: "submitted", label: "Submitted" },
                          { value: "under_review", label: "Under Review" },
                          { value: "accepted", label: "Accepted" },
                          { value: "rejected", label: "Rejected" },
                          { value: "deferred", label: "Deferred" },
                          { value: "waitlisted", label: "Waitlisted" },
                          { value: "withdrawn", label: "Withdrawn" },
                        ]}
                        placeholder="Select status"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Application Type
                      </label>
                      <CustomSelect
                        value={editForm.type || college?.type || ""}
                        onChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            type: value,
                          }))
                        }
                        options={[
                          {
                            value: "early_decision",
                            label: "Early Decision (ED)",
                          },
                          { value: "early_action", label: "Early Action (EA)" },
                          {
                            value: "regular_decision",
                            label: "Regular Decision (RD)",
                          },
                          {
                            value: "rolling_admission",
                            label: "Rolling Admission",
                          },
                        ]}
                        placeholder="Select application type"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DatePicker
                      label="Application Deadline"
                      value={formatDateForInput(
                        editForm.deadline || college?.deadline
                      )}
                      onChange={(date) =>
                        setEditForm((prev) => ({
                          ...prev,
                          deadline: formatDateForBackend(date),
                        }))
                      }
                      placeholder="Select application deadline"
                    />

                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Application Fee ($)
                      </label>
                      <input
                        type="number"
                        value={
                          editForm.applicationFee ||
                          college?.applicationFee ||
                          ""
                        }
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            applicationFee: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Tab */}
              {activeEditTab === "additional" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onBlur={(e) => {
                        // Process tags on blur (when user leaves the field)
                        const processedTags = e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag);
                        setEditForm((prev) => ({
                          ...prev,
                          tags: processedTags,
                        }));
                      }}
                      className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                      placeholder="e.g., Ivy League, Engineering, Research"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editForm.notes || college?.notes || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white h-32 resize-none"
                      placeholder="Add any notes about this college..."
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-700/50">
                <button
                  onClick={handleSaveCollege}
                  className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditCollegeModal(false);
                    setEditForm({});
                    setTagsInput("");
                    setActiveEditTab("basic");
                  }}
                  className="px-4 py-3 border border-neutral-700/50 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete this application for ${college?.universityName}? This action cannot be undone.`
                      )
                    ) {
                      try {
                        await api.collegeApplications.delete(collegeId);
                        showSuccess("Application deleted successfully");
                        router.push("/dashboard/colleges");
                      } catch (error) {
                        showError("Failed to delete application");
                      }
                    }
                  }}
                  className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl font-medium hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center gap-2 justify-center"
                >
                  <FaTrash className="text-sm" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Checklist Modal */}
      {showEditChecklistModal && editingChecklist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-4 sm:p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Edit Checklist
              </h2>
              <button
                onClick={() => {
                  setShowEditChecklistModal(false);
                  setEditingChecklist(null);
                  setEditingChecklistId(null);
                }}
                className="text-white/50 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
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
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
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
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                >
                  <option
                    className="bg-[#1a1a1a] text-white"
                    value="application"
                  >
                    Application
                  </option>
                  <option
                    className="bg-[#1a1a1a] text-white"
                    value="financial_aid"
                  >
                    Financial Aid
                  </option>
                  <option
                    className="bg-[#1a1a1a] text-white"
                    value="scholarship"
                  >
                    Scholarship
                  </option>
                  <option className="bg-[#1a1a1a] text-white" value="housing">
                    Housing
                  </option>
                  <option className="bg-[#1a1a1a] text-white" value="academic">
                    Academic
                  </option>
                  <option className="bg-[#1a1a1a] text-white" value="personal">
                    Personal
                  </option>
                  <option className="bg-[#1a1a1a] text-white" value="other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={editingChecklist.description || ""}
                  onChange={(e) =>
                    setEditingChecklist((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white h-20 resize-none"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditChecklistModal(false);
                    setEditingChecklist(null);
                    setEditingChecklistId(null);
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-xl text-white/70 hover:text-white hover:border-[#FEEBD8]/30 transition-colors"
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
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-4 sm:p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Add New Checklist
              </h2>
              <button
                onClick={() => setShowAddChecklistModal(false)}
                className="text-white/50 hover:text-white transition-colors"
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
                <label className="block text-white/70 text-sm mb-2">
                  Checklist Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                  placeholder="e.g., Essay Requirements"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Add Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChecklistModal(false)}
                  className="px-4 py-2 border border-neutral-700/50 rounded-xl text-white/70 hover:text-white hover:border-[#FEEBD8]/30 transition-colors"
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
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add New Task</h2>
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setSelectedChecklistForTask(null);
                }}
                className="text-white/50 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const deadlineValue = formatDateForBackend(
                  newTaskForm.deadline
                );

                const taskData: any = {
                  name: newTaskForm.name.trim(),
                  priority: newTaskForm.priority,
                  type: newTaskForm.type,
                  component: newTaskForm.component,
                  status: newTaskForm.status,
                  responsible: newTaskForm.responsible,
                  deadline: deadlineValue, // Always include deadline (either user input or tomorrow)
                };

                // Only include notes if it has a value
                if (newTaskForm.notes && newTaskForm.notes.trim()) {
                  taskData.notes = newTaskForm.notes.trim();
                }

                // Validate required fields
                if (!taskData.name) {
                  showError("Task name is required");
                  return;
                }

                handleCreateTask(selectedChecklistForTask, taskData);
                setShowAddTaskModal(false);
                setSelectedChecklistForTask(null);
                // Reset form
                setNewTaskForm({
                  name: "",
                  deadline: "",
                  priority: "medium" as TaskPriority,
                  type: "document_preparation" as TaskType,
                  component: "common_app" as TaskComponent,
                  status: "not_started" as TaskStatus,
                  responsible: "student" as TaskResponsible,
                  notes: "",
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTaskForm.name}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                  placeholder="e.g., Write personal statement"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  label="Deadline"
                  value={newTaskForm.deadline}
                  onChange={(date) =>
                    setNewTaskForm((prev) => ({ ...prev, deadline: date }))
                  }
                  placeholder="Select task deadline"
                />

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Priority
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        priority: e.target.value as TaskPriority,
                      }))
                    }
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Task Type
                  </label>
                  <select
                    value={newTaskForm.type}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        type: e.target.value as TaskType,
                      }))
                    }
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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
                  <label className="block text-white/70 text-sm mb-2">
                    Component
                  </label>
                  <select
                    value={newTaskForm.component}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        component: e.target.value as TaskComponent,
                      }))
                    }
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={newTaskForm.status}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Responsible Person
                  </label>
                  <select
                    value={newTaskForm.responsible}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        responsible: e.target.value as TaskResponsible,
                      }))
                    }
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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
                <label className="block text-white/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={newTaskForm.notes}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white h-24 resize-none"
                  placeholder="Additional notes or details"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setSelectedChecklistForTask(null);
                  }}
                  className="px-4 py-2 border border-neutral-700/50 rounded-xl text-white/70 hover:text-white hover:border-[#FEEBD8]/30 transition-colors"
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
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Task</h2>
              <button
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                  setEditingChecklistId(null);
                  setEditingTaskId(null);
                }}
                className="text-white/50 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
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
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white"
                  placeholder="e.g., Write personal statement"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  label="Deadline"
                  value={formatDateForInput(editingTask.deadline)}
                  onChange={(date) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            deadline: formatDateForBackend(date),
                          }
                        : null
                    )
                  }
                  placeholder="Select task deadline"
                />

                <div>
                  <label className="block text-white/70 text-sm mb-2">
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
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
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
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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
                  <label className="block text-white/70 text-sm mb-2">
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
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
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
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
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
                    className="w-full bg-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: "dark" }}
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
                <label className="block text-white/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={editingTask.notes || ""}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null
                    )
                  }
                  className="w-full bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-3 text-white h-24 resize-none"
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
                  className="w-4 h-4 text-white bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-neutral-700/50 rounded focus:ring-[#FEEBD8] focus:ring-2"
                />
                <label
                  htmlFor="completed-edit"
                  className="text-white/70 text-sm"
                >
                  Mark as completed
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="px-4 py-2 border border-neutral-700/50 rounded-xl text-white/70 hover:text-white hover:border-[#FEEBD8]/30 transition-colors"
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
