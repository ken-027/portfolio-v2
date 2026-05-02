import { useEffect, useMemo, useState } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import {
  FaCode,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaDatabase,
  FaRobot,
  FaChevronDown,
  FaRocket,
  FaCheckCircle,
  FaCalendarAlt,
  FaFolderOpen,
  FaGlobe,
  FaQuoteLeft,
} from "react-icons/fa";
import { SiTypescript, SiPostgresql, SiExpress } from "react-icons/si";
import { IconType } from "react-icons";
import ParallaxBackground from "./ParallaxBackground";
import TiltCard from "./TiltCard";

const NOW = Date.now();

const FALLBACK_TECH_ICONS: TechIcon[] = [
  { Icon: FaReact, color: "text-cyan-400", name: "React" },
  { Icon: FaNodeJs, color: "text-green-400", name: "Node.js" },
  { Icon: SiTypescript, color: "text-blue-400", name: "TypeScript" },
  { Icon: FaDocker, color: "text-blue-500", name: "Docker" },
  { Icon: SiPostgresql, color: "text-blue-300", name: "PostgreSQL" },
  { Icon: FaDatabase, color: "text-purple-400", name: "Databases" },
  { Icon: SiExpress, color: "text-slate-300", name: "Express" },
  { Icon: FaRobot, color: "text-fuchsia-400", name: "AI/LLM" },
];
import { useFetch } from "../hooks/useFetch";
import {
  fetchExperiences,
  fetchSkills,
  fetchProjects,
  getPublicProfile,
  getAvailabilityStatus,
} from "../services/api";
import type { PublicProfile, AvailabilityStatus } from "../services/api";

interface TechIcon {
  Icon: IconType;
  color: string;
  name: string;
}

interface Experience {
  startDate?: string;
  endDate?: string | null;
  location?: string;
}

interface ExperiencesData {
  success: boolean;
  data: Experience[];
}

interface Skill {
  name: string;
}

interface SkillCategory {
  name: string;
  items?: Skill[];
}

interface SkillsData {
  success: boolean;
  data: SkillCategory[];
}

interface Project {
  type: "personal" | "professional" | "open-source";
}

interface ProjectsData {
  success: boolean;
  data: Project[];
}

const MOBILE_MQ = "(max-width: 767px)";

