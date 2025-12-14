"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/components/Modal";
import DocumentTextForm from "@/components/forms/DocumentTextForm";
import DocumentMediaForm from "@/components/forms/DocumentMediaForm";
import DocumentFileForm from "@/components/forms/DocumentFileForm";
import DocumentDatasourceForm from "@/components/forms/DocumentDatasourceForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/contexts/ToastContext";
import { createTextDocument, deleteDocument } from "@/lib/server/actions";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  type: "text" | "media" | "file" | "datasource";
  datasetId: number;
  content?: string;
  url?: string;
  fileType?: string;
  mediaType?: "photo" | "video";
  createdAt: string;
  updatedAt: string;
}

interface Dataset {
  id: number;
  title: string;
  desc: string;
  image_url: string;
}

type DocumentType = "text" | "media" | "file" | "datasource" | null;
type ModalMode = "create" | "edit";

interface DatasetPageClientProps {
  dataset: Dataset;
  initialDocuments: Document[];
  datasetId: number;
}

export function DatasetPageClient({
  dataset,
  initialDocuments,
  datasetId,
}: DatasetPageClientProps) {
  const { success, error } = useToast();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [documentType, setDocumentType] = useState<DocumentType>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<DocumentType | "all">("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateDocument = (type: DocumentType) => {
    setDocumentType(type);
    setModalMode("create");
    setEditingDocument(null);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setDocumentType(document.type);
    setModalMode("edit");
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const result = await deleteDocument(documentId, datasetId);

      if (result.success) {
        success("Document deleted successfully!");
        router.refresh();
        setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      } else {
        error(result.error || "Failed to delete document");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to delete document");
    }
  };

  const handleTextSubmit = async (data: {
    datasetId: number;
    content: string;
  }) => {
    try {
      setIsSubmitting(true);

      if (editingDocument) {
        success("Text document updated successfully!");
        router.refresh();
        closeModal();
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === editingDocument.id
              ? { ...doc, content: data.content }
              : doc
          )
        );
        return;
      }

      const result = await createTextDocument({
        dataset_id: data.datasetId,
        content: data.content,
      });

      if (result.success && result.data) {
        success("Text document created successfully!");
        router.refresh();
        closeModal();
        setDocuments((prev) => [...prev, result.data]);
      } else {
        error(result.error || "Failed to create document");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSubmit = async (data: { datasetId: number; file: File }) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("dataset_id", data.datasetId.toString());
      formData.append("file", data.file);

      const response = await fetch("/api/documents/file", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to create file document",
        }));
        throw new Error(errorData.error || "Failed to create file document");
      }

      const document = await response.json();
      success("File document created successfully!");
      router.refresh();
      closeModal();
      setDocuments((prev) => [
        ...prev,
        {
          id: document.id || String(Date.now()),
          type: "file",
          datasetId: data.datasetId,
          url: document.url || document.file_url,
          fileType: document.file_type || data.file.type,
          createdAt: document.created_at || new Date().toISOString(),
          updatedAt: document.updated_at || new Date().toISOString(),
        },
      ]);
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSubmit = async (data: {
    title: string;
    url: string;
    mediaType: "photo" | "video";
    file?: File;
  }) => {
    success("Media document created successfully!");
    closeModal();
  };

  const handleDatasourceSubmit = async (data: {
    title: string;
    url: string;
  }) => {
    success("Datasource created successfully!");
    closeModal();
  };

  const closeModal = () => {
    setDocumentType(null);
    setEditingDocument(null);
    setIsSubmitting(false);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "text":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12H16M8 8H16M8 16H12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case "media":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 16L10.5 10.5L14.5 14.5L20 9M20 16H4V4H20V16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "file":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "datasource":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60708C11.7643 9.26329 11.0685 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05972 8.24863 9.31026C7.57689 9.5608 6.96688 9.95304 6.46 10.46L3.46 13.46C2.54918 14.403 2.0452 15.6661 2.05659 16.977C2.06798 18.288 2.59282 19.5421 3.51986 20.4691C4.4469 21.3962 5.70097 21.922 7.01195 21.9334C8.32293 21.9448 9.58594 21.4408 10.529 20.53L12.24 18.82"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const documentsByType = {
    text: documents.filter((d) => d.type === "text"),
    media: documents.filter((d) => d.type === "media"),
    file: documents.filter((d) => d.type === "file"),
    datasource: documents.filter((d) => d.type === "datasource"),
  };

  const filteredDocuments =
    filterType === "all"
      ? documents
      : documents.filter((d) => d.type === filterType);

  return (
    <div className="dataset-page">
      <Link href="/datasets" className="back-link">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Datasets
      </Link>

      <div className="dataset-header-compact">
        <div className="dataset-header-compact-image">
          <Image
            src={
              dataset.image_url ||
              "https://images.unsplash.com/photo-1765202665764-ca839162fe4a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={dataset.title}
            fill
            className="dataset-image-compact"
            sizes="80px"
          />
        </div>
        <div className="dataset-header-compact-content">
          <h1 className="dataset-title-compact">{dataset.title}</h1>
          <p className="dataset-description-compact">
            {dataset.desc || "No description"}
          </p>
        </div>
        <div className="dataset-header-compact-meta">
          <span className="dataset-meta-badge">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </span>
        </div>
      </div>

      <div className="dataset-documents-panel">
        <div className="dataset-documents-panel-header">
          <h2 className="dataset-documents-title">Documents</h2>
          <div className="dataset-documents-filters">
            <button
              className={`dataset-filter-button ${
                filterType === "all" ? "active" : ""
              }`}
              onClick={() => setFilterType("all")}
            >
              All ({documents.length})
            </button>
            <button
              className={`dataset-filter-button ${
                filterType === "text" ? "active" : ""
              }`}
              onClick={() => setFilterType("text")}
            >
              Text ({documentsByType.text.length})
            </button>
            <button
              className={`dataset-filter-button ${
                filterType === "media" ? "active" : ""
              }`}
              onClick={() => setFilterType("media")}
            >
              Media ({documentsByType.media.length})
            </button>
            <button
              className={`dataset-filter-button ${
                filterType === "file" ? "active" : ""
              }`}
              onClick={() => setFilterType("file")}
            >
              Files ({documentsByType.file.length})
            </button>
            <button
              className={`dataset-filter-button ${
                filterType === "datasource" ? "active" : ""
              }`}
              onClick={() => setFilterType("datasource")}
            >
              Data Sources ({documentsByType.datasource.length})
            </button>
          </div>
        </div>
        <div className="dataset-documents-panel-actions">
          <div className="dataset-document-create-buttons">
            <button
              className="dataset-create-document-button"
              onClick={() => handleCreateDocument("text")}
              disabled={isSubmitting}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12H16M8 8H16M8 16H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Text</span>
            </button>
            <button
              className="dataset-create-document-button"
              onClick={() => handleCreateDocument("file")}
              disabled={isSubmitting}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>File</span>
            </button>
            <button
              className="dataset-create-document-button dataset-create-document-button-disabled"
              onClick={() => {}}
              disabled={true}
              title="In development"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16L10.5 10.5L14.5 14.5L20 9M20 16H4V4H20V16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Media</span>
              <span className="dataset-create-document-button-badge">
                In development
              </span>
            </button>
            <button
              className="dataset-create-document-button dataset-create-document-button-disabled"
              onClick={() => {}}
              disabled={true}
              title="In development"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60708C11.7643 9.26329 11.0685 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05972 8.24863 9.31026C7.57689 9.5608 6.96688 9.95304 6.46 10.46L3.46 13.46C2.54918 14.403 2.0452 15.6661 2.05659 16.977C2.06798 18.288 2.59282 19.5421 3.51986 20.4691C4.4469 21.3962 5.70097 21.922 7.01195 21.9334C8.32293 21.9448 9.58594 21.4408 10.529 20.53L12.24 18.82"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Data Source</span>
              <span className="dataset-create-document-button-badge">
                In development
              </span>
            </button>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="dataset-documents-empty-state">
            <svg
              width="64"
              height="64"
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
            <h3>No documents yet</h3>
            <p>Create your first document to get started</p>
          </div>
        ) : (
          <div className="dataset-documents-grid">
            {filteredDocuments.map((doc) => {
              const getDocumentTitle = () => {
                if (doc.type === "text") return `Text Document`;
                if (doc.type === "file") return "File Document";
                if (doc.type === "media")
                  return `${
                    doc.mediaType === "photo" ? "Photo" : "Video"
                  }: ${doc.url?.substring(0, 30)}...`;
                if (doc.type === "datasource")
                  return doc.url?.substring(0, 50) || "Data Source";
                return `Document #${doc.id}`;
              };

              const getDocumentPreview = () => {
                if (doc.type === "text")
                  return doc.content?.substring(0, 100) + "...";
                if (doc.type === "file") return doc.url;
                if (doc.type === "media") return doc.url;
                if (doc.type === "datasource") return doc.url;
                return "";
              };

              return (
                <div key={doc.id} className="dataset-document-card">
                  <div className="dataset-document-card-icon">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="dataset-document-card-content">
                    <h4 className="dataset-document-card-title">
                      {getDocumentTitle()}
                    </h4>
                    <p className="dataset-document-card-preview">
                      {getDocumentPreview()}
                    </p>
                    <span className="dataset-document-card-date">
                      Updated{" "}
                      {formatDate(
                        doc.updatedAt ||
                          doc.createdAt ||
                          new Date().toISOString()
                      )}
                    </span>
                  </div>
                  <div className="dataset-document-card-actions">
                    <button
                      className="dataset-document-card-action-button"
                      onClick={() => handleEditDocument(doc)}
                      title="Edit"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="dataset-document-card-action-button dataset-document-card-action-delete"
                      onClick={() => handleDeleteDocument(doc.id)}
                      title="Delete"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Document Modals */}
      <Modal
        isOpen={documentType === "text"}
        onClose={closeModal}
        title={
          modalMode === "edit" ? "Edit Text Document" : "Create Text Document"
        }
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating document...</p>
          </div>
        ) : (
          <DocumentTextForm
            onSubmit={handleTextSubmit}
            onCancel={closeModal}
            datasetId={datasetId}
            initialText={editingDocument?.content}
          />
        )}
      </Modal>

      <Modal
        isOpen={documentType === "file"}
        onClose={closeModal}
        title={
          modalMode === "edit" ? "Edit File Document" : "Create File Document"
        }
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating document...</p>
          </div>
        ) : (
          <DocumentFileForm
            datasetId={datasetId}
            onSubmit={handleFileSubmit}
            onCancel={closeModal}
            initialData={editingDocument || undefined}
          />
        )}
      </Modal>

      <Modal
        isOpen={documentType === "media"}
        onClose={closeModal}
        title={
          modalMode === "edit" ? "Edit Media Document" : "Create Media Document"
        }
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating document...</p>
          </div>
        ) : (
          <DocumentMediaForm
            onSubmit={handleMediaSubmit}
            onCancel={closeModal}
            initialData={editingDocument || undefined}
          />
        )}
      </Modal>

      <Modal
        isOpen={documentType === "datasource"}
        onClose={closeModal}
        title={modalMode === "edit" ? "Edit Datasource" : "Create Datasource"}
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating datasource...</p>
          </div>
        ) : (
          <DocumentDatasourceForm
            onSubmit={handleDatasourceSubmit}
            onCancel={closeModal}
            initialData={editingDocument || undefined}
          />
        )}
      </Modal>
    </div>
  );
}
