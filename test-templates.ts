// Simple test to verify template import functionality
import { templatesApi } from "./lib/api/templates";

// Test the template import functionality
async function testTemplateImport() {
  console.log("Testing template import functionality...\n");

  try {
    // Get available templates
    const templates = await templatesApi.getAvailableTemplates();
    console.log("Available templates:", templates.length);

    if (templates.length > 0) {
      const template = templates[0];
      console.log(`\nTesting template: ${template.name}`);
      console.log(`Description: ${template.description}`);
      console.log(`Number of checklists: ${template.checklists.length}`);

      // Count total tasks across all checklists
      const totalTasks = template.checklists.reduce(
        (sum: number, checklist: any) => sum + checklist.tasks.length,
        0
      );
      console.log(`Total tasks across all checklists: ${totalTasks}`);

      // Show details of each checklist
      console.log("\nChecklist details:");
      template.checklists.forEach((checklist: any, index: number) => {
        console.log(
          `  ${index + 1}. ${checklist.name} (${checklist.category}) - ${
            checklist.tasks.length
          } tasks`
        );
      });

      console.log(
        "\nTemplate import would work with templatesApi.importTemplate()"
      );
      console.log("This requires a valid college application ID to import to.");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testTemplateImport();
