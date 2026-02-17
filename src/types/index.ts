export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface WeeklyTimesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
}

export interface TimesheetEntry {
  id: string;
  weekId: string;
  date: string;
  taskDescription: string;
  project: string;
  typeOfWork: string;
  hours: number;
}

export interface Project {
  id: string;
  name: string;
}

export const WORK_TYPES = [
  "Bug Fixes",
  "Feature Development",
  "Design",
  "Testing",
  "Meetings",
  "Documentation",
] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const PROJECTS: Project[] = [
  { id: "p1", name: "Homepage Development" },
  { id: "p2", name: "Mobile App" },
  { id: "p3", name: "API Integration" },
  { id: "p4", name: "Dashboard Redesign" },
  { id: "p5", name: "E-commerce Platform" },
];
