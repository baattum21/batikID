import type { AuthResponse, LoginPayload, User } from "../types/auth";
import type { CheckoutPayload, CheckoutResponse } from "../types/order";
import type { Product } from "../types/product";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const parseError = async (res: Response) => {
  try {
    const body = await res.json();
    return body?.message || "Terjadi kesalahan pada server";
  } catch {
    return "Terjadi kesalahan pada server";
  }
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json() as Promise<T>;
};

export const getProducts = () => request<Product[]>("/products");

export const loginUser = (payload: LoginPayload) =>
  request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMyProfile = (token: string) => request<User>("/auth/me", {}, token);

export const checkout = (payload: CheckoutPayload, token: string) =>
  request<CheckoutResponse>(
    "/checkout",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );