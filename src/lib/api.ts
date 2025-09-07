import axios from "axios";
import { baseAPIUrl } from "./config";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseAPIUrl}${path}`, {
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

export const apiClient = axios.create({baseURL : baseAPIUrl});