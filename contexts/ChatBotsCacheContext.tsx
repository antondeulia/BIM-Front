/**
 * @deprecated This context is no longer used.
 * Chatbots are now fetched on the server and passed as props to Client Components.
 * Server-side caching is handled by Next.js cache tags and revalidation.
 * 
 * This file can be safely removed once all references are updated.
 */

"use client";

import React, { createContext, useContext } from "react";

interface ChatBotsCacheContextType {
  chatbots: never[];
  isLoading: boolean;
  loadChatbots: (force?: boolean) => Promise<void>;
  getChatbotById: (id: number) => undefined;
  invalidateCache: () => void;
}

const ChatBotsCacheContext = createContext<
  ChatBotsCacheContextType | undefined
>(undefined);

export function ChatBotsCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function useChatBotsCache() {
  const context = useContext(ChatBotsCacheContext);
  if (!context) {
    throw new Error(
      "useChatBotsCache must be used within ChatBotsCacheProvider"
    );
  }
  return context;
}
