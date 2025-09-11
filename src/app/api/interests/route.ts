import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await axios.get("http://localhost:8080/user/interests/all");
        console.log("Fetched interests:", response.data);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Fetch interests error:", error.response?.data || error.message);
        return NextResponse.json({ interests: [] }, { status: 500 });
    }
}