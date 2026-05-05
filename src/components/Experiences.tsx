import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import TiltCard from "./TiltCard";
import {
    FaBriefcase,
    FaCalendar,
    FaMapMarkerAlt,
    FaSpinner,
    FaExternalLinkAlt,
    FaChevronDown,
    FaCode,
    FaLaptopCode,
    FaServer,
} from "react-icons/fa";
import { IconType } from 'react-icons';
import { useFetch } from "../hooks/useFetch";
import { fetchExperiences } from "../services/api";

interface Technology {
    id: string;
    name: string;
    icon?: string;
    proficiency?: string;
    level?: number;
}

interface Project {
    id: string;
    experienceId: string | null;
    title: string;
    description?: string;
    category?: string;
    type?: string;
    projectRole?: string;
    thumbnailLink?: string | null;
    githubRepo?: string | null;
    dockerLink?: string | null;
    liveDemo?: string | null;
    screenshot?: string | null;
    aiPowered?: boolean;
    featured?: boolean;
    technologies?: Technology[];
    createdAt?: string;
    updatedAt?: string;
}

interface Experience {
    id: string;
    title: string;
    company: string;
    companyLogo?: string | null;
    companyLink?: string | null;
    startDate?: string;
    endDate?: string | null;
    location?: string;
    descriptions?: string[];
    projects?: Project[];
    createdAt?: string;
    updatedAt?: string;
}

interface ExperiencesData {
    success: boolean;
    data: Experience[];
}

