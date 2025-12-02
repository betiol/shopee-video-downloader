import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    let { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória" },
        { status: 400 }
      );
    }

    // Trim whitespace and decode if needed
    url = url.trim();

    // If URL contains encoded characters, decode it
    if (url.includes('%')) {
      try {
        url = decodeURIComponent(url);
      } catch (e) {
        // If decode fails, use original URL
      }
    }

    // Extract just the URL part if there's extra text
    const urlMatch = url.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      url = urlMatch[1];
    }

    // Auth & Rate Limiting
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Login necessário para baixar vídeos", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let userId;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (e) {
      return NextResponse.json(
        { error: "Sessão inválida", code: "AUTH_INVALID" },
        { status: 401 }
      );
    }

    // Check limits
    const userRef = adminDb.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");
    const userData = snapshot.val() || {};
    const isPremium = userData.isPremium;

    // Store usage info for later increment (only after success)
    let usageRef = null;
    let currentUsage = 0;

    if (!isPremium) {
      const today = new Date().toISOString().split("T")[0];
      usageRef = userRef.child(`usage/${today}`);
      const usageSnapshot = await usageRef.once("value");
      currentUsage = usageSnapshot.val() || 0;

      if (currentUsage >= 5) {
        return NextResponse.json(
          {
            error: "Limite diário de 5 vídeos atingido. Faça upgrade para ilimitado!",
            code: "LIMIT_REACHED"
          },
          { status: 403 }
        );
      }
    }

    // Check if URL is already a direct video URL
    if (url.includes('susercontent.com') && url.includes('.mp4')) {
      // Increment usage only on success
      if (usageRef) {
        await usageRef.set(currentUsage + 1);
      }
      return NextResponse.json({ videoUrl: url });
    }

    // Step 1: Follow redirects to get the final URL
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    let finalUrl = res.url;

    // Step 2: Extract URL from universal-link if present
    if (finalUrl.includes("universal-link")) {
      const match = finalUrl.match(/redir=([^&]+)/);
      if (match) {
        finalUrl = decodeURIComponent(match[1]);
      }
    }

    // Step 3: Fetch the final page HTML
    const html = await (await fetch(finalUrl)).text();

    // Step 4: Extract JSON data from __NEXT_DATA__ script tag
    const jsonMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
    );

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Não foi possível extrair os dados do vídeo" },
        { status: 400 }
      );
    }

    const data = JSON.parse(jsonMatch[1]);

    // Step 5: Get video URL and remove watermark patterns
    const rawUrl = data?.props?.pageProps?.mediaInfo?.video?.watermarkVideoUrl;

    if (!rawUrl) {
      return NextResponse.json(
        { error: "URL do vídeo não encontrada" },
        { status: 400 }
      );
    }

    // Remove watermark pattern (e.g., .123.456 before .mp4)
    const cleanUrl = rawUrl.replace(/\.\d+\.\d+(?=\.mp4)/, "");

    // Increment usage only on success
    if (usageRef) {
      await usageRef.set(currentUsage + 1);
    }

    return NextResponse.json({ videoUrl: cleanUrl });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Erro ao processar o vídeo. Verifique se a URL é válida." },
      { status: 500 }
    );
  }
}
