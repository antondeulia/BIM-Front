export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

async function clientRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = {
        detail: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    const errorMessage =
      error.error || error.detail || error.message || "An error occurred";

    if (response.status === 401) {
      throw new Error(errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authApi = {
  async login(email: string, password: string) {
    return clientRequest<{
      access_token: string;
      user: null;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(email: string, password: string) {
    return clientRequest<{
      access_token: string;
      user: null;
    }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return clientRequest("/api/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser() {
    return clientRequest<{
      id: string;
      email: string;
      name: string;
    }>("/api/auth/me");
  },
};
