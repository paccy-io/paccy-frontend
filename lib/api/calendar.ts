import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import { CalendarEvent, CreateEventDTO, UpdateEventDTO } from "../types";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  // Try multiple possible token keys
  return localStorage.getItem("auth-token") || localStorage.getItem("token");
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const calendarApi = {
  // Create a new calendar event
  async create(eventData: CreateEventDTO): Promise<CalendarEvent> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CALENDAR}`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        title: eventData.title,
        description: eventData.description || "",
        date: eventData.date || null,
        type: eventData.type,
        priority: eventData.priority,
        location: "", // Can be extended later
        college_id: eventData.college_id || null,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create calendar event: ${response.statusText}`
      );
    }

    const result = await response.json();

    // Map backend response to frontend CalendarEvent format
    return {
      id: result.data.id,
      title: result.data.title,
      description: result.data.description,
      date: result.data.date, // Keep full ISO 8601 format
      type: result.data.type,
      priority: result.data.priority,
      college: result.data.college_name || "",
      college_id: result.data.college_id,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at,
    };
  },

  // Get all calendar events
  async getAll(): Promise<CalendarEvent[]> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CALENDAR}`, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar events: ${response.statusText}`
      );
    }

    const result = await response.json();

    // Map backend response array to frontend CalendarEvent format
    return result.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split("T")[0] : undefined,
      time: event.date ? event.date.split("T")[1]?.substring(0, 5) : undefined,
      type: event.type,
      priority: event.priority,
      college: event.college_name || "",
      college_id: event.college_id,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  },

  // Get a specific calendar event by ID
  async getById(id: string): Promise<CalendarEvent> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR}/${id}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar event: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      id: result.data.id,
      title: result.data.title,
      description: result.data.description,
      date: result.data.date, // Keep full ISO 8601 format
      type: result.data.type,
      priority: result.data.priority,
      college: result.data.college_name || "",
      college_id: result.data.college_id,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at,
    };
  },

  // Update a calendar event
  async update(id: string, eventData: UpdateEventDTO): Promise<CalendarEvent> {
    // Prepare the update payload
    const updatePayload: any = {};

    if (eventData.title !== undefined) updatePayload.title = eventData.title;
    if (eventData.description !== undefined)
      updatePayload.description = eventData.description;
    if (eventData.type !== undefined) updatePayload.type = eventData.type;
    if (eventData.priority !== undefined)
      updatePayload.priority = eventData.priority;
    if (eventData.college_id !== undefined)
      updatePayload.college_id = eventData.college_id;

    // Handle date - now comes as ISO 8601 format from the frontend
    if (eventData.date !== undefined) {
      if (!eventData.date) {
        // No date means move to inbox
        updatePayload.date = null;
      } else {
        // Date is already in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
        updatePayload.date = eventData.date;
      }
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR}/${id}`,
      {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(updatePayload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update calendar event: ${response.statusText}`
      );
    }

    const result = await response.json();

    return {
      id: result.data.id,
      title: result.data.title,
      description: result.data.description,
      date: result.data.date, // Keep full ISO 8601 format
      type: result.data.type,
      priority: result.data.priority,
      college: result.data.college_name || "",
      college_id: result.data.college_id,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at,
    };
  },

  // Delete a calendar event
  async delete(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR}/${id}`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete calendar event: ${response.statusText}`
      );
    }
  },

  // Get inbox events (events without date)
  async getInboxEvents(): Promise<CalendarEvent[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR_INBOX}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch inbox events: ${response.statusText}`);
    }

    const result = await response.json();

    return result.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: undefined,
      time: undefined,
      type: event.type,
      priority: event.priority,
      college: event.college_name || "",
      college_id: event.college_id,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  },

  // Get events by date range
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR_DATE_RANGE}?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events by date range: ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split("T")[0] : undefined,
      time: event.date ? event.date.split("T")[1]?.substring(0, 5) : undefined,
      type: event.type,
      priority: event.priority,
      college: event.college_name || "",
      college_id: event.college_id,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  },

  // Get upcoming events
  async getUpcoming(days: number = 7): Promise<CalendarEvent[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR_UPCOMING}?days=${days}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch upcoming events: ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split("T")[0] : undefined,
      time: event.date ? event.date.split("T")[1]?.substring(0, 5) : undefined,
      type: event.type,
      priority: event.priority,
      college: event.college_name || "",
      college_id: event.college_id,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  },

  // Get events by college application
  async getByCollegeApplication(
    collegeApplicationId: string
  ): Promise<CalendarEvent[]> {
    const response = await fetch(
      `${API_BASE_URL}/college-applications/${collegeApplicationId}/calendar`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events by college application: ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split("T")[0] : undefined,
      time: event.date ? event.date.split("T")[1]?.substring(0, 5) : undefined,
      type: event.type,
      priority: event.priority,
      college: event.college_name || "",
      college_id: event.college_id,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  },

  // Get event count
  async getCount(): Promise<{
    total: number;
    by_type: Record<string, number>;
    by_priority: Record<string, number>;
  }> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CALENDAR_COUNT}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event count: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  },
};
