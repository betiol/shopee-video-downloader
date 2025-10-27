import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import StructuredData from "@/components/structured-data";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPt = locale === "pt";

  return {
    title: isPt
      ? "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água"
      : "Shopee Video Downloader - Download Shopee Videos Without Watermark",
    description: isPt
      ? "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita. Cole a URL do vídeo e faça o download instantaneamente."
      : "Download Shopee videos without watermark quickly and for free. Paste the video URL and download instantly.",
    keywords: [
      "shopee",
      "video downloader",
      isPt ? "baixar video shopee" : "download shopee video",
      isPt ? "shopee sem marca dagua" : "shopee without watermark",
      "download shopee",
      "shopee video",
      isPt ? "remover marca dagua shopee" : "remove shopee watermark",
    ],
    authors: [{ name: "Shopee Video Downloader" }],
    creator: "Shopee Video Downloader",
    publisher: "Shopee Video Downloader",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        pt: "/pt",
        en: "/en",
      },
    },
    openGraph: {
      title: isPt
        ? "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água"
        : "Shopee Video Downloader - Download Shopee Videos Without Watermark",
      description: isPt
        ? "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita. Cole a URL do vídeo e faça o download instantaneamente."
        : "Download Shopee videos without watermark quickly and for free. Paste the video URL and download instantly.",
      url: `/${locale}`,
      siteName: "Shopee Video Downloader",
      locale: isPt ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isPt
        ? "Shopee Video Downloader - Baixe Vídeos da Shopee Sem Marca D'água"
        : "Shopee Video Downloader - Download Shopee Videos Without Watermark",
      description: isPt
        ? "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita."
        : "Download Shopee videos without watermark quickly and for free.",
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <StructuredData />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
