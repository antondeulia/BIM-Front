"use client";

import { useState, useEffect } from "react";
import { type ChatBot } from "@/lib/chatbots";
import {
  getDatasetsForClient,
  getAssistantDatasetsForClient,
} from "@/lib/server/actions";

interface Dataset {
  id: number;
  title: string;
  desc: string;
  image_url: string;
}

interface ChatBotDatasetsFormProps {
  chatbot: ChatBot;
  onSubmit: (datasetIds: number[]) => void;
  onCancel: () => void;
}

export default function ChatBotDatasetsForm({
  chatbot,
  onSubmit,
  onCancel,
}: ChatBotDatasetsFormProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDatasets = async () => {
    try {
      const result = await getDatasetsForClient();
      if (result.success) {
        setDatasets(result.data);
      } else {
        console.error("Failed to load datasets:", result.error);
      }
    } catch (error) {
      console.error("Failed to load datasets:", error);
    }
  };

  const loadSelectedDatasets = async () => {
    try {
      const result = await getAssistantDatasetsForClient(chatbot.id);
      if (result.success) {
        setSelectedDatasets(result.data);
        console.log(
          "Loaded selected datasets for chatbot",
          chatbot.id,
          ":",
          result.data
        );
      } else {
        console.error("Failed to load selected datasets:", result.error);
        setSelectedDatasets([]);
      }
    } catch (err) {
      console.error("Failed to load selected datasets:", err);
      setSelectedDatasets([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await loadDatasets();
      await loadSelectedDatasets();
      setLoading(false);
    };
    loadAll();
  }, [chatbot.id]);

  const handleToggleDataset = (datasetId: number) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId)
        ? prev.filter((id) => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedDatasets);
    console.log(selectedDatasets);
  };

  if (loading) {
    return (
      <div className="datasets-loading">
        <div className="loading-spinner"></div>
        <p>Loading datasets...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label className="form-label">Select Datasets</label>
        <p className="form-hint">
          Choose which datasets this assistant should have access to.
        </p>
        {datasets.length === 0 ? (
          <div className="datasets-empty-state">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19H6C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17V7Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 9H15M9 13H15M9 17H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p>No datasets available. Create a dataset first.</p>
          </div>
        ) : (
          <div className="datasets-list">
            {datasets.map((dataset) => (
              <label
                key={dataset.id}
                className={`dataset-checkbox-item ${
                  selectedDatasets.includes(dataset.id) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDatasets.includes(dataset.id)}
                  onChange={() => handleToggleDataset(dataset.id)}
                />
                <div className="dataset-checkbox-content">
                  <span className="dataset-checkbox-title">
                    {dataset.title}
                  </span>
                  <span className="dataset-checkbox-desc">{dataset.desc}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={datasets.length === 0}
        >
          Save Datasets
        </button>
      </div>
    </form>
  );
}
