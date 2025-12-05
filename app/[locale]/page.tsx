"use client";

import { useState, useEffect } from "react";
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
import { AuthModal } from "@/components/auth-modal";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const t = useTranslations("home");
  const tHowTo = useTranslations("howTo");
  const tFeatures = useTranslations("features");
  const tFaq = useTranslations("faq");
  const tAbout = useTranslations("about");
  const tMobile = useTranslations("mobile");
  const tDesktop = useTranslations("desktop");
  const tTips = useTranslations("auth.tips");
  const tEducation = useTranslations("auth.education");

  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const success = searchParams.get("success");
      const sessionId = searchParams.get("session_id");

      if (success === "true" && sessionId && user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch("/api/stripe/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          });

          const data = await response.json();
          console.log("Payment verification:", data);

          // Remove query params from URL
          window.history.replaceState({}, "", window.location.pathname);
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      }
    };

    verifyPayment();
  }, [searchParams, user]);

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
      <AuthModal open={loginOpen} onOpenChange={setLoginOpen} />
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
              {tTips("title")}
            </h2>
            <div className="space-y-6">
              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {tTips("quality.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tTips("quality.p1")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {tTips("quality.p2")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {tTips("legal.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tTips("legal.p1")}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("legal.list.l1")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("legal.list.l2")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("legal.list.l3")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("legal.list.l4")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {tTips("speed.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tTips("speed.p1")}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("speed.list.l1")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("speed.list.l2")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("speed.list.l3")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("speed.list.l4")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {tTips("management.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tTips("management.p1")}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("management.list.l1")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("management.list.l2")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("management.list.l3")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>{tTips("management.list.l4")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {tTips("troubleshooting.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tTips("troubleshooting.p1")}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tTips.raw("troubleshooting.list.l1") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tTips.raw("troubleshooting.list.l2") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tTips.raw("troubleshooting.list.l3") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tTips.raw("troubleshooting.list.l4") }} />
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
              {tEducation("title")}
            </h2>
            <div className="space-y-6">
              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {tEducation("ecommerce.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tEducation("ecommerce.p1")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tEducation("ecommerce.p2")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {tEducation("ecommerce.p3")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {tEducation("formats.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tEducation("formats.p1")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tEducation("formats.p2")}
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("formats.list.l1") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("formats.list.l2") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("formats.list.l3") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("formats.list.l4") }} />
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    {tEducation("formats.p3")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {tEducation("privacy.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {tEducation("privacy.p1")}
                  </p>
                  <ul className="space-y-3 text-muted-foreground mb-4">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("privacy.list.l1") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("privacy.list.l2") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("privacy.list.l3") }} />
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: tEducation.raw("privacy.list.l4") }} />
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    {tEducation("privacy.p2")}
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
