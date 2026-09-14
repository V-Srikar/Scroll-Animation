"use client";

import React, { useEffect, useRef } from "react";

const TOTAL_FRAMES = 50;

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${frameNum}.png`;
};



export default function Home() {
        


  // Canvas and Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const isLoadedRef = useRef<boolean>(false);

  
  


  // Preload frames and establish smooth canvas rendering loop
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // 1. Prioritize frame 1 for instant display
    const firstImg = new window.Image();
    firstImg.src = getFramePath(0);
    images[0] = firstImg;
    firstImg.onload = () => {
      isLoadedRef.current = true;
      drawFrame(0);
    };

    // 2. Preload remaining frames progressively
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      images[i] = img;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPR and resize
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      drawFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Scroll listener for real-time progress mapping
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollableDist, 0), 1);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Persistent RequestAnimationFrame Render Loop with Smooth Lerp
    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderLoop = () => {
      if (prefersReducedMotion) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        const diff = targetFrameRef.current - currentFrameRef.current;
        // Smooth interpolation factor (Apple-level fluidity)
        currentFrameRef.current += diff * 0.12;
      }

      drawFrame(currentFrameRef.current);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Frame Draw Function (Aspect-Ratio Aware Cover Fit + Seamless Contrast Vignette)
  const drawFrame = (frameFloat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetIdx = Math.min(
      Math.max(Math.round(frameFloat), 0),
      TOTAL_FRAMES - 1
    );

    // Find the closest loaded frame to avoid any blank frame flickers
    let imgToDraw = imagesRef.current[targetIdx];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[targetIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          imgToDraw = prev;
          break;
        }
        const next = imagesRef.current[targetIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          imgToDraw = next;
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Cover math: maintain cinematic aspect ratio
    const imgW = imgToDraw.naturalWidth;
    const imgH = imgToDraw.naturalHeight;
    const canvasRatio = w / h;
    const imgRatio = imgW / imgH;

    let renderW: number;
    let renderH: number;
    let renderX: number;
    let renderY: number;

    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      renderX = 0;
      renderY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      renderX = (w - renderW) / 2;
      renderY = 0;
    }

    ctx.drawImage(imgToDraw, renderX, renderY, renderW, renderH);

    // Luxurious subtle dark vignette overlay for seamless contrast & editorial typography legibility
    const gradient = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.2,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.75
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.25)");
    gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.65)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.92)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  };

  return (
    <div className="w-full bg-black text-[#f5f5f7] font-sans selection:bg-purple-500/30 selection:text-white">
      {/* ========================================================================= */}
      {/* HERO SECTION: Pinned 400vh Scroll Sequence with Atmospheric Shadow & Hero UI */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="relative w-full h-[400vh] bg-black"
      >
        {/* Sticky Fullscreen Frame Pin */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
          />

          {/* Atmospheric Cinematic Dark Shadow/Gradient Behind Left Headline (fading 10-25% to 45-50%) */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background:
                "radial-gradient(ellipse 70% 85% at 16% 45%, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.82) 22%, rgba(0, 0, 0, 0.45) 42%, rgba(0, 0, 0, 0.08) 58%, transparent 72%)",
            }}
          />

          {/* Soft violet/lavender cosmic accent bloom */}
          <div
            className="absolute top-1/4 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none z-[6] opacity-35 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)",
            }}
          />

          {/* Hero UI Overlay: Fixed/Pinned over Sticky Canvas */}
          <div className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-x-hidden pointer-events-none z-10">
            {/* Main Hero Section: headline only, centered */}
            <section className="relative z-10 w-full flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-8 md:py-12 pointer-events-auto">
              <div className="max-w-[1360px] w-full mx-auto flex items-center justify-start">
                <div className="flex flex-col items-start max-w-xl">
                  <h1 className="text-3xl sm:text-4xl md:text-[46px] lg:text-[52px] font-medium tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#f3edff] to-[#d6c4f8] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                    Scroll animation created by Srikar
                  </h1>
                </div>
              </div>
            </section>

            {/* Massive Minimalist Editorial Brand Typography ("DREAMFRAME" - 90vw wide, white/lavender gradient, soft glow) */}
            <footer className="relative z-10 w-full overflow-hidden flex items-end justify-center pointer-events-none select-none pb-2 sm:pb-4">
              <div className="w-[90vw] max-w-[1520px] text-center mx-auto">
                <h2
                  className="w-full font-light uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ede6ff] to-[#c6b0f6] leading-none tracking-[-0.03em] text-center drop-shadow-[0_0_40px_rgba(192,132,252,0.3)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
                  style={{
                    fontSize: "clamp(3.5rem, 13.5vw, 15rem)",
                    fontFamily: "var(--font-outfit), sans-serif",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.82,
                  }}
                >
                  DREAMFRAME
                </h2>
              </div>
            </footer>
          </div>
        </div>
      </div>

    </div>
  );
}
