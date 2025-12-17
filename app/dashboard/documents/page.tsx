"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import AddDocumentModal from "../../../components/Modals/AddDocumentModal";
import EditDocumentModal from "../../../components/Modals/EditDocumentModal";
import PreviewDocumentModal from "../../../components/Modals/PreviewDocumentModal";
import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaTrash,
  FaArrowLeft,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaEye,
  FaEdit,
  FaTag,
} from "react-icons/fa";

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: "Official Transcript",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2025-07-20",
    tags: ["Transcript", "Official"],
    colleges: ["Harvard University", "Stanford University", "MIT"],
    status: "Verified",
    url: "/documents/transcript.pdf",
  },
  {
    id: 2,
    name: "Personal Statement Draft",
    type: "docx",
    size: "0.8 MB",
    uploadDate: "2025-07-25",
    tags: ["Essay", "Draft"],
    colleges: ["Harvard University"],
    status: "In Review",
    url: "/documents/personal-statement.docx",
  },
  {
    id: 3,
    name: "Letter of Recommendation - Prof. Johnson",
    type: "pdf",
    size: "1.2 MB",
    uploadDate: "2025-07-22",
    tags: ["Recommendation", "Academic"],
    colleges: ["Stanford University", "MIT"],
    status: "Complete",
    url: "/documents/rec-letter-johnson.pdf",
  },
  {
    id: 4,
    name: "SAT Score Report",
    type: "pdf",
    size: "0.5 MB",
    uploadDate: "2025-07-18",
    tags: ["Test Scores", "SAT"],
    colleges: ["Harvard University", "Stanford University", "MIT", "NYU"],
    status: "Official",
    url: "/documents/sat-scores.pdf",
  },
  {
    id: 5,
    name: "CV Resume",
    type: "pdf",
    size: "0.9 MB",
    uploadDate: "2025-07-23",
    tags: ["Resume", "CV"],
    colleges: ["All"],
    status: "Updated",
    url: "/documents/resume.pdf",
  },
  {
    id: 6,
    name: "Portfolio Sample",
    type: "jpg",
    size: "5.2 MB",
    uploadDate: "2025-07-21",
    tags: ["Portfolio", "Art"],
    colleges: ["NYU", "Art Schools"],
    status: "Final",
    url: "/documents/portfolio-sample.jpg",
  },
];

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FaFilePdf className="text-red-400" />,
  docx: <FaFileWord className="text-blue-400" />,
  doc: <FaFileWord className="text-blue-400" />,
  jpg: <FaFileImage className="text-green-400" />,
  png: <FaFileImage className="text-green-400" />,
  jpeg: <FaFileImage className="text-green-400" />,
  default: <FaFile className="text-gray-400" />,
};

const statusColors: Record<string, string> = {
  Verified: "bg-green-500",
  Complete: "bg-green-500",
  Official: "bg-blue-500",
  "In Review": "bg-yellow-500",
  Updated: "bg-purple-500",
  Final: "bg-emerald-500",
  Draft: "bg-gray-500",
};

const tagColors = [
  "bg-blue-500/20 text-blue-400",
  "bg-green-500/20 text-green-400",
  "bg-purple-500/20 text-purple-400",
  "bg-orange-500/20 text-orange-400",
  "bg-pink-500/20 text-pink-400",
  "bg-cyan-500/20 text-cyan-400",
];

export default function DocumentOrganizer() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [isPreviewDocumentModalOpen, setIsPreviewDocumentModalOpen] =
    useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  useEffect(() => {
    document.title = "Document Organizer | Paccy";
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = filterType === "All" || doc.type === filterType;
    const matchesStatus = filterStatus === "All" || doc.status === filterStatus;
    const matchesTag = filterTag === "All" || doc.tags.includes(filterTag);

    return matchesSearch && matchesType && matchesStatus && matchesTag;
  });

  const getFileIcon = (type: string) => {
    return fileTypeIcons[type] || fileTypeIcons["default"];
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (date: string) => {
    // Extract date part only to avoid timezone issues
    const dateOnly = date.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const formattedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddDocument = (newDocument: any) => {
    const documentWithId = {
      ...newDocument,
      id: documents.length + 1,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setDocuments((prev) => [...prev, documentWithId]);
  };

  const handleEditDocument = (updatedDocument: any) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc))
    );
    setSelectedDocument(null);
  };

  const handlePreviewClick = (document: any) => {
    setSelectedDocument(document);
    setIsPreviewDocumentModalOpen(true);
  };

  const handleEditClick = (document: any) => {
    setSelectedDocument(document);
    setIsEditDocumentModalOpen(true);
  };

  const handlePreviewEdit = () => {
    setIsPreviewDocumentModalOpen(false);
    setIsEditDocumentModalOpen(true);
  };

  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags)));
  const allTypes = Array.from(new Set(documents.map((doc) => doc.type)));
  const allStatuses = Array.from(new Set(documents.map((doc) => doc.status)));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/70 hover:text-white transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Documents
              </h1>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                Keep all your application files organized
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDocumentModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
          >
            <FaPlus />
            <span className="hidden sm:inline">Upload Document</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {documents.length}
            </div>
            <div className="text-white/60 text-sm">Total Documents</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {
                documents.filter(
                  (d) => d.status === "Verified" || d.status === "Official"
                ).length
              }
            </div>
            <div className="text-white/60 text-sm">Verified</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {documents.filter((d) => d.type === "pdf").length}
            </div>
            <div className="text-white/60 text-sm">PDF Files</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {Math.round(
                documents.reduce(
                  (acc, doc) => acc + parseFloat(doc.size.split(" ")[0]),
                  0
                ) * 10
              ) / 10}
            </div>
            <div className="text-white/60 text-sm">MB Total</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Types</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Statuses</option>
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Tag Filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* File Icon */}
                  <div className="text-3xl">{getFileIcon(doc.type)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {doc.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          statusColors[doc.status]
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
                      <span>{doc.type.toUpperCase()}</span>
                      <span>{formatFileSize(doc.size)}</span>
                      <span>Uploaded {formatDate(doc.uploadDate)}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doc.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-full text-xs ${
                            tagColors[idx % tagColors.length]
                          }`}
                        >
                          <FaTag className="inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Assigned Colleges */}
                    <div className="text-sm text-white/60">
                      <strong>Assigned to:</strong>{" "}
                      {doc.colleges.includes("All")
                        ? "All Colleges"
                        : doc.colleges.length > 2
                        ? `${doc.colleges.slice(0, 2).join(", ")} +${
                            doc.colleges.length - 2
                          } more`
                        : doc.colleges.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handlePreviewClick(document)}
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                  >
                    <FaEye />
                    <span>Preview</span>
                  </button>
                  <button className="bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg font-medium hover:bg-green-500/20 transition-colors flex items-center gap-2">
                    <FaDownload />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(document)}
                    className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500/20 transition-colors flex items-center gap-2"
                  >
                    <FaEdit />
                    <span>Edit Info</span>
                  </button>
                  <button className="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">
              No documents found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onSave={handleAddDocument}
      />

      <EditDocumentModal
        isOpen={isEditDocumentModalOpen}
        onClose={() => setIsEditDocumentModalOpen(false)}
        onSave={handleEditDocument}
        document={selectedDocument}
      />

      <PreviewDocumentModal
        isOpen={isPreviewDocumentModalOpen}
        onClose={() => setIsPreviewDocumentModalOpen(false)}
        onEdit={handlePreviewEdit}
        document={selectedDocument}
      />
    </div>
  );
}
