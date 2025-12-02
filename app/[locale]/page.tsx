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
import Footer from "@/components/footer";
import AdSenseAd from "@/components/adsense-ad";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/components/auth-provider";
import { LoginModal } from "@/components/login-modal";
import { UpgradeModal } from "@/components/upgrade-modal";

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
  const [loginOpen, setLoginOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { user } = useAuth();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVideoUrl("");
    setLoading(true);

    try {
      const token = user ? await user.getIdToken() : null;
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setLoginOpen(true);
        setLoading(false);
        return;
      }

      // Check if limit was reached
      if (response.status === 403 && data.code === "LIMIT_REACHED") {
        setUpgradeOpen(true);
        setError(data.error);
        setLoading(false);
        return;
      }

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

  const handleUpgrade = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <UserMenu />
      </div>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} onUpgrade={handleUpgrade} />
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

        {/* Tips & Best Practices Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              Tips for Downloading Shopee Videos
            </h2>
            <div className="space-y-6">
              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    1. Understanding Video Quality
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When downloading videos from Shopee, it&apos;s important to understand that the quality of the downloaded video will match the original upload quality. Shopee typically hosts videos in various resolutions, and our downloader retrieves the highest quality available. For the best results, ensure you&apos;re downloading videos that were originally uploaded in high definition (HD) or Full HD quality.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The video quality can significantly impact your content creation, marketing efforts, or personal archiving needs. Always preview the video before downloading to ensure it meets your quality requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    2. Legal and Ethical Considerations
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    While our tool makes it easy to download Shopee videos, it&apos;s crucial to respect copyright laws and intellectual property rights. Videos on Shopee are created by sellers and content creators who own the rights to their content. Here are some important guidelines:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Only download videos for personal use, education, or with explicit permission from the content owner</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Never redistribute downloaded videos without proper authorization</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Respect the creator&apos;s work and give proper attribution when using their content</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Consider contacting the video owner directly for commercial use permissions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    3. Optimizing Download Speed
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Download speeds can vary based on several factors. To ensure the fastest and most reliable downloads, consider these optimization tips:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Use a stable internet connection - WiFi or wired connections typically offer better stability than mobile data</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Close unnecessary browser tabs and applications to free up bandwidth</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Download videos during off-peak hours for potentially faster speeds</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Clear your browser cache regularly to maintain optimal performance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    4. File Management and Organization
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Proper file management is essential when downloading multiple videos. Here are some best practices to keep your downloads organized:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Create a dedicated folder structure for Shopee videos on your device</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Rename downloaded files with descriptive names that include product details or dates</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Consider using cloud storage for backup and easy access across devices</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Regularly review and clean up your downloaded videos to save storage space</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    5. Troubleshooting Common Issues
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you encounter problems while downloading Shopee videos, try these troubleshooting steps:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Download fails:</strong> Verify the URL is correct and the video is still available on Shopee</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Slow downloads:</strong> Check your internet connection speed and try again later</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Video won&apos;t play:</strong> Ensure you have a compatible media player installed</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Browser issues:</strong> Try clearing cookies and cache, or use a different browser</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-white">
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

        {/* Additional Educational Content */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              Understanding Shopee Video Content
            </h2>
            <div className="space-y-6">
              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Why Shopee Videos Matter for E-commerce
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Shopee has revolutionized online shopping by integrating video content into product listings. Videos provide customers with a more comprehensive view of products, showcasing features, dimensions, and real-life applications that static images cannot convey. This visual medium has become essential for modern e-commerce, leading to increased customer engagement and higher conversion rates.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    For sellers, product videos are invaluable marketing tools that can demonstrate product features, build trust, and differentiate their offerings from competitors. Studies show that listings with videos receive up to 80% more engagement than those without, making video content a crucial component of successful online selling strategies.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    For buyers and content creators, the ability to download and reference these videos can be useful for product comparisons, reviews, or educational content creation. Our tool facilitates this process while maintaining the original video quality.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Video Formats and Compatibility
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our Shopee Video Downloader delivers videos in MP4 format, which is universally compatible with virtually all devices and media players. MP4 (MPEG-4 Part 14) is an industry-standard digital multimedia container format that offers excellent compression while maintaining high video quality.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The downloaded MP4 files can be played on:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Desktop computers:</strong> Windows Media Player, VLC, QuickTime, and most web browsers</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Mobile devices:</strong> iOS (iPhone/iPad) and Android smartphones and tablets</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Smart TVs:</strong> Most modern smart TV platforms support MP4 playback</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Gaming consoles:</strong> PlayStation, Xbox, and other entertainment systems</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    This universal compatibility ensures that you can view your downloaded Shopee videos on any device without needing special conversion tools or software.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Privacy and Security
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We take your privacy and security seriously. Our Shopee Video Downloader operates with the following privacy principles:
                  </p>
                  <ul className="space-y-3 text-muted-foreground mb-4">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>No data storage:</strong> We do not store any video URLs or downloaded content on our servers. All processing happens in real-time.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>No registration required:</strong> You can use our service without creating an account or providing personal information.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Secure connections:</strong> All data transfers are encrypted using industry-standard SSL/TLS protocols.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>No tracking:</strong> We do not track your download history or create user profiles based on your activity.</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is paramount, and we are committed to maintaining a transparent and secure service that respects user confidentiality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
