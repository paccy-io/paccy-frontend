"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import ImportTemplateModal from "../../../components/Modals/ImportTemplateModal";
import TemplatePreviewModal from "../../../components/Modals/TemplatePreviewModal";
import TemplateImportSuccessModal from "../../../components/Modals/TemplateImportSuccessModal";
import ToastNotification from "../../../components/ToastNotification";
import { useToast } from "../../../lib/hooks/useToast";
import {
  FaArrowLeft,
  FaGlobe,
  FaUniversity,
  FaCheckCircle,
  FaFileAlt,
  FaPen,
  FaCalendar,
  FaGraduationCap,
  FaCertificate,
  FaDollarSign,
  FaLanguage,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaFlag,
  FaClock,
  FaStar,
  FaUsers,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import {
  CreateChecklistDTO,
  CreateTaskDTO,
  Category,
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskStatus,
  TaskResponsible,
  TemplateImportResult,
} from "../../../lib/types";

// Template interfaces
interface UniversityTemplate {
  id: string;
  name: string;
  description: string;
  country: string;
  countryCode: string;
  flag: string;
  requirements: string[];
  commonTests: string[];
  applicationPeriod: string;
  uniqueFeatures: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  popularity: number;
  estimatedUsers: string;
  checklists: TemplateChecklist[];
}

interface TemplateChecklist {
  name: string;
  category: Category;
  description: string;
  tasks: TemplateTask[];
}

interface TemplateTask {
  name: string;
  deadline_days_before: number; // Days before application deadline
  priority: TaskPriority;
  type: TaskType;
  component: TaskComponent;
  responsible: TaskResponsible;
  notes: string;
}

// University system templates based on research
const universityTemplates: UniversityTemplate[] = [
  {
    id: "usa-undergraduate",
    name: "United States - Undergraduate",
    description:
      "Comprehensive template for US undergraduate applications including Common App, essays, standardized tests, and financial aid.",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    requirements: [
      "SAT/ACT scores",
      "High school transcripts",
      "Personal essays",
      "Letters of recommendation",
      "Extracurricular activities",
      "Financial aid documents",
    ],
    commonTests: ["SAT", "ACT", "AP Exams", "SAT Subject Tests"],
    applicationPeriod: "August - January",
    uniqueFeatures: [
      "Common Application system",
      "Holistic admissions review",
      "Need-blind/need-aware policies",
      "Early Decision/Action options",
    ],
    difficulty: "Hard",
    popularity: 95,
    estimatedUsers: "2.1M international applicants",
    checklists: [
      {
        name: "Standardized Tests",
        category: Category.ACADEMIC,
        description: "Prepare and take required standardized tests",
        tasks: [
          {
            name: "Register for SAT/ACT",
            deadline_days_before: 120,
            priority: TaskPriority.HIGH,
            type: TaskType.SCHEDULING,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Take test at least 2-3 times for best scores. Register early to secure preferred test dates.",
          },
          {
            name: "Take SAT/ACT",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Aim for scores above the 75th percentile for target schools.",
          },
          {
            name: "Submit test scores to schools",
            deadline_days_before: 30,
            priority: TaskPriority.HIGH,
            type: TaskType.SUBMISSION,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Check if schools require official score reports or accept self-reported scores.",
          },
        ],
      },
      {
        name: "Application Essays",
        category: Category.APPLICATION,
        description: "Write compelling personal essays and supplemental essays",
        tasks: [
          {
            name: "Write Common App personal essay",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.WRITING,
            component: TaskComponent.COMMON_APP,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Choose from 7 prompts. 650 words max. Show personality and growth.",
          },
          {
            name: "Complete school-specific supplemental essays",
            deadline_days_before: 45,
            priority: TaskPriority.HIGH,
            type: TaskType.WRITING,
            component: TaskComponent.SUPPLEMENTAL_ESSAY,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Research each school thoroughly. Answer 'Why this school?' convincingly.",
          },
          {
            name: "Get essays reviewed by counselor/teacher",
            deadline_days_before: 30,
            priority: TaskPriority.MEDIUM,
            type: TaskType.REVIEW,
            component: TaskComponent.SUPPLEMENTAL_ESSAY,
            responsible: TaskResponsible.COUNSELOR,
            notes: "Get feedback on content, structure, and grammar.",
          },
        ],
      },
      {
        name: "Letters of Recommendation",
        category: Category.APPLICATION,
        description: "Secure strong recommendation letters",
        tasks: [
          {
            name: "Ask teachers for recommendation letters",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.SUPPORTING_DOCUMENTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Ask teachers who know you well academically. Provide resume and personal statement.",
          },
          {
            name: "Request counselor recommendation",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.SUPPORTING_DOCUMENTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Schedule meeting with counselor to discuss college goals and background.",
          },
          {
            name: "Follow up on recommendation submissions",
            deadline_days_before: 14,
            priority: TaskPriority.MEDIUM,
            type: TaskType.FOLLOW_UP,
            component: TaskComponent.SUPPORTING_DOCUMENTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Check Common App to ensure all recommendations are submitted.",
          },
        ],
      },
      {
        name: "Financial Aid",
        category: Category.FINANCIAL_AID,
        description: "Complete financial aid applications",
        tasks: [
          {
            name: "Complete FAFSA",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.DOCUMENT_PREPARATION,
            component: TaskComponent.FINANCIAL_DOCUMENTS,
            responsible: TaskResponsible.PARENT,
            notes:
              "File as early as possible. Need tax returns and financial statements.",
          },
          {
            name: "Complete CSS Profile (if required)",
            deadline_days_before: 45,
            priority: TaskPriority.MEDIUM,
            type: TaskType.DOCUMENT_PREPARATION,
            component: TaskComponent.FINANCIAL_DOCUMENTS,
            responsible: TaskResponsible.PARENT,
            notes:
              "Required by many private schools. More detailed than FAFSA.",
          },
          {
            name: "Apply for external scholarships",
            deadline_days_before: 120,
            priority: TaskPriority.MEDIUM,
            type: TaskType.OTHER,
            component: TaskComponent.FINANCIAL_DOCUMENTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Start early. Apply to multiple scholarships throughout senior year.",
          },
        ],
      },
    ],
  },
  {
    id: "uk-undergraduate",
    name: "United Kingdom - Undergraduate",
    description:
      "UCAS application system for UK universities including personal statements, A-levels, and course selection.",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    requirements: [
      "A-Level grades or equivalent",
      "UCAS personal statement",
      "Academic reference",
      "English proficiency (international students)",
      "Course-specific requirements",
    ],
    commonTests: [
      "A-Levels",
      "IB Diploma",
      "IELTS/TOEFL",
      "UCAT/BMAT (for medicine)",
    ],
    applicationPeriod: "September - January",
    uniqueFeatures: [
      "Apply to up to 5 courses",
      "Course-specific applications",
      "Clearing system for unfilled places",
      "Fixed UCAS deadlines",
    ],
    difficulty: "Medium",
    popularity: 78,
    estimatedUsers: "700K international applicants",
    checklists: [
      {
        name: "UCAS Application",
        category: Category.APPLICATION,
        description: "Complete UCAS online application",
        tasks: [
          {
            name: "Research courses and universities",
            deadline_days_before: 120,
            priority: TaskPriority.HIGH,
            type: TaskType.RESEARCH,
            component: TaskComponent.OTHER,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Choose up to 5 courses. Consider entry requirements and course content.",
          },
          {
            name: "Write personal statement",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.WRITING,
            component: TaskComponent.SUPPLEMENTAL_ESSAY,
            responsible: TaskResponsible.STUDENT,
            notes:
              "4000 characters max. Focus on academic interest and relevant experience.",
          },
          {
            name: "Request academic reference",
            deadline_days_before: 75,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.SUPPORTING_DOCUMENTS,
            responsible: TaskResponsible.TEACHER,
            notes: "Usually written by school teacher or college tutor.",
          },
          {
            name: "Submit UCAS application",
            deadline_days_before: 14,
            priority: TaskPriority.HIGH,
            type: TaskType.SUBMISSION,
            component: TaskComponent.OTHER,
            responsible: TaskResponsible.STUDENT,
            notes: "Deadline: 15 January (Oxford/Cambridge: 15 October)",
          },
        ],
      },
      {
        name: "Academic Qualifications",
        category: Category.ACADEMIC,
        description: "Prepare academic credentials",
        tasks: [
          {
            name: "Complete A-Level studies",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.STUDENT,
            notes: "Meet predicted grade requirements for chosen courses.",
          },
          {
            name: "Take English proficiency test (international)",
            deadline_days_before: 45,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "IELTS 6.5+ typically required. Check specific requirements.",
          },
        ],
      },
    ],
  },
  {
    id: "canada-undergraduate",
    name: "Canada - Undergraduate",
    description:
      "Canadian university applications with provincial variations, focusing on academic performance and extracurriculars.",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    requirements: [
      "Grade 12 transcripts",
      "English proficiency",
      "Program-specific prerequisites",
      "Personal statements (some schools)",
      "Reference letters (some programs)",
    ],
    commonTests: [
      "IELTS/TOEFL",
      "SAT (some schools)",
      "Program-specific tests",
    ],
    applicationPeriod: "October - March",
    uniqueFeatures: [
      "Grade-focused admissions",
      "Provincial application systems",
      "Lower application fees",
      "Post-graduation work permits",
    ],
    difficulty: "Medium",
    popularity: 65,
    estimatedUsers: "500K international applicants",
    checklists: [
      {
        name: "Academic Requirements",
        category: Category.ACADEMIC,
        description: "Meet academic prerequisites",
        tasks: [
          {
            name: "Complete Grade 12 university-prep courses",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.STUDENT,
            notes: "Maintain 80%+ average for competitive programs.",
          },
          {
            name: "Take English proficiency test",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "IELTS 6.5+ or TOEFL 90+ typically required.",
          },
          {
            name: "Submit official transcripts",
            deadline_days_before: 30,
            priority: TaskPriority.HIGH,
            type: TaskType.SUBMISSION,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.SCHOOL_OFFICE,
            notes: "Request transcripts early from your school.",
          },
        ],
      },
      {
        name: "Application Process",
        category: Category.APPLICATION,
        description: "Complete university applications",
        tasks: [
          {
            name: "Apply through OUAC (Ontario) or direct application",
            deadline_days_before: 45,
            priority: TaskPriority.HIGH,
            type: TaskType.SUBMISSION,
            component: TaskComponent.OTHER,
            responsible: TaskResponsible.STUDENT,
            notes: "Each province has different application systems.",
          },
          {
            name: "Write personal statement (if required)",
            deadline_days_before: 60,
            priority: TaskPriority.MEDIUM,
            type: TaskType.WRITING,
            component: TaskComponent.SUPPLEMENTAL_ESSAY,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Not all programs require essays. Check specific requirements.",
          },
        ],
      },
    ],
  },
  {
    id: "netherlands-undergraduate",
    name: "Netherlands - Undergraduate",
    description:
      "Dutch university applications with focus on VWO qualifications and numerus fixus programs.",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    requirements: [
      "VWO diploma or equivalent",
      "Specific subject requirements",
      "English proficiency",
      "Motivation letter (some programs)",
      "Portfolio (art/design programs)",
    ],
    commonTests: ["IELTS/TOEFL", "IB Diploma", "A-Levels"],
    applicationPeriod: "October - May",
    uniqueFeatures: [
      "Numerus fixus lottery system",
      "Research vs Applied Sciences distinction",
      "Low tuition fees for EU students",
      "English-taught programs",
    ],
    difficulty: "Easy",
    popularity: 58,
    estimatedUsers: "85K international applicants",
    checklists: [
      {
        name: "Academic Preparation",
        category: Category.ACADEMIC,
        description: "Meet Dutch academic requirements",
        tasks: [
          {
            name: "Complete VWO or equivalent qualification",
            deadline_days_before: 120,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Must have correct subject combination for your chosen field.",
          },
          {
            name: "Take English proficiency test",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "IELTS 6.0+ or equivalent for most programs.",
          },
        ],
      },
      {
        name: "Application Submission",
        category: Category.APPLICATION,
        description: "Apply through Studielink",
        tasks: [
          {
            name: "Register for Studielink account",
            deadline_days_before: 90,
            priority: TaskPriority.MEDIUM,
            type: TaskType.OTHER,
            component: TaskComponent.OTHER,
            responsible: TaskResponsible.STUDENT,
            notes: "Dutch national application system for higher education.",
          },
          {
            name: "Submit application via Studielink",
            deadline_days_before: 30,
            priority: TaskPriority.HIGH,
            type: TaskType.SUBMISSION,
            component: TaskComponent.OTHER,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Deadline: 1 May for most programs, earlier for numerus fixus.",
          },
          {
            name: "Write motivation letter (if required)",
            deadline_days_before: 45,
            priority: TaskPriority.MEDIUM,
            type: TaskType.WRITING,
            component: TaskComponent.SUPPLEMENTAL_ESSAY,
            responsible: TaskResponsible.STUDENT,
            notes: "Required for some competitive programs.",
          },
        ],
      },
    ],
  },
  {
    id: "germany-undergraduate",
    name: "Germany - Undergraduate",
    description:
      "German university applications requiring Abitur or equivalent, with numerus clausus for popular programs.",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    requirements: [
      "Abitur or equivalent",
      "German language proficiency",
      "Subject-specific requirements",
      "APS certificate (some countries)",
      "Motivation letter (some programs)",
    ],
    commonTests: ["TestDaF", "DSH", "IELTS/TOEFL (English programs)"],
    applicationPeriod: "December - July",
    uniqueFeatures: [
      "Free tuition at public universities",
      "Numerus clausus restrictions",
      "Strong technical education",
      "Dual study programs",
    ],
    difficulty: "Medium",
    popularity: 42,
    estimatedUsers: "350K international applicants",
    checklists: [
      {
        name: "Academic Qualifications",
        category: Category.ACADEMIC,
        description: "Prepare German university entrance qualifications",
        tasks: [
          {
            name: "Obtain Abitur or equivalent recognition",
            deadline_days_before: 120,
            priority: TaskPriority.HIGH,
            type: TaskType.DOCUMENT_PREPARATION,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Check if your qualification is recognized. May need Studienkolleg.",
          },
          {
            name: "Take German language test",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "TestDaF or DSH required for German-taught programs.",
          },
          {
            name: "Get APS certificate (if required)",
            deadline_days_before: 150,
            priority: TaskPriority.HIGH,
            type: TaskType.DOCUMENT_PREPARATION,
            component: TaskComponent.SUPPORTING_DOCUMENTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Required for students from certain countries. Takes several months.",
          },
        ],
      },
    ],
  },
  {
    id: "australia-undergraduate",
    name: "Australia - Undergraduate",
    description:
      "Australian university applications using ATAR scores and centralized admission systems.",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    requirements: [
      "ATAR or equivalent",
      "English proficiency",
      "Subject prerequisites",
      "Personal statement (some courses)",
      "Portfolio (creative courses)",
    ],
    commonTests: [
      "IELTS/TOEFL",
      "UCAT (medicine)",
      "GAMSAT (graduate medicine)",
    ],
    applicationPeriod: "August - December",
    uniqueFeatures: [
      "ATAR ranking system",
      "Centralized state-based applications",
      "Pathway programs available",
      "Work-integrated learning",
    ],
    difficulty: "Medium",
    popularity: 55,
    estimatedUsers: "400K international applicants",
    checklists: [
      {
        name: "Academic Requirements",
        category: Category.ACADEMIC,
        description: "Meet Australian university entry requirements",
        tasks: [
          {
            name: "Complete Year 12 or equivalent",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.ACADEMIC_RECORDS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Achieve required ATAR or equivalent international qualification.",
          },
          {
            name: "Take English proficiency test",
            deadline_days_before: 60,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "IELTS 6.5+ typically required.",
          },
        ],
      },
    ],
  },
  {
    id: "france-undergraduate",
    name: "France - Undergraduate",
    description:
      "French higher education applications through Parcoursup and direct applications to grandes écoles.",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    requirements: [
      "Baccalauréat or equivalent",
      "French language proficiency",
      "Academic transcripts",
      "Motivation project",
      "Portfolio (art schools)",
    ],
    commonTests: ["DELF/DALF", "TCF", "Concours (grandes écoles)"],
    applicationPeriod: "January - April",
    uniqueFeatures: [
      "Parcoursup platform",
      "Grandes écoles system",
      "Low tuition fees",
      "Numerus clausus in some fields",
    ],
    difficulty: "Medium",
    popularity: 38,
    estimatedUsers: "245K international applicants",
    checklists: [
      {
        name: "Language Requirements",
        category: Category.ACADEMIC,
        description: "Meet French language proficiency requirements",
        tasks: [
          {
            name: "Take French language test",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "DELF B2 or DALF C1 required for most programs.",
          },
        ],
      },
    ],
  },
  {
    id: "japan-undergraduate",
    name: "Japan - Undergraduate",
    description:
      "Japanese university applications requiring EJU exam and strong academic performance.",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    requirements: [
      "EJU (Examination for Japanese University Admission)",
      "Japanese language proficiency",
      "Academic transcripts",
      "University-specific entrance exams",
      "Interview (some programs)",
    ],
    commonTests: ["EJU", "JLPT", "TOEFL/IELTS (English programs)"],
    applicationPeriod: "September - February",
    uniqueFeatures: [
      "Multiple examination systems",
      "Strong emphasis on entrance exams",
      "April and September intakes",
      "Research-focused education",
    ],
    difficulty: "Hard",
    popularity: 35,
    estimatedUsers: "180K international applicants",
    checklists: [
      {
        name: "Entrance Examinations",
        category: Category.ACADEMIC,
        description: "Prepare for Japanese university entrance exams",
        tasks: [
          {
            name: "Take EJU exam",
            deadline_days_before: 120,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes:
              "Exam held twice yearly. Choose subjects based on your field.",
          },
          {
            name: "Take Japanese language proficiency test",
            deadline_days_before: 90,
            priority: TaskPriority.HIGH,
            type: TaskType.OTHER,
            component: TaskComponent.STANDARDIZED_TESTS,
            responsible: TaskResponsible.STUDENT,
            notes: "JLPT N2 or N1 typically required.",
          },
        ],
      },
    ],
  },
];

export default function TemplatesPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<TemplateImportResult | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<UniversityTemplate | null>(null);

  const { toasts, removeToast } = useToast();

  useEffect(() => {
    document.title = "Templates | Paccy";
  }, []);

  // Filter templates based on search and filters
  const filteredTemplates = universityTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountry === "all" || template.countryCode === selectedCountry;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      template.difficulty === selectedDifficulty;

    return matchesSearch && matchesCountry && matchesDifficulty;
  });

  // Get unique countries for filter
  const countries = Array.from(
    new Set(universityTemplates.map((t) => t.country))
  ).map((country) => {
    const template = universityTemplates.find((t) => t.country === country);
    return {
      name: country,
      code: template?.countryCode || "",
      flag: template?.flag || "",
    };
  });

  const handleImportTemplate = (template: UniversityTemplate) => {
    setSelectedTemplate(template);
    setShowImportModal(true);
  };

  const handlePreviewTemplate = (template: UniversityTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleImportSuccess = (result: TemplateImportResult) => {
    // Store the import result and show success modal
    setImportResult(result);
    setShowImportModal(false);
    setSelectedTemplate(null);

    // Show success modal after a brief delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20";
      case "Medium":
        return "bg-yellow-500/20";
      case "Hard":
        return "bg-red-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              University Templates
            </h1>
            <p className="text-white/70 mt-2 text-sm sm:text-base">
              Import pre-built application checklists and tasks for universities
              worldwide
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {universityTemplates.length}
            </div>
            <div className="text-white/60 text-sm">Total Templates</div>
          </div>
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {countries.length}
            </div>
            <div className="text-white/60 text-sm">Countries Covered</div>
          </div>
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">1.5K+</div>
            <div className="text-white/60 text-sm">Students Helped</div>
          </div>
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">95%</div>
            <div className="text-white/60 text-sm">Success Rate</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by country, university system, or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="all">All Countries</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.flag}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {template.name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {template.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getDifficultyBg(
                        template.difficulty
                      )} ${getDifficultyColor(template.difficulty)}`}
                    >
                      {template.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-white/60">
                      <FaStar className="text-yellow-400" size={12} />
                      <span className="text-xs">{template.popularity}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">
                  {template.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <FaUsers size={12} />
                    {template.estimatedUsers}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock size={12} />
                    {template.applicationPeriod}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" size={16} />
                    Key Requirements
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {template.requirements.slice(0, 4).map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-white/70 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {req}
                      </div>
                    ))}
                    {template.requirements.length > 4 && (
                      <div className="text-white/60 text-xs">
                        +{template.requirements.length - 4} more requirements
                      </div>
                    )}
                  </div>
                </div>

                {/* Common Tests */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaCertificate className="text-blue-400" size={16} />
                    Common Tests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template.commonTests.map((test, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unique Features */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaStar className="text-yellow-400" size={16} />
                    Unique Features
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {template.uniqueFeatures
                      .slice(0, 3)
                      .map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-white/70 text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Template Stats */}
                <div className="mb-6 p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {template.checklists.length}
                      </div>
                      <div className="text-xs text-white/60">Checklists</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {template.checklists.reduce(
                          (total, checklist) => total + checklist.tasks.length,
                          0
                        )}
                      </div>
                      <div className="text-xs text-white/60">Tasks</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handlePreviewTemplate(template)}
                    className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/30 py-3 px-6 rounded-lg font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    Preview Template
                  </button>
                  <button
                    onClick={() => handleImportTemplate(template)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Import Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-white/40 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Templates Found
            </h3>
            <p className="text-[#FEEBD8]/70 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("all");
                setSelectedDifficulty("all");
              }}
              className="bg-[#FEEBD8] text-[#141414] px-6 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            How Templates Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <FaSearch size={24} />
              </div>
              <h4 className="font-semibold text-white mb-2 text-lg">
                1. Choose Template
              </h4>
              <p className="text-white/70 text-sm">
                Browse templates by country and select the one that matches your
                target universities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center text-green-400 mx-auto mb-4 shadow-lg shadow-green-500/20">
                <FaDownload size={24} />
              </div>
              <h4 className="font-semibold text-white mb-2 text-lg">
                2. Import Template
              </h4>
              <p className="text-white/70 text-sm">
                Click import to automatically create checklists and tasks for
                your college applications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 mx-auto mb-4 shadow-lg shadow-purple-500/20">
                <FaCheckCircle size={24} />
              </div>
              <h4 className="font-semibold text-white mb-2 text-lg">
                3. Track Progress
              </h4>
              <p className="text-white/70 text-sm">
                Use the imported tasks and deadlines to stay organized
                throughout your application process.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Import Template Modal */}
      {selectedTemplate && (
        <ImportTemplateModal
          isOpen={showImportModal}
          onClose={() => {
            setShowImportModal(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
        />
      )}

      {/* Template Import Success Modal */}
      {importResult && (
        <TemplateImportSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setImportResult(null);
          }}
          template={importResult.template}
          collegeApplication={importResult.collegeApplication}
          checklistsCreated={importResult.stats.checklistsCreated}
          tasksCreated={importResult.stats.tasksCreated}
        />
      )}

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
