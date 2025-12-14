"use client";

import { useState, useEffect, useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LandingPage from "@/components/LandingPage";
import RedirectLoader from "@/components/RedirectLoader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [wasAuthenticated, setWasAuthenticated] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!loading) {
      if (wasAuthenticated === null) {
        setWasAuthenticated(isAuthenticated);

        if (isAuthenticated && pathname === "/") {
          startTransition(() => {
            router.push("/dashboard");
          });
        }
      } else if (wasAuthenticated !== isAuthenticated) {
        setWasAuthenticated(isAuthenticated);

        startTransition(() => {
          if (isAuthenticated) {
            router.push("/dashboard");
          } else {
            if (pathname !== "/") {
              router.push("/");
            }
          }
        });
      } else if (isAuthenticated && pathname === "/") {
        startTransition(() => {
          router.push("/dashboard");
        });
      }
    }
  }, [loading, isAuthenticated, wasAuthenticated, router, pathname, startTransition]);

  if (loading || isPending) {
    return (
      <RedirectLoader
        message={
          isPending
            ? isAuthenticated
              ? "Redirecting to dashboard..."
              : "Logging out..."
            : "Loading..."
        }
      />
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const isChatPage =
    pathname?.startsWith("/chat-bots/") && pathname !== "/chat-bots";

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {!isChatPage && (
          <div className="main-content-header">
            <button className="main-content-header-button">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Upgrade to Pro
            </button>
            <button className="main-content-header-button">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Invite People
            </button>
          </div>
        )}
        <div className="main-content-body">{children}</div>
      </main>
    </div>
  );
}
