import axios from "axios";
import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/config/shared/app";

export async function POST(req: Request) {
    const reqBody = await req.json();
    console.log(reqBody);
    try {
        const baseUrl = APP_CONFIG.BASE_API_URL.replace(/\/$/, '');
        const response = await axios.post(`${baseUrl}/api/v1/auth/login`, reqBody);
        const ret = response.data;
        const res = new NextResponse();
        res.cookies.set("accessToken", ret.data.accessToken);
        res.cookies.set("refreshToken", ret.data.refreshToken);
        return res;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        return new NextResponse("Unauthorized", { status: 401 });
    }
}