const Experiences = () => {
    const { data, loading, error } = useFetch<ExperiencesData>(fetchExperiences);
    const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({});

    const toggleProjects = (experienceIndex: number) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [experienceIndex]: !prev[experienceIndex],
        }));
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const calculateDuration = (startDate?: string, endDate?: string | null): string => {
        if (!startDate) return "";
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        if (months < 0) { years--; months += 12; }
        const parts: string[] = [];
        if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
        if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
        return parts.length > 0 ? parts.join(" ") : "< 1 mo";
    };

    const getCategoryIcon = (category?: string): IconType => {
        switch (category?.toLowerCase()) {
            case "frontend":
                return FaCode;
            case "backend":
                return FaServer;
            case "fullstack":
                return FaLaptopCode;
            default:
                return FaBriefcase;
        }
    };

    const getCategoryColor = (category?: string): string => {
        switch (category?.toLowerCase()) {
            case "frontend":
                return "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400";
            case "backend":
                return "from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400";
            case "fullstack":
                return "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400";
            default:
                return "from-slate-500/10 to-slate-500/10 border-slate-500/30 text-slate-400";
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                when: "beforeChildren",
                staggerChildren: 0.07,
                delayChildren: 0.15,
            },
        },
    };

    const descriptionVariants: Variants = {
        hidden: { opacity: 0, y: 8 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    if (loading) {
        return (
            <section id="experiences" className="py-24 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center justify-center h-64">
                        <FaSpinner className="text-4xl text-cyan-400 animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="experiences" className="py-24 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center text-red-400">
                        <p>Error loading experiences: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    const experiences: Experience[] = data?.data || [];

    return (
        <section id="experiences" className="py-12 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Professional Experience
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        A journey through meaningful roles and impactful contributions
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-cyan-400 to-blue-500 transform md:-translate-x-1/2 rounded-full shadow-lg shadow-cyan-500/20"></div>

                        {experiences.map((experience, index) => {
                            const featuredProjects = (experience.projects || []).filter(p => p.featured);
                            return (
                            <motion.div
                                key={experience.id || index}
                                variants={itemVariants}
                                className={`relative mb-8 ${index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:text-right"
                                    }`}
                            >
                                <div
                                    className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:ml-auto"}`}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-3 border-slate-950 transform md:-translate-x-1/2 shadow-lg shadow-cyan-500/30`}
                                    ></div>

                                    <TiltCard
                                        intensity={2}
                                        spotlightColor="rgba(6,182,212,0.08)"
                                        className="group ml-8 md:ml-0 bg-gradient-to-b from-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:border-cyan-400/40 transition-[border-color,box-shadow] duration-500 overflow-hidden shadow-xl hover:shadow-xl hover:shadow-cyan-500/10"
                                    >
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-colors duration-500 rounded-xl pointer-events-none" />
                                        {/* Card Header */}
                                        <div className="p-4">
                                            <div
                                                className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? "" : "md:flex-row-reverse md:text-right"}`}
                                            >
                                                {/* Company Logo */}
                                                {experience.companyLogo && (
                                                    <motion.div
                                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                                        className="shrink-0"
                                                    >
                                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 border border-slate-700/30 p-2 flex items-center justify-center overflow-hidden shadow-lg">
                                                            <img
                                                                src={experience.companyLogo}
                                                                alt={experience.company}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    target.style.display = "none";
                                                                    if (target.parentElement) {
                                                                        target.parentElement.innerHTML =
                                                                            '<div class="text-cyan-400 text-lg font-bold">' +
                                                                            (experience.company?.charAt(0) || "?") +
                                                                            "</div>";
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Title and Company */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
                                                        {experience.title}
                                                    </h3>
                                                    <div className="mb-2">
                                                        {experience.companyLink ?
                                                            <motion.a
                                                                href={experience.companyLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.02 }}
                                                                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold text-base transition-colors group/link"
                                                            >
                                                                <span>{experience.company}</span>
                                                                <FaExternalLinkAlt className="text-xs group-hover/link:translate-x-0.5 transition-transform duration-300" />
                                                            </motion.a>
                                                            : <span className="text-cyan-400 font-semibold text-base">
                                                                {experience.company}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date and Location */}
                                            <div
                                                className={`flex flex-wrap gap-3 text-sm text-slate-400 mb-4 ${index % 2 === 0 ? "" : "md:justify-end"}`}
                                            >
                                                {experience.startDate && (
                                                    <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-700/30">
                                                        <div className="p-1 bg-cyan-500/10 rounded">
                                                            <FaCalendar className="text-cyan-400 text-xs" />
                                                        </div>
                                                        <span className="font-medium text-slate-300 text-xs">
                                                            {formatDate(experience.startDate)}
                                                            {experience.endDate ?
                                                                ` - ${formatDate(experience.endDate)}` : " - Present"}
                                                            <span className="ml-1 text-cyan-400/70">
                                                                · {calculateDuration(experience.startDate, experience.endDate)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                )}
                                                {experience.location && (
                                                    <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-700/30">
                                                        <div className="p-1 bg-emerald-500/10 rounded">
                                                            <FaMapMarkerAlt className="text-emerald-400 text-xs" />
                                                        </div>
                                                        <span className="font-medium text-slate-300 text-xs">{experience.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Descriptions */}
                                            {experience.descriptions &&
                                                Array.isArray(experience.descriptions) &&
                                                experience.descriptions.length > 0 && (
                                                    <div className="space-y-2">
                                                        {experience.descriptions.map((desc, i) => (
                                                            <motion.div
                                                                key={i}
                                                                variants={descriptionVariants}
                                                                className={`flex items-start gap-2 p-3 bg-slate-900/20 rounded-lg border border-slate-700/20 hover:border-cyan-500/30 transition-[border-color] duration-300 ${index % 2 === 0 ? "" : "md:flex-row-reverse md:text-right"}`}
                                                            >
                                                                <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                                                <span className="flex-1 text-slate-300 text-sm leading-relaxed">{desc}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>

                                        {/* Projects Section */}
                                        {featuredProjects.length > 0 && (
                                                <div className="border-t border-slate-700/30 mt-4">
                                                    <motion.button
                                                        onClick={() => toggleProjects(index)}
                                                        whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.3)" }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full px-4 py-3 flex items-center justify-between transition-colors duration-300 rounded-b-xl"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                                                                <FaBriefcase className="text-purple-400 text-sm" />
                                                            </div>
                                                            <div className="text-left">
                                                                <span className="font-semibold text-white text-sm block">
                                                                    {featuredProjects.length} Project{featuredProjects.length > 1 ? "s" : ""}
                                                                </span>
                                                                <span className="text-slate-400 text-xs">
                                                                    {expandedProjects[index] ? "Click to hide" : "Click to view"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            animate={{
                                                                rotate: expandedProjects[index] ? 180 : 0,
                                                            }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            className="p-1.5 bg-slate-700/30 rounded"
                                                        >
                                                            <FaChevronDown className="text-slate-400 text-sm" />
                                                        </motion.div>
                                                    </motion.button>

                                                    <AnimatePresence initial={false}>
                                                        {expandedProjects[index] && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 space-y-3">
                                                                    {featuredProjects.map(
                                                                        (project, projectIndex) => {
                                                                            const CategoryIcon = getCategoryIcon(
                                                                                project.category,
                                                                            );
                                                                            return (
                                                                                <motion.div
                                                                                    key={projectIndex}
                                                                                    initial={{ opacity: 0, y: 10 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{
                                                                                        delay: projectIndex * 0.1,
                                                                                        duration: 0.3
                                                                                    }}
                                                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                                                    className="bg-gradient-to-br from-slate-900/40 to-slate-800/60 rounded-xl p-4 border border-slate-700/40 hover:border-cyan-500/40 transition-[border-color,box-shadow] duration-300 shadow-lg hover:shadow-xl"
                                                                                >
                                                                                    {/* Project Header */}
                                                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                                                        <div className="flex items-start gap-3 flex-1">
                                                                                            <div
                                                                                                className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(project.category)} border shrink-0`}
                                                                                            >
                                                                                                <CategoryIcon className="text-sm" />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                                                    <h4 className="font-bold text-white text-base">
                                                                                                        {project.title}
                                                                                                    </h4>
                                                                                                    {project.category && (
                                                                                                        <span
                                                                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryColor(project.category)}`}
                                                                                                        >
                                                                                                            {project.category}
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                {project.projectRole && (
                                                                                                    <span className="inline-block px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400 font-semibold">
                                                                                                        {project.projectRole}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        {project.screenshot && (
                                                                                            <motion.a
                                                                                                href={project.screenshot}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                whileHover={{ scale: 1.1, y: -2 }}
                                                                                                whileTap={{ scale: 0.95 }}
                                                                                                className="shrink-0 p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 transition-[background-color] duration-300"
                                                                                            >
                                                                                                <FaExternalLinkAlt className="text-xs" />
                                                                                            </motion.a>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Project Description */}
                                                                                    {project.description && (
                                                                                        <p className="text-slate-300 text-sm leading-relaxed mb-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/20">
                                                                                            {project.description}
                                                                                        </p>
                                                                                    )}

                                                                                    {/* Technologies */}
                                                                                    {project.technologies &&
                                                                                        Array.isArray(project.technologies) &&
                                                                                        project.technologies.length > 0 && (
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                {project.technologies
                                                                                                    .slice(0, 5)
                                                                                                    .map((tech, techIndex) => (
                                                                                                        <motion.div
                                                                                                            key={techIndex}
                                                                                                            whileHover={{
                                                                                                                scale: 1.05,
                                                                                                                y: -1
                                                                                                            }}
                                                                                                            className="group/tech"
                                                                                                            data-tooltip-id="info-tooltip"
                                                                                                            data-tooltip-content={`${tech.name}${tech.proficiency ?
                                                                                                                " - " + tech.proficiency
                                                                                                                : tech.level ?
                                                                                                                    " - Level " + tech.level
                                                                                                                    : ""
                                                                                                                }`}
                                                                                                        >
                                                                                                            <div className="px-2 py-1 bg-slate-800/60 border border-slate-700/40 rounded-full flex items-center gap-1.5 hover:border-cyan-500/40 transition-[border-color] duration-300">
                                                                                                                {tech.icon && (
                                                                                                                    <img
                                                                                                                        src={tech.icon}
                                                                                                                        alt={tech.name}
                                                                                                                        className="w-3 h-3 object-contain"
                                                                                                                        onError={(e) =>
                                                                                                                            (e.currentTarget.style.display = "none")
                                                                                                                        }
                                                                                                                    />
                                                                                                                )}
                                                                                                                <span className="text-[10px] text-slate-300 font-medium group-hover/tech:text-cyan-400 transition-colors duration-300">
                                                                                                                    {tech.name}
                                                                                                                </span>
                                                                                                                {tech.level && (
                                                                                                                    <span className="text-[9px] text-slate-500 font-medium">
                                                                                                                        Lv{tech.level}
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </motion.div>
                                                                                                    ))}
                                                                                                {project.technologies.length > 5 && (
                                                                                                    <span className="px-2 py-1 text-[10px] text-slate-500 font-medium cursor-help bg-slate-900/30 rounded-full border border-slate-700/30"
                                                                                                        data-tooltip-id="info-tooltip"
                                                                                                        data-tooltip-content={`More technologies: ${project.technologies.slice(5).map(t => t.name).join(', ')}`}
                                                                                                    >
                                                                                                        +{project.technologies.length - 5}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                </motion.div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                    </TiltCard>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Experiences;
