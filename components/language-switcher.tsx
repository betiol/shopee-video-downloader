"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === "pt" ? "en" : "pt";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {locale === "pt" ? "EN" : "PT"}
    </Button>
  );
}
