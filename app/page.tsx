"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Video } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVideoUrl("");
    setLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar o vídeo");
      }

      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(
         "Erro ao processar o vídeo, tente novamente"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = "shopee-video.mp4";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Shopee Video Downloader
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Baixe vídeos da Shopee sem marca d&apos;água de forma rápida e
            gratuita. Cole a URL do vídeo abaixo e clique em baixar.
          </p>
        </div>

        {/* Form */}
        <Card className="border-purple-100 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleDownload} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="Cole a URL do vídeo da Shopee aqui..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1 h-12 text-base"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !url}
                  className="h-12 px-8 text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Baixar
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Video Preview */}
        {videoUrl && (
          <Card className="border-purple-100 shadow-lg overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Vídeo Pronto!
              </h2>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                controlsList="nodownload"
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
              <Button
                onClick={downloadVideo}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar Vídeo sem Marca D&apos;água
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Esta ferramenta é gratuita e não armazena nenhum dado. Todos os
            vídeos são processados em tempo real.
          </p>
        </div>
      </div>
    </main>
  );
}
