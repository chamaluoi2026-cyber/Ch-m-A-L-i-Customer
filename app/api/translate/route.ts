import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/server-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, content, text, targetLang = "en" } = body;

    const settings = getSiteSettings();
    const apiKey = process.env.GEMINI_API_KEY || settings?.geminiApiKey;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "Gemini API key is not configured"
      });
    }

    const prompt = `You are an expert bilingual travel writer and translator for "Cham A Luoi" (an indigenous community-based ecotourism initiative in A Luoi, Thua Thien Hue, Vietnam).
Translate the following travel content into natural, immersive, culturally authentic ${targetLang === "en" ? "English" : "Vietnamese"}.
Accurately preserve indigenous ethnic terms (such as Pa Cô, Tà Ôi, Zèng, A Quát, bánh A Quát, nhà Gươl, Ta Lư, Khèn Bè).

Input to translate:
${JSON.stringify({ title, excerpt, content, text })}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "translated title or original if empty",
  "excerpt": "translated excerpt or original if empty",
  "content": "translated content or original if empty",
  "text": "translated text or original if empty"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.3 }
        }),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!geminiRes.ok) {
      const errTxt = await geminiRes.text();
      return NextResponse.json({ success: false, error: errTxt }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const translation = rawText ? JSON.parse(rawText) : null;

    return NextResponse.json({
      success: true,
      translation
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Translation failed" },
      { status: 500 }
    );
  }
}
