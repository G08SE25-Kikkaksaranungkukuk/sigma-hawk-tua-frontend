import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const reqBody = await req.json();
    console.log(reqBody);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/login`, reqBody);
        const ret = response.data;
        const res = new NextResponse();
        res.cookies.set("accessToken", ret.data.accessToken, { httpOnly: true , secure: true, sameSite: 'lax', path: '/'});
        res.cookies.set("refreshToken", ret.data.refreshToken, { httpOnly: true , secure: true, sameSite: 'lax', path: '/'});
        return res;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        return new NextResponse("Unauthorized", { status: 401 });
    }
}