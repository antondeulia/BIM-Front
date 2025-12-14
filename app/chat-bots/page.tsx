import { getAssistants, getAssistantDatasets, getDatasets } from "@/lib/server/data";
import { ChatBotsClient } from "./ChatBotsClient";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function ChatBotsPage() {
  const [assistants, allDatasets] = await Promise.all([
    getAssistants(),
    getDatasets(),
  ]);

  const assistantsWithDatasets = await Promise.all(
    (assistants || []).map(async (assistant) => {
      const datasetIds = await getAssistantDatasets(assistant.id);
      const datasets = (allDatasets || []).filter((ds) => datasetIds.includes(ds.id));
      return {
        ...assistant,
        datasetIds: datasetIds || [],
        datasets: datasets || [],
      };
    })
  );

  return <ChatBotsClient initialAssistants={assistantsWithDatasets} />;
}
