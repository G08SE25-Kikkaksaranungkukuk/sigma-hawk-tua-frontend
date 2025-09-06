import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req : Request) => {
    const reqBody = await req.json()
    console.log(reqBody);
    const ret = await (await axios.post("http://localhost:8080/auth/login",reqBody)).data
    const res = new NextResponse();
    res.cookies.set("accessToken",ret.data.accessToken);
    res.cookies.set("refreshToken",ret.data.refreshToken);
    return res
}