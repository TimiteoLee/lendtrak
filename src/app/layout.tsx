import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "ToolTrack — Honest Tool Lending",
  description: "Keep an honest record of every tool you lend. Who borrowed it, when, and in what condition.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ToolTrack",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="classic">
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <ServiceWorkerRegister />
          <Nav />
          <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-24">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
