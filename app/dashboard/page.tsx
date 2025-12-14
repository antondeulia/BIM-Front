import { getAssistants, getDatasets } from "@/lib/server/data";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 30;

interface DashboardStats {
  assistants: number;
  datasets: number;
  totalMessages: number;
  totalDocuments: number;
}

export default async function DashboardPage() {
  const [assistants, datasets] = await Promise.all([
    getAssistants(),
    getDatasets(),
  ]);

  const stats: DashboardStats = {
    assistants: assistants?.length || 0,
    datasets: datasets?.length || 0,
    totalMessages: 0,
    totalDocuments: 0,
  };

  return <DashboardClient stats={stats} />;
}
