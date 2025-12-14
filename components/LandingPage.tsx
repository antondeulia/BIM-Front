"use client";

import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="landing-page"
        style={{
          background: `linear-gradient(135deg, 
            hsl(${220 + mousePosition.x * 0.1}, 70%, 15%) 0%, 
            hsl(${230 + mousePosition.x * 0.05}, 60%, 20%) 25%, 
            hsl(${240 + mousePosition.y * 0.05}, 55%, 25%) 50%, 
            hsl(${250 + mousePosition.x * 0.03}, 50%, 30%) 75%, 
            hsl(${260 + mousePosition.y * 0.03}, 45%, 35%) 100%)`,
        }}
      >
        <div className="landing-hero">
          <div className="landing-container">
            <header className="landing-header">
              <div className="landing-logo">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>BIM Test</span>
              </div>
              <button
                className="landing-login-button"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Log in
              </button>
            </header>

            <div className="landing-hero-content">
              <div className="landing-hero-text">
                <h1 className="landing-title">
                  Fine-tune RAG models
                  <span className="landing-title-gradient">
                    {" "}
                    with your data
                  </span>
                </h1>
                <p className="landing-subtitle">
                  Create intelligent chatbots powered by your documents,
                  datasets, and knowledge base. Train custom AI models that
                  understand your domain and deliver accurate, contextual
                  responses.
                </p>
                <div className="landing-cta">
                  <button
                    className="landing-cta-primary"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Get Started
                  </button>
                  <button
                    className="landing-cta-secondary"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="landing-hero-visual">
                <div className="landing-visual-card">
                  <div className="landing-visual-header">
                    <div className="landing-visual-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="landing-visual-content">
                    <div className="landing-chat-message">
                      <div className="landing-message-avatar"></div>
                      <div className="landing-message-bubble">
                        <p>How can I help you today?</p>
                      </div>
                    </div>
                    <div className="landing-chat-message landing-chat-user">
                      <div className="landing-message-bubble landing-message-user">
                        <p>Tell me about your features</p>
                      </div>
                    </div>
                    <div className="landing-chat-message">
                      <div className="landing-message-avatar"></div>
                      <div className="landing-message-bubble">
                        <p>
                          BIM Test allows you to create custom chatbots
                          trained on your data...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-features">
          <div className="landing-container">
            <h2 className="landing-section-title">Powerful Features</h2>
            <div className="landing-features-grid">
              <div className="landing-feature-card">
                <div className="landing-feature-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>RAG Fine-tuning</h3>
                <p>
                  Fine-tune retrieval-augmented generation models with your
                  proprietary data for domain-specific accuracy.
                </p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon">
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
                </div>
                <h3>Multiple Data Sources</h3>
                <p>
                  Connect text files, media, datasets, and external data sources
                  to build comprehensive knowledge bases.
                </p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon">
                  <svg
                    width="24"
                    height="24"
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
                </div>
                <h3>Custom Chatbots</h3>
                <p>
                  Create and deploy intelligent chatbots tailored to your needs
                  with customizable models and configurations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <div className="landing-container">
            <p>&copy; 2024 BIM Test. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
