import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

type ThemeType = 'blue' | 'purple' | 'green' | 'amber';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  glow1: string;
  glow2: string;
  glow3: string;
  mesh: string;
  particle: string;
}

interface ParallaxBackgroundProps {
  theme?: ThemeType;
}

const ParallaxBackground = ({ theme = 'blue' }: ParallaxBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1]);

  // Enhanced theme colors with richer gradients
  const themes: Record<ThemeType, ThemeColors> = {
    blue: {
      primary: 'from-blue-600/40 via-cyan-500/30 to-blue-400/20',
      secondary: 'from-cyan-500/30 via-blue-600/25 to-cyan-400/15',
      accent: 'from-blue-400/25 via-cyan-600/20 to-blue-500/15',
      glow1: 'bg-blue-500/40',
      glow2: 'bg-cyan-400/35',
      glow3: 'bg-blue-600/30',
      mesh: 'from-blue-600/20 via-cyan-500/15 via-blue-500/10 to-transparent',
      particle: 'bg-cyan-400/60'
    },
    purple: {
      primary: 'from-purple-600/40 via-violet-500/30 to-fuchsia-400/20',
      secondary: 'from-violet-500/30 via-purple-600/25 to-fuchsia-400/15',
      accent: 'from-fuchsia-400/25 via-violet-600/20 to-purple-500/15',
      glow1: 'bg-purple-500/40',
      glow2: 'bg-violet-400/35',
      glow3: 'bg-fuchsia-600/30',
      mesh: 'from-purple-600/20 via-violet-500/15 via-fuchsia-500/10 to-transparent',
      particle: 'bg-violet-400/60'
    },
    green: {
      primary: 'from-green-600/40 via-emerald-500/30 to-teal-400/20',
      secondary: 'from-emerald-500/30 via-green-600/25 to-teal-400/15',
      accent: 'from-teal-400/25 via-emerald-600/20 to-green-500/15',
      glow1: 'bg-green-500/40',
      glow2: 'bg-emerald-400/35',
      glow3: 'bg-teal-600/30',
      mesh: 'from-green-600/20 via-emerald-500/15 via-teal-500/10 to-transparent',
      particle: 'bg-emerald-400/60'
    },
    amber: {
      primary: 'from-amber-600/40 via-orange-500/30 to-yellow-400/20',
      secondary: 'from-orange-500/30 via-amber-600/25 to-yellow-400/15',
      accent: 'from-yellow-400/25 via-orange-600/20 to-amber-500/15',
      glow1: 'bg-amber-500/40',
      glow2: 'bg-orange-400/35',
      glow3: 'bg-yellow-600/30',
      mesh: 'from-amber-600/20 via-orange-500/15 via-yellow-500/10 to-transparent',
      particle: 'bg-orange-400/60'
    }
  };

  const colors = themes[theme] || themes.blue;

  // Floating orb animation variants
  const floatingOrb = (duration: number, delay = 0) => ({
    initial: { y: 0, x: 0, scale: 1, opacity: 0.6 },
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  });

  // Pulse animation for glow effects
  const pulseGlow = (duration: number, delay = 0) => ({
    initial: { scale: 1, opacity: 0.4 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.4, 0.6, 0.4],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient mesh layer */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900/95 to-slate-900/90" />

      {/* Animated gradient mesh overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Primary large gradient orbs with parallax */}
      <motion.div
        style={{ y: y1, rotate: rotate1, scale: scale1 }}
        className="absolute -top-40 -left-40"
      >
        <motion.div
          variants={pulseGlow(6, 0)}
          initial="initial"
          animate="animate"
          className={`w-[500px] h-[500px] rounded-full bg-linear-to-br ${colors.primary} blur-3xl`}
        />
      </motion.div>

      <motion.div
        style={{ y: y2, scale: scale2 }}
        className="absolute -top-32 -right-32"
      >
        <motion.div
          variants={pulseGlow(7, 1)}
          initial="initial"
          animate="animate"
          className={`w-[450px] h-[450px] rounded-full bg-linear-to-br ${colors.secondary} blur-3xl`}
        />
      </motion.div>

      {/* Middle layer orbs */}
      <motion.div
        style={{ y: y3, rotate: rotate2 }}
        className="absolute top-1/4 -left-48"
      >
        <motion.div
          variants={pulseGlow(8, 2)}
          initial="initial"
          animate="animate"
          className={`w-[400px] h-[400px] rounded-full bg-linear-to-br ${colors.accent} blur-3xl`}
        />
      </motion.div>

      <motion.div
        style={{ y: y4, rotate: rotate1, scale: scale1 }}
        className="absolute top-1/3 -right-40"
      >
        <motion.div
          variants={pulseGlow(7.5, 1.5)}
          initial="initial"
          animate="animate"
          className={`w-[420px] h-[420px] rounded-full bg-linear-to-br ${colors.primary} blur-3xl`}
        />
      </motion.div>

      {/* Bottom layer orbs */}
      <motion.div
        style={{ y: y1, scale: scale2 }}
        className="absolute -bottom-32 -left-32"
      >
        <motion.div
          variants={pulseGlow(6.5, 0.5)}
          initial="initial"
          animate="animate"
          className={`w-[380px] h-[380px] rounded-full bg-linear-to-br ${colors.secondary} blur-3xl`}
        />
      </motion.div>

      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute -bottom-40 -right-40"
      >
        <motion.div
          variants={pulseGlow(7, 2.5)}
          initial="initial"
          animate="animate"
          className={`w-[480px] h-[480px] rounded-full bg-linear-to-br ${colors.accent} blur-3xl`}
        />
      </motion.div>

      {/* Center focal gradient */}
      <motion.div
        style={{ y: y3, scale: scale1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          variants={pulseGlow(9, 1)}
          initial="initial"
          animate="animate"
          className={`w-[700px] h-[700px] rounded-full bg-linear-to-br ${colors.mesh} blur-3xl`}
        />
      </motion.div>

      {/* Floating accent glow orbs */}
      <motion.div
        variants={floatingOrb(5, 0)}
        initial="initial"
        animate="animate"
        className="absolute top-1/4 left-1/4"
      >
        <div className={`w-32 h-32 rounded-full ${colors.glow1} blur-2xl`} />
      </motion.div>

      <motion.div
        variants={floatingOrb(6, 1)}
        initial="initial"
        animate="animate"
        className="absolute top-1/2 right-1/4"
      >
        <div className={`w-40 h-40 rounded-full ${colors.glow2} blur-2xl`} />
      </motion.div>

      <motion.div
        variants={floatingOrb(7, 2)}
        initial="initial"
        animate="animate"
        className="absolute bottom-1/3 left-1/3"
      >
        <div className={`w-36 h-36 rounded-full ${colors.glow3} blur-2xl`} />
      </motion.div>

      <motion.div
        variants={floatingOrb(5.5, 1.5)}
        initial="initial"
        animate="animate"
        className="absolute top-1/3 right-1/3"
      >
        <div className={`w-28 h-28 rounded-full ${colors.glow1} blur-2xl`} />
      </motion.div>

      {/* Small particle effects */}
      {[...Array(12)].map((_, i) => {
        const positions = [
          'top-20 left-[15%]', 'top-32 right-[20%]', 'top-1/4 left-[25%]',
          'top-1/3 right-[15%]', 'top-[45%] left-[10%]', 'top-1/2 right-[30%]',
          'bottom-1/3 left-[35%]', 'bottom-1/4 right-[25%]', 'bottom-32 left-[20%]',
          'bottom-20 right-[15%]', 'top-[60%] left-[45%]', 'top-[70%] right-[40%]'
        ];
        
        return (
          <motion.div
            key={i}
            className={`absolute ${positions[i]} hidden lg:block`}
            variants={floatingOrb(4 + i * 0.3, i * 0.2)}
            initial="initial"
            animate="animate"
          >
            <div className={`w-3 h-3 rounded-full ${colors.particle} blur-sm`} />
          </motion.div>
        );
      })}

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Radial fade at edges */}
      <div className="absolute inset-0 bg-radial-to-t from-transparent via-transparent to-slate-900/20" />
    </div>
  );
};

export default ParallaxBackground;
