import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'
import { AuthCredentials } from './lib/utils'
import { RequestCookies, ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")
    const refreshToken = request.cookies.get("refreshToken")
    const res = new NextResponse();
    if (!accessToken && refreshToken) {
        const ret = await (await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/refresh`,{},{
            headers : {
                Authorization : `Bearer ${refreshToken.value}`
            },
            withCredentials : true
        })).data as AuthCredentials;
        const response = NextResponse.next()
        response.cookies.set("accessToken",ret.data.accessToken,{
            maxAge : 60 * 60 * 24,
            sameSite : "lax"
        });
        response.cookies.set("refreshToken",ret.data.refreshToken,{
            maxAge : 60 * 60 * 24 * 30,
            sameSite : "lax"
        });
        return response
    }   
    else if((!accessToken && !refreshToken) || (!refreshToken)) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next({request})
}
 
export const config = {
  matcher: [
    '/profile/:path*',
    '/group/:path*',
    '/home/:path*',
  ],
}