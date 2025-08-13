"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
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
  FaHistory,
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

interface ActivityLogEntry {
  id: string;
  type:
    | "status_change"
    | "deadline_update"
    | "document_upload"
    | "note_added"
    | "checklist_update";
  description: string;
  timestamp: string;
  details?: any;
}

// Mock data
const mockColleges: College[] = [
  {
    id: "1",
    universityName: "Harvard University",
    universityCountry: "United States",
    universityState: "Massachusetts",
    universityWebsite: "https://harvard.edu",
    status: "In Progress",
    deadline: "2026-01-01",
    applicationDeadline: "2026-01-01",
    type: "RD",
    notes: "Need to finish personal statement",
    tags: ["Ivy League", "Reach"],
    progress: 65,
    createdAt: "2024-09-15",
    updatedAt: "2024-12-01",
    // Enhanced fields
    applicationFee: 85,
    contactEmail: "admissions@harvard.edu",
    priority: "Reach",
    gpa: 3.95,
    testScores: {
      sat: 1580,
      ap: [
        { subject: "Calculus BC", score: 5 },
        { subject: "Chemistry", score: 4 },
      ],
    },
  },
  {
    id: "2",
    universityName: "Stanford University",
    universityCountry: "United States",
    universityState: "California",
    universityWebsite: "https://stanford.edu",
    status: "Ready to Submit",
    deadline: "2025-12-15",
    applicationDeadline: "2025-12-15",
    type: "EA",
    notes: "All materials ready for submission",
    tags: ["Reach", "Tech"],
    progress: 95,
    createdAt: "2024-08-20",
    updatedAt: "2024-11-28",
    applicationFee: 90,
    contactEmail: "admission@stanford.edu",
    priority: "Reach",
    gpa: 4.0,
    testScores: {
      sat: 1590,
      act: 35,
    },
  },
];

const mockChecklists: Checklist[] = [
  {
    id: "1",
    name: "Application Materials",
    progress: 70,
    category: "Application",
    description: "Core application documents required for submission",
    items: [
      {
        id: "1",
        name: "Common Application",
        completed: true,
        deadline: "2024-12-31",
        priority: "High",
        category: "Application",
        taskType: "Document Preparation",
        appComponent: "Common App",
        status: "Completed",
        responsibility: "Student",
      },
      {
        id: "2",
        name: "Personal Statement",
        completed: true,
        deadline: "2024-12-15",
        priority: "High",
        category: "Essays",
        taskType: "Writing",
        appComponent: "Common App",
        status: "Completed",
        responsibility: "Student",
      },
      {
        id: "3",
        name: "Letters of Recommendation",
        completed: false,
        deadline: "2024-12-20",
        priority: "High",
        category: "Support",
        taskType: "Follow-up",
        appComponent: "Supporting Documents",
        status: "In Progress",
        responsibility: "Teacher",
        notes: "Need to follow up with Math teacher",
      },
      {
        id: "4",
        name: "Transcripts",
        completed: true,
        deadline: "2024-12-25",
        priority: "High",
        category: "Academic",
        taskType: "Submission",
        appComponent: "Academic Records",
        status: "Completed",
        responsibility: "School Office",
      },
      {
        id: "5",
        name: "SAT/ACT Scores",
        completed: false,
        deadline: "2024-12-30",
        priority: "High",
        category: "Testing",
        taskType: "Submission",
        appComponent: "Standardized Tests",
        status: "Waiting for Response",
        responsibility: "Student",
        notes: "Waiting for December SAT scores",
      },
    ],
  },
  {
    id: "2",
    name: "Supplemental Essays",
    progress: 40,
    category: "Essays",
    description: "University-specific essay requirements",
    items: [
      {
        id: "1",
        name: "Why This College Essay",
        completed: true,
        deadline: "2024-12-28",
        priority: "High",
        taskType: "Writing",
        appComponent: "Supplemental Essays",
        status: "Completed",
        responsibility: "Student",
      },
      {
        id: "2",
        name: "Diversity Essay",
        completed: false,
        deadline: "2024-12-29",
        priority: "Medium",
        taskType: "Writing",
        appComponent: "Supplemental Essays",
        status: "In Progress",
        responsibility: "Student",
      },
      {
        id: "3",
        name: "Activity Essay",
        completed: false,
        deadline: "2024-12-30",
        priority: "Medium",
        taskType: "Writing",
        appComponent: "Supplemental Essays",
        status: "Not Started",
        responsibility: "Student",
      },
    ],
  },
  {
    id: "3",
    name: "Financial Aid",
    progress: 20,
    category: "Financial",
    description: "Financial aid and scholarship applications",
    items: [
      {
        id: "1",
        name: "FAFSA",
        completed: false,
        deadline: "2025-01-15",
        priority: "High",
        taskType: "Document Preparation",
        appComponent: "Financial Documents",
        status: "Not Started",
        responsibility: "Parent",
      },
      {
        id: "2",
        name: "CSS Profile",
        completed: false,
        deadline: "2025-01-10",
        priority: "High",
        taskType: "Document Preparation",
        appComponent: "Financial Documents",
        status: "Not Started",
        responsibility: "Parent",
      },
      {
        id: "3",
        name: "Scholarship Applications",
        completed: true,
        deadline: "2024-12-15",
        priority: "Medium",
        taskType: "Submission",
        appComponent: "Financial Documents",
        status: "Completed",
        responsibility: "Student",
      },
    ],
  },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Personal Statement - Draft 3.pdf",
    type: "pdf",
    size: 245000,
    uploadDate: "2024-11-28",
    category: "Essay",
    status: "Final",
  },
  {
    id: "2",
    name: "Official Transcript.pdf",
    type: "pdf",
    size: 156000,
    uploadDate: "2024-11-20",
    category: "Transcript",
    status: "Submitted",
  },
  {
    id: "3",
    name: "SAT Score Report.pdf",
    type: "pdf",
    size: 89000,
    uploadDate: "2024-11-15",
    category: "Test Score",
    status: "Submitted",
  },
];

