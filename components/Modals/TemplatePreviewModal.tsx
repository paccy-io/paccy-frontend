import React, { useState } from "react";
import {
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaCalendar,
  FaTag,
  FaStickyNote,
  FaFlag,
} from "react-icons/fa";
import {
  Category,
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskResponsible,
} from "../../lib/types";

interface TemplateTask {
  name: string;
  deadline_days_before: number;
  priority: TaskPriority;
  type: TaskType;
  component: TaskComponent;
  responsible: TaskResponsible;
  notes: string;
}

interface TemplateChecklist {
  name: string;
  category: Category;
  description: string;
  tasks: TemplateTask[];
}

interface UniversityTemplate {
  id: string;
  name: string;
  description: string;
  country: string;
  flag: string;
  checklists: TemplateChecklist[];
}

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: UniversityTemplate;
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  const [expandedChecklists, setExpandedChecklists] = useState<Set<number>>(
    new Set([0])
  ); // First checklist expanded by default

  if (!isOpen) return null;

  const toggleChecklist = (index: number) => {
    const newExpanded = new Set(expandedChecklists);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChecklists(newExpanded);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case TaskPriority.MEDIUM:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case TaskPriority.LOW:
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case Category.ACADEMIC:
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case Category.APPLICATION:
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case Category.FINANCIAL_AID:
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case Category.SCHOLARSHIP:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case Category.HOUSING:
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case Category.PERSONAL:
        return "text-pink-400 bg-pink-400/10 border-pink-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getResponsibleIcon = (responsible: TaskResponsible) => {
    switch (responsible) {
      case TaskResponsible.STUDENT:
        return <FaUser className="text-blue-400" />;
      case TaskResponsible.PARENT:
        return <FaUser className="text-green-400" />;
      case TaskResponsible.COUNSELOR:
        return <FaUser className="text-purple-400" />;
      case TaskResponsible.TEACHER:
        return <FaUser className="text-orange-400" />;
      default:
        return <FaUser className="text-gray-400" />;
    }
  };

  const formatDeadline = (daysBefore: number) => {
    if (daysBefore === 0) return "Application deadline";
    if (daysBefore > 0) return `${daysBefore} days before deadline`;
    return `${Math.abs(daysBefore)} days after deadline`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700/50 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700/50 sticky top-0 bg-[#141414] z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.flag}</span>
            <div>
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Template Preview
              </h2>
              <p className="text-[#FEEBD8]/60 text-sm">
                {template.name} - {template.country}
              </p>
            </div>
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
          <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-600/50">
            <h3 className="font-semibold text-[#FEEBD8] mb-2">
              What you'll get:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#FEEBD8]/70">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>{template.checklists.length} organized checklists</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>
                  {template.checklists.reduce(
                    (total, checklist) => total + checklist.tasks.length,
                    0
                  )}{" "}
                  actionable tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>Automated deadline calculations</span>
              </div>
            </div>
          </div>

          {/* Preview Notice */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <FaFlag className="text-blue-400 mt-1" />
              <div>
                <h4 className="text-[#FEEBD8] font-medium mb-1">
                  Preview Mode
                </h4>
                <p className="text-[#FEEBD8]/70 text-sm">
                  This shows exactly how the checklists and tasks will appear in
                  your college application after import. All deadlines will be
                  automatically calculated based on your application deadline.
                </p>
              </div>
            </div>
          </div>

          {/* Checklists Preview */}
          <div className="space-y-4">
            {template.checklists.map((checklist, index) => (
              <div
                key={index}
                className="bg-neutral-800/50 border border-neutral-600/50 rounded-lg"
              >
                {/* Checklist Header */}
                <div className="p-4 border-b border-neutral-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleChecklist(index)}
                        className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors"
                      >
                        {expandedChecklists.has(index) ? (
                          <FaChevronDown size={16} />
                        ) : (
                          <FaChevronUp size={16} />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-[#FEEBD8]">
                            {checklist.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(
                              checklist.category
                            )}`}
                          >
                            {checklist.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-[#FEEBD8]/60 text-sm mt-1">
                          {checklist.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#FEEBD8]/60 text-sm">
                        {checklist.tasks.length} tasks
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                {expandedChecklists.has(index) && (
                  <div className="p-4">
                    <div className="space-y-3">
                      {checklist.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="bg-neutral-800 border border-neutral-600/50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {/* Task Header */}
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-5 h-5 border-2 border-neutral-500 rounded"></div>
                                <h4 className="text-[#FEEBD8] font-medium">
                                  {task.name}
                                </h4>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              {/* Task Details */}
                              <div className="ml-8 space-y-2">
                                {/* Deadline */}
                                <div className="flex items-center gap-2 text-sm text-[#FEEBD8]/70">
                                  <FaCalendar />
                                  <span>
                                    {formatDeadline(task.deadline_days_before)}
                                  </span>
                                </div>

                                {/* Responsible */}
                                <div className="flex items-center gap-2 text-sm text-[#FEEBD8]/70">
                                  {getResponsibleIcon(task.responsible)}
                                  <span className="capitalize">
                                    {task.responsible.replace(/_/g, " ")}
                                  </span>
                                </div>

                                {/* Type & Component */}
                                <div className="flex items-center gap-4 text-sm text-[#FEEBD8]/70">
                                  <div className="flex items-center gap-2">
                                    <FaTag />
                                    <span className="capitalize">
                                      {task.type.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FaFlag />
                                    <span className="capitalize">
                                      {task.component.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                </div>

                                {/* Notes */}
                                {task.notes && (
                                  <div className="flex items-start gap-2 text-sm text-[#FEEBD8]/70">
                                    <FaStickyNote className="mt-1" />
                                    <span>{task.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!expandedChecklists.has(index) && (
                  <div className="px-4 pb-4">
                    <div className="text-center py-2 text-[#FEEBD8]/60 text-sm">
                      Click to expand and view {checklist.tasks.length} tasks
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-600/50">
            <div className="flex items-center gap-3 text-[#FEEBD8]/70 text-sm">
              <FaExclamationTriangle className="text-yellow-400" />
              <span>
                After importing, you can edit any checklist or task to customize
                it for your specific needs.
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-6 border-t border-neutral-700/50">
          <button
            onClick={onClose}
            className="w-full bg-neutral-700 text-[#FEEBD8] py-3 px-4 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
