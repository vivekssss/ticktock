import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ weekId: string }> }
) {
    const session = await getServerSession(authOptions);
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

    const entries = await db.collection("entries").find({ weekId }).toArray();

    const formattedWeek = { ...week, _id: undefined };
    const formattedEntries = entries.map(e => ({ ...e, _id: undefined }));

    return NextResponse.json({ week: formattedWeek, entries: formattedEntries });
}
