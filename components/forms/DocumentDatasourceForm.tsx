"use client";

import { useState } from "react";

interface DocumentDatasourceFormProps {
  onSubmit: (data: { title: string; url: string }) => void;
  onCancel: () => void;
  initialData?: {
    title?: string;
    url?: string;
  };
}

export default function DocumentDatasourceForm({
  onSubmit,
  onCancel,
  initialData,
}: DocumentDatasourceFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, url });
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter datasource title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url" className="form-label">
          Website URL
        </label>
        <input
          id="url"
          type="url"
          className="form-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? "Update" : "Create"} Datasource
        </button>
      </div>
    </form>
  );
}

