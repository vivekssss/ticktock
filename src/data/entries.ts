import { TimesheetEntry } from "@/types";

let nextId = 100;
export function generateId(): string {
    return `entry-${nextId++}`;
}

export const timesheetEntries: TimesheetEntry[] = [
    // Week 1 (Jan 1-5, completed = 40 hrs)
    { id: "entry-1", weekId: "w1", date: "2024-01-01", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-2", weekId: "w1", date: "2024-01-02", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-3", weekId: "w1", date: "2024-01-03", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Design", hours: 8 },
    { id: "entry-4", weekId: "w1", date: "2024-01-04", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Bug Fixes", hours: 8 },
    { id: "entry-5", weekId: "w1", date: "2024-01-05", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Testing", hours: 8 },

    // Week 2 (Jan 8-12, completed = 40 hrs)
    { id: "entry-6", weekId: "w2", date: "2024-01-08", taskDescription: "API Integration", project: "API Integration", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-7", weekId: "w2", date: "2024-01-09", taskDescription: "API Integration", project: "API Integration", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-8", weekId: "w2", date: "2024-01-10", taskDescription: "API Integration", project: "API Integration", typeOfWork: "Testing", hours: 8 },
    { id: "entry-9", weekId: "w2", date: "2024-01-11", taskDescription: "API Integration", project: "API Integration", typeOfWork: "Documentation", hours: 8 },
    { id: "entry-10", weekId: "w2", date: "2024-01-12", taskDescription: "API Integration", project: "API Integration", typeOfWork: "Bug Fixes", hours: 8 },

    // Week 3 (Jan 15-19, incomplete = 28 hrs)
    { id: "entry-11", weekId: "w3", date: "2024-01-15", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-12", weekId: "w3", date: "2024-01-16", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Bug Fixes", hours: 8 },
    { id: "entry-13", weekId: "w3", date: "2024-01-17", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Design", hours: 4 },
    { id: "entry-14", weekId: "w3", date: "2024-01-18", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Meetings", hours: 4 },
    { id: "entry-15", weekId: "w3", date: "2024-01-19", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Testing", hours: 4 },

    // Week 4 (Jan 22-26, completed = 40 hrs)
    { id: "entry-16", weekId: "w4", date: "2024-01-22", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 4 },
    { id: "entry-17", weekId: "w4", date: "2024-01-22", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Design", hours: 4 },
    { id: "entry-18", weekId: "w4", date: "2024-01-23", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 4 },
    { id: "entry-19", weekId: "w4", date: "2024-01-23", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Bug Fixes", hours: 4 },
    { id: "entry-20", weekId: "w4", date: "2024-01-23", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Testing", hours: 4 },
    { id: "entry-21", weekId: "w4", date: "2024-01-24", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 4 },
    { id: "entry-22", weekId: "w4", date: "2024-01-24", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Meetings", hours: 4 },
    { id: "entry-23", weekId: "w4", date: "2024-01-25", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 4 },
    { id: "entry-24", weekId: "w4", date: "2024-01-25", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Documentation", hours: 4 },
    { id: "entry-25", weekId: "w4", date: "2024-01-26", taskDescription: "Homepage Development", project: "Homepage Development", typeOfWork: "Feature Development", hours: 4 },

    // Week 6 (Feb 5-9, completed = 40 hrs)
    { id: "entry-26", weekId: "w6", date: "2024-02-05", taskDescription: "Dashboard Redesign", project: "Dashboard Redesign", typeOfWork: "Design", hours: 8 },
    { id: "entry-27", weekId: "w6", date: "2024-02-06", taskDescription: "Dashboard Redesign", project: "Dashboard Redesign", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-28", weekId: "w6", date: "2024-02-07", taskDescription: "Dashboard Redesign", project: "Dashboard Redesign", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-29", weekId: "w6", date: "2024-02-08", taskDescription: "Dashboard Redesign", project: "Dashboard Redesign", typeOfWork: "Testing", hours: 8 },
    { id: "entry-30", weekId: "w6", date: "2024-02-09", taskDescription: "Dashboard Redesign", project: "Dashboard Redesign", typeOfWork: "Bug Fixes", hours: 8 },

    // Week 8 (Feb 19-23, incomplete = 16 hrs)
    { id: "entry-31", weekId: "w8", date: "2024-02-19", taskDescription: "Mobile App Setup", project: "Mobile App", typeOfWork: "Feature Development", hours: 8 },
    { id: "entry-32", weekId: "w8", date: "2024-02-20", taskDescription: "Mobile App Navigation", project: "Mobile App", typeOfWork: "Feature Development", hours: 8 },
];
