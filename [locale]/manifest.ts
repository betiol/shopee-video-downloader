import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shopee Video Downloader",
    short_name: "Shopee Downloader",
    description:
      "Baixe vídeos da Shopee sem marca d'água de forma rápida e gratuita",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9333ea",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
