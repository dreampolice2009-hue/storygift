import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── PROFESSIONAL IMAGE PROMPT BUILDER ───────────────────────────────────────
function buildImagePrompt(scene: string, imageStyle: string, characterDesc: string): string {
  const styleMap: Record<string, string> = {
    cartoon: "vibrant cartoon-style digital painting, bold outlines, bright saturated colors, Pixar-inspired 3D look, expressive character faces",
    watercolor: "soft watercolor illustration, delicate brushstrokes, gentle pastel palette, dreamy washes of color, reminiscent of classic picture books",
    realistic: "detailed digital painting, soft realistic lighting, painterly textures, warm cinematic colors, storybook realism",
  };
  const artStyle = styleMap[imageStyle] ?? styleMap.watercolor;

  return `${artStyle}, children's book illustration, full scene composition, ${characterDesc ? `main character: ${characterDesc}, ` : ""}${scene}, magical golden hour lighting, rich depth of field, wonder and joy atmosphere, professional children's book quality (inspired by Pixar, Studio Ghibli, Maurice Sendak), wide-angle establishing shot, safe for all ages, child-friendly, NO text, NO words, NO letters, NO captions, NO watermarks, NO signatures, NO numbers, NO writing of any kind anywhere in the image`;
}

// ─── STORY PROMPT ─────────────────────────────────────────────────────────────
function buildStoryPrompt(childName: string, ageGroup: string, storyIdea: string, language: string): string {
  const wordCount = ageGroup === "0" ? "180-250" : ageGroup === "1" ? "350-500" : "600-800";
  const isArabic = language === "ar";

  return `You are a world-class children's book author — warm, imaginative, emotionally resonant.

Write a BEAUTIFUL personalised children's story:
- Hero name: ${childName} (central hero throughout — brave, kind, curious)
- Story idea: ${storyIdea}
- Language: ${isArabic ? "Modern Standard Arabic, warm and poetic, beautifully written" : "English"}
- Total word count: ${wordCount} words split across EXACTLY 5 pages (${Math.round(parseInt(wordCount) / 5)} words each)

RULES:
1. ${childName} is the HERO — place them at the heart of every scene
2. Each page ends with a moment that makes the reader want to turn the page
3. Rich sensory details — what do they see, hear, smell, feel?
4. Dialogue that sounds real for children
5. The moral should emerge naturally — NEVER state it directly until the final wisdom line
6. Make it magical — parents should tear up, children should beg for it again

FORMAT (follow EXACTLY):
TITLE: [Captivating magical title with ${childName}]

[PAGE 1]
[Opening scene — 60-80 words — set the world, introduce ${childName}, hint at the adventure ahead]

[PAGE 2]
[The problem appears — 60-80 words — tension builds, ${childName} faces a challenge]

[PAGE 3]
[The adventure — 60-80 words — ${childName} tries something brave or clever]

[PAGE 4]
[The climax — 60-80 words — the most exciting/emotional moment, ${childName}'s greatest test]

[PAGE 5]
[Resolution — 60-80 words — the happy ending, warmth, everything resolved beautifully]

WISDOM: [One line — the lesson in a child's voice, poetic and memorable]

SCENE_BRIEFS:
COVER: [Vivid scene — ${childName} as hero, establishing the world, mood, specific colors, time of day]
PAGE2: [The challenge/problem scene — specific action, emotion, setting details]
PAGE3: [Adventure scene — movement, energy, specific environment details]
PAGE4: [Climax scene — the most dramatic/emotional moment, character expression]
PAGE5: [Resolution scene — warm, joyful, cozy — the perfect happy ending image]`;
}

