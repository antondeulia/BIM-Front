import { getAssistantById, getChatMessages } from "@/lib/server/data";
import { ChatPageClient } from "./ChatPageClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatPage({
  params,
}: {
  params: { id: string };
}) {
  const chatbotId = Number(params.id);

  const [assistant, messages] = await Promise.all([
    getAssistantById(chatbotId),
    getChatMessages(chatbotId),
  ]);

  if (!assistant) {
    notFound();
  }

  return (
    <ChatPageClient
      assistant={assistant}
      chatbotId={chatbotId}
      initialMessages={messages || []}
    />
  );
}
