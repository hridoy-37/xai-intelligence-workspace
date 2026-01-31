import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Xai — Intelligence Workspace | Transform Data into Strategic Intelligence",
  description:
    "Experience the future of data intelligence. Xai transforms raw data into structured intelligence and actionable insights through advanced AI automation.",
  keywords: [
    "AI",
    "Data Intelligence",
    "Analytics",
    "Automation",
    "Machine Learning",
  ],
  authors: [{ name: "Xai Architecture Labs" }],
  creator: "Xai Architecture Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xai-workspace.vercel.app",
    title: "Xai — Intelligence Workspace",
    description:
      "Transform data into strategic intelligence with AI-powered automation",
    siteName: "Xai Intelligence Workspace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xai — Intelligence Workspace",
    description:
      "Transform data into strategic intelligence with AI-powered automation",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
