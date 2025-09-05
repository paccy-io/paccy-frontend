import React from "react";
import Link from "next/link";
import {
  FaTimes,
  FaCheckCircle,
  FaRocket,
  FaArrowRight,
  FaTasks,
  FaClipboardList,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";

interface TemplateImportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  collegeApplication: any;
  checklistsCreated: number;
  tasksCreated: number;
}

export default function TemplateImportSuccessModal({
  isOpen,
  onClose,
  template,
  collegeApplication,
  checklistsCreated,
  tasksCreated,
}: TemplateImportSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700/50 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-green-400 text-xl" />
            <h2 className="text-lg font-semibold text-[#FEEBD8]">
              Template Imported!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Template Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-800/50 rounded-lg">
            <span className="text-2xl">{template.flag}</span>
            <div>
              <h4 className="font-medium text-[#FEEBD8]">{template.name}</h4>
              <p className="text-[#FEEBD8]/60 text-sm">
                Added to {collegeApplication?.name || "your application"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-neutral-800/30 rounded-lg">
              <div className="text-xl font-bold text-[#FEEBD8]">
                {checklistsCreated}
              </div>
              <div className="text-[#FEEBD8]/60 text-xs">Checklists</div>
            </div>
            <div className="text-center p-3 bg-neutral-800/30 rounded-lg">
              <div className="text-xl font-bold text-[#FEEBD8]">
                {tasksCreated}
              </div>
              <div className="text-[#FEEBD8]/60 text-xs">Tasks</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/dashboard/colleges/${collegeApplication?.id || "#"}`}
              className="block w-full bg-[#FEEBD8] text-[#141414] py-3 px-4 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors text-center"
              onClick={onClose}
            >
              <span className="flex items-center justify-center gap-2">
                <FaArrowRight />
                View Application
              </span>
            </Link>
            <button
              onClick={onClose}
              className="w-full border border-neutral-600 text-[#FEEBD8] py-3 px-4 rounded-lg font-medium hover:bg-neutral-800/50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
