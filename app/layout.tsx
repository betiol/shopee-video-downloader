import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água",
  description:
    "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita. Cole a URL do vídeo e faça o download instantaneamente.",
  keywords: [
    "shopee",
    "video downloader",
    "baixar video shopee",
    "shopee sem marca dagua",
    "download shopee",
    "shopee video",
    "remover marca dagua shopee",
  ],
  authors: [{ name: "Shopee Video Downloader" }],
  creator: "Shopee Video Downloader",
  publisher: "Shopee Video Downloader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água",
    description:
      "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita. Cole a URL do vídeo e faça o download instantaneamente.",
    url: "/",
    siteName: "Shopee Video Downloader",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água",
    description:
      "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <StructuredData />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
