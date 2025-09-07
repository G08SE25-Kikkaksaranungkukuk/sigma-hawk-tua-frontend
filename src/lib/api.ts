import axios from "axios";
import { baseAPIUrl } from "./config";  

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

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || baseAPIUrl,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export { apiClient };