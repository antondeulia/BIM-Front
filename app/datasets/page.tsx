import { getDatasets, getDocumentsByDataset } from "@/lib/server/data";
import { DatasetsClient } from "./DatasetsClient";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function DatasetsPage() {
  const datasets = await getDatasets();

  const datasetsWithDocuments = await Promise.all(
    (datasets || []).map(async (dataset) => {
      const documents = await getDocumentsByDataset(dataset.id);
      return {
        ...dataset,
        documents: documents || [],
        documentCount: documents?.length || 0,
      };
    })
  );

  return <DatasetsClient initialDatasets={datasetsWithDocuments} />;
}
