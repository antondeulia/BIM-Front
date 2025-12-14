import { getAssistants } from "@/lib/server/data";
import { ChatBotsClient } from "./ChatBotsClient";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function ChatBotsPage() {
  const assistants = await getAssistants();

  return <ChatBotsClient initialAssistants={assistants || []} />;
}
