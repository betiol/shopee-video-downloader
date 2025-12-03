import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Footer from "@/components/footer";

export default function TermsPage() {
  const t = useTranslations("termsPage");
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
          <span>{tNav("terms")}</span>
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
          {/* Acceptance */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("acceptance.title")}
              </h2>
              <p className="text-muted-foreground">{t("acceptance.description")}</p>
            </CardContent>
          </Card>

          {/* Service */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("service.title")}
              </h2>
              <p className="text-muted-foreground">{t("service.description")}</p>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("usage.title")}
              </h2>
              <p className="text-muted-foreground mb-4">{t("usage.description")}</p>
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
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("usage.item4")}</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("prohibited.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("prohibited.description")}
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("prohibited.item1")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("prohibited.item2")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("prohibited.item3")}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-muted-foreground">{t("prohibited.item4")}</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("disclaimer.title")}
              </h2>
              <p className="text-muted-foreground">{t("disclaimer.description")}</p>
            </CardContent>
          </Card>

          {/* Changes */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("changes.title")}
              </h2>
              <p className="text-muted-foreground">{t("changes.description")}</p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-purple-100 shadow-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("contact.title")}</h2>
              <p className="text-purple-50">{t("contact.description")}</p>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {t("availability.title")}
              </h2>
              <p className="text-muted-foreground">{t("availability.description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
