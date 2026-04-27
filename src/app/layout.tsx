import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  title: "Dave Zachary Macarayo — Developer Portfolio",
  description:
    "Dave Zachary Macarayo builds modern web applications and AI-integrated systems, including LLM workflows, RAG systems, speech synthesis, biometrics, and computer vision.",
  openGraph: {
    title: "Dave Zachary Macarayo — Developer Portfolio",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-bg text-text antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ExperienceProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ExperienceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
