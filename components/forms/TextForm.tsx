"use client";

import { useState } from "react";

interface TextFormProps {
  onSubmit: (data: { text: string }) => void;
  onCancel: () => void;
}

export default function TextForm({ onSubmit, onCancel }: TextFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text: text.trim() });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="text" className="form-label">
          Text Content
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-textarea"
          placeholder="Enter your text here..."
          rows={10}
          required
        />
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
