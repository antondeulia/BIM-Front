import { getDatasetById, getDocumentsByDataset } from "@/lib/server/data";
import { DatasetPageClient } from "./DatasetPageClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function DatasetPage({
  params,
}: {
  params: { id: string };
}) {
  const datasetId = Number(params.id);

  const [dataset, documents] = await Promise.all([
    getDatasetById(datasetId),
    getDocumentsByDataset(datasetId),
  ]);

  if (!dataset) {
    notFound();
  }

  return (
    <DatasetPageClient
      dataset={dataset}
      initialDocuments={documents}
      datasetId={datasetId}
    />
  );
}
