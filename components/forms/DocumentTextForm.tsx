"use client";

import { useState, useEffect } from "react";

interface DocumentTextFormProps {
  onSubmit: (data: { datasetId: number; content: string }) => void;
  onCancel: () => void;
  datasetId: number;
  initialText?: string;
}

export default function DocumentTextForm({
  onSubmit,
  onCancel,
  datasetId,
  initialText,
}: DocumentTextFormProps) {
  const [content, setContent] = useState(initialText || "");

  useEffect(() => {
    if (initialText !== undefined) {
      setContent(initialText);
    }
  }, [initialText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ datasetId, content });
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="content" className="form-label">
          Text Content
        </label>
        <textarea
          id="content"
          className="form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter text content..."
          required
          rows={10}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialText ? "Update Document" : "Create Document"}
        </button>
      </div>
    </form>
  );
}
