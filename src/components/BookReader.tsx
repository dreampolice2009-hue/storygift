"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Download, Share2, Loader2 } from "lucide-react";

interface BookPage {
  type: string;
  image: string | null;
  text: string;
  title?: string;
}

interface BookReaderProps {
  title: string;
  pages: BookPage[];
  wisdom: string;
  language: string;
  childName: string;
}

export default function BookReader({ title, pages, wisdom, language, childName }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const isRTL = language === "ar";
  const totalPages = pages.length;
  const page = pages[currentPage];

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) { setFlipDir("next"); setCurrentPage(p => p + 1); }
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) { setFlipDir("prev"); setCurrentPage(p => p - 1); }
  }, [currentPage]);

  // PDF Export — captures each spread as an image and builds a PDF
  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [900, 506] });
      const savedPage = currentPage;

      for (let i = 0; i < totalPages; i++) {
        setCurrentPage(i);
        await new Promise(r => setTimeout(r, 600)); // wait for render

        if (bookRef.current) {
          const canvas = await html2canvas(bookRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#0a0612",
            logging: false,
            onclone: (doc) => {
              // Replace oklab colors that html2canvas can't parse
              doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
                const style = el.style;
                ["color", "backgroundColor", "borderColor", "outlineColor"].forEach((prop) => {
                  const val = style.getPropertyValue(prop);
                  if (val.includes("oklab") || val.includes("oklch")) {
                    el.style.setProperty(prop, "#ffffff");
                  }
                });
              });
            },
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.92);
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, 0, 900, 506);
        }
      }

      setCurrentPage(savedPage);
      pdf.save(`${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Share — Web Share API with WhatsApp fallback
  const handleShare = async () => {
    setSharing(true);
    const shareText = `✨ "${title}" — A personalised story created with StoryGift\n\nRead it at: https://storygift.app`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText });
      } else {
        // WhatsApp fallback
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, "_blank");
      }
    } catch {
      // Copy to clipboard as last resort
      await navigator.clipboard.writeText(shareText);
      alert("Story link copied to clipboard!");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title */}
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white text-center px-4"
        style={{ fontFamily: "Playfair Display, serif" }}>
        {title}
      </motion.h2>

      {/* Book */}
      <div className="relative w-full max-w-4xl px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            ref={bookRef}
            initial={{ opacity: 0, rotateY: flipDir === "next" ? -12 : 12, x: flipDir === "next" ? 30 : -30 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: flipDir === "next" ? 12 : -12, x: flipDir === "next" ? -30 : 30 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d", perspective: 1200 }}
          >
            {/* ── COVER ── */}
            {page?.type === "cover" && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20" style={{ aspectRatio: "16/9" }}>
                {page.image
                  ? <img src={page.image} alt="Cover" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-800" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-10">
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-3">
                    {childName ? `✨ A story for ${childName}` : "✨ A magical story"}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "Playfair Display, serif" }} dir={isRTL ? "rtl" : "ltr"}>
                    {title}
                  </h1>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/40 to-transparent" />
              </div>
            )}

            {/* ── STORY SPREAD ── */}
            {page?.type === "story" && (
              <div className="grid grid-cols-2 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10" style={{ aspectRatio: "16/9", minHeight: "420px" }}>
                {/* Left — Illustration */}
                <div className="relative bg-gradient-to-br from-indigo-900/50 to-violet-900/30 overflow-hidden">
                  {page.image
                    ? <img src={page.image} alt="Illustration" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-16 h-16 text-white/10" /></div>
                  }
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/25 text-xs font-serif">{currentPage * 2 - 1}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
                </div>

                {/* Right — Text */}
                <div className="relative flex flex-col justify-center p-8 md:p-12" style={{ background: "#f9f5ef" }} dir={isRTL ? "rtl" : "ltr"}>
                  {/* Ruled lines */}
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #8b5cf6 31px, #8b5cf6 32px)", backgroundPosition: "0 48px" }} />
                  {/* Margin line */}
                  <div className="absolute left-16 top-0 bottom-0 w-px bg-pink-300/20" />
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />

                  <p className="text-gray-800 leading-relaxed md:leading-[1.9] relative z-10 text-[clamp(0.85rem,1.4vw,1.05rem)]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    {page.text}
                  </p>
                  <div className="absolute bottom-3 right-1/2 translate-x-1/2 text-gray-400/50 text-xs font-serif">{currentPage * 2}</div>
                </div>
              </div>
            )}

            {/* ── WISDOM / END ── */}
            {page?.type === "wisdom" && (
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 flex flex-col items-center justify-center p-12 md:p-20 text-center"
                style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(139,92,246,0.12))", backdropFilter: "blur(20px)" }}>
                <div className="text-6xl mb-6">✨</div>
                <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>The End</p>
                <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-2xl" style={{ fontFamily: "Playfair Display, serif" }} dir={isRTL ? "rtl" : "ltr"}>
                  "{wisdom}"
                </blockquote>
                <div className="mt-10 flex gap-4 flex-wrap justify-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadPDF} disabled={exporting}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white border border-white/15 hover:border-white/30 bg-white/5 disabled:opacity-50">
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {exporting ? "Creating PDF..." : "Save as PDF"}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleShare} disabled={sharing}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-amber-900"
                    style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                    {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    {sharing ? "Sharing..." : "🎁 Gift This Story"}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goPrev} disabled={currentPage === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goNext} disabled={currentPage === totalPages - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Page dots */}
      <div className="flex gap-2 items-center">
        {pages.map((_, i) => (
          <motion.button key={i}
            onClick={() => { setFlipDir(i > currentPage ? "next" : "prev"); setCurrentPage(i); }}
            animate={{ scale: i === currentPage ? 1.5 : 1, opacity: i === currentPage ? 1 : 0.3 }}
            className="w-2 h-2 rounded-full bg-amber-400" />
        ))}
      </div>
      <p className="text-white/20 text-xs">Click arrows or dots to flip pages</p>
    </div>
  );
}
