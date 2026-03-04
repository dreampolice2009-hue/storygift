"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Star, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

/* ── Floating sparkle particle ── */
function Sparkle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        y: [0, -40, -80],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
        ease: "easeOut",
      }}
    />
  );
}

/* ── Tilt card on mouse ── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Morphing blob background ── */
function MorphBlob({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Floating 3D book (CSS only) ── */
function FloatingBook() {
  return (
    <motion.div
      animate={{ y: [0, -16, 0], rotateZ: [-2, 2, -2] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 800 }}
      className="relative w-48 h-64 mx-auto"
    >
      {/* Book body */}
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        {/* Cover */}
        <div className="absolute inset-0 rounded-r-lg rounded-l-sm bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-400/50 flex flex-col items-center justify-center p-6 border-l-4 border-amber-600">
          <div className="text-5xl mb-3">📖</div>
          <div className="text-white font-bold text-sm text-center leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
            Once Upon<br />a Gift
          </div>
          <div className="mt-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-200 text-yellow-200" />
            ))}
          </div>
        </div>
        {/* Spine shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-700/40 rounded-l-sm" />
        {/* Pages */}
        <div className="absolute -right-2 top-1 bottom-1 w-3 bg-gradient-to-l from-gray-100 to-white rounded-r-sm shadow-sm" />
      </motion.div>

      {/* Glow under book */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-400/30 blur-xl rounded-full"
        animate={{ scaleX: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </motion.div>
  );
}

/* ── Glass card ── */
function GlassCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-2xl p-6 border border-white/30 backdrop-blur-xl shadow-xl overflow-hidden group cursor-default"
      style={{
        background: "rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* Inner glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
      />
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Playfair Display, serif" }}>{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ── Typing text effect ── */
function TypeWriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="text-amber-300">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-amber-300 ml-1 align-middle"
      />
    </span>
  );
}

/* ═══════════════════════════════ MAIN PAGE ═══════════════════════════════ */
export default function DemoPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 80, damping: 20 });

  const sparkles = [
    { x: "10%", y: "20%", delay: 0 },
    { x: "25%", y: "60%", delay: 0.5 },
    { x: "45%", y: "15%", delay: 1 },
    { x: "65%", y: "70%", delay: 0.3 },
    { x: "80%", y: "30%", delay: 0.8 },
    { x: "90%", y: "55%", delay: 1.4 },
    { x: "55%", y: "85%", delay: 0.6 },
    { x: "15%", y: "80%", delay: 1.8 },
  ];

  return (
    <div className="bg-[#0a0612] min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(10,6,18,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white text-lg" style={{ fontFamily: "Playfair Display, serif" }}>
            StoryGift
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-white/50">
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Themes</a>
          <a href="#" className="hover:text-white transition-colors">Gallery</a>
        </div>
        <Link href="/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full text-sm font-semibold text-amber-900"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
          >
            Create Story
          </motion.button>
        </Link>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Morphing blobs */}
        <MorphBlob className="w-[600px] h-[600px] bg-violet-600 -top-20 -left-40" />
        <MorphBlob className="w-[500px] h-[500px] bg-amber-500 -bottom-20 -right-40" />
        <MorphBlob className="w-[300px] h-[300px] bg-pink-500 top-1/3 left-1/2" />

        {/* Sparkles */}
        {sparkles.map((s, i) => <Sparkle key={i} {...s} />)}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ y: springY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 pt-32 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 text-amber-400 text-sm mb-8"
            style={{ background: "rgba(251,191,36,0.08)" }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalized stories for every child</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold text-white leading-[1.05] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Stories that make
            <br />
            <TypeWriter texts={["heroes.", "dreamers.", "readers.", "believers."]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/50 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Gift your child a story where <em className="text-white/80 not-italic">they are the hero</em>.
            Crafted with love. Ready in seconds.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(251,191,36,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-amber-900 text-lg"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
              >
                <Heart className="w-5 h-5" />
                Create a Story
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full font-semibold text-white text-lg border border-white/15 hover:border-white/30 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
            >
              See an Example
            </motion.button>
          </motion.div>

          {/* Floating book */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20"
          >
            <TiltCard>
              <FloatingBook />
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      {/* ── GLASS CARDS ── */}
      <section className="relative py-32 px-6">
        <MorphBlob className="w-[400px] h-[400px] bg-violet-700 top-0 left-1/4 opacity-20" />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              How the magic works
            </h2>
            <p className="text-white/40 text-lg">Three steps. One story. A lifetime memory.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard
              icon="👶"
              title="Tell us about your child"
              desc="Name, age, favourite things. The more you share, the more personal the story."
              delay={0}
            />
            <GlassCard
              icon="✨"
              title="We craft the story"
              desc="Your child becomes the hero. The moral you choose becomes the soul of the tale."
              delay={0.15}
            />
            <GlassCard
              icon="🎁"
              title="Gift it with love"
              desc="Download as a beautiful PDF, share via WhatsApp, or read it aloud tonight."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── STORY PREVIEW (glass) ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TiltCard>
              <div
                className="rounded-3xl p-10 border border-white/10 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">O</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Omar's gift to Sara</p>
                    <p className="text-white/40 text-xs">Age 7 • Theme: Courage</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  "Sara and the Dragon Who Lost His Roar"
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  Sara had never planned to find a dragon in her grandmother's garden. But there he was — enormous, green, and sitting behind the rosebushes looking extremely sorry for himself...
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-8 w-full py-3 rounded-xl text-amber-900 font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
                >
                  Read the Full Story →
                </motion.button>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="text-white font-bold" style={{ fontFamily: "Playfair Display, serif" }}>StoryGift</span>
        </div>
        <p className="text-white/25 text-sm">Made with love for fathers everywhere. © 2026 StoryGift.</p>
        <div className="mt-6">
          <Link href="/">
            <span className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors cursor-pointer">← Back to original design</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
