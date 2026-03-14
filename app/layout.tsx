import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Open Source Bug Fix Arena",
    template: "%s | Open Source Bug Fix Arena",
  },
  description:
    "Browse beginner-friendly GitHub issues, review challenge briefs, and draft your bug-fix workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
