import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória" },
        { status: 400 }
      );
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

    return NextResponse.json({ videoUrl: cleanUrl });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Erro ao processar o vídeo. Verifique se a URL é válida." },
      { status: 500 }
    );
  }
}
