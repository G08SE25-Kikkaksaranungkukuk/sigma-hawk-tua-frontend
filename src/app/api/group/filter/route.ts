import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Build backend query string
    const params = new URLSearchParams();
    searchParams.getAll("interest_id").forEach(field => params.append("interest_id", field));
    if (searchParams.get("group_name")) params.append("group_name", searchParams.get("group_name")!);
    if (searchParams.get("page")) params.append("page", searchParams.get("page")!);
    if (searchParams.get("page_size")) params.append("page_size", searchParams.get("page_size")!);

    const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/group/filter?${params.toString()}`;   
    try {
        const res = await axios.get(backendUrl);
        return NextResponse.json(res.data);
    } catch (err: any) {
        const status = err.response?.status || 500;
        return NextResponse.json({ group_array: [], group_count: 0 }, { status });
    }
}