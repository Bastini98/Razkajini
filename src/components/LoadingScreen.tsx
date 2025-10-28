import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  isReady: boolean;
  onComplete?: () => void;
  imageSrc: string;                   // ЕДИНСТВЕНА корица
  hingeOnViewportLeft?: boolean;      // <- сгъвка в най-левия ръб на екрана
  peelMs?: number;
  overshootMs?: number;
  overshootPct?: number;              // 0..0.2
  fadeOutMs?: number;
  minShowMs?: number;
  maxThetaDeg?: number;
  letterboxBg?: string;               // фон извън изображението
};

const LoadingScreen: React.FC<Props> = ({
  isReady,
  onComplete,
  imageSrc,
  hingeOnViewportLeft = true,         // ← ПО ПОДРАЗБИРАНЕ: в най-ляво
  peelMs = 2200,
  overshootMs = 420,
  overshootPct = 0.06,
  fadeOutMs = 650,
  minShowMs = 650, 
  maxThetaDeg = 160,
  letterboxBg = "linear-gradient(180deg,#f7f2e9 0%, #efe7db 100%)",
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLImageElement | null>(null);

  const [imgReady, setImgReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const openedRef = useRef(false);
  const mountedAt = useRef(Date.now());

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // ── Прелоуд + измерване на real draw box (за contain) ───────────────────────
  const measure = () => {
    const img = probeRef.current;
    if (!img) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const natW = img.naturalWidth || vw;
    const natH = img.naturalHeight || vh;
    const imgR = natW / natH;
    const viewR = vw / vh;

    let drawW: number, drawH: number, offX: number, offY: number;
    if (viewR > imgR) {
      drawH = vh;
      drawW = vh * imgR;
      offX = (vw - drawW) / 2;
      offY = 0;
    } else {
      drawW = vw;
      drawH = vw / imgR;
      offX = 0;
      offY = (vh - drawH) / 2;
    }

    const hingePx = hingeOnViewportLeft ? 0 : offX; // ако някога искаш „гръбнакът“ върху самата картинка → offX

    const root = rootRef.current!;
    root.style.setProperty("--drawW", `${drawW}px`);
    root.style.setProperty("--drawH", `${drawH}px`);
    root.style.setProperty("--offX", `${offX}px`);
    root.style.setProperty("--offY", `${offY}px`);
    root.style.setProperty("--hinge", `${hingePx}px`);
  };

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgReady(true);
      if (probeRef.current) {
        probeRef.current.src = imageSrc;
        measure();
      }
    };
    img.onerror = () => {
      setImgReady(true);
      if (probeRef.current) {
        probeRef.current.src = imageSrc;
        measure();
      }
    };
  }, [imageSrc, hingeOnViewportLeft]);

  useEffect(() => {
    const onR = () => measure();
    window.addEventListener("resize", onR);
    window.addEventListener("orientationchange", onR);
    return () => {
      window.removeEventListener("resize", onR);
      window.removeEventListener("orientationchange", onR);
    };
  }, []);

  // ── Заключи скрол докато е видим ────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const prevH = document.documentElement.style.overflow;
    const prevB = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevH;
      document.body.style.overflow = prevB;
    };
  }, [visible]);

  // ── Инициализация на променливите ──────────────────────────────────────────
  useEffect(() => {
    if (!rootRef.current) return;
    (async () => {
      const { gsap } = await import("gsap");
      gsap.set(rootRef.current, {
        "--t": 0,
        "--theta": "0deg",
        "--drawW": "100vw",
        "--drawH": "100vh",
        "--offX": "0px",
        "--offY": "0px",
        "--hinge": "0px",
      } as any);
    })();
  }, []);

  // ── Анимация (прелистване + fade) ───────────────────────────────────────────
  useEffect(() => {
    if (!visible || openedRef.current) return;
    if (!(imgReady && isReady)) return;

    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, minShowMs - elapsed);

    let to: number | undefined;
    let ctx: any;

    const run = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        tl.to(rootRef.current, { ["--t" as any]: 1, duration: peelMs / 1000 }, 0);
        tl.to(rootRef.current, { ["--theta" as any]: `${maxThetaDeg}deg`, duration: peelMs / 1000 }, 0);

        if (overshootPct > 0 && overshootMs > 0) {
          const b = 1 - overshootPct;
          tl.to(rootRef.current, { ["--t" as any]: b, duration: overshootMs / 1000 });
          tl.to(rootRef.current, { ["--theta" as any]: `${(maxThetaDeg * b).toFixed(2)}deg`, duration: overshootMs / 1000 }, "<");
          tl.to(rootRef.current, { ["--t" as any]: 1, duration: (overshootMs * 0.9) / 1000, ease: "power1.out" });
          tl.to(rootRef.current, { ["--theta" as any]: `${maxThetaDeg}deg`, duration: (overshootMs * 0.9) / 1000, ease: "power1.out" }, "<");
        }

        tl.to(overlayRef.current, {
          opacity: 0,
          duration: fadeOutMs / 1000,
          ease: "power2.out",
          onComplete: () => { setVisible(false); onComplete?.(); },
        }, "+=0.06");
      });
      openedRef.current = true;
    };

    to = window.setTimeout(run, wait);
    return () => { if (to) window.clearTimeout(to); ctx?.revert?.(); };
  }, [isReady, imgReady, minShowMs, peelMs, overshootMs, overshootPct, fadeOutMs, visible, onComplete, maxThetaDeg, prefersReduced]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] select-none"
      aria-hidden="true"
      style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "transparent" }}
    >
      <div
        ref={rootRef}
        style={
          {
            position: "absolute",
            inset: 0,
            perspective: "1600px",
            "--t": 0,
            "--theta": "0deg",
          } as React.CSSProperties
        }
      >
        {/* скрито img за naturalWidth/Height */}
        <img ref={probeRef} src="" alt="" style={{ position: "absolute", width: 0, height: 0, opacity: 0 }} />

        {/* LETTERBOX панели – правят крем фон извън изображението */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "var(--offX)", height: "100%", background: letterboxBg }} />
        <div style={{ position: "absolute", top: 0, left: "calc(var(--offX) + var(--drawW))", width: "calc(100vw - (var(--offX) + var(--drawW)))", height: "100%", background: letterboxBg }} />
        <div style={{ position: "absolute", top: 0, left: "var(--offX)", width: "var(--drawW)", height: "var(--offY)", background: letterboxBg }} />
        <div style={{ position: "absolute", top: "calc(var(--offY) + var(--drawH))", left: "var(--offX)", width: "var(--drawW)", height: "calc(100vh - (var(--offY) + var(--drawH)))", background: letterboxBg }} />

        {/* ЛЯВА СТАТИЧНА ЗОНА – ако hinge е вляво на viewport-а, тази ширина става 0 */}
        <div
          style={{
            position: "absolute",
            top: "var(--offY)",
            left: "var(--offX)",
            width: "var(--drawW)",
            height: "var(--drawH)",
            overflow: "hidden",
            clipPath:
              "polygon(0 0, max(0px, calc(var(--hinge) - var(--offX))) 0, max(0px, calc(var(--hinge) - var(--offX))) 100%, 0 100%)",
          } as React.CSSProperties}
        >
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "var(--drawW)",
              height: "var(--drawH)",
              objectFit: "fill",
              display: "block",
            } as React.CSSProperties}
          />
          {/* сянка по сгъвката (ако има видима лява част) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "calc(max(0px, calc(var(--hinge) - var(--offX))) - clamp(24px,6vw,80px))",
              width: "clamp(24px,6vw,80px)",
              height: "100%",
              background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0))",
              opacity: 0.5,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ДЯСНАТА СТРАНИЦА (листът) – anchored на hinge = 0px → в най-ляво на viewport-а */}
        <div
          style={{
            position: "absolute",
            top: "var(--offY)",
            left: "var(--hinge)",
            width: "max(0px, calc(var(--offX) + var(--drawW) - var(--hinge)))",
            height: "var(--drawH)",
            overflow: "visible",
            pointerEvents: "none",
          } as React.CSSProperties}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
              transform: "rotateY(calc(-1 * var(--theta)))",
              willChange: "transform",
              boxShadow: "0 14px 36px rgba(0,0,0,0.22)",
            } as React.CSSProperties}
          >
            {/* FACE – дясната част на СЪЩАТА картинка */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden" }}>
              <img
                src={imageSrc}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "calc(-1 * (var(--hinge) - var(--offX)))", // компенсира hinge в координатите на картинката
                  width: "var(--drawW)",
                  height: "var(--drawH)",
                  objectFit: "fill",
                  display: "block",
                } as React.CSSProperties}
              />
            </div>

            {/* РЪБ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "2px",
                background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.12))",
                transform: "translateZ(0.6px)",
              }}
            />

            {/* BACK – прозрачен (виждаш hero долу) */}
            <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 30%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0) 100%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
 