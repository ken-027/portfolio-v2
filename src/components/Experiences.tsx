import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    name: string;
    icon?: string;
    proficiency?: string;
    level?: number;
}

interface Project {
    title: string;
    category?: string;
    projectRole?: string;
    screenshot?: string;
    description?: string;
    technologies?: Technology[];
}

interface Experience {
    id?: string | number;
    title?: string;
    position?: string;
    company: string;
    companyLogo?: string;
    companyLink?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    descriptions?: string[];
    projects?: Project[];
}

interface ExperiencesData {
    data?: Experience[];
    experiences?: Experience[];
}

const Experiences = () => {
    const { data, loading, error } = useFetch<Experience[] | ExperiencesData>(fetchExperiences);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    if (loading) {
        return (
            <section id="experiences" className="py-20 bg-slate-900/20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <FaSpinner className="text-4xl text-cyan-400 animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="experiences" className="py-20 bg-slate-900/20">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-400">
                        <p>Error loading experiences: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    const experiences: Experience[] =
        Array.isArray(data) ? data : (data as ExperiencesData)?.data || (data as ExperiencesData)?.experiences || [];

    return (
        <section id="experiences" className="py-20 bg-slate-900/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Professional Experience</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        My professional journey and roles
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
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-transparent transform md:-translate-x-1/2"></div>

                        {experiences.map((experience, index) => (
                            <motion.div
                                key={experience.id || index}
                                variants={itemVariants}
                                className={`relative mb-12 ${index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:text-right"
                                    }`}
                            >
                                <div
                                    className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto"}`}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-cyan-400 rounded-full border-4 border-slate-950 transform md:-translate-x-1/2`}
                                    ></div>

                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all ml-8 md:ml-0 overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="p-6">
                                            <div
                                                className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? "" : "md:flex-row-reverse md:text-right"}`}
                                            >
                                                {/* Company Logo */}
                                                {experience.companyLogo && (
                                                    <motion.div
                                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                                        className="shrink-0"
                                                    >
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 border border-slate-700/50 p-2 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={experience.companyLogo}
                                                                alt={experience.company}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    target.style.display = "none";
                                                                    if (target.parentElement) {
                                                                        target.parentElement.innerHTML =
                                                                            '<div class="text-cyan-400 text-xl font-bold">' +
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
                                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                                        {experience.title ||
                                                            experience.position ||
                                                            "Position"}
                                                    </h3>
                                                    <div className="mb-2">
                                                        {experience.companyLink ?
                                                            <a
                                                                href={experience.companyLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group/link"
                                                                data-tooltip-id="portfolio-tooltip"
                                                                data-tooltip-content={`Visit ${experience.company} website`}
                                                            >
                                                                <span>{experience.company}</span>
                                                                <FaExternalLinkAlt className="text-xs group-hover/link:translate-x-0.5 transition-transform" />
                                                            </a>
                                                            : <span className="text-cyan-400 font-medium">
                                                                {experience.company}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date and Location */}
                                            <div
                                                className={`flex flex-wrap gap-4 text-sm text-slate-400 mb-4 ${index % 2 === 0 ? "" : "md:justify-end"}`}
                                            >
                                                {experience.startDate && (
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendar className="text-slate-500" />
                                                        <span>
                                                            {formatDate(experience.startDate)}
                                                            {experience.endDate &&
                                                                ` - ${experience.endDate === "Present" ? experience.endDate : formatDate(experience.endDate)}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {experience.location && (
                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-slate-500" />
                                                        <span>{experience.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Descriptions */}
                                            {experience.descriptions &&
                                                Array.isArray(experience.descriptions) &&
                                                experience.descriptions.length > 0 && (
                                                    <ul
                                                        className={`space-y-2 text-slate-300 ${index % 2 === 0 ? "" : "md:text-right"}`}
                                                    >
                                                        {experience.descriptions.map((desc, i) => (
                                                            <motion.li
                                                                key={i}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                whileInView={{ opacity: 1, x: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: 0.05 * i }}
                                                                className={`flex items-start gap-2 ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                                                            >
                                                                <span className="text-cyan-400 mt-1">▹</span>
                                                                <span className="flex-1">{desc}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                )}
                                        </div>

                                        {/* Projects Section */}
                                        {experience.projects &&
                                            Array.isArray(experience.projects) &&
                                            experience.projects.length > 0 && (
                                                <div className="border-t border-slate-700/50">
                                                    <motion.button
                                                        onClick={() => toggleProjects(index)}
                                                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                                                        data-tooltip-id="quick-tooltip"
                                                        data-tooltip-content={
                                                            expandedProjects[index] ?
                                                                "Click to hide projects"
                                                                : "Click to view projects"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FaBriefcase className="text-cyan-400" />
                                                            <span className="font-medium text-white text-sm">
                                                                {experience.projects.length} Project
                                                                {experience.projects.length > 1 ? "s" : ""}
                                                            </span>
                                                        </div>
                                                        <motion.div
                                                            animate={{
                                                                rotate: expandedProjects[index] ? 180 : 0,
                                                            }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <FaChevronDown className="text-slate-400 text-sm" />
                                                        </motion.div>
                                                    </motion.button>

                                                    <AnimatePresence>
                                                        {expandedProjects[index] && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-6 pb-6 space-y-3">
                                                                    {experience.projects.map(
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
                                                                                    }}
                                                                                    whileHover={{ scale: 1.01 }}
                                                                                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                                                                                >
                                                                                    {/* Project Header */}
                                                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                                                        <div className="flex items-start gap-2 flex-1">
                                                                                            <div
                                                                                                className={`p-1.5 rounded-lg bg-gradient-to-br ${getCategoryColor(project.category)} border shrink-0`}
                                                                                            >
                                                                                                <CategoryIcon className="text-sm" />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                                                    <h4 className="font-bold text-white text-sm">
                                                                                                        {project.title}
                                                                                                    </h4>
                                                                                                    {project.category && (
                                                                                                        <span
                                                                                                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getCategoryColor(project.category)}`}
                                                                                                        >
                                                                                                            {project.category}
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                {project.projectRole && (
                                                                                                    <span className="inline-block px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-[10px] text-purple-400 font-medium">
                                                                                                        {project.projectRole}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        {project.screenshot && (
                                                                                            <a
                                                                                                href={project.screenshot}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="shrink-0 px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-medium transition-colors"
                                                                                            >
                                                                                                <FaExternalLinkAlt />
                                                                                            </a>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Project Description */}
                                                                                    {project.description && (
                                                                                        <p className="text-slate-400 text-xs leading-relaxed mb-3">
                                                                                            {project.description}
                                                                                        </p>
                                                                                    )}

                                                                                    {/* Technologies */}
                                                                                    {project.technologies &&
                                                                                        Array.isArray(
                                                                                            project.technologies,
                                                                                        ) && (
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                {project.technologies
                                                                                                    .slice(0, 6)
                                                                                                    .map((tech, techIndex) => (
                                                                                                        <motion.div
                                                                                                            key={techIndex}
                                                                                                            whileHover={{
                                                                                                                scale: 1.05,
                                                                                                            }}
                                                                                                            className="group/tech"
                                                                                                            data-tooltip-id="info-tooltip"
                                                                                                            data-tooltip-content={`${tech.name}${tech.proficiency ?
                                                                                                                    " - " +
                                                                                                                    tech.proficiency
                                                                                                                    : tech.level ?
                                                                                                                        " - Level " +
                                                                                                                        tech.level
                                                                                                                        : ""
                                                                                                                }`}
                                                                                                            data-tooltip-place="top"
                                                                                                        >
                                                                                                            <div className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded flex items-center gap-1.5 hover:border-cyan-500/50 transition-colors">
                                                                                                                {tech.icon && (
                                                                                                                    <img
                                                                                                                        src={tech.icon}
                                                                                                                        alt={tech.name}
                                                                                                                        className="w-3 h-3 object-contain"
                                                                                                                        onError={(e) =>
                                                                                                                        (e.currentTarget.style.display =
                                                                                                                            "none")
                                                                                                                        }
                                                                                                                    />
                                                                                                                )}
                                                                                                                <span className="text-[10px] text-slate-300 font-medium group-hover/tech:text-cyan-400 transition-colors">
                                                                                                                    {tech.name}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </motion.div>
                                                                                                    ))}
                                                                                                {project.technologies.length >
                                                                                                    6 && (
                                                                                                        <span className="px-2 py-1 text-[10px] text-slate-500">
                                                                                                            +
                                                                                                            {project.technologies
                                                                                                                .length - 6}
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
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Experiences;
