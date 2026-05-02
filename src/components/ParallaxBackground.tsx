import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type ThemeType = "blue" | "purple" | "green" | "amber";

interface ParallaxBackgroundProps {
  theme?: ThemeType;
}

interface ThemeColors {
  farBlob1: string;
  farBlob2: string;
  midGlow1: string;
  midGlow2: string;
  midGlow3: string;
  nearAccent1: string;
  nearAccent2: string;
  nearAccent3: string;
  nearAccent4: string;
}

const THEMES: Record<ThemeType, ThemeColors> = {
  blue: {
    farBlob1: "bg-blue-600/20",
    farBlob2: "bg-cyan-500/15",
    midGlow1: "bg-cyan-400/20",
    midGlow2: "bg-blue-500/15",
    midGlow3: "bg-indigo-500/20",
    nearAccent1: "bg-cyan-300/25",
    nearAccent2: "bg-blue-400/20",
    nearAccent3: "bg-indigo-400/20",
    nearAccent4: "bg-cyan-500/15",
  },
  purple: {
    farBlob1: "bg-purple-600/20",
    farBlob2: "bg-violet-500/15",
    midGlow1: "bg-violet-400/20",
    midGlow2: "bg-purple-500/15",
    midGlow3: "bg-fuchsia-500/20",
    nearAccent1: "bg-violet-300/25",
    nearAccent2: "bg-purple-400/20",
    nearAccent3: "bg-fuchsia-400/20",
    nearAccent4: "bg-violet-500/15",
  },
  green: {
    farBlob1: "bg-green-600/20",
    farBlob2: "bg-emerald-500/15",
    midGlow1: "bg-emerald-400/20",
    midGlow2: "bg-green-500/15",
    midGlow3: "bg-teal-500/20",
    nearAccent1: "bg-emerald-300/25",
    nearAccent2: "bg-green-400/20",
    nearAccent3: "bg-teal-400/20",
    nearAccent4: "bg-emerald-500/15",
  },
  amber: {
    farBlob1: "bg-amber-600/20",
    farBlob2: "bg-orange-500/15",
    midGlow1: "bg-orange-400/20",
    midGlow2: "bg-amber-500/15",
    midGlow3: "bg-yellow-500/20",
    nearAccent1: "bg-orange-300/25",
    nearAccent2: "bg-amber-400/20",
    nearAccent3: "bg-yellow-400/20",
    nearAccent4: "bg-orange-500/15",
  },
};

const ParallaxBackground = ({ theme = "blue" }: ParallaxBackgroundProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 20, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const farX = useTransform(smoothX, (v) => v * 0.02);
  const farY = useTransform(smoothY, (v) => v * 0.02);
  const midX = useTransform(smoothX, (v) => v * 0.05);
  const midY = useTransform(smoothY, (v) => v * 0.05);
  const nearX = useTransform(smoothX, (v) => v * 0.1);
  const nearY = useTransform(smoothY, (v) => v * 0.1);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const colors = THEMES[theme] ?? THEMES.blue;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-slate-900" />

      {/* Far layer — large blobs, slowest drift */}
      <motion.div style={{ x: farX, y: farY }} className="absolute inset-0">
        <div
          className={`absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full ${colors.farBlob1} blur-3xl`}
        />
        <div
          className={`absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full ${colors.farBlob2} blur-3xl`}
        />
      </motion.div>

      {/* Mid layer — medium glows */}
      <motion.div style={{ x: midX, y: midY }} className="absolute inset-0">
        <div
          className={`absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full ${colors.midGlow1} blur-2xl`}
        />
        <div
          className={`absolute bottom-1/3 left-1/3 w-[260px] h-[260px] rounded-full ${colors.midGlow2} blur-2xl`}
        />
        <div
          className={`absolute top-1/2 left-1/4 w-[220px] h-[220px] rounded-full ${colors.midGlow3} blur-2xl`}
        />
      </motion.div>

      {/* Near layer — small accents, fastest drift */}
      <motion.div style={{ x: nearX, y: nearY }} className="absolute inset-0">
        <div
          className={`absolute top-[20%] left-[30%] w-28 h-28 rounded-full ${colors.nearAccent1} blur-xl`}
        />
        <div
          className={`absolute top-[55%] right-[20%] w-24 h-24 rounded-full ${colors.nearAccent2} blur-xl`}
        />
        <div
          className={`absolute bottom-[25%] left-[20%] w-20 h-20 rounded-full ${colors.nearAccent3} blur-xl`}
        />
        <div
          className={`absolute top-[35%] right-[35%] w-32 h-32 rounded-full ${colors.nearAccent4} blur-xl`}
        />
      </motion.div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial edge fade */}
      <div className="absolute inset-0 bg-radial-to-t from-transparent via-transparent to-slate-900/20" />
    </div>
  );
};

export default ParallaxBackground;
