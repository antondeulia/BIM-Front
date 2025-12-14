'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatBotCard from '@/components/ChatBotCard';
import Modal from '@/components/Modal';
import ChatBotSettingsForm from '@/components/forms/ChatBotSettingsForm';
import ChatBotDatasetsForm from '@/components/forms/ChatBotDatasetsForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';
import {
  createAssistant,
  updateAssistant,
  updateAssistantDatasets,
} from '@/lib/server/actions';

interface Assistant {
  id: number;
  name: string;
  desc: string;
  provider: string;
  model: string;
  temperature: number;
}

interface CreateAssistantDto {
  name: string;
  desc?: string | null;
  model: string;
  temperature: number;
}

interface ChatBotsClientProps {
  initialAssistants: Assistant[];
}

export function ChatBotsClient({
  initialAssistants,
}: ChatBotsClientProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [assistants, setAssistants] = useState<Assistant[]>(initialAssistants);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState<number | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [datasetsModalOpen, setDatasetsModalOpen] = useState(false);

  const [selectedChatbot, setSelectedChatbot] = useState<Assistant | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAssistants(initialAssistants);
  }, [initialAssistants]);

  const handleAddChatBot = async (data: CreateAssistantDto) => {
    try {
      setIsSubmitting(true);
      const result = await createAssistant(data);

      if (result.success && result.data) {
        success('Assistant created successfully!');
        setCreateModalOpen(false);
        router.refresh();
        setAssistants((prev) => [...prev, result.data]);
      } else {
        error(result.error || 'Failed to create assistant');
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create assistant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettings = (chatbot: Assistant) => {
    setSelectedChatbot(chatbot);
    setSettingsModalOpen(true);
  };

  const handleSettingsSubmit = async (data: CreateAssistantDto) => {
    if (!selectedChatbot) return;
    try {
      setIsSubmitting(true);
      const result = await updateAssistant(selectedChatbot.id, data);

      if (result.success && result.data) {
        success('Settings updated successfully!');
        router.refresh();
        setSettingsModalOpen(false);
        setSelectedChatbot(null);
        setAssistants((prev) =>
          prev.map((cb) => (cb.id === selectedChatbot.id ? result.data : cb))
        );
      } else {
        error(result.error || 'Failed to update settings');
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDatasetsSubmit = async (datasetIds: number[]) => {
    if (!selectedChatbot) return;
    try {
      setIsSubmitting(true);
      const result = await updateAssistantDatasets(
        selectedChatbot.id,
        datasetIds
      );

      if (result.success) {
        success('Datasets updated successfully!');
        setDatasetsModalOpen(false);
        setSelectedChatbot(null);
        router.refresh();
      } else {
        error(result.error || 'Failed to update datasets');
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update datasets');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDatasets = (chatbot: Assistant) => {
    setSelectedChatbot(chatbot);
    setDatasetsModalOpen(true);
  };

  const handleChat = async (chatbot: Assistant) => {
    setIsNavigating(chatbot.id);
    router.push(`/chat-bots/${chatbot.id}`);
  };

  const filteredAssistants = assistants.filter((chatbot) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      chatbot.name.toLowerCase().includes(query) ||
      chatbot.desc?.toLowerCase().includes(query) ||
      chatbot.model.toLowerCase().includes(query)
    );
  });

  return (
    <div className="chatbots-page">
      <div className="chatbots-page-header">
        <h1>Chat Bots</h1>
        <button
          className="add-chatbot-button"
          onClick={() => setCreateModalOpen(true)}
          disabled={isSubmitting}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Chat Bot
        </button>
      </div>

      <div className="chatbots-search-container">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search chat bots by name, description, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!filteredAssistants.length ? (
        <>You don&apos;t have any assistants created</>
      ) : (
        <div className="chatbots-grid">
          {filteredAssistants.map((chatbot) => (
            <ChatBotCard
              key={chatbot.id}
              chatbot={chatbot}
              onSettings={() => handleSettings(chatbot)}
              onDatasets={() => handleDatasets(chatbot)}
              onChat={() => handleChat(chatbot)}
              isLoading={isNavigating === chatbot.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={createModalOpen}
        onClose={() => !isSubmitting && setCreateModalOpen(false)}
        title="Create Chat Bot"
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating assistant...</p>
          </div>
        ) : (
          <ChatBotSettingsForm
            chatbot={selectedChatbot}
            onSubmit={handleAddChatBot}
            onCancel={() => setCreateModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={settingsModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setSettingsModalOpen(false);
            setSelectedChatbot(null);
          }
        }}
        title={`Settings – ${selectedChatbot?.name ?? ''}`}
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Saving settings...</p>
          </div>
        ) : selectedChatbot ? (
          <ChatBotSettingsForm
            chatbot={selectedChatbot}
            onSubmit={handleSettingsSubmit}
            onCancel={() => {
              setSettingsModalOpen(false);
              setSelectedChatbot(null);
            }}
          />
        ) : null}
      </Modal>

      <Modal
        isOpen={datasetsModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setDatasetsModalOpen(false);
            setSelectedChatbot(null);
          }
        }}
        title={`Datasets – ${selectedChatbot?.name ?? ''}`}
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Saving datasets...</p>
          </div>
        ) : selectedChatbot ? (
          <ChatBotDatasetsForm
            chatbot={selectedChatbot}
            onSubmit={handleDatasetsSubmit}
            onCancel={() => {
              setDatasetsModalOpen(false);
              setSelectedChatbot(null);
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

