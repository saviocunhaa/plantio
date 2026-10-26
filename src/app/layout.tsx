import type { Metadata, Viewport } from "next";
import { RegistroServiceWorker } from "@/components/RegistroServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plantio Fácil — Guia de plantio para iniciantes",
  description: "Diga onde você está e quanto espaço tem. A gente diz o que plantar e te guia até colher.",
  applicationName: "Plantio Fácil",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plantio Fácil",
  },
};

export const viewport: Viewport = {
  themeColor: "#244227",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#fcfbfa]">
        <RegistroServiceWorker />
        {children}
      </body>
    </html>
  );
}
