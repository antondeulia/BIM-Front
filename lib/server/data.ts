import { cookies } from "next/headers";
import { serverRequest } from "./api";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}

export async function getAssistants() {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await serverRequest<any[]>("/assistant", {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 30, tags: ["assistants"] },
    });
  } catch (error) {
    console.error("Failed to fetch assistants:", error);
    return null;
  }
}

export async function getChatMessages(assistantId: number) {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  try {
    const data = await serverRequest<any[]>(`/assistant/${assistantId}/chat-messages`, {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 0, tags: ["chat-messages", `assistant-${assistantId}`] },
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const normalized = data
      .map((msg: any) => ({
        ...msg,
        id: msg.id || msg.message_id || String(msg.timestamp || Date.now()),
        role: msg.role || (msg.message_type === "user" ? "user" : "assistant"),
        content: msg.content || msg.message || msg.text || "",
        timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        created_at: msg.created_at || msg.timestamp,
      }))
      .filter((msg: any) => msg.content && msg.role)
      .sort((a, b) => {
        const timeA = new Date(a.timestamp || a.created_at || 0).getTime();
        const timeB = new Date(b.timestamp || b.created_at || 0).getTime();
        return timeA - timeB;
      });

    return normalized;
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return [];
  }
}

export async function getAssistantById(id: number) {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await serverRequest<any>(`/assistant/${id}`, {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 60, tags: ["assistants", `assistant-${id}`] },
    });
  } catch (error) {
    console.error("Failed to fetch assistant:", error);
    return null;
  }
}

export async function getAssistantDatasets(id: number) {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  try {
    const response = await serverRequest<{ current?: number[] } | number[]>(
      `/assistant/get-datasets/${id}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        next: { revalidate: 60, tags: ["assistants", `assistant-${id}`] },
      }
    );

    const data = Array.isArray(response) ? response : response.current || [];
    return data
      .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
      .filter((id) => !isNaN(id));
  } catch (error) {
    console.error("Failed to fetch assistant datasets:", error);
    return [];
  }
}

export async function getDatasets() {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await serverRequest<any[]>("/datasets/", {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 30, tags: ["datasets"] },
    });
  } catch (error) {
    console.error("Failed to fetch datasets:", error);
    return null;
  }
}

export async function getDatasetById(id: number) {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await serverRequest<any>(`/datasets/${id}`, {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 60, tags: ["datasets", `dataset-${id}`] },
    });
  } catch (error) {
    console.error("Failed to fetch dataset:", error);
    return null;
  }
}

export async function getDocumentsByDataset(datasetId: number) {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  try {
    return await serverRequest<any[]>(`/document/by-dataset/${datasetId}`, {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 30, tags: ["documents", `dataset-${datasetId}`] },
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
}

export async function getCurrentUser() {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await serverRequest<{
      id: string;
      email: string;
      name: string;
    }>("/auth/me", {
      method: "GET",
      token,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
