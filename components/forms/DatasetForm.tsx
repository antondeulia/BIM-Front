"use client";

import { useState } from "react";

interface DatasetFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    imageUrl: string;
  };
}

export default function DatasetForm({
  onSubmit,
  onCancel,
  initialData,
}: DatasetFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, imageUrl });
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
          placeholder="Enter dataset title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter dataset description"
          required
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl" className="form-label">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="url"
          className="form-input"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? "Update" : "Create"} Dataset
        </button>
      </div>
    </form>
  );
}
