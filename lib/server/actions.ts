"use server";

import { cookies } from "next/headers";
import { serverRequest } from "./api";
import { revalidateTag, revalidatePath } from "next/cache";

async function getAuthToken(): Promise<string | null> {
  return cookies().get("access_token")?.value ?? null;
}

export async function sendChatMessage(assistantId: number, message: string) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await serverRequest<any>(`/assistant/${assistantId}/chat`, {
      method: "POST",
      body: { message },
      token,
    });

    revalidateTag("chat-messages");
    revalidateTag(`assistant-${assistantId}`);
    revalidatePath(`/chat-bots/${assistantId}`);

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function createAssistant(data: {
  name: string;
  desc?: string | null;
  model: string;
  temperature: number;
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const assistant = await serverRequest<any>("/assistant", {
      method: "POST",
      body: data,
      token,
      cache: "no-store",
    });

    revalidateTag("assistants");
    revalidatePath("/chat-bots");

    return { success: true, data: assistant };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create assistant",
    };
  }
}

export async function updateAssistant(
  id: number,
  data: {
    name?: string;
    desc?: string | null;
    model?: string;
    temperature?: number;
  }
) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const assistant = await serverRequest<any>(`/assistant/${id}`, {
      method: "PUT",
      body: data,
      token,
      cache: "no-store",
    });

    revalidateTag("assistants");
    revalidateTag(`assistant-${id}`);
    revalidatePath("/chat-bots");
    revalidatePath(`/chat-bots/${id}`);

    return { success: true, data: assistant };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update assistant",
    };
  }
}

export async function deleteAssistant(id: number) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    await serverRequest(`/assistant/${id}`, {
      method: "DELETE",
      token,
      cache: "no-store",
    });

    revalidateTag("assistants");
    revalidatePath("/chat-bots");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete assistant",
    };
  }
}

export async function updateAssistantDatasets(
  id: number,
  datasetIds: number[]
) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    await serverRequest(`/assistant/${id}/datasets`, {
      method: "PUT",
      body: { dataset_ids: datasetIds },
      token,
      cache: "no-store",
    });

    revalidateTag("assistants");
    revalidateTag(`assistant-${id}`);
    revalidatePath(`/chat-bots/${id}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update assistant datasets",
    };
  }
}

export async function createDataset(data: {
  title: string;
  desc: string;
  image_url: string;
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const dataset = await serverRequest<any>("/datasets/", {
      method: "POST",
      body: data,
      token,
      cache: "no-store",
    });

    revalidateTag("datasets");
    revalidatePath("/datasets");

    return { success: true, data: dataset };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create dataset",
    };
  }
}

export async function updateDataset(
  id: number,
  data: {
    title?: string;
    desc?: string;
    image_url?: string;
  }
) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const dataset = await serverRequest<any>(`/datasets/${id}`, {
      method: "PUT",
      body: data,
      token,
      cache: "no-store",
    });

    revalidateTag("datasets");
    revalidateTag(`dataset-${id}`);
    revalidatePath("/datasets");
    revalidatePath(`/datasets/${id}`);

    return { success: true, data: dataset };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update dataset",
    };
  }
}

export async function deleteDataset(id: number) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    await serverRequest(`/datasets/${id}`, {
      method: "DELETE",
      token,
      cache: "no-store",
    });

    revalidateTag("datasets");
    revalidatePath("/datasets");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete dataset",
    };
  }
}

export async function createTextDocument(data: {
  dataset_id: number;
  content: string;
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const document = await serverRequest<any>("/document/text", {
      method: "POST",
      body: data,
      token,
      cache: "no-store",
    });

    revalidateTag("documents");
    revalidateTag(`dataset-${data.dataset_id}`);
    revalidatePath(`/datasets/${data.dataset_id}`);

    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create document",
    };
  }
}

export async function createFileDocument(data: {
  dataset_id: number;
  file: File;
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const formData = new FormData();
    formData.append("dataset_id", String(data.dataset_id));
    formData.append("file", data.file);

    const document = await serverRequest<any>("/document/file", {
      method: "POST",
      body: formData,
      token,
      cache: "no-store",
    });

    revalidateTag("documents");
    revalidateTag(`dataset-${data.dataset_id}`);
    revalidatePath(`/datasets/${data.dataset_id}`);

    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create document",
    };
  }
}

export async function deleteDocument(id: string, datasetId?: number) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    await serverRequest(`/document/${id}`, {
      method: "DELETE",
      token,
      cache: "no-store",
    });

    revalidateTag("documents");
    if (datasetId) {
      revalidateTag(`dataset-${datasetId}`);
      revalidatePath(`/datasets/${datasetId}`);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete document",
    };
  }
}

export async function getDatasetsForClient() {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, data: [], error: "Unauthorized" };
  }

  try {
    const datasets = await serverRequest<any[]>("/datasets/", {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 30, tags: ["datasets"] },
    });

    return { success: true, data: datasets || [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch datasets",
    };
  }
}

export async function getAssistantDatasetsForClient(assistantId: number) {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, data: [], error: "Unauthorized" };
  }

  try {
    const response = await serverRequest<{ current?: number[] } | number[]>(
      `/assistant/get-datasets/${assistantId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        next: {
          revalidate: 60,
          tags: ["assistants", `assistant-${assistantId}`],
        },
      }
    );

    const data = Array.isArray(response) ? response : response.current || [];
    const datasetIds = data
      .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
      .filter((id) => !isNaN(id));

    return { success: true, data: datasetIds };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch assistant datasets",
    };
  }
}
