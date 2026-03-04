"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// SVG Components
function OwlSVG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="20" fill="#F59E0B" />
      <circle cx="24" cy="26" r="5" fill="white" />
      <circle cx="36" cy="26" r="5" fill="white" />
      <circle cx="24" cy="26" r="3" fill="#1C1917" />
      <circle cx="36" cy="26" r="3" fill="#1C1917" />
      <path d="M20 18L15 12L18 18Z" fill="#F59E0B" />
      <path d="M40 18L45 12L42 18Z" fill="#F59E0B" />
      <path d="M26 35Q30 38 34 35" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="33" r="2" fill="#F59E0B" />
    </svg>
  );
}

function FoxSVG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 10L20 25L30 30L20 25L15 10Z" fill="#F97316" />
      <path d="M45 10L40 25L30 30L40 25L45 10Z" fill="#F97316" />
      <circle cx="30" cy="35" r="15" fill="#F97316" />
      <circle cx="25" cy="32" r="3" fill="white" />
      <circle cx="35" cy="32" r="3" fill="white" />
      <circle cx="25" cy="32" r="1.5" fill="#1C1917" />
      <circle cx="35" cy="32" r="1.5" fill="#1C1917" />
      <path d="M30 38L27 42L30 41L33 42L30 38Z" fill="white" />
      <circle cx="30" cy="38" r="1.5" fill="#1C1917" />
    </svg>
  );
}

