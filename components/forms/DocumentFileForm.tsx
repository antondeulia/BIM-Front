"use client";

import { useState } from "react";

interface DocumentFileFormProps {
  onSubmit: (data: {
    datasetId: number;
    file: File;
  }) => void;
  onCancel: () => void;
  initialData?: {
    url?: string;
    fileType?: string;
  };
  datasetId: number;
}

export default function DocumentFileForm({
  onSubmit,
  onCancel,
  initialData,
  datasetId,
}: DocumentFileFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit({ datasetId, file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="file-upload" className="form-label">
          Upload File
        </label>
          <div className="file-upload-area">
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv"
              onChange={handleFileChange}
            required
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{file ? file.name : "Choose file"}</span>
              <span className="file-upload-hint">
                PDF, TXT, DOC, DOCX, XLS, XLSX, PPT, PPTX, CSV up to 50MB
              </span>
            </label>
          </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? "Update" : "Create"} Document
        </button>
      </div>
    </form>
  );
}
