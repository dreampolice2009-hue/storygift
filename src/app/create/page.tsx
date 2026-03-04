"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, ChevronDown, Mic, Sparkles, Settings2 } from "lucide-react";
import BookReader from "@/components/BookReader";
import Link from "next/link";

const imageStyles = [
  { id: "cartoon", label: "IMAGE STYLE", value: "Cartoon", emoji: "🎨", bg: "from-orange-400 to-pink-400" },
  { id: "watercolor", label: "IMAGE STYLE", value: "Watercolor", emoji: "🖌️", bg: "from-blue-400 to-violet-400" },
  { id: "realistic", label: "IMAGE STYLE", value: "Realistic", emoji: "📸", bg: "from-green-400 to-teal-400" },
];

const textStyles = [
  { id: "short", label: "TEXT STYLE", value: "Short", desc: "Quick bedtime read" },
  { id: "medium", label: "TEXT STYLE", value: "Medium", desc: "Perfect adventure" },
  { id: "long", label: "TEXT STYLE", value: "Long", desc: "Epic chronicle" },
];

const storyTypes = [
  { id: "storybook", label: "TYPE", value: "Story Book", emoji: "📖" },
  { id: "adventure", label: "TYPE", value: "Adventure", emoji: "⚔️" },
  { id: "bedtime", label: "TYPE", value: "Bedtime", emoji: "🌙" },
];

const languages = ["English", "Arabic (Gulf)", "Arabic (Modern Standard)", "French", "Spanish"];
const specialNeeds = ["None", "Autism", "ADHD", "Dyslexia", "Color Blind"];

interface BookPage {
  type: string;
  image: string | null;
  text: string;
  title?: string;
}

