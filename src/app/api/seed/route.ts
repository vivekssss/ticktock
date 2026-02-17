import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { users } from "@/data/users";
import { weeklyTimesheets } from "@/data/timesheets";
import { timesheetEntries } from "@/data/entries";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("ticktock");

        // Clear existing data
        await db.collection("users").deleteMany({});
        await db.collection("timesheets").deleteMany({});
        await db.collection("entries").deleteMany({});

        // Insert new data
        // MongoDB generates _id automatically if not provided, but we want to keep our IDs consistent for now or just let Mongo handle it.
        // The mock data has string IDs like "user-1", "w1", "entry-1".
        // We can use these as _id or just custom id fields. Let's use custom "id" field and let Mongo have its _id.

        // In a real app we'd hash passwords, but for this mock we kept them plain.
        // The previous auth logic used plain text comparison.

        await db.collection("users").insertMany(users);
        await db.collection("timesheets").insertMany(weeklyTimesheets);
        await db.collection("entries").insertMany(timesheetEntries);

        return NextResponse.json({ message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ message: "Error seeding database", error }, { status: 500 });
    }
}
