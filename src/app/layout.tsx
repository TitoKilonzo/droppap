import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "DropPap - Secure file management for teams", template: "%s | DropPap" },
  description: "DropPap is a private workspace where every department stores, versions and shares company documents with access enforced on the server.",
  applicationName: "DropPap",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#173D32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-forest">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
