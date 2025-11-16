import axios from "axios";
import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/config/shared/app";

export async function GET() {
    try {
        const baseUrl = APP_CONFIG.BASE_API_URL.replace(/\/$/, '');
        const response = await axios.get(`${baseUrl}/api/v1/user/interests/all`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Fetch interest error:", error.response?.data || error.message);
        return NextResponse.json({ interest: [] }, { status: 500 });
    }
}