import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  const t = useTranslations("privacyPage");
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
          <span>{tNav("privacy")}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
        </div>

        {/* Intro */}
        <Card className="mb-8 border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <p className="text-muted-foreground leading-relaxed">{t("intro")}</p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {/* Information Collection */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("collection.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("collection.description")}
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("collection.item1")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("collection.item2")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("collection.item3")}</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("usage.title")}
              </h2>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("usage.item1")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("usage.item2")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("usage.item3")}</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("storage.title")}
              </h2>
              <p className="text-muted-foreground">{t("storage.description")}</p>
            </CardContent>
          </Card>

          {/* Third Party */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("thirdParty.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("thirdParty.description")}
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("thirdParty.item1")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("thirdParty.item2")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("thirdParty.item3")}</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Rights */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("rights.title")}
              </h2>
              <p className="text-muted-foreground">{t("rights.description")}</p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-purple-100 shadow-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("contact.title")}</h2>
              <p className="text-purple-50">{t("contact.description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