// ─── PARSE STORY ──────────────────────────────────────────────────────────────
function parseStory(text: string) {
  const titleMatch = text.match(/TITLE:\s*(.+)/);
  const title = titleMatch?.[1]?.trim() ?? "A Magical Story";

  const wisdomMatch = text.match(/WISDOM:\s*(.+)/);
  const wisdom = wisdomMatch?.[1]?.trim() ?? "";

  const pages: string[] = [];
  const pageRegex = /\[PAGE \d+\]\s*([\s\S]*?)(?=\[PAGE \d+\]|WISDOM:|SCENE_BRIEFS:|$)/g;
  for (const match of text.matchAll(pageRegex)) {
    const content = match[1].trim();
    if (content) pages.push(content);
  }

  const scenes: Record<string, string> = {};
  const sceneRegex = /(COVER|PAGE\d+):\s*(.+)/g;
  const briefSection = text.split("SCENE_BRIEFS:")?.[1] ?? "";
  for (const match of briefSection.matchAll(sceneRegex)) {
    scenes[match[1].toLowerCase()] = match[2].trim();
  }

  return { title, wisdom, pages, scenes };
}

// ─── GENERATE IMAGE ───────────────────────────────────────────────────────────
async function generateImage(
  scene: string,
  imageStyle: string,
  characterDesc: string,
  characterPhotoBase64?: string
): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" } as never);
    const prompt = buildImagePrompt(scene, imageStyle, characterDesc);

    const parts: unknown[] = [];

    // If we have a character reference photo, include it
    if (characterPhotoBase64) {
      const base64Data = characterPhotoBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = characterPhotoBase64.match(/^data:(image\/\w+);base64,/)?.[1] ?? "image/jpeg";
      parts.push({
        inlineData: { mimeType, data: base64Data }
      });
      parts.push({
        text: `Using the child in the reference photo as visual inspiration for the main character's appearance, create this scene: ${prompt}. Match the child's general features (hair color, ethnicity, facial features) in a cartoon/illustrated style. ABSOLUTELY NO text, words, or letters anywhere in the image.`
      });
    } else {
      parts.push({ text: prompt });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (model as any).generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: { responseModalities: ["image", "text"] },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imgPart = result.response.candidates?.[0]?.content?.parts?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    );

    if (imgPart?.inlineData?.data) {
      return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error("Image generation failed:", e);
    return null;
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const {
      childName,
      ageGroup = "1",
      storyIdea,
      language = "en",
      imageStyle = "watercolor",
      characterPhoto, // base64 from frontend
    } = await req.json();

    if (!childName || !storyIdea) {
      return NextResponse.json({ error: "Missing childName or storyIdea" }, { status: 400 });
    }

    // 1) Generate story
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const storyResult = await textModel.generateContent(
      buildStoryPrompt(childName, String(ageGroup), storyIdea, language)
    );
    const storyText = storyResult.response.text();
    const parsed = parseStory(storyText);

    // Character description for prompt (from name + story context)
    const characterDesc = `a child named ${childName}, the story's hero`;

    // 2) Generate 3 key illustrations in parallel (cover + page2 + page4)
    const [coverImg, p2Img, p4Img] = await Promise.all([
      generateImage(parsed.scenes["cover"] ?? `${childName} as a brave hero in a magical world`, imageStyle, characterDesc, characterPhoto),
      generateImage(parsed.scenes["page2"] ?? `${childName} facing a challenge`, imageStyle, characterDesc, characterPhoto),
      generateImage(parsed.scenes["page4"] ?? `${childName} at the most exciting moment`, imageStyle, characterDesc, characterPhoto),
    ]);

    // 3) Build book spreads
    const bookPages = [
      { type: "cover", image: coverImg, title: parsed.title, text: "" },
      { type: "story", image: coverImg,  text: parsed.pages[0] ?? "" },
      { type: "story", image: p2Img,     text: parsed.pages[1] ?? "" },
      { type: "story", image: p2Img,     text: parsed.pages[2] ?? "" },
      { type: "story", image: p4Img,     text: parsed.pages[3] ?? "" },
      { type: "story", image: p4Img,     text: parsed.pages[4] ?? "" },
      { type: "wisdom", image: coverImg, text: parsed.wisdom },
    ];

    return NextResponse.json({
      title: parsed.title,
      wisdom: parsed.wisdom,
      pages: bookPages,
      language,
    });
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json({ error: "Failed to generate story. Please try again." }, { status: 500 });
  }
}
