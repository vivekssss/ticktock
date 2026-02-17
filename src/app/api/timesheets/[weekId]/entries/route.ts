import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { generateId } from "@/data/entries"; // We can still use this unique ID generator or use UUID

async function recalculateWeekStatus(db: any, weekId: string) {
    const entries = await db.collection("entries").find({ weekId }).toArray();
    const totalHours = entries.reduce((sum: number, e: any) => sum + e.hours, 0);

    let status = "missing";
    if (totalHours >= 40) {
        status = "completed";
    } else if (totalHours > 0) {
        status = "incomplete";
    }

    await db.collection("timesheets").updateOne(
        { id: weekId },
        { $set: { status, totalHours } }
    );
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ weekId: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { weekId } = await params;

    const client = await clientPromise;
    const db = client.db("ticktock");

    const week = await db.collection("timesheets").findOne({ id: weekId });

    if (!week) {
        return NextResponse.json({ message: "Week not found" }, { status: 404 });
    }

    const body = await request.json();
    const { date, taskDescription, project, typeOfWork, hours } = body;

    // Validation
    if (!date || !taskDescription || !project || !typeOfWork || !hours) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    if (typeof hours !== "number" || hours <= 0) {
        return NextResponse.json(
            { message: "Hours must be a positive number" },
            { status: 400 }
        );
    }

    const newEntry = {
        id: generateId(),
        weekId,
        date,
        taskDescription,
        project,
        typeOfWork,
        hours,
    };

    await db.collection("entries").insertOne(newEntry);
    await recalculateWeekStatus(db, weekId);

    // Remove _id for client response cleanliness
    const { _id, ...responseEntry } = newEntry as any;

    return NextResponse.json(responseEntry, { status: 201 });
}
