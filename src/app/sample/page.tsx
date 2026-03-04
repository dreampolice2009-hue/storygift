"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── NOISE OVERLAY ─── */
function Noise() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px",
      }}
    />
  );
}

/* ─── CURSOR ─── */
function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (cursor.current) {
        cursor.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
    };
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a")) setHovered(true);
    };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);

  return (
    <>
      <div ref={dot} className="fixed top-0 left-0 w-2 h-2 bg-amber-400 rounded-full z-[999] pointer-events-none transition-transform duration-75" />
      <motion.div ref={cursor} animate={{ scale: hovered ? 2.5 : 1, opacity: hovered ? 0.6 : 0.3 }}
        className="fixed top-0 left-0 w-10 h-10 border border-amber-400 rounded-full z-[998] pointer-events-none"
        transition={{ type: "spring", stiffness: 300, damping: 28 }} />
    </>
  );
}

/* ─── SPLIT TEXT ANIMATION ─── */
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span key={i} className="inline-block"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── MAGNETIC BUTTON ─── */
function MagneticButton({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };

  return (
    <motion.button ref={ref} onMouseMove={handleMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={className} style={style}>
      {children}
    </motion.button>
  );
}

/* ─── FLOATING CARD ─── */
function StoryCard({ title, age, theme, delay }: { title: string; age: string; theme: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setTilt({ x: ((e.clientY - rect.top - rect.height / 2) / rect.height) * -10, y: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="relative rounded-2xl p-6 cursor-pointer group"
      whileHover={{ scale: 1.03 }}>
      {/* Glass bg */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 transition-all duration-500 group-hover:border-amber-400/30"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }} />
      {/* Top line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="relative z-10">
        <span className="text-3xl mb-4 block">📖</span>
        <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-2">{age} · {theme}</p>
        <h3 className="text-white font-bold text-lg leading-snug" style={{ fontFamily: "Playfair Display, serif" }}>{title}</h3>
        <div className="mt-4 flex items-center gap-2 text-amber-400/60 text-xs group-hover:text-amber-400 transition-colors">
          <span>Read story</span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MARQUEE ─── */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden py-4">
      <motion.div className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-white/20 text-sm uppercase tracking-[0.3em] font-medium flex items-center gap-12">
            {item} <span className="text-amber-400/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */
export default function SamplePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c < 200000 ? c + 3471 : 200000), 30);
    return () => clearInterval(t);
  }, []);

  const marqueeItems = ["Personalized Stories", "Arabic & English", "AI Illustrated", "Gift From Father", "Magical Adventures", "Children's Books"];

  return (
    <div className="bg-[#080510] min-h-screen overflow-x-hidden cursor-none">
      <Cursor />
      <Noise />

      {/* ── NAV ── */}
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 py-6"
        style={{ background: "rgba(8,5,16,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-sm">✨</div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "Playfair Display, serif" }}>StoryGift</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="hidden md:flex items-center gap-10 text-sm text-white/40">
          {["How it works", "Themes", "Gallery", "Pricing"].map(item => (
            <a key={item} href="#" className="hover:text-white transition-colors duration-300 relative group">
              {item}
              <span className="absolute -bottom-px left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <MagneticButton
            className="px-6 py-2.5 rounded-full text-sm font-bold text-black"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
            Create Story →
          </MagneticButton>
        </motion.div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
          <motion.div animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, #ec4899, transparent)", opacity: 0.08 }} />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <motion.div style={{ y: springY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl pt-24">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-amber-300 mb-10"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>✦</motion.span>
            Over {count.toLocaleString()} stories gifted worldwide
          </motion.div>

          {/* Headline */}
          <div className="text-6xl md:text-8xl font-black text-white leading-[1.0] mb-6 overflow-hidden"
            style={{ fontFamily: "Playfair Display, serif" }}>
            <div className="overflow-hidden pb-2">
              <SplitText text="A father's" className="block" delay={0.4} />
            </div>
            <div className="overflow-hidden pb-2">
              <SplitText text="greatest gift." className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent block" delay={0.6} />
            </div>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="text-white/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            A personalised story where your child is the hero. AI-illustrated. In Arabic or English. Ready in 60 seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-black text-lg group"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", boxShadow: "0 0 40px rgba(251,191,36,0.3)" }}>
              <span>✨</span>
              <span>Create a Story — Free</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
            </MagneticButton>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
              style={{ backdropFilter: "blur(10px)" }}>
              Watch a story come alive ▶
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="mt-16 flex items-center justify-center gap-12 text-center">
            {[["60s", "Story ready"], ["$0.07", "Cost per story"], ["99%", "Parent satisfaction"]].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-black text-white" style={{ fontFamily: "Playfair Display, serif" }}>{num}</div>
                <div className="text-white/30 text-xs mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          <span className="text-white/20 text-xs uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/5 py-2">
        <Marquee items={marqueeItems} />
      </div>

      {/* ── STORIES GRID ── */}
      <section className="py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-amber-400/60 text-xs uppercase tracking-[0.4em] mb-4">Stories created today</p>
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "Playfair Display, serif" }}>
              Every child.<br />Every adventure.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            <StoryCard title="Sara and the Dragon Who Lost His Roar" age="Age 7" theme="Courage" delay={0} />
            <StoryCard title="Adam's Journey to the Cloud Kingdom" age="Age 9" theme="Curiosity" delay={0.1} />
            <StoryCard title="Little Layla and the Sleepy Stars" age="Age 4" theme="Kindness" delay={0.2} />
            <StoryCard title="Omar the Brave and the Giant Wave" age="Age 8" theme="Never Give Up" delay={0.3} />
            <StoryCard title="The Girl Who Talked to Trees" age="Age 6" theme="Nature" delay={0.4} />
            <StoryCard title="Zaid and the Robot Who Wanted to Dream" age="Age 10" theme="Friendship" delay={0.5} />
          </div>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 70%)" }} />
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8" style={{ fontFamily: "Playfair Display, serif" }}>
            Their story<br />starts with<br />
            <span className="text-amber-400">yours.</span>
          </h2>
          <p className="text-white/40 text-lg mb-12">2 minutes. A lifetime memory.</p>
          <MagneticButton
            className="px-12 py-5 rounded-full font-black text-black text-xl"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", boxShadow: "0 0 80px rgba(251,191,36,0.25)" }}>
            Create Your Child's Story ✨
          </MagneticButton>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-16 border-t border-white/5 flex items-center justify-between">
        <span className="text-white/20 text-sm" style={{ fontFamily: "Playfair Display, serif" }}>StoryGift</span>
        <Link href="/create" className="text-amber-400/40 text-xs hover:text-amber-400 transition-colors">← Back to app</Link>
        <span className="text-white/10 text-xs">© 2026</span>
      </footer>
    </div>
  );
}
