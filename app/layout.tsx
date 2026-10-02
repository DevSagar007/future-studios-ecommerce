import type { Metadata } from "next";
import "@/components/styles/globals.css";
import "@/components/styles/button-overrides.css";

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
    <html lang="en"><body>{children}</body></html>
  );
}
