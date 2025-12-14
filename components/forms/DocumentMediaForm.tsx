"use client";

import { useState } from "react";

interface DocumentMediaFormProps {
  onSubmit: (data: {
    title: string;
    url: string;
    mediaType: "photo" | "video";
    file?: File;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title?: string;
    url?: string;
    mediaType?: "photo" | "video";
  };
}

export default function DocumentMediaForm({
  onSubmit,
  onCancel,
  initialData,
}: DocumentMediaFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [mediaType, setMediaType] = useState<"photo" | "video">(
    initialData?.mediaType || "photo"
  );
  const [file, setFile] = useState<File | null>(null);
  const [useFileUpload, setUseFileUpload] = useState(!initialData?.url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useFileUpload && file) {
      onSubmit({ title, url: file.name, mediaType, file });
    } else {
      onSubmit({ title, url, mediaType });
    }
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
          placeholder="Enter document title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="mediaType" className="form-label">
          Media Type
        </label>
        <select
          id="mediaType"
          className="form-input"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as "photo" | "video")}
          required
        >
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Method</label>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="radio"
              checked={useFileUpload}
              onChange={() => setUseFileUpload(true)}
            />
            Upload File
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="radio"
              checked={!useFileUpload}
              onChange={() => setUseFileUpload(false)}
            />
            Enter URL
          </label>
        </div>

        {useFileUpload ? (
          <div className="file-upload-area">
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept={mediaType === "photo" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              required={!initialData}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{file ? file.name : `Choose ${mediaType === "photo" ? "photo" : "video"} file`}</span>
              <span className="file-upload-hint">
                {mediaType === "photo" ? "PNG, JPG, GIF up to 10MB" : "MP4, MOV, AVI up to 100MB"}
              </span>
            </label>
          </div>
        ) : (
          <input
            id="url"
            type="url"
            className="form-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg or https://example.com/video.mp4"
            required
          />
        )}
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

