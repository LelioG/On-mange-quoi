import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "On mange quoi ?",
  description: "Le petit coup de pouce pour décider du dîner.",
};

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