function LandscapeSVG() {
  return (
    <svg width="100%" height="200" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FEF3C7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FFFBF0", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="1440" height="200" fill="url(#skyGradient)" />
      
      {/* Sun */}
      <circle cx="1200" cy="40" r="30" fill="#F59E0B" opacity="0.6" />
      
      {/* Clouds */}
      <ellipse cx="200" cy="50" rx="40" ry="20" fill="white" opacity="0.7" />
      <ellipse cx="220" cy="45" rx="35" ry="18" fill="white" opacity="0.7" />
      <ellipse cx="600" cy="60" rx="50" ry="25" fill="white" opacity="0.7" />
      <ellipse cx="625" cy="55" rx="40" ry="20" fill="white" opacity="0.7" />
      <ellipse cx="1100" cy="70" rx="45" ry="22" fill="white" opacity="0.7" />
      
      {/* Stars */}
      <path d="M100 30L102 36L108 36L103 40L105 46L100 42L95 46L97 40L92 36L98 36Z" fill="#F59E0B" opacity="0.4" />
      <path d="M900 25L902 31L908 31L903 35L905 41L900 37L895 41L897 35L892 31L898 31Z" fill="#7C3AED" opacity="0.4" />
      
      {/* Rolling hills */}
      <path d="M0 120Q360 80 720 120T1440 120V200H0Z" fill="#10B981" opacity="0.3" />
      <path d="M0 140Q360 100 720 140T1440 140V200H0Z" fill="#10B981" opacity="0.5" />
      <path d="M0 160Q360 130 720 160T1440 160V200H0Z" fill="#10B981" opacity="0.7" />
      
      {/* Trees */}
      <g>
        <rect x="250" y="140" width="8" height="30" fill="#78716C" />
        <circle cx="254" cy="140" r="20" fill="#10B981" />
      </g>
      <g>
        <rect x="450" y="135" width="10" height="35" fill="#78716C" />
        <circle cx="455" cy="135" r="25" fill="#10B981" />
      </g>
      <g>
        <rect x="850" y="145" width="8" height="28" fill="#78716C" />
        <circle cx="854" cy="145" r="18" fill="#10B981" />
      </g>
      <g>
        <rect x="1150" y="138" width="9" height="32" fill="#78716C" />
        <circle cx="1154.5" cy="138" r="22" fill="#10B981" />
      </g>
      
      {/* Small house */}
      <g>
        <rect x="680" y="145" width="40" height="35" fill="#F59E0B" opacity="0.8" />
        <path d="M675 145L700 125L725 145Z" fill="#7C3AED" opacity="0.8" />
        <rect x="690" y="160" width="12" height="20" fill="#78716C" />
        <rect x="708" y="152" width="8" height="8" fill="white" opacity="0.6" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        
        .playfair {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div style={{ backgroundColor: "#FFFBF0" }} className="min-h-screen">
        {/* NAVBAR */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            backgroundColor: isScrolled ? "rgba(255, 251, 240, 0.95)" : "rgba(255, 251, 240, 0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: isScrolled ? "1px solid #FEF3C7" : "none"
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl playfair font-bold" style={{ color: "#F59E0B" }}>
              ✨ StoryGift
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how" className="text-sm font-medium transition-colors" style={{ color: "#78716C" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F59E0B"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>
                How it works
              </Link>
              <Link href="#stories" className="text-sm font-medium transition-colors" style={{ color: "#78716C" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F59E0B"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>
                Stories
              </Link>
              <Link href="#pricing" className="text-sm font-medium transition-colors" style={{ color: "#78716C" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F59E0B"} onMouseLeave={(e) => e.currentTarget.style.color = "#78716C"}>
                Pricing
              </Link>
            </div>

            <button className="px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-transform hover:scale-105" style={{ backgroundColor: "#F59E0B" }}>
              Create a Story
            </button>
          </div>
        </motion.nav>

        {/* HERO */}
        <section className="min-h-screen flex items-center pt-20 px-6">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUpVariants} className="inline-block px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "#FEF3C7", color: "#78716C", fontSize: "14px" }}>
                🎁 The perfect gift for your child
              </motion.div>
              
              <motion.h1 variants={fadeUpVariants} className="playfair font-black mb-6" style={{ fontSize: "clamp(36px, 6vw, 64px)", lineHeight: "1.15", color: "#1C1917" }}>
                Give them a story<br />
                they'll never<br />
                <span style={{ color: "#F59E0B" }}>forget.</span>
              </motion.h1>
              
              <motion.p variants={fadeUpVariants} className="text-lg mb-8" style={{ color: "#78716C", lineHeight: "1.7" }}>
                A personalised AI storybook where <strong style={{ color: "#1C1917" }}>YOUR child is the hero</strong>. Arabic or English. Ready in 60 seconds.
              </motion.p>
              
              <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-4 mb-8">
                <button className="px-8 py-4 rounded-full font-bold text-white text-lg transition-transform hover:scale-105" style={{ backgroundColor: "#F59E0B" }}>
                  ✨ Create Free Story
                </button>
                <button className="px-8 py-4 rounded-full font-semibold border-2 transition-all hover:border-[#F59E0B] hover:text-[#F59E0B]" style={{ borderColor: "#78716C", color: "#78716C" }}>
                  See an example →
                </button>
              </motion.div>
              
              <motion.p variants={fadeUpVariants} className="text-sm" style={{ color: "#78716C" }}>
                <strong style={{ color: "#1C1917" }}>200,000+ stories gifted</strong> • Arabic & English • Loved by fathers
              </motion.p>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              {/* Floating emojis */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-8 text-4xl"
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-12 right-8 text-4xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [5, -15, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-24 left-4 text-4xl"
              >
                🦊
              </motion.div>
              <motion.div
                animate={{ y: [-8, 12, -8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-32 right-4 text-4xl"
              >
                🌙
              </motion.div>

              {/* SVG owl and fox */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-16 left-16"
              >
                <OwlSVG />
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                className="absolute bottom-16 right-16"
              >
                <FoxSVG />
              </motion.div>

              {/* Floating book card */}
              <motion.div
                animate={{ y: [-15, 0, -15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ width: "320px", height: "440px", border: "2px solid #FEF3C7" }}
              >
                <div className="h-48 relative" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #7C3AED 100%)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl">📖</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: "#FEF3C7", color: "#F59E0B" }}>
                    ✨ Personalised
                  </div>
                  <h3 className="playfair font-bold text-2xl mb-2" style={{ color: "#1C1917" }}>
                    Sara's Magical<br />Adventure
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#78716C" }}>
                    A brave girl discovers a secret garden where dreams come true...
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FEF3C7" }}>
                      👧
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#1C1917" }}>Starring Sara</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="playfair font-black text-center mb-16"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1C1917" }}
            >
              How it works
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { emoji: "📝", title: "Tell us about your child", desc: "Name, age, interests. Takes 30 seconds." },
                { emoji: "🤖", title: "AI creates the magic", desc: "Our AI crafts a unique story in 60 seconds." },
                { emoji: "🎁", title: "Gift it forever", desc: "Download PDF, share on WhatsApp, or print." }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">{step.emoji}</div>
                  <h3 className="playfair font-bold text-xl mb-2" style={{ color: "#1C1917" }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "#78716C" }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ILLUSTRATED SCENE */}
        <section className="w-full">
          <LandscapeSVG />
        </section>

        {/* STORY THEMES */}
        <section id="stories" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="playfair font-black text-center mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1C1917" }}
            >
              Every child. Every dream.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 text-lg"
              style={{ color: "#78716C" }}
            >
              Choose from six magical themes
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "🦁", title: "Adventure", desc: "Brave journeys to faraway lands" },
                { emoji: "🦋", title: "Friendship", desc: "Stories about kindness and connection" },
                { emoji: "🌊", title: "Discovery", desc: "Exploring new worlds and ideas" },
                { emoji: "🌟", title: "Courage", desc: "Overcoming fears and challenges" },
                { emoji: "🦊", title: "Animals", desc: "Meet magical creatures and companions" },
                { emoji: "🏰", title: "Fantasy", desc: "Castles, magic, and wonder" }
              ].map((theme, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 cursor-pointer transition-all"
                  style={{ border: "2px solid #FEF3C7" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#F59E0B"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#FEF3C7"}
                >
                  <div className="text-5xl mb-4">{theme.emoji}</div>
                  <h3 className="playfair font-bold text-xl mb-2" style={{ color: "#1C1917" }}>
                    {theme.title}
                  </h3>
                  <p style={{ color: "#78716C" }}>{theme.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-6" style={{ backgroundColor: "#FEF3C7" }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="playfair font-black text-center mb-16"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1C1917" }}
            >
              Loved by fathers
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Ahmed", location: "Dubai", quote: "My daughter cried happy tears. Best gift ever.", stars: 5 },
                { name: "Khalid", location: "Riyadh", quote: "I ordered it in Arabic. Perfect Ramadan gift.", stars: 5 },
                { name: "Omar", location: "Abu Dhabi", quote: "Ready in 60 seconds. My son's face was priceless.", stars: 5 }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, j) => (
                      <span key={j} className="text-xl" style={{ color: "#F59E0B" }}>⭐</span>
                    ))}
                  </div>
                  <p className="mb-6 text-lg" style={{ color: "#1C1917" }}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-bold" style={{ color: "#1C1917" }}>{testimonial.name}</p>
                    <p className="text-sm" style={{ color: "#78716C" }}>{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING CTA */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="playfair font-black mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#1C1917" }}
            >
              One story.<br />A lifetime of magic.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-8"
              style={{ color: "#F59E0B" }}
            >
              From $4.99 per story
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="px-12 py-5 rounded-full font-bold text-white text-xl mb-8 pulse-glow"
              style={{ backgroundColor: "#F59E0B" }}
            >
              ✨ Create Your Story Now
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm"
              style={{ color: "#78716C" }}
            >
              No subscription • Instant download • 100% happiness guarantee
            </motion.p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 border-t" style={{ borderColor: "#FEF3C7" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl playfair font-bold" style={{ color: "#F59E0B" }}>
              ✨ StoryGift
            </Link>
            <p className="text-sm" style={{ color: "#78716C" }}>
              Made with ❤️ for fathers everywhere
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
