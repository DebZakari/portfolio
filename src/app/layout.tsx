import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideNav from "@/components/SideNav";
import CursorBlackHole from "@/components/CursorBlackHole";
import { ExperienceProvider } from "@/contexts/ExperienceContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const BASE_URL = "https://dz-macarayo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Dave Zachary Macarayo: Developer Portfolio",
  description:
    "Dave Zachary Macarayo builds modern web applications and AI-integrated systems, including LLM workflows, RAG systems, speech synthesis, biometrics, and computer vision.",
  openGraph: {
    title: "Dave Zachary Macarayo: Developer Portfolio",
    description:
      "Modern web applications and AI-integrated systems.",
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Dave Zachary Macarayo – Developer Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dave Zachary Macarayo: Developer Portfolio",
    description: "Modern web applications and AI-integrated systems.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-bg text-text antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ExperienceProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
              style={{ background: "var(--surface)", border: "1px solid var(--accent)", color: "var(--text)" } as React.CSSProperties}
            >
              Skip to content
            </a>
            <CursorBlackHole />
            <Header />
            <SideNav />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
          </ExperienceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
