"use client";

import { useState, useEffect } from "react";
import { type ChatBot } from "@/lib/chatbots";

interface ChatBotSettingsFormProps {
  chatbot?: ChatBot | null;
  onSubmit: (data: {
    name: string;
    desc?: string | null;
    provider: string;
    model: string;
    temperature: number;
  }) => void;
  onCancel: () => void;
}

const PROVIDERS = ["openai", "gemini"] as const;

const MODELS_BY_PROVIDER: Record<string, string[]> = {
  openai: ["gpt-5.1", "gpt-5.2", "gpt-5-nano"],
  gemini: ["gemini-2.5-flash", "gemini-3-pro-preview"],
};

export default function ChatBotSettingsForm({
  chatbot,
  onSubmit,
  onCancel,
}: ChatBotSettingsFormProps) {
  const [name, setName] = useState(chatbot?.name ?? "");
  const [desc, setDesc] = useState(chatbot?.desc ?? "");
  const [provider, setProvider] = useState(chatbot?.provider ?? "openai");
  const [temperature, setTemperature] = useState(chatbot?.temperature ?? 0.7);

  const initialProvider = chatbot?.provider || "openai";
  const initialModels = MODELS_BY_PROVIDER[initialProvider] ?? [];

  const [availableModels, setAvailableModels] = useState<string[]>(initialModels);

  const [model, setModel] = useState(
    chatbot?.model && initialModels.includes(chatbot.model)
      ? chatbot.model
      : initialModels[0] ?? ""
  );

  useEffect(() => {
    const models = MODELS_BY_PROVIDER[provider] ?? [];
    setAvailableModels(models);

    if (models.length > 0) {
      setModel((currentModel) => {
        if (!currentModel || !models.includes(currentModel)) {
          return models[0];
        }
        return currentModel;
      });
    } else {
      setModel("");
    }
  }, [provider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name,
      desc: desc || null,
      provider,
      model,
      temperature,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      {/* NAME */}
      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter chatbot name"
          required
        />
      </div>

      {/* PROVIDER */}
      <div className="form-group">
        <label className="form-label">Provider</label>
        <select
          className="form-input"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* MODEL */}
      <div className="form-group">
        <label className="form-label">Model</label>
        <select
          className="form-input"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={availableModels.length === 0}
        >
          {availableModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* TEMPERATURE */}
      <div className="form-group">
        <label className="form-label">
          Temperature: {temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
      </div>

      {/* SYSTEM PROMPT */}
      <div className="form-group">
        <label className="form-label">System Prompt</label>
        <textarea
          className="form-textarea"
          rows={6}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter system prompt for the chatbot..."
        />
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Apply Changes
        </button>
      </div>
    </form>
  );
}
