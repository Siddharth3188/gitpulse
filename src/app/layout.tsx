
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GITPULSE — Your GitHub. Decoded.",
    template: "%s | GITPULSE",
  },
  description:
    "Explore GitHub profiles through beautiful analytics, repository insights, and developer comparisons.",
  applicationName: "GITPULSE",
  keywords: [
    "GitHub analytics",
    "GitHub profile analyzer",
    "developer analytics",
    "repository insights",
    "GITPULSE",
  ],
  openGraph: {
    title: "GITPULSE — Your GitHub. Decoded.",
    description:
      "Discover the projects, technologies, and activity behind any public GitHub profile.",
    siteName: "GITPULSE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GITPULSE — Your GitHub. Decoded.",
    description:
      "Explore GitHub profiles through beautiful analytics and repository insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
