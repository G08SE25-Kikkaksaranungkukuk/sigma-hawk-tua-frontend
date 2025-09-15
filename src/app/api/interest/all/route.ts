import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await axios.get("http://localhost:8080/user/interests/all");
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Fetch interest error:", error.response?.data || error.message);
        return NextResponse.json({ interest: [] }, { status: 500 });
    }
}