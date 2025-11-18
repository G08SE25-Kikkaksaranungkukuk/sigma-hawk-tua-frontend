import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init?.headers||{}) },
    credentials: "include", // ถ้าแบ็กเอนด์ใช้ cookie
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface ApiEnvelope<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: { code?: string; message?: string; details?: unknown };
}

export class ApiClientError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  constructor(message: string, opts: { status?: number; code?: string; details?: unknown } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,      
  headers: { "Content-Type": "application/json" },
  // timeout: 15000,                                   // optional: add a timeout
  withCredentials: true,                            // optional: set default if you always need cookies
});

// Helper function to get accessToken from cookies
function getAccessTokenFromCookies(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('accessToken=')
  );
  
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  
  return null;
}

// Attach auth header with token from cookies
apiClient.interceptors.request.use((config) => {
  const token = getAccessTokenFromCookies();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[apiClient] Adding Authorization header to request:', config.url, 'Token preview:', token.substring(0, 20) + '...');
  } else {
    console.log('[apiClient] No token found in cookies for request:', config.url);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;
    // Unwrap only if it *looks* like your envelope
    const looksLikeEnvelope =
      payload && typeof payload === "object" && ("data" in payload || "success" in payload || "message" in payload);

    return looksLikeEnvelope && (payload as ApiEnvelope).data !== undefined
      ? (payload as ApiEnvelope).data
      : payload;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const payload = error.response?.data as ApiEnvelope | unknown;

    const code =
      (typeof payload === "object" && payload && "error" in payload && (payload as any).error?.code) ||
      (typeof payload === "object" && payload && "code" in payload && (payload as any).code) ||
      error.code;

    const message =
      (typeof payload === "object" && payload && "error" in payload && (payload as any).error?.message) ||
      (typeof payload === "object" && payload && "message" in payload && (payload as any).message) ||
      error.message ||
      "Request failed";

    const details =
      (typeof payload === "object" && payload && "error" in payload && (payload as any).error?.details) || payload;

    return Promise.reject(new ApiClientError(String(message), { status, code, details }));
  }
);

export { apiClient };
