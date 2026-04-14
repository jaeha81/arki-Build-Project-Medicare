import type { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = (await res.json().catch(() => ({ code: "UNKNOWN", message: res.statusText }))) as ApiError;
    throw new ApiClientError(error.code, error.message, res.status);
  }

  return res.json() as Promise<T>;
}

async function authRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  authGet: <T>(path: string, token: string) => authRequest<T>(path, token),
  authPost: <T>(path: string, token: string, body: unknown) =>
    authRequest<T>(path, token, { method: "POST", body: JSON.stringify(body) }),
};
