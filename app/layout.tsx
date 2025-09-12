import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spg.danieyal.qzz.io"),
  title: "Secure Password Generator",
  description:
    "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
  openGraph: {
    title: "Secure Password Generator",
    description:
      "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
    images: ["https://spg.danieyal.qzz.io/og-image.png"],
    url: "https://spg.danieyal.qzz.io",
    siteName: "Secure Password Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Secure Password Generator",
    description:
      "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
    images: ["https://spg.danieyal.qzz.io/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
