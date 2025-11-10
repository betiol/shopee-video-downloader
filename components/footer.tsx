import { useTranslations } from "next-intl";
import Link from "next/link";
import { Video } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Shopee Video Downloader</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <p className="text-xs text-muted-foreground">{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
