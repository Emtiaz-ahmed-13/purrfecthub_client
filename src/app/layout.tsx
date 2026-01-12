import { ChatAIWidget } from "@/components/chatAI/ChatAIWidget";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://purrfecthub.com'),
  title: {
    default: "PurrfectHub - Find Your Perfect Cat Companion in Bangladesh",
    template: "%s | PurrfectHub"
  },
  description: "Bangladesh's first digital cat adoption platform. Connect with verified shelters, browse adoptable cats, track medical records, and find your purrfect companion. বাংলাদেশের প্রথম ডিজিটাল বিড়াল দত্তক প্ল্যাটফর্ম।",
  keywords: [
    "cat adoption Bangladesh",
    "adopt cat Dhaka",
    "pet adoption",
    "animal shelter Bangladesh",
    "rescue cats",
    "বিড়াল দত্তক",
    "পোষা প্রাণী",
    "cat care",
    "verified shelters",
    "pet adoption platform"
  ],
  authors: [{ name: "PurrfectHub Team" }],
  creator: "PurrfectHub",
  publisher: "PurrfectHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    url: "https://purrfecthub.com",
    siteName: "PurrfectHub",
    title: "PurrfectHub - Find Your Perfect Cat Companion in Bangladesh",
    description: "Connect with verified shelters and find your purrfect cat companion. Browse adoptable cats, track medical records, and get AI-powered care guidance.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "PurrfectHub - Cat Adoption Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PurrfectHub - Find Your Perfect Cat Companion",
    description: "Bangladesh's first digital cat adoption platform. Find your purrfect companion today!",
    images: ["/images/twitter-image.png"],
    creator: "@purrfecthub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "pets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
            </div>
            <ChatAIWidget />
            <ScrollToTop />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
