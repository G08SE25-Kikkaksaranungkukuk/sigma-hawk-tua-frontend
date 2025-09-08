import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken');
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Call backend refresh endpoint
    const response = await axios.post(
      'http://localhost:8080/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken.value}`,
        },
        withCredentials: true,
      }
    );

    // Create response with new tokens
    const res = NextResponse.json(
      { 
        message: 'Tokens refreshed successfully',
        data: response.data.data 
      },
      { status: 200 }
    );

    // Set new tokens in cookies
    if (response.data.data?.accessToken) {
      res.cookies.set('accessToken', response.data.data.accessToken, {
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax',
        httpOnly: false, // Allow access from client-side JavaScript
      });
    }

    if (response.data.data?.refreshToken) {
      res.cookies.set('refreshToken', response.data.data.refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        httpOnly: false, // Allow access from client-side JavaScript
      });
    }

    return res;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    
    // If refresh fails, clear cookies and return error
    const res = NextResponse.json(
      { error: 'Failed to refresh tokens' },
      { status: 401 }
    );
    
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
    
    return res;
  }
}
