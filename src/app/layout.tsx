import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dave Macarayo — Web Developer & AI Engineer",
  description:
    "Dave Macarayo builds modern web applications and AI-integrated systems, including LLM workflows, RAG systems, speech synthesis, biometrics, and computer vision.",
  openGraph: {
    title: "Dave Macarayo — Web Developer & AI Engineer",
    description:
      "Modern web applications and AI-integrated systems.",
    type: "website",
    locale: "en_US",
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
      className={`${spaceGrotesk.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-bg text-text antialiased">
        {/* ThemeProvider added in Phase 02 */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