const Hero = () => {
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobileLayout(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollY } = useScroll();
  const scale = useTransform(
    scrollY,
    isMobileLayout ? [0, 500] : [0, 640],
    isMobileLayout ? [1, 0.91] : [1, 0.94],
  );
  const opacity = useTransform(
    scrollY,
    isMobileLayout ? [0, 400] : [0, 300],
    isMobileLayout ? [1, 0.68] : [1, 0.3],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const { data: experiencesData } = useFetch<ExperiencesData>(fetchExperiences);
  const { data: skillsData } = useFetch<SkillsData>(fetchSkills);
  const { data: projectsData } = useFetch<ProjectsData>(fetchProjects);
  const { data: availability } = useFetch<AvailabilityStatus>(
    getAvailabilityStatus,
  );

  const { data: profile } = useFetch<PublicProfile>(getPublicProfile);

  const experiences = useMemo(
    () => experiencesData?.data ?? [],
    [experiencesData],
  );
  const skillCategories = useMemo(() => skillsData?.data ?? [], [skillsData]);

  const yearsExperience = useMemo(() => {
    if (!experiences.length) return 0;

    const ranges = experiences
      .map((exp) => {
        if (!exp.startDate) return null;
        const start = new Date(exp.startDate).getTime();
        const end = exp.endDate ? new Date(exp.endDate).getTime() : NOW;
        if (Number.isNaN(start) || Number.isNaN(end) || end < start)
          return null;
        return { start, end };
      })
      .filter((range): range is { start: number; end: number } =>
        Boolean(range),
      )
      .sort((a, b) => a.start - b.start);

    if (!ranges.length) return 0;

    const merged: { start: number; end: number }[] = [];
    for (const range of ranges) {
      const last = merged[merged.length - 1];
      if (!last || range.start > last.end) {
        merged.push({ ...range });
        continue;
      }
      last.end = Math.max(last.end, range.end);
    }

    const totalMs = merged.reduce(
      (sum, range) => sum + (range.end - range.start),
      0,
    );
    const totalYears = totalMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(Math.max(0, totalYears));
  }, [experiences]);

  const locationLabel = useMemo(() => {
    const hasRemote = experiences.some((exp) =>
      (exp.location || "").toLowerCase().includes("remote"),
    );
    return hasRemote ? "Remote · Worldwide" : "Philippines · Remote Worldwide";
  }, [experiences]);

  const techIcons = useMemo((): TechIcon[] => {
    if (!skillCategories.length) return FALLBACK_TECH_ICONS;

    const allItems = skillCategories.flatMap(
      (category) => category.items || [],
    );
    const hasSkill = (term: string) =>
      allItems.some((skill) => skill.name.toLowerCase().includes(term));
    const hasCategory = (term: string) =>
      skillCategories.some((category) =>
        category.name.toLowerCase().includes(term),
      );

    const dynamic: TechIcon[] = [];
    if (hasSkill("react"))
      dynamic.push({ Icon: FaReact, color: "text-cyan-400", name: "React" });
    if (hasSkill("node"))
      dynamic.push({
        Icon: FaNodeJs,
        color: "text-green-400",
        name: "Node.js",
      });
    if (hasSkill("typescript"))
      dynamic.push({
        Icon: SiTypescript,
        color: "text-blue-400",
        name: "TypeScript",
      });
    if (hasSkill("docker"))
      dynamic.push({ Icon: FaDocker, color: "text-blue-500", name: "Docker" });
    if (hasSkill("postgres"))
      dynamic.push({
        Icon: SiPostgresql,
        color: "text-blue-300",
        name: "PostgreSQL",
      });
    if (hasCategory("database"))
      dynamic.push({
        Icon: FaDatabase,
        color: "text-purple-400",
        name: "Databases",
      });
    if (hasSkill("express"))
      dynamic.push({
        Icon: SiExpress,
        color: "text-slate-300",
        name: "Express",
      });
    if (hasCategory("ai"))
      dynamic.push({
        Icon: FaRobot,
        color: "text-fuchsia-400",
        name: "AI/LLM",
      });

    const deduped = Array.from(
      new Map(dynamic.map((icon) => [icon.name, icon])).values(),
    );
    return deduped.length >= 6 ? deduped.slice(0, 8) : FALLBACK_TECH_ICONS;
  }, [skillCategories]);

  const companyProjects = useMemo(() => {
    return (projectsData?.data || []).filter((p) => p.type === "professional")
      .length;
  }, [projectsData]);

  const leftTechChips = useMemo(() => {
    const byName = new Map(techIcons.map((icon) => [icon.name, icon]));
    const pickFirst = (candidates: string[]) => {
      for (const name of candidates) {
        const match = byName.get(name);
        if (match) return match;
      }
      return null;
    };

    const ordered = [
      pickFirst(["TypeScript"]),
      pickFirst(["Node.js"]),
      pickFirst(["React"]),
      pickFirst(["PostgreSQL"]),
      pickFirst(["AI/LLM"]),
    ].filter((item): item is TechIcon => Boolean(item));

    if (!ordered.some((item) => item.name === "AI/LLM")) {
      ordered.push({ Icon: FaRobot, color: "text-fuchsia-400", name: "AI" });
    }

    return ordered;
  }, [techIcons]);

  return (
    <section
      id="home"
      className="min-h-screen translate-y-2 flex items-center justify-center relative overflow-hidden"
    >
      <ParallaxBackground theme="blue" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ scale, opacity }}
        className="container mx-auto px-4 py-20 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center mb-10">
            {/* Left: main content (3/5) */}
            <div className="lg:col-span-3">
              {/* Name & title */}
              <motion.div variants={itemVariants} className="mb-5">
                <p className="text-slate-400 text-base mb-2">Hi, I&apos;m</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                  <span className="text-white block">Kenneth</span>
                  <span className="text-gradient block">Andales</span>
                </h1>
                <p className="text-2xl md:text-3xl text-slate-200 font-semibold">
                  Full-Stack Developer for{" "}
                  <span className="text-cyan-400">Startups</span>
                </p>
              </motion.div>

              {/* Value prop */}
              <motion.div variants={itemVariants} className="mb-8">
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  I help founders build scalable web apps and SaaS products —
                  from MVP to production, quickly and affordably.
                </p>
              </motion.div>

              {/* Tech chips */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-2.5 mb-7"
              >
                {leftTechChips.map((tech) => (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 shadow-lg shadow-slate-950/30"
                  >
                    <tech.Icon className={`text-sm ${tech.color}`} />
                    <span className="text-xs text-slate-300">{tech.name}</span>
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 md:gap-6 mb-8"
              >
                <div className="flex items-center gap-2.5 min-w-[160px]">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center justify-center">
                    <FaCalendarAlt className="text-sm" />
                  </span>
                  <div>
                    <p className="text-3xl font-bold text-white leading-none">
                      {Math.max(1, yearsExperience)}+
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Years Experience
                    </p>
                  </div>
                </div>

                <div className="h-12 w-px bg-slate-700/70 hidden sm:block" />

                <div className="flex items-center gap-2.5 min-w-[170px]">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
                    <FaFolderOpen className="text-sm" />
                  </span>
                  <div>
                    <p className="text-3xl font-bold text-white leading-none">
                      {Math.max(1, companyProjects)}+
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Projects Delivered
                    </p>
                  </div>
                </div>

                <div className="h-12 w-px bg-slate-700/70 hidden sm:block" />

                <div className="flex items-center gap-2.5 min-w-[180px]">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
                    <FaGlobe className="text-sm" />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-white leading-none">
                      Remote
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {locationLabel}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center md:justify-start flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaCode />
                    View Projects
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://services.kdevtech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-cyan-500/50 hover:bg-slate-800/50 transition-colors backdrop-blur-sm flex items-center gap-2"
                >
                  <FaRocket className="text-cyan-400" />
                  Start a Project
                </motion.a>
              </motion.div>
            </div>

            {/* Right: profile card (2/5) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 flex justify-center lg:justify-end"
            >
              <TiltCard
                intensity={5}
                spotlightColor="rgba(6,182,212,0.10)"
                className="w-full max-w-sm rounded-[30px]"
              >
                <div className="relative w-full rounded-[30px] border border-cyan-500/25 bg-slate-900/50 px-7 py-8 backdrop-blur-xl shadow-[0_30px_80px_rgba(14,116,255,0.22)]">
                  <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-linear-to-b from-cyan-500/10 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-slate-400/10" />

                  {/* Avatar */}
                  <div className="relative z-10 flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-2xl bg-cyan-500/35 scale-110" />
                      {profile?.avatarLink ?
                        <img
                          src={profile.avatarLink}
                          alt="Kenneth Andales"
                          className="relative w-36 h-36 rounded-full border-4 border-cyan-500/45 object-cover shadow-[0_0_48px_rgba(34,211,238,0.32)]"
                        />
                      : <div className="relative w-36 h-36 rounded-full border-4 border-cyan-500/45 bg-slate-700/50 flex items-center justify-center shadow-[0_0_48px_rgba(34,211,238,0.32)]">
                          <FaCode className="text-5xl text-cyan-500/50" />
                        </div>
                      }
                    </div>
                  </div>

                  {availability?.availableForProjects ?
                    <div className="relative z-10 border border-emerald-500/35 bg-emerald-500/10 rounded-full px-4 py-2 w-fit mx-auto mb-7">
                      <p className="text-emerald-300 text-sm inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Available for new projects
                      </p>
                    </div>
                  : <div className="relative z-10 border border-orange-500/35 bg-orange-500/10 rounded-full px-4 py-2 w-fit mx-auto mb-7">
                      <p className="text-orange-300 text-sm inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full" />
                        Currently busy with existing projects
                      </p>
                    </div>
                  }

                  <div className="relative z-10 border-t border-slate-700/70 pt-6 mb-6">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                      {[
                        "Startup MVP",
                        "Business Website",
                        "Web Application",
                        "SaaS Development",
                        "AI Integration",
                        "API & Backend",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <FaCheckCircle className="text-cyan-400 text-xs shrink-0" />
                          <span className="text-slate-200 text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-slate-700/70 mb-5" />

                  <div className="relative z-10 border-t border-slate-700/70 pt-5">
                    <FaQuoteLeft className="text-cyan-400/70 text-lg mb-2" />
                    <blockquote className="text-slate-300/90 text-lg font-semibold leading-relaxed">
                      Clean architecture. Fast delivery. Real results.
                    </blockquote>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2,
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() =>
          document
            .getElementById("experiences")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-slate-700 hover:border-cyan-500/50 rounded-full flex items-start justify-center p-2 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          </div>
          <FaChevronDown className="text-slate-600 text-xs animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
