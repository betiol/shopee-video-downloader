import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Footer from "@/components/footer";
import { BookOpen, Video, Download, Shield, Zap, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Complete Guide to Downloading Shopee Videos | Tips & Best Practices",
  description: "Learn everything about downloading Shopee videos safely and legally. Comprehensive guide with tips, best practices, and troubleshooting advice.",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Guide</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Complete Guide to Downloading Shopee Videos
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about downloading, managing, and using Shopee videos
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12 border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Table of Contents</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#introduction" className="hover:text-primary">1. Introduction to Shopee Video Downloads</a>
              </li>
              <li>
                <a href="#getting-started" className="hover:text-primary">2. Getting Started</a>
              </li>
              <li>
                <a href="#step-by-step" className="hover:text-primary">3. Step-by-Step Download Guide</a>
              </li>
              <li>
                <a href="#video-quality" className="hover:text-primary">4. Understanding Video Quality</a>
              </li>
              <li>
                <a href="#legal" className="hover:text-primary">5. Legal & Ethical Considerations</a>
              </li>
              <li>
                <a href="#best-practices" className="hover:text-primary">6. Best Practices</a>
              </li>
              <li>
                <a href="#troubleshooting" className="hover:text-primary">7. Troubleshooting Common Issues</a>
              </li>
              <li>
                <a href="#advanced" className="hover:text-primary">8. Advanced Tips</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary">9. Frequently Asked Questions</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section id="introduction">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    1. Introduction to Shopee Video Downloads
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Shopee, one of Southeast Asia&apos;s leading e-commerce platforms, has integrated video content as a core feature of product listings. These videos provide dynamic, engaging representations of products that help customers make informed purchasing decisions. Whether you&apos;re a buyer researching products, a seller analyzing competition, or a content creator gathering material for reviews, downloading these videos can be incredibly useful.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  However, downloading videos from online platforms isn&apos;t always straightforward. Shopee, like many modern web applications, uses advanced streaming technologies that don&apos;t provide simple &quot;download&quot; buttons. This is where specialized tools like our Shopee Video Downloader come in.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our service bridges this gap by providing a simple, user-friendly interface that allows you to download Shopee videos with just a URL. The videos are delivered in high-quality MP4 format without watermarks, making them suitable for various legitimate purposes including personal archiving, product research, and educational use.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Section 2 */}
          <section id="getting-started">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    2. Getting Started
                  </h2>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">What You&apos;ll Need</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>A stable internet connection:</strong> Required for accessing Shopee and downloading videos. Faster connections will result in quicker downloads.</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>A modern web browser:</strong> Chrome, Firefox, Safari, Edge, or any other current browser will work perfectly.</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>The Shopee video URL:</strong> You&apos;ll need to copy the link from the product page containing the video you want to download.</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Sufficient storage space:</strong> Ensure your device has enough free space to save the downloaded video files.</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-foreground">Browser Compatibility</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Shopee Video Downloader is designed to work seamlessly with all modern web browsers. We&apos;ve tested extensively on:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Google Chrome (recommended)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Mozilla Firefox</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Safari (macOS and iOS)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Microsoft Edge</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Opera</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Brave</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  For the best experience, we recommend keeping your browser updated to the latest version. This ensures optimal performance, security, and compatibility with our service.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Section 3 */}
          <section id="step-by-step">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    3. Step-by-Step Download Guide
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Step 1: Find the Shopee Video</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Navigate to Shopee and browse to the product page containing the video you want to download. Look for product listings that include video content - these are usually displayed prominently in the product image gallery or as a dedicated video section.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Pro tip: Videos on Shopee are typically marked with a play button icon overlay on the product images. Click on the video to view it in full screen and verify it&apos;s the content you want to download.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Step 2: Copy the Product URL</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Once you&apos;ve found the video you want, copy the URL from the browser&apos;s address bar. This URL should be the complete link to the Shopee product page. It typically looks something like:
                    </p>
                    <code className="block bg-gray-100 p-3 rounded text-sm text-gray-800 mb-3">
                      https://shopee.com/product/1234567890
                    </code>
                    <p className="text-muted-foreground leading-relaxed">
                      You can copy the URL by clicking in the address bar, pressing Ctrl+A (or Cmd+A on Mac) to select all, then Ctrl+C (or Cmd+C) to copy.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Step 3: Paste URL into Our Downloader</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Visit our Shopee Video Downloader homepage and locate the URL input field. Click in the field and paste the URL you copied (Ctrl+V or Cmd+V). The field will accept the complete Shopee product URL.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Make sure the entire URL is pasted correctly without any extra spaces or missing characters. Our system will automatically validate the URL format.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Step 4: Click Download</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      After pasting the URL, click the &quot;Download&quot; button. Our system will immediately begin processing your request, extracting the video information from Shopee&apos;s servers.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      You&apos;ll see a loading indicator showing that the video is being processed. This usually takes just a few seconds, depending on the video size and current server load.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Step 5: Preview and Save</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Once processing is complete, the video will appear in a preview player on the page. You can watch the video to confirm it&apos;s the correct one. Below the preview, you&apos;ll find a download button.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Click the download button to save the video to your device. Your browser may ask you to confirm the download location or automatically save it to your default downloads folder.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      The downloaded video will be in MP4 format, compatible with virtually all devices and media players. It will retain the original quality from Shopee without any watermarks or degradation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4 */}
          <section id="video-quality">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  4. Understanding Video Quality
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Video quality is a crucial factor when downloading content. Our service retrieves videos at the highest quality available from Shopee&apos;s servers. However, it&apos;s important to understand that the final quality depends on the original upload.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-foreground mt-6">Resolution and Bitrate</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Shopee videos are typically available in resolutions ranging from 480p to 1080p (Full HD). The resolution you receive depends on what the seller originally uploaded. Higher resolutions provide clearer, more detailed videos but result in larger file sizes.
                </p>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Our downloader automatically selects the highest quality version available. You&apos;ll receive the same quality that viewers see when watching the video on Shopee&apos;s platform.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground mt-6">File Size Considerations</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Video file sizes can vary significantly based on resolution, length, and compression:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>480p videos (30 seconds):</strong> Approximately 5-10 MB</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>720p videos (30 seconds):</strong> Approximately 15-25 MB</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>1080p videos (30 seconds):</strong> Approximately 30-50 MB</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Ensure you have sufficient storage space on your device before downloading multiple videos, especially if they&apos;re high-resolution or lengthy.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Section 5 */}
          <section id="legal">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    5. Legal & Ethical Considerations
                  </h2>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <p className="text-amber-900 font-semibold mb-2">Important Legal Notice</p>
                  <p className="text-amber-800 leading-relaxed">
                    While our tool makes downloading Shopee videos technically simple, users must respect copyright laws and intellectual property rights. Videos on Shopee are created by sellers and content creators who retain ownership of their work.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground">Legitimate Use Cases</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Personal research and comparison:</strong> Downloading videos to compare products or make informed purchasing decisions</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Educational purposes:</strong> Using videos as reference materials for academic research on e-commerce or digital marketing</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Fair use reviews:</strong> Downloading with permission for creating product reviews or comparison content</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Seller analysis:</strong> Studying competitor videos to improve your own product presentations</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-foreground">What to Avoid</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Redistributing downloaded videos without explicit permission from the copyright holder</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Using videos for commercial purposes without authorization</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Claiming ownership of videos created by others</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Modifying and re-uploading videos as your own content</span>
                  </li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-900 leading-relaxed">
                    <strong>Best Practice:</strong> When in doubt, contact the video creator or seller directly to request permission before using their content. Most sellers appreciate respectful inquiries and may grant permission for legitimate uses.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 6 */}
          <section id="best-practices">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  6. Best Practices for Video Management
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Once you&apos;ve downloaded Shopee videos, proper organization and management will help you find and use them efficiently. Here are our recommended best practices:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Organize Your Files</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Create a logical folder structure on your device. For example:
                    </p>
                    <code className="block bg-gray-100 p-4 rounded text-sm text-gray-800 mb-3 whitespace-pre">
{`Shopee Videos/
├── Electronics/
│   ├── Smartphones/
│   └── Laptops/
├── Fashion/
│   ├── Clothing/
│   └── Accessories/
└── Home & Living/`}
                    </code>
                    <p className="text-muted-foreground leading-relaxed">
                      This structure makes it easy to locate specific videos later and helps prevent duplicate downloads.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Use Descriptive File Names</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Rename downloaded files with descriptive names that include:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Product name or description</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Brand name (if applicable)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Date of download</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Any relevant product codes or SKUs</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Example: &quot;Samsung_Galaxy_S24_Product_Demo_2024-01-15.mp4&quot;
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Backup Important Videos</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Consider backing up valuable videos to cloud storage services such as:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Google Drive</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Dropbox</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>iCloud (for Apple users)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>OneDrive (for Microsoft users)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 7 */}
          <section id="troubleshooting">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  7. Troubleshooting Common Issues
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-red-400 pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Problem: Download Fails or Shows Error</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Possible Causes:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Invalid or incorrect URL format</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>The video has been removed from Shopee</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Temporary server issues</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Network connectivity problems</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Verify the URL is copied correctly without extra spaces</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Check if the video still exists on Shopee by visiting the link</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Try again after a few minutes</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Test your internet connection by loading other websites</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-400 pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Problem: Slow Download Speed</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Possible Causes:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Slow internet connection</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>High server load during peak hours</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Large video file size</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Multiple applications using bandwidth</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Close unnecessary applications and browser tabs</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Try downloading during off-peak hours</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Switch from WiFi to wired connection if possible</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Restart your router to refresh the connection</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Problem: Downloaded Video Won&apos;t Play</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Possible Causes:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-3">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Incomplete download</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Incompatible media player</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Corrupted file</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Re-download the video to ensure complete transfer</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Try a different media player (VLC is recommended)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Update your media player to the latest version</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Check file size to ensure the download completed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 8 */}
          <section id="advanced">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  8. Advanced Tips and Tricks
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Batch Processing</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      If you need to download multiple videos, create a workflow:
                    </p>
                    <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                      <li>Collect all Shopee URLs in a text document</li>
                      <li>Download videos one by one, organizing them as you go</li>
                      <li>Use consistent naming conventions for easy tracking</li>
                      <li>Keep a spreadsheet log of downloaded videos with URLs and dates</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Video Editing and Usage</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Once downloaded, you can use videos in various ways (with proper permissions):
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Create comparison montages using video editing software</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Extract still frames for detailed product analysis</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Slow down videos to examine product details more carefully</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Add annotations for personal reference notes</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Mobile Usage</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Our service works perfectly on mobile devices:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Use the Shopee mobile app to browse products</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Copy the product URL by using the share function</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Paste into our mobile-optimized website</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>Videos download directly to your phone&apos;s gallery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 9 */}
          <section id="faq">
            <Card className="border-purple-100 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  9. Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      Is this service really free?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes, our Shopee Video Downloader is completely free to use with no hidden costs, subscriptions, or premium tiers. We believe in providing accessible tools for everyone.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      Do I need to create an account?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      No account or registration is required. Simply visit our website, paste your URL, and download. We respect your privacy and don&apos;t require any personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      How many videos can I download?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      There are no limits on the number of videos you can download. Use our service as much as you need for your legitimate purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      Will the downloaded videos have watermarks?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      No, videos are downloaded in their original form without any additional watermarks added by our service. However, if the original video on Shopee contains watermarks, those will remain.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      Is it safe to use this service?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes, our service is completely safe. We use secure HTTPS connections, don&apos;t require downloads of any software, and don&apos;t store your data. The service works entirely through your web browser.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      What video format do I receive?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All videos are provided in MP4 format, which is universally compatible with all devices, operating systems, and media players.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 border-purple-100 shadow-lg bg-gradient-to-br from-purple-600 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Download Shopee Videos?</h2>
            <p className="text-purple-50 mb-6 text-lg">
              Try our free Shopee Video Downloader now and experience the easiest way to save videos from Shopee.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Start Downloading
            </Link>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
