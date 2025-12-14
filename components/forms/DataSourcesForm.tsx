"use client";

import { useState } from "react";

interface DataSourcesFormProps {
  onSubmit: (data: { url: string }) => void;
  onCancel: () => void;
}

export default function DataSourcesForm({
  onSubmit,
  onCancel,
}: DataSourcesFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit({ url: url.trim() });
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="url" className="form-label">
          Data Source URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
          placeholder="https://example.com/data-source"
          required
        />
        <p className="form-hint">
          Enter a valid URL to connect as a data source
        </p>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Create
        </button>
      </div>
    </form>
  );
}
