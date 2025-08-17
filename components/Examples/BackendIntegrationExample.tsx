// Example component showing backend integration usage
// This demonstrates how to use the college applications API

import { useState } from "react";
import { api, ApiError } from "../../lib/api/college-applications";
import { useToast } from "../../lib/hooks/useToast";
import {
  Status,
  ApplicationType,
  Priority,
  Category,
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskStatus,
  TaskResponsible,
} from "../../lib/types";

export function CollegeApplicationExample() {
  const { success: showSuccess, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Example 1: Create a college application
  const createExampleApplication = async () => {
    try {
      setIsLoading(true);

      const application = await api.collegeApplications.create({
        name: "Harvard University",
        websites: ["https://harvard.edu"],
        status: Status.NOT_STARTED,
        application_type: ApplicationType.REGULAR_DECISION,
        priority: Priority.REACH,
        major: "Computer Science",
        location: "Cambridge, MA",
        application_fee: 85,
        contact_email: "admissions@harvard.edu",
        notes: "Interested in their CS program",
      });

      showSuccess(`Created application for ${application.name}!`);
      console.log("Created application:", application);
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to create application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Example 2: Create a checklist for an application
  const createExampleChecklist = async (applicationId: string) => {
    try {
      const checklist = await api.checklists.create({
        application_id: applicationId,
        name: "Common Application Requirements",
        category: Category.APPLICATION,
        description: "All requirements for Common App submission",
      });

      showSuccess("Checklist created successfully!");
      console.log("Created checklist:", checklist);
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to create checklist"
      );
    }
  };

  // Example 3: Create a task within a checklist
  const createExampleTask = async (
    applicationId: string,
    checklistId: string
  ) => {
    try {
      const task = await api.tasks.create({
        application_id: applicationId,
        checklist_id: checklistId,
        name: "Write Personal Statement",
        deadline: "2024-12-31T23:59:59Z",
        priority: TaskPriority.HIGH,
        type: TaskType.WRITING,
        component: TaskComponent.COMMON_APP,
        status: TaskStatus.NOT_STARTED,
        responsible: TaskResponsible.STUDENT,
        notes: "650 word limit, focus on leadership experience",
      });

      showSuccess("Task created successfully!");
      console.log("Created task:", task);
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to create task"
      );
    }
  };

  // Example 4: Get all applications
  const loadApplications = async () => {
    try {
      const applications = await api.collegeApplications.getAll();
      console.log("All applications:", applications);
      showSuccess(`Loaded ${applications.length} applications`);
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to load applications"
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Backend Integration Examples</h2>

      <div className="space-y-4">
        <button
          onClick={createExampleApplication}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Example Application"}
        </button>

        <button
          onClick={loadApplications}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Load All Applications
        </button>

        <div className="text-sm text-gray-600">
          <p>• Check the console for API responses</p>
          <p>• Toast notifications will show success/error messages</p>
          <p>• All API calls include proper error handling</p>
        </div>
      </div>
    </div>
  );
}
