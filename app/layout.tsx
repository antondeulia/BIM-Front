import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "BIM Test",
  description:
    "Fine-tune RAG models with your data and create intelligent chatbots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <ToastProvider>
                <AppLayout>{children}</AppLayout>
              </ToastProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
