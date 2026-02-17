import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ weekId: string; entryId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { weekId, entryId } = await params;

    const client = await clientPromise;
    const db = client.db("ticktock");

    const entry = await db.collection("entries").findOne({ id: entryId, weekId });

    if (!entry) {
        return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    const body = await request.json();
    const { taskDescription, project, typeOfWork, hours } = body;

    if (hours !== undefined && (typeof hours !== "number" || hours <= 0)) {
        return NextResponse.json(
            { message: "Hours must be a positive number" },
            { status: 400 }
        );
    }

    const updateData: any = {};
    if (taskDescription !== undefined) updateData.taskDescription = taskDescription;
    if (project !== undefined) updateData.project = project;
    if (typeOfWork !== undefined) updateData.typeOfWork = typeOfWork;
    if (hours !== undefined) updateData.hours = hours;

    await db.collection("entries").updateOne(
        { id: entryId, weekId },
        { $set: updateData }
    );

    await recalculateWeekStatus(db, weekId);
    const updatedEntry = await db.collection("entries").findOne({ id: entryId, weekId });
    const { _id, ...responseEntry } = updatedEntry as any;

    return NextResponse.json(responseEntry);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ weekId: string; entryId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { weekId, entryId } = await params;

    const client = await clientPromise;
    const db = client.db("ticktock");

    const result = await db.collection("entries").deleteOne({ id: entryId, weekId });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    await recalculateWeekStatus(db, weekId);

    return NextResponse.json({ message: "Entry deleted" });
}
