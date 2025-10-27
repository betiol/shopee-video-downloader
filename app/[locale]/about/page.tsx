import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export default function AboutPage() {
  const t = useTranslations("aboutPage");
  const tNav = useTranslations("nav");

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            {tNav("home")}
          </Link>
          <span className="mx-2">/</span>
          <span>{tNav("about")}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Mission */}
        <Card className="mb-8 border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {t("mission.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("mission.description")}
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("features.free.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("features.free.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("features.easy.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("features.easy.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("features.quality.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("features.quality.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("features.safe.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("features.safe.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Commitment */}
        <Card className="border-purple-100 shadow-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">{t("commitment.title")}</h2>
            <p className="text-purple-50 leading-relaxed">
              {t("commitment.description")}
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
