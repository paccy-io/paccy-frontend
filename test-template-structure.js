// Simple test to verify template data structure and mappings
console.log("Testing template data structure...\n");

// Simulate template data structure
const template = {
  checklists: [
    {
      name: "Standardized Tests",
      category: "academic",
      description: "Prepare and take required standardized tests",
      tasks: [
        {
          name: "Register for SAT/ACT",
          deadline_days_before: 120,
          priority: "high",
          type: "scheduling",
          component: "standardized_tests",
          responsible: "student",
          notes: "Register early",
        },
        {
          name: "Take SAT/ACT",
          deadline_days_before: 90,
          priority: "high",
          type: "other",
          component: "standardized_tests",
          responsible: "student",
          notes: "Aim for high scores",
        },
      ],
    },
    {
      name: "Application Essays",
      category: "application",
      description: "Write compelling essays",
      tasks: [
        {
          name: "Write Common App personal essay",
          deadline_days_before: 60,
          priority: "high",
          type: "writing",
          component: "common_app",
          responsible: "student",
          notes: "Be authentic and compelling",
        },
      ],
    },
  ],
};

// Test template structure
console.log(`Template has ${template.checklists.length} checklists:`);
let totalTasks = 0;

template.checklists.forEach((checklist, index) => {
  console.log(`  ${index + 1}. ${checklist.name} (${checklist.category})`);
  console.log(`     Description: ${checklist.description}`);
  console.log(`     Tasks: ${checklist.tasks.length}`);

  checklist.tasks.forEach((task, taskIndex) => {
    console.log(`       ${taskIndex + 1}. ${task.name}`);
    console.log(
      `          - Deadline: ${task.deadline_days_before} days before`
    );
    console.log(`          - Priority: ${task.priority}`);
    console.log(`          - Type: ${task.type}`);
    console.log(`          - Component: ${task.component}`);
    console.log(`          - Responsible: ${task.responsible}`);
    totalTasks++;
  });
  console.log("");
});

console.log(`Total tasks across all checklists: ${totalTasks}`);

// Test deadline calculation
const applicationDeadline = "2024-01-15T00:00:00Z";
console.log(`\nApplication deadline: ${applicationDeadline}`);
console.log("Task deadlines:");

template.checklists.forEach((checklist) => {
  checklist.tasks.forEach((task) => {
    const appDate = new Date(applicationDeadline);
    const taskDate = new Date(appDate);
    taskDate.setDate(taskDate.getDate() - task.deadline_days_before);

    console.log(
      `  ${task.name}: ${taskDate.toISOString()} (${
        task.deadline_days_before
      } days before app deadline)`
    );
  });
});

console.log("\n✅ Template structure test completed!");
