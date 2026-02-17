import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const sortBy = searchParams.get("sortBy") || "weekNumber";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const client = await clientPromise;
    const db = client.db("ticktock");

    // Build query
    const query: any = {};

    if (status && status !== "all") {
        query.status = status;
    }

    if (startDate) {
        query.startDate = { ...query.startDate, $gte: startDate };
    }
    if (endDate) {
        query.endDate = { ...query.endDate, $lte: endDate };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await db.collection("timesheets").countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const data = await db
        .collection("timesheets")
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray();

    // Convert _id to string or remove it if we use 'id'
    const formattedData = data.map((item) => ({
        ...item,
        _id: undefined, // remove mongo _id from response to keep it clean if we use 'id'
    }));

    return NextResponse.json({
        data: formattedData,
        total,
        page,
        pageSize,
        totalPages,
    });
}
