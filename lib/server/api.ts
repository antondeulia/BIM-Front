const API_BASE_URL = process.env.API_BASE_URL;

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export function getAuthTokenFromRequest(request: Request | any): string | null {
  if (typeof window !== "undefined") {
    throw new Error("getAuthTokenFromRequest can only be called on the server");
  }

  if (!request) {
    return null;
  }

  if ("cookies" in request && request.cookies) {
    const token = request.cookies.get("access_token");
    return token?.value || null;
  }

  const cookieHeader = request.headers?.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c: any) => {
        const [key, ...values] = c.split("=");
        return [key.trim(), values.join("=")];
      })
    );
    return cookies["access_token"] || null;
  }

  return null;
}

export async function serverRequest<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    headers?: HeadersInit;
    token?: string | null;
    cache?: RequestCache;
    next?: { revalidate?: number | false; tags?: string[] };
  } = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: customHeaders = {},
    token,
    cache = "no-store",
    next,
  } = options;

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    // @ts-ignore
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache,
  };

  if (next) {
    // @ts-ignore
    fetchOptions.next = next;
  }

  if (body && method !== "GET") {
    if (isFormData) {
      fetchOptions.body = body;
    } else {
      fetchOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || error.message || "An error occurred");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}

export function extractAuthToken(request?: Request): string | null {
  return getAuthTokenFromRequest(request);
}

export function setAuthCookies(
  response: Response,
  accessToken: string | null | undefined,
  refreshToken?: string | null | undefined
): void {
  if (!accessToken) {
    console.error("setAuthCookies: accessToken is required");
    return;
  }

  const isSecure = process.env.NODE_ENV === "production";
  const sameSite = isSecure ? "Strict" : "Lax";

  const accessTokenStr = String(accessToken);
  const refreshTokenStr = refreshToken ? String(refreshToken) : null;

  response.headers.append(
    "Set-Cookie",
    `access_token=${accessTokenStr}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=3600${
      isSecure ? "; Secure" : ""
    }`
  );

  if (refreshTokenStr) {
    response.headers.append(
      "Set-Cookie",
      `refresh_token=${refreshTokenStr}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=604800${
        isSecure ? "; Secure" : ""
      }`
    );
  }
}

export function clearAuthCookies(response: Response): void {
  const isSecure = process.env.NODE_ENV === "production";
  const sameSite = isSecure ? "Strict" : "Lax";

  response.headers.append(
    "Set-Cookie",
    `access_token=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${
      isSecure ? "; Secure" : ""
    }`
  );
  response.headers.append(
    "Set-Cookie",
    `refresh_token=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${
      isSecure ? "; Secure" : ""
    }`
  );
}
