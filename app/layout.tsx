import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { SWRegister } from "@/components/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://passgen.danieyal.qzz.io"),
  title: "PassGen",
  description:
    "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
  openGraph: {
    title: "PassGen",
    description:
      "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
    images: ["https://passgen.danieyal.qzz.io/og-image.png"],
    url: "https://passgen.danieyal.qzz.io",
    siteName: "PassGen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "PassGen",
    description:
      "Create strong, unique passwords instantly. Flexible options, readable passphrases, and one-click copy.",
    images: ["https://passgen.danieyal.qzz.io/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
          <Toaster position="top-right" richColors closeButton />
          <SWRegister />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
