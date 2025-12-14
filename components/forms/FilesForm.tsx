"use client";

import { useState } from "react";

interface FilesFormProps {
  onSubmit: (data: { file: File }) => void;
  onCancel: () => void;
}

export default function FilesForm({ onSubmit, onCancel }: FilesFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit({ file });
      setFile(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      case "xls":
      case "xlsx":
        return "📊";
      default:
        return "📎";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="file" className="form-label">
          Upload File
        </label>
        <div className="file-upload-area">
          <input
            type="file"
            id="file"
            accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx"
            onChange={handleFileChange}
            className="file-input"
            required
          />
          <label htmlFor="file" className="file-upload-label">
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
              Documents (TXT, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, CSV)
            </span>
          </label>
        </div>
        {file && (
          <div className="file-info">
            <div className="file-info-content">
              <span className="file-icon">{getFileIcon(file.name)}</span>
              <div>
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
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