interface StoryResult {
  title: string;
  wisdom: string;
  pages: BookPage[];
  language: string;
}

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<"create" | "illustrate">("create");
  const [imageStyle, setImageStyle] = useState("cartoon");
  const [textStyle, setTextStyle] = useState("short");
  const [storyType, setStoryType] = useState("storybook");
  const [characters, setCharacters] = useState<(string | null)[]>([null, null, null, null]);
  const [storyText, setStoryText] = useState("");
  const [language, setLanguage] = useState("English");
  const [specialNeed, setSpecialNeed] = useState("None");
  const [pages, setPages] = useState("14");
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const handlePhotoUpload = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = [...characters];
      updated[index] = ev.target?.result as string;
      setCharacters(updated);
    };
    reader.readAsDataURL(file);
  }, [characters]);

  const generateStory = async () => {
    if (!storyText.trim()) return;
    setGenerating(true);
    setError(null);
    setGeneratingStep(0);

    const interval = setInterval(() => setGeneratingStep((s) => Math.min(s + 1, 3)), 4000);

    try {
      // Extract child name from story text (first capitalized word after common words)
      const nameGuess = storyText.match(/\b([A-Z][a-z]+)\b/)?.[1] ?? "your child";
      const isArabic = language.toLowerCase().includes("arabic");
      const ageMap: Record<string, string> = { short: "0", medium: "1", long: "2" };

      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: nameGuess,
          ageGroup: ageMap[textStyle],
          storyIdea: storyText,
          language: isArabic ? "ar" : "en",
          imageStyle,
          characterPhoto: characters[0] ?? undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  const generatingMessages = [
    "Writing your story...",
    "Adding magic to every word...",
    "Painting the illustrations...",
    "Almost ready...",
  ];

  if (result) {
    return (
      <div className="min-h-screen px-4 py-10" style={{ background: "#e8e8f5" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 text-indigo-800 font-bold text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
              <BookOpen className="w-6 h-6" /> StoryGift
            </Link>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setResult(null)}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #5b4fcf, #7c3aed)" }}>
              ← Create Another
            </motion.button>
          </div>
          <BookReader title={result.title} pages={result.pages} wisdom={result.wisdom} language={result.language} childName="" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "#c8c9e8" }}>
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
        <Link href="/" className="flex items-center gap-2 text-indigo-900 font-bold text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
          <span className="text-2xl">✨</span> StoryGift
        </Link>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.03 }} className="px-5 py-2 rounded-full text-sm font-bold text-white" style={{ background: "#4a3fa0" }}>
            Log in
          </motion.button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-4">

        {/* TAB TOGGLE */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8">
          <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
            {(["create", "illustrate"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? "text-white shadow-lg" : "text-indigo-800/70 hover:text-indigo-900"}`}
                style={activeTab === tab ? { background: "linear-gradient(135deg, #4a3fa0, #6d28d9)" } : {}}>
                {tab === "create" ? "CREATE YOUR STORY" : "ILLUSTRATE YOUR STORY"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* HEADING */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-black text-indigo-900 mb-3" style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" }}>
            CREATE YOUR STORY
          </h1>
          <p className="text-indigo-700/70 text-sm max-w-md mx-auto leading-relaxed">
            Gift your child a personalised story where they are the hero.
            A beautiful illustrated book — ready in 60 seconds.
          </p>
        </motion.div>

        {/* SECTION 1: STYLE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6">
          <h2 className="text-lg font-black text-indigo-900 mb-5">1. What is the style?</h2>
          <div className="grid grid-cols-3 gap-4">

            {/* Story Type */}
            <div className="flex flex-col items-center gap-2">
              <motion.div whileTap={{ scale: 0.95 }}
                onClick={() => setStoryType(storyType === "storybook" ? "adventure" : storyType === "adventure" ? "bedtime" : "storybook")}
                className="w-full aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all"
                style={{ borderColor: "#f59e0b", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {storyTypes.find(s => s.id === storyType)?.emoji}
                </div>
              </motion.div>
              <p className="text-xs font-black text-indigo-900 tracking-wider">TYPE</p>
              <p className="text-xs text-indigo-600">({storyTypes.find(s => s.id === storyType)?.value})</p>
            </div>

            {/* Text Style */}
            <div className="flex flex-col items-center gap-2">
              <motion.div whileTap={{ scale: 0.95 }}
                onClick={() => setTextStyle(textStyle === "short" ? "medium" : textStyle === "medium" ? "long" : "short")}
                className="w-full aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all"
                style={{ borderColor: "#f59e0b", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {textStyle === "short" ? "📄" : textStyle === "medium" ? "📃" : "📜"}
                </div>
              </motion.div>
              <p className="text-xs font-black text-indigo-900 tracking-wider">TEXT STYLE</p>
              <p className="text-xs text-indigo-600">({textStyle})</p>
            </div>

            {/* Image Style */}
            <div className="flex flex-col items-center gap-2">
              <motion.div whileTap={{ scale: 0.95 }}
                onClick={() => setImageStyle(imageStyle === "cartoon" ? "watercolor" : imageStyle === "watercolor" ? "realistic" : "cartoon")}
                className="w-full aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all"
                style={{ borderColor: "#f59e0b", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {imageStyle === "cartoon" ? "🎨" : imageStyle === "watercolor" ? "🖌️" : "📸"}
                </div>
              </motion.div>
              <p className="text-xs font-black text-indigo-900 tracking-wider">IMAGE STYLE</p>
              <p className="text-xs text-indigo-600">({imageStyle})</p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: CHARACTERS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6">
          <h2 className="text-lg font-black text-indigo-900 mb-5">
            2. Who are your characters?
            <span className="ml-2 text-amber-400">ⓘ</span>
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {characters.map((char, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden"
                  onChange={(e) => handlePhotoUpload(i, e)} />
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => fileRefs.current[i]?.click()}
                  className="w-full aspect-square rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center transition-all"
                  style={{
                    border: i === 0 ? "2px dashed #6b7280" : "2px dashed #f59e0b",
                    background: char ? "transparent" : "rgba(255,255,255,0.5)",
                  }}>
                  {char ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={char} alt="Character" className="w-full h-full object-cover" />
                  ) : i === 0 ? (
                    <Plus className="w-8 h-8 text-gray-400" />
                  ) : (
                    <span className="text-2xl text-amber-400">👑</span>
                  )}
                </motion.div>
                {i > 0 && <p className="text-xs text-indigo-500">(optional)</p>}
              </div>
            ))}
          </div>
          <p className="text-xs text-indigo-500 mt-3 text-center">
            Add your child's photo — they'll be illustrated as the hero ✨
          </p>
        </motion.div>

        {/* SECTION 3: STORY */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-6 bg-white/60 backdrop-blur-sm rounded-3xl p-6">
          <h2 className="text-lg font-black text-indigo-900 mb-5">
            3. What is the story?
          </h2>

          <div className="relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.8)" }}>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="✨ Tell us about your child and the adventure they'll have! Include their name, something they love, or a lesson you want them to learn..."
              rows={5}
              className="w-full p-5 pr-24 text-sm text-indigo-900 placeholder:text-indigo-300 bg-transparent resize-none outline-none leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #a855f7, #6d28d9)" }}>
                <Sparkles className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #4a3fa0, #6d28d9)" }}>
                <Mic className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* ADDITIONAL SETTINGS */}
          <div className="mt-4">
            <button onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors">
              <Settings2 className="w-4 h-4" />
              Additional Settings
              <motion.span animate={{ rotate: showSettings ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs font-black text-indigo-800 tracking-wider mb-2 block">LANGUAGE</label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm bg-white/80 text-indigo-900 border border-indigo-200 outline-none">
                        {languages.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-indigo-800 tracking-wider mb-2 block">SPECIAL NEEDS</label>
                      <select value={specialNeed} onChange={(e) => setSpecialNeed(e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm bg-white/80 text-indigo-900 border border-indigo-200 outline-none">
                        {specialNeeds.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-indigo-800 tracking-wider mb-2 block">PAGES</label>
                      <select value={pages} onChange={(e) => setPages(e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm bg-white/80 text-indigo-900 border border-indigo-200 outline-none">
                        <option>14</option><option>20</option><option>24</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-indigo-800 tracking-wider mb-2 block">GIFT TO</label>
                      <input placeholder="Child's name (optional)" className="w-full rounded-xl px-3 py-2.5 text-sm bg-white/80 text-indigo-900 border border-indigo-200 outline-none placeholder:text-indigo-300" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </motion.div>
          )}

          {/* CREATE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(74,63,160,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={generateStory}
            disabled={!storyText.trim() || generating}
            className="mt-6 w-full py-4 rounded-2xl font-black text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #4a3fa0, #6d28d9)", boxShadow: "0 10px 30px rgba(74,63,160,0.3)" }}
          >
            {generating ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                {generatingMessages[generatingStep]}
              </>
            ) : (
              <>
                <span>✨</span> Create Story <span>✨</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-indigo-600/60 mt-4">
          Join thousands of fathers gifting magical stories to their children 🎁
        </p>

      </div>
    </div>
  );
}
