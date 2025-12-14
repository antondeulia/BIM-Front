"use client";

import { useState } from "react";

interface MediaFormProps {
  onSubmit: (data: { file: File }) => void;
  onCancel: () => void;
}

export default function MediaForm({ onSubmit, onCancel }: MediaFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit({ file });
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="media" className="form-label">
          Upload Media or Video
        </label>
        <div className="file-upload-area">
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="file-input"
            required
          />
          <label htmlFor="media" className="file-upload-label">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Click to upload or drag and drop</span>
            <span className="file-upload-hint">
              Images and videos (PNG, JPG, GIF, MP4, etc.)
            </span>
          </label>
        </div>
        {preview && (
          <div className="file-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        {file && !preview && (
          <div className="file-info">
            <p>Selected: {file.name}</p>
            <p className="file-size">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={!file}>
          Create
        </button>
      </div>
    </form>
  );
}
