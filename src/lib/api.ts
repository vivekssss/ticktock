import { WeeklyTimesheet, TimesheetEntry } from "@/types";

interface FetchTimesheetsParams {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

interface TimesheetsResponse {
    data: WeeklyTimesheet[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || `HTTP error ${response.status}`);
    }
    return response.json();
}

export async function fetchTimesheets(
    params?: FetchTimesheetsParams
): Promise<TimesheetsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.set("status", params.status);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    const url = `/api/timesheets${query ? `?${query}` : ""}`;

    const response = await fetch(url);
    return handleResponse<TimesheetsResponse>(response);
}

export async function fetchWeekDetail(
    weekId: string
): Promise<{ week: WeeklyTimesheet; entries: TimesheetEntry[] }> {
    const response = await fetch(`/api/timesheets/${weekId}`);
    return handleResponse(response);
}

export async function createEntry(
    weekId: string,
    data: Omit<TimesheetEntry, "id" | "weekId">
): Promise<TimesheetEntry> {
    const response = await fetch(`/api/timesheets/${weekId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<TimesheetEntry>(response);
}

export async function updateEntry(
    weekId: string,
    entryId: string,
    data: Partial<TimesheetEntry>
): Promise<TimesheetEntry> {
    const response = await fetch(`/api/timesheets/${weekId}/entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<TimesheetEntry>(response);
}

export async function deleteEntry(
    weekId: string,
    entryId: string
): Promise<void> {
    const response = await fetch(`/api/timesheets/${weekId}/entries/${entryId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || `HTTP error ${response.status}`);
    }
}
