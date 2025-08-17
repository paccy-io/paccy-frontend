# Backend Integration Documentation

This document explains the complete backend integration for the College Applications system.

## Overview

The frontend now integrates with a comprehensive backend API that manages college applications, checklists, and tasks. The integration includes:

- ✅ **TypeScript Types**: Complete type definitions for all backend entities
- ✅ **API Client**: Typed functions for all 14 backend endpoints
- ✅ **Authentication**: Bearer token integration with localStorage
- ✅ **Error Handling**: Custom ApiError class with user-friendly messages
- ✅ **UI Integration**: College applications page now uses backend data
- ✅ **Toast Notifications**: Success/error feedback for all operations

## Files Structure

```
lib/
├── types.ts                           # Complete TypeScript definitions
├── hooks/useToast.ts                 # Toast notification system
└── api/
    └── college-applications.ts       # API client with all endpoints

app/dashboard/colleges/page.tsx       # Enhanced with backend integration
components/Examples/
└── BackendIntegrationExample.tsx    # Usage examples
```

## API Client Usage

### 1. College Applications

```typescript
import { api } from "../lib/api/college-applications";
import { Status, ApplicationType, Priority } from "../lib/types";

// Create a new college application
const application = await api.collegeApplications.create({
  name: "Harvard University",
  status: Status.NOT_STARTED,
  application_type: ApplicationType.REGULAR_DECISION,
  priority: Priority.REACH,
  major: "Computer Science",
});

// Get all applications
const applications = await api.collegeApplications.getAll();

// Update an application
const updated = await api.collegeApplications.update(id, {
  status: Status.IN_PROGRESS,
});

// Delete an application
await api.collegeApplications.delete(id);
```

### 2. Checklists

```typescript
import { Category } from "../lib/types";

// Create a checklist for an application
const checklist = await api.checklists.create({
  application_id: applicationId,
  name: "Common App Requirements",
  category: Category.APPLICATION,
  description: "All requirements for submission",
});

// Update a checklist
const updated = await api.checklists.update(applicationId, checklistId, {
  name: "Updated Checklist Name",
});
```

### 3. Tasks

```typescript
import {
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskStatus,
  TaskResponsible,
} from "../lib/types";

// Create a task within a checklist
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
});
```

## Error Handling

All API calls include comprehensive error handling:

```typescript
try {
  const result = await api.collegeApplications.create(data);
  showSuccess("Application created successfully!");
} catch (error) {
  if (error instanceof ApiError) {
    showError(error.message); // User-friendly error message
  } else {
    showError("An unexpected error occurred");
  }
}
```

## Authentication

The API client automatically handles authentication using Bearer tokens:

```typescript
// Token is automatically retrieved from localStorage
// Headers: { Authorization: 'Bearer <token>' }
```

## Type Safety

All API responses and requests are fully typed:

```typescript
// Enums for consistent values
Status.NOT_STARTED; // "not_started"
ApplicationType.EARLY_DECISION; // "early_decision"
Priority.REACH; // "reach"

// Interfaces for data structures
interface CollegeApplication {
  id: string;
  name: string;
  status: Status;
  application_type: ApplicationType;
  priority: Priority;
  major: string;
  // ... more properties
}
```

## Integration Examples

### College Applications Page Integration

The main colleges page (`/app/dashboard/colleges/page.tsx`) demonstrates:

1. **Data Loading**: Fetches applications on component mount
2. **Create Operations**: Creates new applications with backend persistence
3. **UI Feedback**: Shows loading states and success/error messages
4. **Data Transformation**: Converts backend data to UI format

### Example Component

See `/components/Examples/BackendIntegrationExample.tsx` for comprehensive usage examples including:

- Creating applications, checklists, and tasks
- Error handling patterns
- Loading states
- Success feedback

## Available Endpoints

| Method | Endpoint                                                | Description              |
| ------ | ------------------------------------------------------- | ------------------------ |
| POST   | /college-applications                                   | Create new application   |
| GET    | /college-applications                                   | Get all applications     |
| GET    | /college-applications/:id                               | Get specific application |
| PUT    | /college-applications/:id                               | Update application       |
| DELETE | /college-applications/:id                               | Delete application       |
| GET    | /college-applications/deadlines/upcoming                | Get upcoming deadlines   |
| POST   | /college-applications/checklists                        | Create checklist         |
| GET    | /college-applications/:appId/checklists/:id             | Get checklist            |
| PUT    | /college-applications/:appId/checklists/:id             | Update checklist         |
| DELETE | /college-applications/:appId/checklists/:id             | Delete checklist         |
| POST   | /college-applications/tasks                             | Create task              |
| GET    | /college-applications/:appId/checklists/:clId/tasks/:id | Get task                 |
| PUT    | /college-applications/:appId/checklists/:clId/tasks/:id | Update task              |
| DELETE | /college-applications/:appId/checklists/:clId/tasks/:id | Delete task              |

## Configuration

API base URL is configured in `/config/api.ts`:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
```

## Toast Notifications

Success and error messages are handled through the toast system:

```typescript
import { useToast } from "../lib/hooks/useToast";

const { success, error } = useToast();

success("Operation completed successfully!");
error("Something went wrong");
```

## Next Steps

1. **Environment Configuration**: Set up proper API URLs for different environments
2. **Error Boundaries**: Add React error boundaries for better error handling
3. **Caching**: Implement caching strategies for improved performance
4. **Optimistic Updates**: Add optimistic UI updates for better UX
5. **Real-time Updates**: Consider WebSocket integration for live updates
