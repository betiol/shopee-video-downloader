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

        {/* Additional Content Sections */}
        <div className="mt-12 space-y-8">
          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Our Technology
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Shopee Video Downloader is built using cutting-edge web technologies to ensure optimal performance, reliability, and security. We utilize modern frameworks and libraries that enable fast processing speeds and seamless user experiences across all devices and platforms.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The application is designed with a focus on efficiency, using server-side rendering for improved load times and search engine optimization. Our infrastructure is optimized to handle multiple concurrent requests while maintaining consistent download speeds and quality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We continuously update and improve our technology stack to incorporate the latest security patches, performance enhancements, and feature additions, ensuring that our users always have access to the most reliable video downloading service available.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Why Choose Our Service
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No Installation Required</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Unlike many other video downloading tools that require you to install software on your device, our web-based solution works directly in your browser. This means no bloatware, no security risks from unknown installers, and no taking up valuable storage space on your device. Simply visit our website, paste your link, and download - it&apos;s that simple.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Cross-Platform Compatibility</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you&apos;re using Windows, macOS, Linux, iOS, or Android, our service works seamlessly across all operating systems and devices. The web-based interface adapts to your screen size, providing an optimal experience whether you&apos;re on a desktop computer, laptop, tablet, or smartphone.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Regular Updates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    E-commerce platforms like Shopee frequently update their systems and video delivery methods. We monitor these changes closely and update our service regularly to ensure compatibility. You never have to worry about updating software - our web-based tool is always up-to-date automatically.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No Speed Limits</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Many video downloading services artificially limit download speeds to encourage premium subscriptions. We believe in providing full-speed downloads to all users, completely free. Your download speed is only limited by your internet connection, not by our service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Use Cases
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Shopee Video Downloader serves a variety of legitimate use cases:
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <div>
                    <strong className="text-foreground">Product Research:</strong>
                    <p className="text-muted-foreground">
                      Buyers can download product videos to compare features across different sellers, analyze product details more carefully, or share videos with family and friends for purchasing decisions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <div>
                    <strong className="text-foreground">Content Creation:</strong>
                    <p className="text-muted-foreground">
                      Reviewers and content creators can download videos (with proper permissions) to create comparison videos, product reviews, or educational content about e-commerce trends.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <div>
                    <strong className="text-foreground">Seller Analysis:</strong>
                    <p className="text-muted-foreground">
                      E-commerce professionals can study successful product videos to understand effective video marketing strategies and improve their own product presentations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <div>
                    <strong className="text-foreground">Offline Viewing:</strong>
                    <p className="text-muted-foreground">
                      Users with limited internet access or those traveling can download videos to watch later offline, especially useful for detailed product demonstrations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <div>
                    <strong className="text-foreground">Educational Purposes:</strong>
                    <p className="text-muted-foreground">
                      Students and researchers studying e-commerce, digital marketing, or consumer behavior can archive videos as reference materials for academic work.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Future Development
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are constantly working to improve our service and add new features based on user feedback. Some features we&apos;re exploring for future releases include:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Batch downloading capability for multiple videos at once</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Video quality selection options</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Browser extension for one-click downloads</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Support for additional video platforms</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Video format conversion options</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Download history and favorites (with user privacy maintained)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
