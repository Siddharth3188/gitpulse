
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GITPULSE — Your GitHub. Decoded.",
    template: "%s | GITPULSE"
  },
  description:
    "Explore GitHub profiles through beautiful analytics, repository insights, and developer comparisons.",
  applicationName: "GITPULSE"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
