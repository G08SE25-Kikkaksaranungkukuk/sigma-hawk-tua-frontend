import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Build backend query string
    const params = new URLSearchParams();
    searchParams.getAll("interest_fields").forEach(field => params.append("interest_fields", field));
    if (searchParams.get("group_name")) params.append("group_name", searchParams.get("group_name")!);
    if (searchParams.get("page")) params.append("page", searchParams.get("page")!);
    if (searchParams.get("page_size")) params.append("page_size", searchParams.get("page_size")!);

    const backendUrl = `http://localhost:8080/group/?${params.toString()}`;

    try {
        const res = await fetch(backendUrl);
        if (!res.ok) {
            return NextResponse.json({ group_array: [], group_count: 0 }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ group_array: [], group_count: 0 }, { status: 500 });
    }
}