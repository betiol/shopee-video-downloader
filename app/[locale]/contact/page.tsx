import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export default function ContactPage() {
  const t = useTranslations("contactPage");
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
          <span>{tNav("contact")}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Email Card */}
        <Card className="mb-8 border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-foreground">
                  {t("email.title")}
                </h2>
                <a
                  href={`mailto:${t("email.address")}`}
                  className="text-lg text-primary hover:underline"
                >
                  {t("email.address")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note Card */}
        <Card className="border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("note.title")}
              </h2>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p className="text-muted-foreground">{t("note.item1")}</p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p className="text-muted-foreground">{t("note.item2")}</p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground">{t("note.item3")}</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
