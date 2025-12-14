"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/contexts/ToastContext";
import { sendChatMessage } from "@/lib/server/actions";

interface Assistant {
  id: number;
  name: string;
  desc: string;
  provider: string;
  model: string;
  temperature: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  created_at?: Date | string;
}

interface ChatPageClientProps {
  assistant: Assistant;
  chatbotId: number;
  initialMessages: ChatMessage[];
}

export function ChatPageClient({
  assistant,
  chatbotId,
  initialMessages,
}: ChatPageClientProps) {
  const router = useRouter();
  const { error } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousAssistantCountRef = useRef<number>(
    initialMessages.filter((m) => m.role === "assistant").length
  );

  useEffect(() => {
    const newAssistantCount = initialMessages.filter(
      (m) => m.role === "assistant"
    ).length;

    if (newAssistantCount > previousAssistantCountRef.current) {
      setMessages(initialMessages);
      previousAssistantCountRef.current = newAssistantCount;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setIsSending(false);
    } else {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, isSending]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const messageText = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();

    try {
      const result = await sendChatMessage(chatbotId, messageText);

      console.log(result);

      if (!result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      const currentAssistantCount = messages.filter(
        (m) => m.role === "assistant"
      ).length;
      previousAssistantCountRef.current = currentAssistantCount;
    } catch (err) {
      setIsSending(false);
      error(err instanceof Error ? err.message : "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button
          className="chat-back-button"
          onClick={() => router.push("/chat-bots")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <div className="chat-header-avatar-initials">
              {getInitials(assistant.name)}
            </div>
            <div
              className="chat-header-status"
              style={{ background: "#10b981" }}
            />
          </div>
          <div className="chat-header-text">
            <h2>{assistant.name}</h2>
            <p>{assistant.desc || "AI Assistant"}</p>
          </div>
        </div>
      </div>

      <div className="chat-messages-wrapper" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-avatar">
              {getInitials(assistant.name)}
            </div>
            <h3>Start a conversation</h3>
            <p>Send a message to begin chatting with {assistant.name}</p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${
                  message.role === "user"
                    ? "chat-message-user"
                    : "chat-message-assistant"
                }`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div className="chat-message-content">
                  <div className="chat-message-text">{message.content}</div>
                  <span className="chat-message-time">
                    {new Date(
                      message.timestamp || message.created_at || Date.now()
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="chat-message chat-message-assistant">
                <div className="chat-message-content">
                  <div className="chat-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <form onSubmit={handleSubmit} className="chat-input-form">
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              disabled={isSending}
              rows={1}
            />
            <button
              type="submit"
              className="chat-send-button"
              disabled={!inputValue.trim() || isSending}
            >
              {isSending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L9 11M18 2l-7 7M18 2l-7 7-2-2-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
