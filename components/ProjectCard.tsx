"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(project);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete(project.id);
  };

  return (
    <div className="project-card">
      <Link href={`/data/projects/${project.id}`} className="project-card-link">
        <div className="project-card-image-container">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="project-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="project-card-content">
          <h3 className="project-card-title">{project.title}</h3>
          <p className="project-card-description">{project.description}</p>
          <p className="project-card-date">
            Updated {formatDate(project.lastUpdated)}
          </p>
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
          <button className="menu-item-edit" onClick={handleEdit}>
            Edit
          </button>
          <button className="menu-item-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
