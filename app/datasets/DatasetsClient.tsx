"use client";

import { useState } from "react";
import DatasetCard from "@/components/DatasetCard";
import Modal from "@/components/Modal";
import DatasetForm from "@/components/forms/DatasetForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/contexts/ToastContext";
import { createDataset } from "@/lib/server/actions";
import { useRouter } from "next/navigation";

interface Dataset {
  id: number;
  title: string;
  desc: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  documents?: any[];
  documentCount?: number;
}

interface DatasetsClientProps {
  initialDatasets: Dataset[];
}

export function DatasetsClient({ initialDatasets }: DatasetsClientProps) {
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const handleCreateDataset = async (data: {
    title: string;
    description: string;
    imageUrl: string;
  }) => {
    try {
      setIsSubmitting(true);
      const result = await createDataset({
        title: data.title,
        desc: data.description,
        image_url: data.imageUrl,
      });

      if (result.success && result.data) {
        success("Dataset created successfully!");
        setIsCreateModalOpen(false);
        router.refresh();
        setDatasets((prev) => [...prev, result.data]);
      } else {
        error(result.error || "Failed to create dataset");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create dataset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDataset = (datasetId: number) => {
    setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <h1>Datasets</h1>
        <button
          className="add-dataset-button"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isSubmitting}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Datasets
        </button>
      </div>

      {datasets.length === 0 ? (
        <div className="empty-state">
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
          <h3>No datasets yet</h3>
          <p>Create your first dataset to get started</p>
        </div>
      ) : (
        <div className="datasets-grid">
          {datasets.map((dataset) => (
            <DatasetCard 
              key={dataset.id} 
              dataset={dataset} 
              onDelete={handleDeleteDataset}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
        title="Create Dataset"
      >
        {isSubmitting ? (
          <div className="form-loading">
            <LoadingSpinner size="md" />
            <p>Creating dataset...</p>
          </div>
        ) : (
          <DatasetForm
            onSubmit={handleCreateDataset}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
