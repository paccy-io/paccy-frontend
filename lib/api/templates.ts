import {
  CreateCollegeApplicationDTO,
  CreateChecklistDTO,
  CreateTaskDTO,
  StandaloneCreateChecklistDTO,
  StandaloneCreateTaskDTO,
  CollegeApplication,
  Checklist,
  Status,
  ApplicationType,
  Priority,
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskComponent,
  TaskResponsible,
  Category,
  TemplateImportResult,
} from "../types";
import {
  collegeApplicationsApi,
  checklistsApi,
  tasksApi,
} from "./college-applications";

// Templates API for importing pre-built templates
export const templatesApi = {
  /**
   * Import a template to an existing college application by adding pre-built checklists and tasks
   */
  async importTemplate(
    templateId: string,
    collegeApplicationId: string
  ): Promise<TemplateImportResult> {
    // Get the template data (this would normally come from a backend API)
    const template = getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Get the existing college application
    const existingApplication = await collegeApplicationsApi.getById(
      collegeApplicationId
    );
    if (!existingApplication) {
      throw new Error(
        `College application with ID ${collegeApplicationId} not found`
      );
    }

    // Add each template checklist to the existing application
    // Note: In a real implementation, this might be done in a single API call
    // to avoid multiple round trips and ensure atomicity
    let updatedApplication = existingApplication;
    let checklistsCreated = 0;
    let tasksCreated = 0;

    for (const templateChecklist of template.checklists) {
      try {
        // First create the checklist
        const checklistData: StandaloneCreateChecklistDTO = {
          application_id: collegeApplicationId,
          name: templateChecklist.name,
          category: mapTemplateCategory(templateChecklist.category), // Map template category to enum
          description:
            templateChecklist.description ||
            `Template checklist: ${templateChecklist.name}`,
        };

        const createdChecklistResponse = await checklistsApi.create(
          checklistData
        );
        checklistsCreated++;

        // Handle the response - it could be either a Checklist or CollegeApplication
        let checklistId: string;

        // Check if the response is a CollegeApplication (has checklists property) or just a Checklist
        if (
          createdChecklistResponse &&
          typeof createdChecklistResponse === "object" &&
          "checklists" in createdChecklistResponse &&
          Array.isArray(createdChecklistResponse.checklists)
        ) {
          // It's a CollegeApplication - find the newly created checklist
          const updatedApp = createdChecklistResponse as CollegeApplication;
          const expectedCategory = mapTemplateCategory(
            templateChecklist.category
          );
          const newChecklist = updatedApp.checklists.find(
            (c) =>
              c.name === templateChecklist.name &&
              c.category === expectedCategory &&
              !existingApplication.checklists.some(
                (existing) => existing.id === c.id
              )
          );

          if (!newChecklist) {
            // Fallback: try to find any checklist with the same name (less strict matching)
            const fallbackChecklist = updatedApp.checklists.find(
              (c) => c.name === templateChecklist.name
            );

            if (fallbackChecklist) {
              checklistId = fallbackChecklist.id;
            } else {
              throw new Error(
                `Failed to find newly created checklist: ${
                  templateChecklist.name
                }. Available checklists: ${updatedApp.checklists
                  .map((c) => c.name)
                  .join(", ")}`
              );
            }
          } else {
            checklistId = newChecklist.id;
          }

          updatedApplication = updatedApp;
        } else if (
          createdChecklistResponse &&
          typeof createdChecklistResponse === "object" &&
          "id" in createdChecklistResponse
        ) {
          // It's just a Checklist object
          const checklist = createdChecklistResponse as Checklist;
          checklistId = checklist.id;

          // We need to refresh the application to get the updated state
          updatedApplication = await collegeApplicationsApi.getById(
            collegeApplicationId
          );
        } else {
          throw new Error(
            `Unexpected response format from checklist creation API: ${JSON.stringify(
              createdChecklistResponse
            )}`
          );
        }

        // Then add tasks to the checklist
        for (const templateTask of templateChecklist.tasks) {
          try {
            const taskData: StandaloneCreateTaskDTO =
              convertTemplateTaskToCreateDTO(
                templateTask,
                existingApplication.deadline,
                collegeApplicationId,
                checklistId
              );

            await tasksApi.create(taskData);
            tasksCreated++;
          } catch (taskError) {
            throw taskError;
          }
        }
      } catch (error) {
        throw new Error(
          `Failed to create checklist "${templateChecklist.name}": ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Log final summary
    // Return the updated college application with import stats
    const updatedCollegeApplication = await collegeApplicationsApi.getById(
      collegeApplicationId
    );

    // Helper function to get country flag emoji
    const getCountryFlag = (country: string): string => {
      const flags: { [key: string]: string } = {
        "United States": "🇺🇸",
        "United Kingdom": "🇬🇧",
        Canada: "🇨🇦",
        Netherlands: "🇳🇱",
        Germany: "🇩🇪",
        Australia: "🇦🇺",
        France: "🇫🇷",
        Japan: "🇯🇵",
      };
      return flags[country] || "🌍";
    };

    return {
      success: true,
      collegeApplication: updatedCollegeApplication,
      template: {
        id: template.id,
        name: template.name,
        country: template.country,
        flag: getCountryFlag(template.country),
      },
      stats: {
        checklistsCreated,
        tasksCreated,
      },
    };
  },

  /**
   * Get available templates (this would normally fetch from backend)
   */
  async getAvailableTemplates() {
    // For now, return static data. In production, this would fetch from backend
    return getAvailableTemplates();
  },

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string) {
    return getTemplateById(templateId);
  },
};

// Helper function to map template category strings to enum values
function mapTemplateCategory(categoryString: string): Category {
  switch (categoryString.toLowerCase()) {
    case "academic":
      return Category.ACADEMIC;
    case "application":
      return Category.APPLICATION;
    case "financial_aid":
      return Category.FINANCIAL_AID;
    case "scholarship":
      return Category.SCHOLARSHIP;
    case "housing":
      return Category.HOUSING;
    case "personal":
      return Category.PERSONAL;
    default:
      return Category.OTHER;
  }
}

// Helper function to map template priority strings to enum values
function mapTemplatePriority(priorityString: string): TaskPriority {
  switch (priorityString.toLowerCase()) {
    case "high":
      return TaskPriority.HIGH;
    case "medium":
      return TaskPriority.MEDIUM;
    case "low":
      return TaskPriority.LOW;
    default:
      return TaskPriority.MEDIUM;
  }
}

// Helper function to map template type strings to enum values
function mapTemplateType(typeString: string): TaskType {
  switch (typeString.toLowerCase()) {
    case "document_preparation":
      return TaskType.DOCUMENT_PREPARATION;
    case "submission":
      return TaskType.SUBMISSION;
    case "review":
      return TaskType.REVIEW;
    case "follow_up":
      return TaskType.FOLLOW_UP;
    case "research":
      return TaskType.RESEARCH;
    case "writing":
      return TaskType.WRITING;
    case "scheduling":
      return TaskType.SCHEDULING;
    case "application":
      return TaskType.OTHER; // Map 'application' to OTHER since it's not in the enum
    default:
      return TaskType.OTHER;
  }
}

// Helper function to map template component strings to enum values
function mapTemplateComponent(componentString: string): TaskComponent {
  switch (componentString.toLowerCase()) {
    case "common_app":
      return TaskComponent.COMMON_APP;
    case "supplemental_essay":
      return TaskComponent.SUPPLEMENTAL_ESSAY;
    case "academic_records":
      return TaskComponent.ACADEMIC_RECORDS;
    case "standardized_tests":
      return TaskComponent.STANDARDIZED_TESTS;
    case "supporting_documents":
      return TaskComponent.SUPPORTING_DOCUMENTS;
    case "financial_documents":
      return TaskComponent.FINANCIAL_DOCUMENTS;
    case "financial_aid":
      return TaskComponent.OTHER; // Map 'financial_aid' to OTHER since it's not in the enum
    case "scholarships":
      return TaskComponent.OTHER; // Map 'scholarships' to OTHER since it's not in the enum
    default:
      return TaskComponent.OTHER;
  }
}

// Helper function to map template responsible strings to enum values
function mapTemplateResponsible(responsibleString: string): TaskResponsible {
  switch (responsibleString.toLowerCase()) {
    case "student":
      return TaskResponsible.STUDENT;
    case "parent":
      return TaskResponsible.PARENT;
    case "counselor":
      return TaskResponsible.COUNSELOR;
    case "teacher":
      return TaskResponsible.TEACHER;
    case "school_office":
      return TaskResponsible.SCHOOL_OFFICE;
    default:
      return TaskResponsible.OTHER;
  }
}

// Helper function to convert template task to API format
function convertTemplateTaskToCreateDTO(
  templateTask: any,
  applicationDeadline?: string,
  applicationId?: string,
  checklistId?: string
): StandaloneCreateTaskDTO {
  // Calculate deadline based on days before application deadline
  let deadlineDate: Date;

  if (applicationDeadline && templateTask.deadline_days_before) {
    // If we have an application deadline and days_before, calculate the task deadline
    deadlineDate = new Date(applicationDeadline);
    deadlineDate.setDate(
      deadlineDate.getDate() - templateTask.deadline_days_before
    );
  } else if (templateTask.deadline_days_before) {
    // If we only have days_before, use current date as baseline
    deadlineDate = new Date();
    deadlineDate.setDate(
      deadlineDate.getDate() + templateTask.deadline_days_before
    );
  } else {
    // Default to 30 days from now
    deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30);
  }

  return {
    application_id: applicationId || "",
    checklist_id: checklistId || "",
    name: templateTask.name || "Untitled Task",
    deadline: deadlineDate.toISOString(),
    priority: mapTemplatePriority(templateTask.priority || "medium"),
    type: mapTemplateType(templateTask.type || "other"),
    component: mapTemplateComponent(templateTask.component || "other"),
    status: TaskStatus.NOT_STARTED,
    responsible: mapTemplateResponsible(templateTask.responsible || "student"),
    notes: templateTask.notes || null,
  };
}

// Mock template data (this would come from backend in production)
function getAvailableTemplates() {
  return [
    {
      id: "usa-undergraduate",
      name: "United States - Undergraduate",
      description:
        "Comprehensive template for US undergraduate applications including Common App, essays, standardized tests, and financial aid.",
      country: "United States",
      checklists: [
        {
          name: "Standardized Tests",
          category: "academic" as const,
          description: "Prepare and take required standardized tests",
          tasks: [
            {
              name: "Register for SAT/ACT",
              deadline_days_before: 120,
              priority: "high" as const,
              type: "scheduling" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes:
                "Take test at least 2-3 times for best scores. Register early to secure preferred test dates.",
            },
            {
              name: "Take SAT/ACT",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes:
                "Aim for scores above the 75th percentile for target schools.",
            },
            {
              name: "Submit test scores to schools",
              deadline_days_before: 30,
              priority: "high" as const,
              type: "submission" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes:
                "Check if schools require official score reports or accept self-reported scores.",
            },
          ],
        },
        {
          name: "Application Essays",
          category: "application" as const,
          description:
            "Write compelling personal essays and supplemental essays",
          tasks: [
            {
              name: "Write Common App personal essay",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "writing" as const,
              component: "common_app" as const,
              responsible: "student" as const,
              notes:
                "Choose from 7 prompts. 650 words max. Show personality and growth.",
            },
            {
              name: "Complete school-specific supplemental essays",
              deadline_days_before: 45,
              priority: "high" as const,
              type: "writing" as const,
              component: "supplemental_essay" as const,
              responsible: "student" as const,
              notes:
                "Research each school thoroughly. Answer 'Why this school?' convincingly.",
            },
            {
              name: "Get essays reviewed by counselor/teacher",
              deadline_days_before: 30,
              priority: "medium" as const,
              type: "review" as const,
              component: "supplemental_essay" as const,
              responsible: "counselor" as const,
              notes: "Get feedback on content, structure, and grammar.",
            },
          ],
        },
        {
          name: "Letters of Recommendation",
          category: "application" as const,
          description: "Secure strong recommendation letters",
          tasks: [
            {
              name: "Ask teachers for recommendation letters",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "supporting_documents" as const,
              responsible: "student" as const,
              notes:
                "Ask teachers who know you well academically. Provide resume and personal statement.",
            },
            {
              name: "Request counselor recommendation",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "supporting_documents" as const,
              responsible: "counselor" as const,
              notes:
                "Most schools require a counselor recommendation for context about your school.",
            },
            {
              name: "Follow up on recommendation submissions",
              deadline_days_before: 15,
              priority: "medium" as const,
              type: "follow_up" as const,
              component: "supporting_documents" as const,
              responsible: "student" as const,
              notes:
                "Politely check that all recommendations have been submitted.",
            },
          ],
        },
        {
          name: "Financial Aid",
          category: "financial_aid" as const,
          description: "Complete financial aid applications and scholarships",
          tasks: [
            {
              name: "Complete FAFSA",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "application" as const,
              component: "financial_aid" as const,
              responsible: "parent" as const,
              notes:
                "Submit as early as possible. Requires tax information from previous year.",
            },
            {
              name: "Complete CSS Profile (if required)",
              deadline_days_before: 45,
              priority: "high" as const,
              type: "application" as const,
              component: "financial_aid" as const,
              responsible: "parent" as const,
              notes: "Required by many private schools for institutional aid.",
            },
            {
              name: "Apply for merit scholarships",
              deadline_days_before: 30,
              priority: "medium" as const,
              type: "application" as const,
              component: "scholarships" as const,
              responsible: "student" as const,
              notes:
                "Research school-specific and external scholarship opportunities.",
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
      checklists: [
        {
          name: "UCAS Application",
          category: "application" as const,
          description: "Complete UCAS online application",
          tasks: [
            {
              name: "Research courses and universities",
              deadline_days_before: 120,
              priority: "high" as const,
              type: "research" as const,
              component: "other" as const,
              responsible: "student" as const,
              notes:
                "Choose up to 5 courses. Consider entry requirements and course content.",
            },
            {
              name: "Write personal statement",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "writing" as const,
              component: "supplemental_essay" as const,
              responsible: "student" as const,
              notes:
                "4000 characters max. Focus on academic interest and relevant experience.",
            },
            {
              name: "Request academic reference",
              deadline_days_before: 75,
              priority: "high" as const,
              type: "other" as const,
              component: "supporting_documents" as const,
              responsible: "teacher" as const,
              notes: "Usually written by school teacher or college tutor.",
            },
            {
              name: "Submit UCAS application",
              deadline_days_before: 14,
              priority: "high" as const,
              type: "submission" as const,
              component: "other" as const,
              responsible: "student" as const,
              notes: "Deadline: 15 January (Oxford/Cambridge: 15 October)",
            },
          ],
        },
        {
          name: "Academic Qualifications",
          category: "academic" as const,
          description: "Prepare academic credentials",
          tasks: [
            {
              name: "Complete A-Level studies",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "academic_records" as const,
              responsible: "student" as const,
              notes: "Meet predicted grade requirements for chosen courses.",
            },
            {
              name: "Take English proficiency test (international)",
              deadline_days_before: 45,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Academic Requirements",
          category: "academic" as const,
          description: "Meet academic prerequisites",
          tasks: [
            {
              name: "Complete Grade 12 university-prep courses",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "academic_records" as const,
              responsible: "student" as const,
              notes: "Maintain 80%+ average for competitive programs.",
            },
            {
              name: "Take English proficiency test",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes: "IELTS 6.5+ or TOEFL 90+ typically required.",
            },
            {
              name: "Submit official transcripts",
              deadline_days_before: 30,
              priority: "high" as const,
              type: "submission" as const,
              component: "academic_records" as const,
              responsible: "school_office" as const,
              notes: "Request transcripts early from your school.",
            },
          ],
        },
        {
          name: "Application Process",
          category: "application" as const,
          description: "Complete university applications",
          tasks: [
            {
              name: "Apply through OUAC (Ontario) or direct application",
              deadline_days_before: 45,
              priority: "high" as const,
              type: "submission" as const,
              component: "other" as const,
              responsible: "student" as const,
              notes: "Each province has different application systems.",
            },
            {
              name: "Write personal statement (if required)",
              deadline_days_before: 60,
              priority: "medium" as const,
              type: "writing" as const,
              component: "supplemental_essay" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Academic Preparation",
          category: "academic" as const,
          description: "Meet Dutch academic requirements",
          tasks: [
            {
              name: "Complete VWO or equivalent qualification",
              deadline_days_before: 120,
              priority: "high" as const,
              type: "other" as const,
              component: "academic_records" as const,
              responsible: "student" as const,
              notes:
                "Must have correct subject combination for your chosen field.",
            },
            {
              name: "Take English proficiency test",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes: "IELTS 6.0+ or equivalent for most programs.",
            },
          ],
        },
        {
          name: "Application Submission",
          category: "application" as const,
          description: "Apply through Studielink",
          tasks: [
            {
              name: "Register for Studielink account",
              deadline_days_before: 90,
              priority: "medium" as const,
              type: "other" as const,
              component: "other" as const,
              responsible: "student" as const,
              notes: "Dutch national application system for higher education.",
            },
            {
              name: "Submit application via Studielink",
              deadline_days_before: 30,
              priority: "high" as const,
              type: "submission" as const,
              component: "other" as const,
              responsible: "student" as const,
              notes:
                "Deadline: 1 May for most programs, earlier for numerus fixus.",
            },
            {
              name: "Write motivation letter (if required)",
              deadline_days_before: 45,
              priority: "medium" as const,
              type: "writing" as const,
              component: "supplemental_essay" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Academic Qualifications",
          category: "academic" as const,
          description: "Prepare German university entrance qualifications",
          tasks: [
            {
              name: "Obtain Abitur or equivalent recognition",
              deadline_days_before: 120,
              priority: "high" as const,
              type: "document_preparation" as const,
              component: "academic_records" as const,
              responsible: "student" as const,
              notes:
                "Check if your qualification is recognized. May need Studienkolleg.",
            },
            {
              name: "Take German language test",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes: "TestDaF or DSH required for German-taught programs.",
            },
            {
              name: "Get APS certificate (if required)",
              deadline_days_before: 150,
              priority: "high" as const,
              type: "document_preparation" as const,
              component: "supporting_documents" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Academic Requirements",
          category: "academic" as const,
          description: "Meet Australian university entry requirements",
          tasks: [
            {
              name: "Complete Year 12 or equivalent",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "academic_records" as const,
              responsible: "student" as const,
              notes:
                "Achieve required ATAR or equivalent international qualification.",
            },
            {
              name: "Take English proficiency test",
              deadline_days_before: 60,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Language Requirements",
          category: "academic" as const,
          description: "Meet French language proficiency requirements",
          tasks: [
            {
              name: "Take French language test",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
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
      checklists: [
        {
          name: "Entrance Examinations",
          category: "academic" as const,
          description: "Prepare for Japanese university entrance exams",
          tasks: [
            {
              name: "Take EJU exam",
              deadline_days_before: 120,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes:
                "Exam held twice yearly. Choose subjects based on your field.",
            },
            {
              name: "Take Japanese language proficiency test",
              deadline_days_before: 90,
              priority: "high" as const,
              type: "other" as const,
              component: "standardized_tests" as const,
              responsible: "student" as const,
              notes: "JLPT N2 or N1 typically required.",
            },
          ],
        },
      ],
    },
    // Add more templates here as needed
  ];
}

function getTemplateById(templateId: string) {
  const templates = getAvailableTemplates();
  return templates.find((t) => t.id === templateId) || null;
}
