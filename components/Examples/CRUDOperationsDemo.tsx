// College Applications Management Component
// Comprehensive Create, Read, Update, Delete operations for college applications

import React, { useState, useEffect } from "react";
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
  CollegeApplication,
  Checklist,
  Task,
} from "../../lib/types";

export function CollegeApplicationsManager() {
  const { success: showSuccess, error: showError } = useToast();
  const [applications, setApplications] = useState<CollegeApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<CollegeApplication | null>(
    null
  );
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load all applications with their checklists and tasks
  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const apps = await api.collegeApplications.getAll();
      setApplications(apps);
      if (apps.length > 0) {
        showSuccess(`Loaded ${apps.length} applications with real data`);
      } else {
        showSuccess("No applications found - create one to get started!");
      }
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to load applications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // College Applications CRUD
  const createApplication = async () => {
    try {
      const newApp = await api.collegeApplications.create({
        name: `Demo University ${Date.now()}`,
        status: Status.NOT_STARTED,
        application_type: ApplicationType.REGULAR_DECISION,
        priority: Priority.TARGET,
        major: "Computer Science",
        notes: "Application created through management system",
        websites: ["https://university.edu"],
        tags: ["University"],
      });

      await loadApplications(); // Reload to get fresh data
      showSuccess(`Created application for ${newApp.name}!`);
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to create application"
      );
    }
  };

  const updateApplication = async (id: string) => {
    try {
      const updated = await api.collegeApplications.update(id, {
        status: Status.IN_PROGRESS,
        notes: `Updated at ${new Date().toLocaleTimeString()}`,
      });

      await loadApplications(); // Reload to get fresh data
      showSuccess("Application updated successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to update application"
      );
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Delete this application?")) return;

    try {
      await api.collegeApplications.delete(id);
      await loadApplications(); // Reload to get fresh data
      showSuccess("Application deleted successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to delete application"
      );
    }
  };

  // Checklists CRUD
  const createChecklist = async (applicationId: string) => {
    try {
      const checklistData = {
        application_id: applicationId,
        name: `Application Checklist ${Date.now()}`,
        category: Category.APPLICATION,
        description: "Application checklist created through management system",
      };

      await api.checklists.create(checklistData);
      await loadApplications(); // Reload to get fresh data with new checklist
      showSuccess("Checklist created successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to create checklist"
      );
    }
  };

  const updateChecklist = async (
    applicationId: string,
    checklistId: string
  ) => {
    try {
      await api.checklists.update(applicationId, checklistId, {
        name: `Updated Checklist - ${new Date().toLocaleTimeString()}`,
        description: "Updated through management system",
      });

      await loadApplications(); // Reload to get fresh data
      showSuccess("Checklist updated successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to update checklist"
      );
    }
  };

  const deleteChecklist = async (
    applicationId: string,
    checklistId: string
  ) => {
    if (!confirm("Delete this checklist?")) return;

    try {
      await api.checklists.delete(applicationId, checklistId);
      await loadApplications(); // Reload to get fresh data
      showSuccess("Checklist deleted successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to delete checklist"
      );
    }
  };

  // Tasks CRUD
  const createTask = async (applicationId: string, checklistId: string) => {
    try {
      const taskData = {
        application_id: applicationId,
        checklist_id: checklistId,
        name: `Application Task ${Date.now()}`,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        priority: TaskPriority.MEDIUM,
        type: TaskType.DOCUMENT_PREPARATION,
        component: TaskComponent.COMMON_APP,
        status: TaskStatus.NOT_STARTED,
        responsible: TaskResponsible.STUDENT,
        notes: "Task created through management system",
      };

      await api.tasks.create(taskData);
      await loadApplications(); // Reload to get fresh data with new task
      showSuccess("Task created successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to create task"
      );
    }
  };

  const updateTask = async (
    applicationId: string,
    checklistId: string,
    taskId: string
  ) => {
    try {
      await api.tasks.update(applicationId, checklistId, taskId, {
        status: TaskStatus.COMPLETED,
        completed: true,
        notes: `Completed at ${new Date().toLocaleTimeString()}`,
      });

      await loadApplications(); // Reload to get fresh data
      showSuccess("Task updated successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to update task"
      );
    }
  };

  const deleteTask = async (
    applicationId: string,
    checklistId: string,
    taskId: string
  ) => {
    if (!confirm("Delete this task?")) return;

    try {
      await api.tasks.delete(applicationId, checklistId, taskId);
      await loadApplications(); // Reload to get fresh data
      showSuccess("Task deleted successfully!");
    } catch (error) {
      showError(
        error instanceof ApiError ? error.message : "Failed to delete task"
      );
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        College Applications Management
      </h2>

      {/* College Applications Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">College Applications</h3>
          <div className="space-x-2">
            <button
              onClick={createApplication}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Application
            </button>
            <button
              onClick={loadApplications}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{app.name}</h4>
                  <p className="text-sm text-gray-600">
                    {app.major} • {app.status} • {app.checklists.length}{" "}
                    checklists
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      setSelectedApp(selectedApp?.id === app.id ? null : app)
                    }
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    {selectedApp?.id === app.id ? "Hide" : "Show"} Details
                  </button>
                  <button
                    onClick={() => updateApplication(app.id)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Checklists for selected application */}
              {selectedApp?.id === app.id && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Checklists</h5>
                    <button
                      onClick={() => createChecklist(app.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Add Checklist
                    </button>
                  </div>

                  {app.checklists.map((checklist) => (
                    <div
                      key={checklist.id}
                      className="mb-2 p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">
                            {checklist.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {checklist.tasks.length} tasks
                          </span>
                        </div>
                        <div className="space-x-1">
                          <button
                            onClick={() =>
                              setSelectedChecklist(
                                selectedChecklist?.id === checklist.id
                                  ? null
                                  : checklist
                              )
                            }
                            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                          >
                            {selectedChecklist?.id === checklist.id
                              ? "Hide"
                              : "Show"}{" "}
                            Tasks
                          </button>
                          <button
                            onClick={() =>
                              updateChecklist(app.id, checklist.id)
                            }
                            className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              deleteChecklist(app.id, checklist.id)
                            }
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Tasks for selected checklist */}
                      {selectedChecklist?.id === checklist.id && (
                        <div className="mt-2 pl-2 border-l border-gray-300">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs">Tasks</span>
                            <button
                              onClick={() => createTask(app.id, checklist.id)}
                              className="px-2 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500"
                            >
                              Add Task
                            </button>
                          </div>

                          {checklist.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-1 bg-white rounded mb-1"
                            >
                              <div>
                                <span className="text-xs font-medium">
                                  {task.name}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {task.status} • {task.responsible}
                                </span>
                              </div>
                              <div className="space-x-1">
                                <button
                                  onClick={() =>
                                    updateTask(app.id, checklist.id, task.id)
                                  }
                                  className="px-1 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() =>
                                    deleteTask(app.id, checklist.id, task.id)
                                  }
                                  className="px-1 py-1 bg-red-400 text-white rounded text-xs hover:bg-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Management Operations Available:</h4>
        <ul className="space-y-1">
          <li>
            <strong>College Applications:</strong> Create, Read, Update, Delete
          </li>
          <li>
            <strong>Checklists:</strong> Create, Read, Update, Delete
          </li>
          <li>
            <strong>Tasks:</strong> Create, Read, Update, Delete
          </li>
          <li>
            <strong>Features:</strong> Error handling, loading states, success
            feedback
          </li>
          <li>
            <strong>Data:</strong> Real-time updates with backend sync
          </li>
        </ul>
      </div>
    </div>
  );
}