const mockActivityLog: ActivityLogEntry[] = [
  {
    id: "1",
    type: "status_change",
    description: "Status changed from 'Researching' to 'In Progress'",
    timestamp: "2024-12-01T10:30:00Z",
    details: { from: "Researching", to: "In Progress" },
  },
  {
    id: "2",
    type: "document_upload",
    description: "Uploaded Personal Statement - Draft 3.pdf",
    timestamp: "2024-11-28T14:15:00Z",
    details: { documentName: "Personal Statement - Draft 3.pdf" },
  },
  {
    id: "3",
    type: "checklist_update",
    description: "Completed 'Personal Statement' task",
    timestamp: "2024-11-28T14:10:00Z",
    details: { checklistId: "1", itemId: "2" },
  },
  {
    id: "4",
    type: "deadline_update",
    description: "Updated application deadline to January 1, 2026",
    timestamp: "2024-11-25T09:45:00Z",
    details: { newDeadline: "2026-01-01" },
  },
];

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

export default function CollegeDetail() {
  const router = useRouter();
  const params = useParams();
  const collegeId = params.id as string;

  const [college, setCollege] = useState<College | null>(null);
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activityLog, setActivityLog] =
    useState<ActivityLogEntry[]>(mockActivityLog);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(
    new Set(["1"])
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Modal states
  const [showEditCollegeModal, setShowEditCollegeModal] = useState(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditChecklistItemModal, setShowEditChecklistItemModal] =
    useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Edit states
  const [editingChecklistItem, setEditingChecklistItem] =
    useState<ChecklistItem | null>(null);
  const [editingChecklist, setEditingChecklist] = useState<string | null>(null);
  const [selectedChecklistForTask, setSelectedChecklistForTask] = useState<
    string | null
  >(null);
  const [tempNotes, setTempNotes] = useState("");
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
    // Find the college by ID first
    const foundCollege = mockColleges.find((c) => c.id === collegeId);
    if (foundCollege) {
      setCollege(foundCollege);
      document.title = `${foundCollege.universityName} | Paccy`;
    } else {
      // Check if this is a new college with university data in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const universityData = urlParams.get("university");

      if (universityData) {
        try {
          const university: UniversityData = JSON.parse(
            decodeURIComponent(universityData)
          );
          // Create college from university autocomplete data
          setCollege({
            id: collegeId,
            universityName: university.name,
            universityCountry: university.country,
            universityState: university["state-province"] || null,
            universityWebsite:
              university.web_pages.slice(0, 3).join(", ") || "",
            status: "Researching",
            deadline: "",
            applicationDeadline: "",
            type: "RD",
            notes: "",
            tags: [],
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          document.title = `${university.name} | Paccy`;
        } catch (error) {
          console.error("Error parsing university data:", error);
          // Fallback to default new college
          setCollege({
            id: collegeId,
            universityName: "New University",
            universityCountry: "Unknown",
            universityState: null,
            universityWebsite: "",
            status: "Researching",
            deadline: "",
            applicationDeadline: "",
            type: "RD",
            notes: "",
            tags: [],
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          document.title = "New Application | Paccy";
        }
      } else {
        // If not found and no university data, create a placeholder
        setCollege({
          id: collegeId,
          universityName: "New University",
          universityCountry: "Unknown",
          universityState: null,
          universityWebsite: "",
          status: "Researching",
          deadline: "",
          applicationDeadline: "",
          type: "RD",
          notes: "",
          tags: [],
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        document.title = "New Application | Paccy";
      }
    }
  }, [collegeId]);

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

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          const completedCount = updatedItems.filter(
            (item) => item.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedItems.length) * 100
          );
          return { ...checklist, items: updatedItems, progress };
        }
        return checklist;
      })
    );
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
  const addActivityLog = (entry: Omit<ActivityLogEntry, "id">) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setActivityLog((prev) => [newEntry, ...prev]);
  };

  const handleSaveCollege = () => {
    if (!college) return;

    const updatedCollege = {
      ...college,
      ...editForm,
      updatedAt: new Date().toISOString(),
    };
    setCollege(updatedCollege);
    setShowEditCollegeModal(false);
    setEditForm({});

    addActivityLog({
      type: "status_change",
      description: "College information updated",
      timestamp: new Date().toISOString(),
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!college) return;

    const oldStatus = college.status;
    setCollege((prev) =>
      prev
        ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
        : null
    );

    addActivityLog({
      type: "status_change",
      description: `Status changed from '${oldStatus}' to '${newStatus}'`,
      timestamp: new Date().toISOString(),
      details: { from: oldStatus, to: newStatus },
    });
  };

  const handleAddChecklist = () => {
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      name: newChecklistForm.name,
      description: newChecklistForm.description,
      category: newChecklistForm.category,
      items: [],
      progress: 0,
    };

    setChecklists((prev) => [...prev, newChecklist]);
    setNewChecklistForm({ name: "", description: "", category: "Application" });
    setShowAddChecklistModal(false);

    addActivityLog({
      type: "checklist_update",
      description: `Created new checklist: ${newChecklist.name}`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      name: newItemForm.name,
      completed: false,
      deadline: newItemForm.deadline,
      priority: newItemForm.priority as "Low" | "Medium" | "High",
      taskType: newItemForm.taskType,
      appComponent: newItemForm.appComponent,
      status: newItemForm.status,
      responsibility: newItemForm.responsibility,
      notes: newItemForm.notes,
    };

    setChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = [...checklist.items, newItem];
          const completedCount = updatedItems.filter(
            (item) => item.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedItems.length) * 100
          );
          return { ...checklist, items: updatedItems, progress };
        }
        return checklist;
      })
    );

    setNewItemForm({
      name: "",
      deadline: "",
      priority: "Medium",
      taskType: "",
      appComponent: "",
      status: "Not Started",
      responsibility: "",
      notes: "",
    });

    addActivityLog({
      type: "checklist_update",
      description: `Added new task: ${newItem.name}`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleEditChecklistItem = (
    checklistId: string,
    item: ChecklistItem
  ) => {
    setEditingChecklistItem(item);
    setEditingChecklist(checklistId);
    setShowEditChecklistItemModal(true);
  };

  const handleSaveChecklistItem = () => {
    if (!editingChecklistItem || !editingChecklist) return;

    setChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === editingChecklist) {
          const updatedItems = checklist.items.map((item) =>
            item.id === editingChecklistItem.id ? editingChecklistItem : item
          );
          const completedCount = updatedItems.filter(
            (item) => item.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedItems.length) * 100
          );
          return { ...checklist, items: updatedItems, progress };
        }
        return checklist;
      })
    );

    setEditingChecklistItem(null);
    setEditingChecklist(null);
    setShowEditChecklistItemModal(false);

    addActivityLog({
      type: "checklist_update",
      description: `Updated task: ${editingChecklistItem.name}`,
      timestamp: new Date().toISOString(),
    });
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

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.filter(
            (item) => item.id !== itemId
          );
          const completedCount = updatedItems.filter(
            (item) => item.completed
          ).length;
          const progress =
            updatedItems.length > 0
              ? Math.round((completedCount / updatedItems.length) * 100)
              : 0;
          return { ...checklist, items: updatedItems, progress };
        }
        return checklist;
      })
    );
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

  if (!college) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#FEEBD8]">Loading...</div>
      </div>
    );
  }

  const overallProgress = Math.round(
    checklists.reduce((acc, checklist) => acc + checklist.progress, 0) /
      checklists.length
  );

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
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowActivityModal(true)}
              className="bg-neutral-700 text-[#FEEBD8] px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2"
            >
              <FaHistory />
              <span>Activity</span>
            </button>
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
                <label className="text-[#FEEBD8]/70 text-sm">Deadline</label>
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
                            className="text-blue-400 hover:underline block"
                          >
                            {website.trim()}
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              )}
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
                    {checklists.reduce(
                      (acc, checklist) =>
                        acc +
                        checklist.items.filter((item) => item.completed).length,
                      0
                    )}
                  </div>
                  <div className="text-[#FEEBD8]/70 text-sm">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {checklists.reduce(
                      (acc, checklist) =>
                        acc +
                        checklist.items.filter((item) => !item.completed)
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

          {checklists.map((checklist) => (
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
                            checklist.items.filter((item) => item.completed)
                              .length
                          }{" "}
                          of {checklist.items.length} completed
                        </div>
                        <div className="w-32 bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${checklist.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-[#FEEBD8]/70">
                          {checklist.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {expandedChecklists.has(checklist.id) && (
                <div className="border-t border-neutral-700/50">
                  <div className="p-6 space-y-3">
                    {checklist.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-neutral-800/30 rounded-lg border border-neutral-700/30 cursor-pointer hover:bg-neutral-800/40 transition-colors"
                        onClick={() => {
                          if (
                            item.priority ||
                            item.status ||
                            item.responsibility ||
                            item.taskType ||
                            item.appComponent ||
                            item.notes
                          ) {
                            toggleTask(item.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChecklistItem(checklist.id, item.id);
                              }}
                              className={`text-xl flex-shrink-0 ${
                                item.completed
                                  ? "text-green-400 hover:text-green-300"
                                  : "text-neutral-500 hover:text-neutral-400"
                              } transition-colors`}
                            >
                              {item.completed ? (
                                <FaCheckCircle />
                              ) : (
                                <FaTimesCircle />
                              )}
                            </button>
                            <div className="flex-1">
                              <h4
                                className={`text-lg font-medium ${
                                  item.completed
                                    ? "text-[#FEEBD8]/70 line-through"
                                    : "text-[#FEEBD8]"
                                }`}
                              >
                                {item.name}
                              </h4>
                              {item.deadline && (
                                <div className="text-sm text-[#FEEBD8]/50 mt-1 flex items-center gap-1">
                                  <FaCalendar />
                                  Due: {formatDeadline(item.deadline)}
                                  {(() => {
                                    const days = getDaysUntilDeadline(
                                      item.deadline
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
                            {(item.priority ||
                              item.status ||
                              item.responsibility ||
                              item.taskType ||
                              item.appComponent ||
                              item.notes) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTask(item.id);
                                }}
                                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors flex-shrink-0"
                                title={
                                  expandedTasks.has(item.id)
                                    ? "Show less"
                                    : "Show more"
                                }
                              >
                                {expandedTasks.has(item.id) ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditChecklistItem(checklist.id, item);
                              }}
                              className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors flex-shrink-0"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </div>

                        {/* Task Details - Only show when expanded */}
                        {expandedTasks.has(item.id) && (
                          <>
                            {(item.priority ||
                              item.status ||
                              item.responsibility ||
                              item.taskType) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                {item.priority && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Priority:
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                        item.priority
                                      )}`}
                                    >
                                      {item.priority}
                                    </span>
                                  </div>
                                )}
                                {item.status && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Status:
                                    </span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                      {item.status}
                                    </span>
                                  </div>
                                )}
                                {item.responsibility && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Assigned:
                                    </span>
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                      {item.responsibility}
                                    </span>
                                  </div>
                                )}
                                {item.taskType && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Type:
                                    </span>
                                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                                      {item.taskType}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {(item.appComponent || item.notes) && (
                              <div className="mt-3 pt-3 border-t border-neutral-700/30">
                                {item.appComponent && (
                                  <div className="mb-2">
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Component:{" "}
                                    </span>
                                    <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-medium">
                                      {item.appComponent}
                                    </span>
                                  </div>
                                )}
                                {item.notes && (
                                  <div>
                                    <span className="text-[#FEEBD8]/50 text-xs">
                                      Notes:{" "}
                                    </span>
                                    <span className="text-[#FEEBD8]/70 text-sm">
                                      {item.notes}
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
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Applied">Applied</option>
                    <option value="Waitlisted">Waitlisted</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Type
                  </label>
                  <select
                    value={editForm.type || college?.type || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Target">Target</option>
                    <option value="Reach">Reach</option>
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
                    value={editForm.deadline || college?.deadline || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Fee
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
                  setNewItemForm({
                    name: "",
                    deadline: "",
                    priority: "Medium",
                    taskType: "",
                    appComponent: "",
                    status: "Not Started",
                    responsibility: "",
                    notes: "",
                  });
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
                  value={newItemForm.name}
                  onChange={(e) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
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
                    value={newItemForm.deadline}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Priority
                  </label>
                  <select
                    value={newItemForm.priority}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Task Type
                  </label>
                  <select
                    value={newItemForm.taskType}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
                        ...prev,
                        taskType: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="">Select Task Type</option>
                    <option value="Document Preparation">
                      Document Preparation
                    </option>
                    <option value="Submission">Submission</option>
                    <option value="Review">Review</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Research">Research</option>
                    <option value="Writing">Writing</option>
                    <option value="Scheduling">Scheduling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Component
                  </label>
                  <select
                    value={newItemForm.appComponent}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
                        ...prev,
                        appComponent: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="">Select Component</option>
                    <option value="Common App">Common App</option>
                    <option value="Supplemental Essays">
                      Supplemental Essays
                    </option>
                    <option value="Academic Records">Academic Records</option>
                    <option value="Standardized Tests">
                      Standardized Tests
                    </option>
                    <option value="Supporting Documents">
                      Supporting Documents
                    </option>
                    <option value="Financial Documents">
                      Financial Documents
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={newItemForm.status}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Waiting for Response">
                      Waiting for Response
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Responsibility
                </label>
                <select
                  value={newItemForm.responsibility}
                  onChange={(e) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      responsibility: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                >
                  <option value="">Select Responsibility</option>
                  <option value="Student">Student</option>
                  <option value="Counselor">Counselor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Parent">Parent</option>
                  <option value="School Office">School Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={newItemForm.notes}
                  onChange={(e) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-24 resize-none"
                  placeholder="Additional notes for this task..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleAddChecklistItem(selectedChecklistForTask);
                    setShowAddTaskModal(false);
                    setSelectedChecklistForTask(null);
                  }}
                  disabled={!newItemForm.name.trim()}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setSelectedChecklistForTask(null);
                    setNewItemForm({
                      name: "",
                      deadline: "",
                      priority: "Medium",
                      taskType: "",
                      appComponent: "",
                      status: "Not Started",
                      responsibility: "",
                      notes: "",
                    });
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
                onClick={() => {
                  setShowAddChecklistModal(false);
                  setNewChecklistForm({
                    name: "",
                    description: "",
                    category: "Application",
                  });
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
                  value={newChecklistForm.name}
                  onChange={(e) =>
                    setNewChecklistForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  placeholder="e.g., Application Requirements"
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={newChecklistForm.description}
                  onChange={(e) =>
                    setNewChecklistForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-20 resize-none"
                  placeholder="Brief description of this checklist..."
                />
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Category
                </label>
                <select
                  value={newChecklistForm.category}
                  onChange={(e) =>
                    setNewChecklistForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                >
                  <option value="Application">Application</option>
                  <option value="Financial Aid">Financial Aid</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Housing">Housing</option>
                  <option value="Academic">Academic</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddChecklist}
                  disabled={!newChecklistForm.name.trim()}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Checklist
                </button>
                <button
                  onClick={() => {
                    setShowAddChecklistModal(false);
                    setNewChecklistForm({
                      name: "",
                      description: "",
                      category: "Application",
                    });
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

      {/* Edit Checklist Item Modal */}
      {showEditChecklistItemModal && editingChecklistItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Edit Task
              </h2>
              <button
                onClick={() => {
                  setShowEditChecklistItemModal(false);
                  setEditingChecklistItem(null);
                  setEditingChecklist(null);
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
                  value={editingChecklistItem.name}
                  onChange={(e) =>
                    setEditingChecklistItem((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingChecklistItem.deadline || ""}
                    onChange={(e) =>
                      setEditingChecklistItem((prev) =>
                        prev ? { ...prev, deadline: e.target.value } : null
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
                    value={editingChecklistItem.priority || "Medium"}
                    onChange={(e) =>
                      setEditingChecklistItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              priority: e.target.value as
                                | "Low"
                                | "Medium"
                                | "High",
                            }
                          : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Task Type
                  </label>
                  <select
                    value={editingChecklistItem.taskType || ""}
                    onChange={(e) =>
                      setEditingChecklistItem((prev) =>
                        prev ? { ...prev, taskType: e.target.value } : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="">Select Task Type</option>
                    <option value="Document Preparation">
                      Document Preparation
                    </option>
                    <option value="Submission">Submission</option>
                    <option value="Review">Review</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Research">Research</option>
                    <option value="Writing">Writing</option>
                    <option value="Scheduling">Scheduling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Application Component
                  </label>
                  <select
                    value={editingChecklistItem.appComponent || ""}
                    onChange={(e) =>
                      setEditingChecklistItem((prev) =>
                        prev ? { ...prev, appComponent: e.target.value } : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="">Select Component</option>
                    <option value="Common App">Common App</option>
                    <option value="Supplemental Essays">
                      Supplemental Essays
                    </option>
                    <option value="Academic Records">Academic Records</option>
                    <option value="Standardized Tests">
                      Standardized Tests
                    </option>
                    <option value="Supporting Documents">
                      Supporting Documents
                    </option>
                    <option value="Financial Documents">
                      Financial Documents
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={editingChecklistItem.status || "Not Started"}
                    onChange={(e) =>
                      setEditingChecklistItem((prev) =>
                        prev ? { ...prev, status: e.target.value } : null
                      )
                    }
                    className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Waiting for Response">
                      Waiting for Response
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Responsibility
                </label>
                <select
                  value={editingChecklistItem.responsibility || ""}
                  onChange={(e) =>
                    setEditingChecklistItem((prev) =>
                      prev ? { ...prev, responsibility: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8]"
                >
                  <option value="">Select Responsibility</option>
                  <option value="Student">Student</option>
                  <option value="Counselor">Counselor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Parent">Parent</option>
                  <option value="School Office">School Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  value={editingChecklistItem.notes || ""}
                  onChange={(e) =>
                    setEditingChecklistItem((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null
                    )
                  }
                  className="w-full bg-[#141414] border border-neutral-700/50 rounded-lg p-3 text-[#FEEBD8] h-24 resize-none"
                  placeholder="Additional notes for this task..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={editingChecklistItem.completed}
                  onChange={(e) =>
                    setEditingChecklistItem((prev) =>
                      prev ? { ...prev, completed: e.target.checked } : null
                    )
                  }
                  className="w-4 h-4 text-[#FEEBD8] bg-[#141414] border-neutral-700/50 rounded focus:ring-[#FEEBD8] focus:ring-2"
                />
                <label
                  htmlFor="completed"
                  className="text-[#FEEBD8]/70 text-sm"
                >
                  Mark as completed
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveChecklistItem}
                  className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditChecklistItemModal(false);
                    setEditingChecklistItem(null);
                    setEditingChecklist(null);
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

      {/* Activity Log Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-700/50 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2">
                <FaHistory />
                Activity Log
              </h2>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {activityLog.length === 0 ? (
                <div className="text-center text-[#FEEBD8]/50 py-8">
                  <FaHistory className="mx-auto mb-4" size={40} />
                  <p>No activity recorded yet</p>
                </div>
              ) : (
                activityLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#141414] border border-neutral-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              entry.type === "status_change"
                                ? "bg-blue-500/20 text-blue-300"
                                : entry.type === "document_upload"
                                ? "bg-green-500/20 text-green-300"
                                : entry.type === "checklist_update"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {entry.type.replace("_", " ").toUpperCase()}
                          </span>
                          <span className="text-[#FEEBD8]/50 text-sm">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-[#FEEBD8] mb-1">
                          {entry.description}
                        </p>
                        {entry.details && (
                          <div className="text-[#FEEBD8]/70 text-sm bg-[#0a0a0a] rounded p-2 mt-2">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
