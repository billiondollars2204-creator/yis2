import { assetPath } from "@/lib/asset-path";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { resolveImage } from "@/data/images";
import { site } from "@/lib/site";

// One coherent sans family across display, copy and commerce controls.
// Devanagari labels use the platform’s native font fallback.
const grotesk = localFont({ src: "../../public/fonts/manrope-variable.ttf", weight: "200 800", variable: "--font-grotesk", display: "swap" });

const ogImage = resolveImage("/images/og") ?? "/og-placeholder.svg";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Homemade panjiri, pinni & laddus`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: `${site.name} — Homemade panjiri, pinni & laddus`,
    description: site.description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: assetPath("/favicon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#0029ae",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/favicon.svg`,
  // PLACEHOLDER: add sameAs social profiles and contactPoint once confirmed.
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${grotesk.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <Analytics />
        <JsonLd data={organizationLd} />
      </body>
    </html>
  );
}
