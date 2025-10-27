"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, Loader2, Video, Infinity, Droplet, FileVideo } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("home");
  const tHowTo = useTranslations("howTo");
  const tFeatures = useTranslations("features");
  const tFaq = useTranslations("faq");
  const tAbout = useTranslations("about");
  const tMobile = useTranslations("mobile");
  const tDesktop = useTranslations("desktop");

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
        throw new Error(data.error || t("error"));
      }

      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(t("error"));
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
    <>
      <LanguageSwitcher />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="flex items-center justify-center p-4 min-h-[60vh]">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Video className="w-12 h-12 text-primary" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {t("title")}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t("description")}
              </p>
            </div>

            <Card className="border-purple-100 shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleDownload} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      type="url"
                      placeholder={t("inputPlaceholder")}
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
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          {t("downloadButton")}
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

            {videoUrl && (
              <Card className="border-purple-100 shadow-lg overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    {t("videoReady")}
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
                    {t("downloadVideo")}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>{t("footer")}</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <Infinity className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{tFeatures("unlimited.title")}</h3>
                <p className="text-muted-foreground">{tFeatures("unlimited.description")}</p>
              </div>

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <Droplet className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{tFeatures("noWatermark.title")}</h3>
                <p className="text-muted-foreground">{tFeatures("noWatermark.description")}</p>
              </div>

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <FileVideo className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{tFeatures("mp4.title")}</h3>
                <p className="text-muted-foreground">{tFeatures("mp4.description")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How To Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {tHowTo("title")}
            </h2>

            <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-8 md:p-12 text-white space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{tHowTo("step1.title")}</h3>
                    <p className="text-purple-50">{tHowTo("step1.description")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{tHowTo("step2.title")}</h3>
                    <p className="text-purple-50">{tHowTo("step2.description")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{tHowTo("step3.title")}</h3>
                    <p className="text-purple-50">{tHowTo("step3.description")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              {tAbout("title")}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{tAbout("p1")}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{tAbout("p2")}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{tAbout("p3")}</p>
          </div>
        </section>

        {/* Mobile & Desktop Sections */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">{tMobile("title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{tMobile("description")}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">{tDesktop("title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{tDesktop("description")}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {tFaq("title")}
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => {
                const num = i + 1;
                const key = `q${num}` as const;
                return (
                  <AccordionItem
                    key={key}
                    value={key}
                    className="bg-white rounded-lg px-6 border-purple-100"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-semibold text-foreground">
                        {tFaq(`${key}.question`)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {tFaq(`${key}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t bg-white/80">
          <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Shopee Video Downloader. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
