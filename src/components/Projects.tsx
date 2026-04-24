import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    FaGithub,
    FaExternalLinkAlt,
    FaFolder,
    FaSpinner,
    FaCode,
    FaUsers,
    FaUser,
    FaRobot,
    FaDocker,
    FaLaptopCode,
    FaServer,
    FaLayerGroup,
    FaFilter,
    FaChevronDown,
} from "react-icons/fa";
import { IconType } from 'react-icons';
import { useFetch } from "../hooks/useFetch";
import { fetchProjects } from "../services/api";

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
    description: string;
    type: "personal" | "professional" | "open-source";
    category: "frontend" | "backend" | "fullstack";
    projectRole: "solo" | "leader" | "collaborator" | "contributor";
    thumbnailLink?: string;
    githubRepo?: string | null;
    dockerLink?: string | null;
    liveDemo?: string | null;
    screenshot?: string | null;
    aiPowered?: boolean;
    technologies: Technology[];
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ProjectsData {
    success: boolean;
    data: Project[];
}

interface CategoryInfo {
    Icon: IconType;
    color: string;
    text: string;
}

const Projects = () => {
    const { data, loading, error } = useFetch<ProjectsData>(fetchProjects);
    const [selectedType, setSelectedType] = useState<Project["type"] | "all">("professional");
    const [selectedCategory, setSelectedCategory] = useState<Project["category"] | "all">("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
            },
        },
    };

    // Helper function to get category icon and color
    const getCategoryInfo = (category?: string): CategoryInfo => {
        const lowerCategory = category?.toLowerCase() || "";
        if (lowerCategory === "frontend") {
            return {
                Icon: FaLaptopCode,
                color: "from-blue-500 to-cyan-500",
                text: "Frontend",
            };
        }
        if (lowerCategory === "backend") {
            return {
                Icon: FaServer,
                color: "from-green-500 to-emerald-500",
                text: "Backend",
            };
        }
        if (lowerCategory === "fullstack") {
            return {
                Icon: FaLayerGroup,
                color: "from-purple-500 to-pink-500",
                text: "Full Stack",
            };
        }
        return {
            Icon: FaCode,
            color: "from-slate-500 to-slate-600",
            text: category || "Other",
        };
    };

    // Helper function to get type badge color
    const getTypeColor = (type?: string): string => {
        const lowerType = type?.toLowerCase() || "";
        if (lowerType === "personal")
            return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
        if (lowerType === "company")
            return "bg-blue-500/10 text-blue-400 border-blue-500/30";
        if (lowerType === "freelance")
            return "bg-purple-500/10 text-purple-400 border-purple-500/30";
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    };

    // Helper function to get role icon
    const getRoleIcon = (role?: string): IconType => {
        const lowerRole = role?.toLowerCase() || "";
        if (lowerRole.includes("team") || lowerRole.includes("collaborator"))
            return FaUsers;
        if (lowerRole.includes("pair")) return FaUsers;
        return FaUser;
    };

    // Parse the API structure and filter for featured projects only
    const allProjects = useMemo(() => {
        return (data?.data || []).filter((project: Project) => project.featured);
    }, [data]);

    // Get unique types
    const projectTypes = useMemo(() => {
        if (!allProjects.length) return ["all"];
        const types = [
            ...new Set(allProjects.map((p) => p.type?.toLowerCase()).filter(Boolean)),
        ];
        return ["all", ...types.sort()];
    }, [allProjects]);

    // Get unique categories
    const projectCategories = useMemo(() => {
        if (!allProjects.length) return ["all"];
        const categories = [
            ...new Set(
                allProjects.map((p) => p.category?.toLowerCase()).filter(Boolean),
            ),
        ];
        return ["all", ...categories.sort()];
    }, [allProjects]);

    // Filter projects based on selected type and category
    const filteredProjects: Project[] = useMemo(() => {
        return allProjects.filter((project: Project) => {
            const typeMatch =
                selectedType === "all" || project.type?.toLowerCase() === selectedType;
            const categoryMatch =
                selectedCategory === "all" ||
                project.category?.toLowerCase() === selectedCategory;
            return typeMatch && categoryMatch;
        });
    }, [allProjects, selectedType, selectedCategory]);

    const filterPanel = (
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50">
            {/* Type Filter */}
            <div className="mb-4">
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                    Project Type
                </h3>
                <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                        <motion.button
                            key={type}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(type as Project["type"])}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-[color,background-color,border-color,box-shadow] duration-300 capitalize ${selectedType === type
                                ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                                : "bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-cyan-500/30 hover:text-white hover:bg-slate-800/80"
                                }`}
                        >
                            {type}
                            <span className="ml-1.5 text-[10px] opacity-80 bg-black/20 px-1.5 py-0.5 rounded-full">
                                {type === "all"
                                    ? allProjects.length
                                    : allProjects.filter((p) => p.type?.toLowerCase() === type).length}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-linear-to-r from-purple-400 to-pink-500 rounded-full"></div>
                    Category
                </h3>
                <div className="flex flex-wrap gap-2">
                    {projectCategories.map((category) => {
                        const categoryInfo = getCategoryInfo(category);
                        return (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCategory(category as Project["category"])}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-[color,background-color,border-color,box-shadow] duration-300 capitalize ${selectedCategory === category
                                    ? `bg-linear-to-r ${categoryInfo.color} text-white shadow-lg shadow-blue-500/25`
                                    : "bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-purple-500/30 hover:text-white hover:bg-slate-800/80"
                                    }`}
                            >
                                {category !== "all" && <categoryInfo.Icon className="text-xs" />}
                                {category === "all" ? "All" : categoryInfo.text}
                                <span className="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.5 rounded-full">
                                    {category === "all"
                                        ? allProjects.length
                                        : allProjects.filter((p) => p.category?.toLowerCase() === category).length}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-slate-900/20">
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
            <section id="projects" className="py-20 bg-slate-900/20">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-400">
                        <p>Error loading projects: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-12 bg-gradient-to-b from-transparent to-slate-950/30">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="text-gradient bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Featured Projects
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        Crafted with precision and passion—showcasing innovation through code
                    </p>
                </motion.div>

                {/* Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    {/* Mobile: CTA toggle button */}
                    <div className="md:hidden mb-3">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsFilterOpen((v) => !v)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm font-medium text-white transition-colors duration-300"
                        >
                            <div className="flex items-center gap-2.5">
                                <FaFilter className="text-cyan-400 text-xs" />
                                <span>Filters</span>
                                {(selectedType !== "all" || selectedCategory !== "all") && (
                                    <div className="flex items-center gap-1.5">
                                        {selectedType !== "all" && (
                                            <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 capitalize">
                                                {selectedType}
                                            </span>
                                        )}
                                        {selectedCategory !== "all" && (
                                            <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] text-purple-400 capitalize">
                                                {getCategoryInfo(selectedCategory).text}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">
                                    {filteredProjects.length}/{allProjects.length}
                                </span>
                                <motion.span
                                    animate={{ rotate: isFilterOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaChevronDown className="text-slate-400 text-xs" />
                                </motion.span>
                            </div>
                        </motion.button>
                    </div>

                    {/* Mobile: animated collapsible panel */}
                    <AnimatePresence initial={false}>
                        {isFilterOpen && (
                            <motion.div
                                key="filter-panel-mobile"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden md:hidden mb-3"
                            >
                                {filterPanel}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Desktop: always visible */}
                    <div className="hidden md:block">
                        {filterPanel}
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedType !== "professional" || selectedCategory !== "all") && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-3 p-3 bg-linear-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-cyan-400 text-sm">
                                        {filteredProjects.length} of {allProjects.length} projects
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {selectedType !== "all" && (
                                            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 capitalize">
                                                {selectedType}
                                            </span>
                                        )}
                                        {selectedCategory !== "all" && (
                                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 capitalize">
                                                {getCategoryInfo(selectedCategory).text}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedType("all");
                                        setSelectedCategory("all");
                                    }}
                                    className="px-3 py-1 bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600/50 rounded text-xs text-white transition-colors duration-200 font-medium"
                                >
                                    Clear
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    key={`${selectedType}-${selectedCategory}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    {filteredProjects.map((project, index) => {
                        const categoryInfo = getCategoryInfo(project.category);
                        const RoleIcon = getRoleIcon(project.projectRole);

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -12, scale: 1.02 }}
                                className="group"
                            >
                                <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-cyan-400/40 transition-[border-color,box-shadow] duration-500 h-full flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10">
                                    {/* Project Image or Default Thumbnail */}
                                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                                        {project.thumbnailLink ? (
                                            <>
                                                <img
                                                    src={project.thumbnailLink}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                                            </>
                                        ) : (
                                            // Default Thumbnail
                                            <div className={`w-full h-full bg-gradient-to-br ${categoryInfo.color} opacity-15 flex items-center justify-center group-hover:opacity-25 transition-opacity duration-500`}>
                                                <categoryInfo.Icon className="text-5xl text-slate-600/40 group-hover:text-slate-500/60 transition-colors duration-500" />
                                            </div>
                                        )}

                                        {/* Category Badge on Image */}
                                        <div className="absolute top-2 left-2">
                                            <div
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-linear-to-r ${categoryInfo.color} shadow-lg backdrop-blur-sm`}
                                            >
                                                <categoryInfo.Icon className="text-white text-xs" />
                                                <span className="text-white text-[10px] font-bold tracking-wide">
                                                    {categoryInfo.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* AI Badge on Image */}
                                        {project.aiPowered && (
                                            <div className="absolute top-2 right-2">
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-linear-to-r from-violet-500 to-fuchsia-500 shadow-lg backdrop-blur-sm">
                                                    <FaRobot className="text-white text-xs animate-pulse" />
                                                    <span className="text-white text-[10px] font-bold tracking-wide">
                                                        AI
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between mb-3">
                                            {/* Type & Role Badges */}
                                            <div className="flex flex-wrap gap-1.5 mb-1">
                                                {project.type && (
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeColor(project.type)}`}
                                                    >
                                                        {project.type}
                                                    </span>
                                                )}
                                                {project.projectRole && (
                                                    <span
                                                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/40 text-slate-300 border border-slate-600/50"
                                                        data-tooltip-id="info-tooltip"
                                                        data-tooltip-content={`My role: ${project.projectRole}`}
                                                    >
                                                        <RoleIcon className="text-[10px]" />
                                                        <span className="capitalize">
                                                            {project.projectRole.split(" ")[0]}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Links */}
                                            <div className="flex gap-2">
                                                {project.githubRepo && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={project.githubRepo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-lg text-slate-400 hover:text-white transition-colors duration-300 border border-slate-600/30 hover:border-slate-500/50"
                                                        aria-label="View on GitHub"
                                                    >
                                                        <FaGithub className="text-sm" />
                                                    </motion.a>
                                                )}
                                                {project.dockerLink && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={project.dockerLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-colors duration-300 border border-blue-500/20 hover:border-blue-400/40"
                                                        aria-label="View on Docker Hub"
                                                    >
                                                        <FaDocker className="text-sm" />
                                                    </motion.a>
                                                )}
                                                {(project.liveDemo || project.screenshot) && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={project.liveDemo || project.screenshot || ""}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors duration-300 border border-cyan-500/20 hover:border-cyan-400/40"
                                                        aria-label="View Live Project"
                                                    >
                                                        <FaExternalLinkAlt className="text-sm" />
                                                    </motion.a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 leading-tight">
                                            {project.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-300 text-sm leading-relaxed mb-3 flex-1 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Technologies */}
                                        {project.technologies &&
                                            Array.isArray(project.technologies) &&
                                            project.technologies.length > 0 && (
                                                <div className="mt-auto">
                                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-700/30">
                                                        {project.technologies.slice(0, 5).map((tech, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/40 border border-slate-700/40 rounded-full hover:border-cyan-500/40 transition-colors duration-300 group/tech"
                                                                data-tooltip-id="info-tooltip"
                                                                data-tooltip-content={`${tech.name}${tech.proficiency ? " - " + tech.proficiency
                                                                    : tech.level ? " - Level " + tech.level
                                                                        : ""
                                                                    }`}
                                                            >
                                                                {tech.icon && (
                                                                    <img
                                                                        src={tech.icon}
                                                                        alt={tech.name}
                                                                        className="w-3 h-3 object-contain"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = "none";
                                                                        }}
                                                                    />
                                                                )}
                                                                <span className="text-[10px] text-slate-400 group-hover/tech:text-cyan-400 transition-colors duration-300 font-medium">
                                                                    {tech.name}
                                                                </span>
                                                                {tech.level && (
                                                                    <span className="text-[9px] text-slate-500 font-medium">
                                                                        Lv{tech.level}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {project.technologies.length > 5 && (
                                                            <span
                                                                className="px-2 py-1 text-[10px] text-slate-500 font-medium cursor-help bg-slate-900/20 rounded-full border border-slate-700/30"
                                                                data-tooltip-id="info-tooltip"
                                                                data-tooltip-content={`More technologies: ${project.technologies.slice(5).map(t => t.name).join(', ')}`}
                                                            >
                                                                +{project.technologies.length - 5}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-slate-400 py-8"
                    >
                        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 max-w-sm mx-auto">
                            <FaFolder className="text-4xl text-slate-600/60 mx-auto mb-3" />
                            {allProjects.length === 0 ?
                                <p className="text-base font-medium">No projects available</p>
                                : <>
                                    <p className="text-base font-medium mb-2">
                                        No projects found
                                    </p>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Try adjusting your filters
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSelectedType("all");
                                            setSelectedCategory("all");
                                        }}
                                        className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg text-white transition-[background-image,box-shadow] duration-300 font-medium shadow-lg shadow-cyan-500/25 text-sm"
                                    >
                                        View All Projects
                                    </motion.button>
                                </>
                            }
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
