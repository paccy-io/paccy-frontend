import majorsData from "./college-majors.json";

// Extract major names from the JSON structure
export const COLLEGE_MAJORS: string[] = majorsData.Majors.map(
  (item) => item.major
);

// Popular majors for quick selection
export const POPULAR_MAJORS = [
  "Computer Science",
  "Business Administration & Management",
  "Psychology",
  "Biology",
  "Engineering (Pre-Engineering)",
  "English Language & Literature",
  "Economics",
  "Mathematics",
  "Political Science & Government",
  "Chemistry",
];
