import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Falcon — Everyday things, better chosen",
    template: "%s | Falcon",
  },
  description:
    "Falcon is a modern storefront for useful, beautiful products. Browse 500+ items across electronics, audio, lifestyle and accessories.",
  applicationName: "Falcon",
  openGraph: {
    title: "Falcon — Everyday things, better chosen",
    description:
      "Browse 500+ products across electronics, audio, lifestyle and accessories.",
    siteName: "Falcon",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
