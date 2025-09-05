import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUniversity,
  FaCalendar,
  FaGraduationCap,
  FaDownload,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";
import { CollegeApplication, TemplateImportResult } from "../../lib/types";
import { collegeApplicationsApi } from "../../lib/api/college-applications";
import { templatesApi } from "../../lib/api/templates";
import { useToast } from "../../lib/hooks/useToast";

interface ImportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  onSuccess: (result: TemplateImportResult) => void;
}

export default function ImportTemplateModal({
  isOpen,
  onClose,
  template,
  onSuccess,
}: ImportTemplateModalProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [collegeApplications, setCollegeApplications] = useState<
    CollegeApplication[]
  >([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [importing, setImporting] = useState(false);
  const { success, error } = useToast();

  // Load user's college applications when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCollegeApplications();
    }
  }, [isOpen]);

  const loadCollegeApplications = async () => {
    setLoadingApplications(true);
    try {
      const applications = await collegeApplicationsApi.getAll();
      setCollegeApplications(applications);

      // Reset selection when applications are loaded
      setSelectedApplicationId("");
    } catch (err) {
      console.error("Failed to load college applications:", err);
      error(
        err instanceof Error
          ? `Failed to load college applications: ${err.message}`
          : "Failed to load college applications. Please try again."
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  if (!isOpen) return null;

  const selectedApplication = collegeApplications.find(
    (app) => app.id === selectedApplicationId
  );

  const handleImport = async () => {
    if (!selectedApplicationId) {
      error("Please select a college application");
      return;
    }

    setImporting(true);
    try {
      // Import template to the selected college application
      const result = await templatesApi.importTemplate(
        template.id,
        selectedApplicationId
      );

      // Close this modal and trigger success modal in parent
      onClose();
      onSuccess(result);
    } catch (err) {
      console.error("Failed to import template:", err);
      error(
        err instanceof Error
          ? `Failed to import template: ${err.message}`
          : "Failed to import template. Please try again."
      );
    } finally {
      setImporting(false);
    }
  };
  const handleClose = () => {
    if (!importing) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#141414] border border-neutral-700/50 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
            <h2 className="text-xl font-semibold text-[#FEEBD8]">
              Import Template
            </h2>
            <button
              onClick={handleClose}
              disabled={importing}
              className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors disabled:opacity-50"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Template Info */}
            <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{template.flag}</span>
                <div>
                  <h3 className="font-semibold text-[#FEEBD8]">
                    {template.name}
                  </h3>
                  <p className="text-[#FEEBD8]/60 text-sm">
                    {template.country}
                  </p>
                </div>
              </div>
              <p className="text-[#FEEBD8]/70 text-sm">
                {template.description}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* College Application Selection */}
              <div>
                <label className="block text-[#FEEBD8]/70 text-sm mb-2">
                  <FaUniversity className="inline mr-2" />
                  Select College Application *
                </label>

                {loadingApplications ? (
                  <div className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-[#FEEBD8]/60 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FEEBD8]/30 border-t-[#FEEBD8] rounded-full animate-spin"></div>
                    Loading your college applications...
                  </div>
                ) : collegeApplications.length === 0 ? (
                  <div className="space-y-3">
                    <div className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-[#FEEBD8]/60">
                      No college applications found
                    </div>
                    <p className="text-[#FEEBD8]/60 text-sm">
                      You need to create at least one college application before
                      importing templates.{" "}
                      <button
                        className="text-[#FEEBD8] hover:underline inline-flex items-center gap-1"
                        onClick={() => {
                          // This could navigate to create college application page
                          alert(
                            "Please go to your dashboard to create a college application first."
                          );
                        }}
                      >
                        <FaPlus size={12} />
                        Create one now
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedApplicationId}
                      onChange={(e) => setSelectedApplicationId(e.target.value)}
                      className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]/50 appearance-none pr-10"
                      disabled={importing}
                    >
                      <option value="">Choose a college application...</option>
                      {collegeApplications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name} {app.location ? `(${app.location})` : ""}
                          {app.deadline
                            ? ` - Due: ${new Date(
                                app.deadline
                              ).toLocaleDateString()}`
                            : ""}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FEEBD8]/60 pointer-events-none" />
                  </div>
                )}

                {selectedApplication && (
                  <div className="mt-2 p-3 bg-neutral-800/50 rounded-lg border border-neutral-600/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#FEEBD8] font-medium">
                          {selectedApplication.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[#FEEBD8]/60">
                          {selectedApplication.location && (
                            <span>{selectedApplication.location}</span>
                          )}
                          {selectedApplication.major && (
                            <span>Major: {selectedApplication.major}</span>
                          )}
                          {selectedApplication.deadline && (
                            <span>
                              <FaCalendar className="inline mr-1" />
                              Due:{" "}
                              {new Date(
                                selectedApplication.deadline
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#FEEBD8]/60 text-sm">
                          {selectedApplication.checklists?.length || 0} existing
                          checklists
                        </div>
                        <div className="text-[#FEEBD8]/60 text-sm">
                          Progress: {selectedApplication.progress || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What will be imported */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-[#FEEBD8] font-medium mb-2">
                What will be imported:
              </h4>
              <ul className="text-[#FEEBD8]/70 text-sm space-y-1">
                <li>• {template.checklists.length} pre-built checklists</li>
                <li>
                  •{" "}
                  {template.checklists.reduce(
                    (total: number, checklist: any) =>
                      total + checklist.tasks.length,
                    0
                  )}{" "}
                  organized tasks
                </li>
                <li>• Automated deadline calculations</li>
                <li>• Country-specific requirements</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                disabled={importing}
                className="flex-1 px-4 py-3 border border-neutral-600 rounded-lg text-[#FEEBD8] hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleImport}
                disabled={
                  importing ||
                  !selectedApplicationId ||
                  collegeApplications.length === 0
                }
                className="flex-1 bg-[#FEEBD8] text-[#141414] py-3 px-4 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#141414]/30 border-t-[#141414] rounded-full animate-spin"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <FaDownload />
                    Import Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
