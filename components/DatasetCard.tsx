"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteDataset } from "@/lib/server/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

interface DatasetCardProps {
  dataset: any;
  onDelete?: (datasetId: number) => void;
}

export default function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { success, error: showError } = useToast();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const documents = dataset.documents || [];
  const previewDocuments = documents.slice(0, 3);
  const hasMoreDocuments = documents.length > 3;

  const getDocumentPreview = (doc: any) => {
    if (doc.type === "text") {
      return doc.content?.substring(0, 40) + "..." || "Text document";
    }
    if (doc.type === "file") {
      return doc.url?.split("/").pop()?.substring(0, 30) || "File";
    }
    if (doc.type === "media") {
      return doc.url?.substring(0, 30) || "Media";
    }
    if (doc.type === "datasource") {
      return doc.url?.substring(0, 30) || "Data source";
    }
    return "Document";
  };

  return (
    <div className="project-card">
      <Link href={`/datasets/${dataset.id}`} className="project-card-link">
        <div className="project-card-content-wrapper">
          <div className="project-card-image-container-small">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={dataset.title}
              fill
              className="project-card-image-small"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="project-card-content">
            <h3 className="project-card-title">{dataset.title}</h3>
            <p className="project-card-description">
              {dataset.desc || "No description"}
            </p>

            {documents.length > 0 && (
              <div className="project-card-documents-preview project-card-documents-preview-highlighted">
                {previewDocuments.map((doc: any, index: number) => (
                  <div
                    key={doc.id || index}
                    className={`project-card-document-item ${
                      index >= 2 && hasMoreDocuments
                        ? "project-card-document-item-faded"
                        : ""
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19H6C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17V7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="project-card-document-text">
                      {getDocumentPreview(doc)}
                    </span>
                  </div>
                ))}
                {hasMoreDocuments && (
                  <div className="project-card-document-item project-card-document-item-more">
                    <span className="project-card-document-text">
                      +{documents.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="project-card-meta">
              <span className="project-card-documents">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19H6C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {dataset.documentCount || documents.length || 0} documents
              </span>
              <span className="project-card-date">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {dataset.created_at
                  ? new Date(dataset.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <button
        className="project-card-menu-button"
        onClick={(e) => {
          e.preventDefault();
          setIsMenuOpen(!isMenuOpen);
        }}
        aria-label="More options"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="5" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="project-card-menu" ref={menuRef}>
          <button className="menu-item-edit">Edit</button>
          <button
            className="menu-item-delete"
            onClick={async (e) => {
              e.preventDefault();
              if (
                confirm(
                  `Are you sure you want to delete "${dataset.title}"? This action cannot be undone.`
                )
              ) {
                try {
                  setIsDeleting(true);
                  const result = await deleteDataset(dataset.id);
                  if (result.success) {
                    success("Dataset deleted successfully!");
                    if (onDelete) {
                      onDelete(dataset.id);
                    }
                    router.refresh();
                  } else {
                    showError(result.error || "Failed to delete dataset");
                  }
                } catch (err) {
                  showError(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete dataset"
                  );
                } finally {
                  setIsDeleting(false);
                  setIsMenuOpen(false);
                }
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
