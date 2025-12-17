import React from "react";
import {
  FaTimes,
  FaEye,
  FaDownload,
  FaEdit,
  FaShare,
  FaFile,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaCalendar,
  FaTag,
  FaUniversity,
} from "react-icons/fa";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  colleges?: string[];
  tags?: string[];
  status: string;
}

interface PreviewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  document: Document | null;
}

export default function PreviewDocumentModal({
  isOpen,
  onClose,
  onEdit,
  document,
}: PreviewDocumentModalProps) {
  if (!isOpen || !document) return null;

  const getFileIcon = (type: string) => {
    if (!type) return <FaFile className="text-gray-400" size={24} />;

    const lowerType = type.toLowerCase();
    if (lowerType.includes("pdf"))
      return <FaFilePdf className="text-red-400" size={24} />;
    if (lowerType.includes("doc") || lowerType.includes("word"))
      return <FaFileWord className="text-blue-400" size={24} />;
    if (
      lowerType.includes("image") ||
      lowerType.includes("jpg") ||
      lowerType.includes("png")
    )
      return <FaFileImage className="text-green-400" size={24} />;
    if (lowerType.includes("text") || lowerType.includes("txt"))
      return <FaFileAlt className="text-gray-400" size={24} />;
    return <FaFile className="text-white" size={24} />;
  };

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-500/20 text-gray-400";

    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400";
      case "Submitted":
        return "bg-blue-500/20 text-blue-400";
      case "In Review":
        return "bg-yellow-500/20 text-yellow-400";
      case "Rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const renderDocumentPreview = () => {
    if (!document.type) {
      return (
        <div className="bg-white rounded-lg p-8 text-gray-800 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <FaFile className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{document.name}</h3>
            <p className="text-gray-600">File type not specified</p>
          </div>
        </div>
      );
    }

    const type = document.type.toLowerCase();

    // For demonstration, showing different preview types
    if (type.includes("pdf")) {
      return (
        <div className="bg-white rounded-lg p-8 text-gray-800 min-h-[400px]">
          <div className="text-center">
            <FaFilePdf className="text-red-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{document.name}</h3>
            <p className="text-gray-600 mb-4">PDF Document Preview</p>
            <div className="bg-gray-100 rounded-lg p-6 text-left">
              <p className="mb-4">
                This is a sample PDF document preview. In a real application,
                you would integrate with a PDF viewer library to show the actual
                document content.
              </p>
              <p className="mb-4">
                Document content would be rendered here with proper formatting,
                images, and layout preserved from the original PDF file.
              </p>
              <p>File size: {document.size}</p>
            </div>
          </div>
        </div>
      );
    } else if (type.includes("image")) {
      return (
        <div className="bg-white rounded-lg p-8 text-center min-h-[400px]">
          <FaFileImage className="text-green-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            {document.name}
          </h3>
          <p className="text-gray-600 mb-4">Image Document Preview</p>
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">
                Image preview would appear here
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg p-8 text-gray-800 min-h-[400px]">
          <div className="text-center mb-6">
            {getFileIcon(document.type)}
            <h3 className="text-xl font-bold mt-2 mb-2">{document.name}</h3>
            <p className="text-gray-600">Document Preview</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <div className="font-mono text-sm">
              <p className="mb-4">Dear Admissions Office,</p>
              <p className="mb-4">
                This document contains important information for my college
                application. The content has been carefully prepared and
                reviewed to ensure accuracy and completeness.
              </p>
              <p className="mb-4">Key highlights include:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Academic achievements and transcripts</li>
                <li>Extracurricular activities and leadership roles</li>
                <li>Personal statement and essays</li>
                <li>Letters of recommendation</li>
              </ul>
              <p className="mb-4">
                I believe these materials demonstrate my readiness for the
                challenges and opportunities that await at your institution.
              </p>
              <p>Thank you for your consideration.</p>
              <p className="mt-4">
                Sincerely,
                <br />
                [Student Name]
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEye className="text-blue-400 text-xl" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {document.name}
                </h2>
                <p className="text-white/70 text-sm">{document.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2"
              >
                <FaEdit size={14} />
                <span>Edit Info</span>
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Document Info Bar */}
        <div className="px-6 py-4 bg-neutral-800/30 border-b border-neutral-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FaFile className="text-white/60" size={14} />
              <div>
                <div className="text-sm font-medium text-white">
                  {document.size}
                </div>
                <div className="text-xs text-white/70">File Size</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendar className="text-white/60" size={14} />
              <div>
                <div className="text-sm font-medium text-white">
                  {document.uploadDate
                    ? new Date(document.uploadDate).toLocaleDateString()
                    : "Unknown"}
                </div>
                <div className="text-xs text-white/70">Upload Date</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaUniversity className="text-white/60" size={14} />
              <div>
                <div className="text-sm font-medium text-white">
                  {document.colleges &&
                  Array.isArray(document.colleges) &&
                  document.colleges.length > 0
                    ? document.colleges.join(", ")
                    : "General"}
                </div>
                <div className="text-xs text-white/70">Colleges</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    document.status || ""
                  )}`}
                >
                  {document.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {document.tags &&
          Array.isArray(document.tags) &&
          document.tags.length > 0 && (
            <div className="px-6 py-3 border-b border-neutral-700/50">
              <div className="flex items-center gap-2">
                <FaTag className="text-white/60" size={14} />
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Document Preview */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Document Preview</h3>
              <div className="flex gap-2">
                <button className="bg-green-500/20 text-green-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-2">
                  <FaDownload size={12} />
                  <span>Download</span>
                </button>
                <button className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                  <FaShare size={12} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {renderDocumentPreview()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-neutral-700/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 bg-green-500/20 text-green-400 px-6 py-3 rounded-lg font-medium hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2">
            <FaDownload size={16} />
            <span>Download Document</span>
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaEdit size={16} />
            <span>Edit Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
