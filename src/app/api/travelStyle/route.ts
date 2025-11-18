import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await axios.get(
            "http://localhost:8080/api/v1/user/travel-styles/all"
        );
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error(
            "Fetch travel styles error:",
            error.response?.data || error.message
        );
        return NextResponse.json({ travelStyles: [] }, { status: 500 });
    }
}
