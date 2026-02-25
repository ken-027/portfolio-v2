import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
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
    type?: string;
    category?: string;
    projectRole?: string;
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
    const [selectedType, setSelectedType] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

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
        <section id="projects" className="py-20 bg-slate-900/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Featured Projects</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A collection of personal, professional, and freelance projects
                        showcasing my expertise
                    </p>
                </motion.div>

                {/* Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-7xl mx-auto mb-12"
                >
                    {/* Type Filter */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FaFolder className="text-cyan-400 text-lg" />
                            <h3 className="text-lg font-semibold text-white">Project Type</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {projectTypes.map((type) => (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedType(type)}
                                    data-tooltip-id="quick-tooltip"
                                    data-tooltip-content={
                                        type === "all" ? "Show all projects" : (
                                            `Filter: ${type} projects only`
                                        )
                                    }
                                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${selectedType === type ?
                                        "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                                        : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-white"
                                        }`}
                                >
                                    {type}
                                    <span className="ml-2 text-xs opacity-70">
                                        (
                                        {type === "all" ?
                                            allProjects.length
                                            : allProjects.filter((p) => p.type?.toLowerCase() === type)
                                                .length
                                        }
                                        )
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FaFilter className="text-cyan-400 text-lg" />
                            <h3 className="text-lg font-semibold text-white">Category</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {projectCategories.map((category) => {
                                const categoryInfo = getCategoryInfo(category);
                                return (
                                    <motion.button
                                        key={category}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(category)}
                                        data-tooltip-id="quick-tooltip"
                                        data-tooltip-content={
                                            category === "all" ?
                                                "Show all categories"
                                                : `Filter: ${categoryInfo.text} projects only`
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all capitalize ${selectedCategory === category ?
                                            `bg-linear-to-r ${categoryInfo.color} text-white shadow-lg`
                                            : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-white"
                                            }`}
                                    >
                                        {category !== "all" && (
                                            <categoryInfo.Icon className="text-sm" />
                                        )}
                                        {category === "all" ? "All" : categoryInfo.text}
                                        <span className="text-xs opacity-70">
                                            (
                                            {category === "all" ?
                                                allProjects.length
                                                : allProjects.filter(
                                                    (p) => p.category?.toLowerCase() === category,
                                                ).length
                                            }
                                            )
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedType !== "all" || selectedCategory !== "all") && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <span className="font-medium text-cyan-400">
                                        Showing {filteredProjects.length} of {allProjects.length}{" "}
                                        projects
                                    </span>
                                    {selectedType !== "all" && (
                                        <span className="px-2 py-1 bg-slate-700 rounded text-xs capitalize">
                                            Type: {selectedType}
                                        </span>
                                    )}
                                    {selectedCategory !== "all" && (
                                        <span className="px-2 py-1 bg-slate-700 rounded text-xs capitalize">
                                            Category: {getCategoryInfo(selectedCategory).text}
                                        </span>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedType("all");
                                        setSelectedCategory("all");
                                    }}
                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
                                >
                                    Clear Filters
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
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredProjects.map((project, index) => {
                        const categoryInfo = getCategoryInfo(project.category);
                        const RoleIcon = getRoleIcon(project.projectRole);

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all h-full flex flex-col overflow-hidden shadow-lg hover:shadow-cyan-500/20">
                                    {/* Project Image or Default Thumbnail */}
                                    <div className="relative h-48 overflow-hidden bg-slate-900">
                                        {project.thumbnailLink ? (
                                            <>
                                                <img
                                                    src={project.thumbnailLink}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                                            </>
                                        ) : (
                                            // Default Thumbnail
                                            <div className={`w-full h-full bg-linear-to-br ${categoryInfo.color} opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity duration-500`}>
                                                <categoryInfo.Icon className="text-6xl text-slate-700/50" />
                                            </div>
                                        )}

                                        {/* Category Badge on Image */}
                                        <div className="absolute top-3 left-3">
                                            <div
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r ${categoryInfo.color} shadow-lg`}
                                            >
                                                <categoryInfo.Icon className="text-white text-sm" />
                                                <span className="text-white text-xs font-semibold">
                                                    {categoryInfo.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* AI Badge on Image */}
                                        {project.aiPowered && (
                                            <div className="absolute top-3 right-3">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-linear-to-r from-violet-500 to-fuchsia-500 shadow-lg animate-pulse">
                                                    <FaRobot className="text-white text-sm" />
                                                    <span className="text-white text-xs font-semibold">
                                                        AI
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Links Row */}
                                        <div className="flex items-center justify-between mb-3">
                                            {/* Type & Role Badges - Labels visible, no tooltips needed */}
                                            <div className="flex flex-wrap gap-2">
                                                {project.type && (
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getTypeColor(project.type)}`}
                                                    >
                                                        {project.type}
                                                    </span>
                                                )}
                                                {project.projectRole && (
                                                    <span
                                                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-700/50 text-slate-300 border border-slate-600"
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

                                            {/* Action Links - Important actions, keep informative tooltips */}
                                            <div className="flex gap-2">
                                                {project.githubRepo && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        href={project.githubRepo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                        aria-label="View on GitHub"
                                                        data-tooltip-id="portfolio-tooltip"
                                                        data-tooltip-content="View source code - Click to open GitHub"
                                                    >
                                                        <FaGithub className="text-base" />
                                                    </motion.a>
                                                )}
                                                {project.dockerLink && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        href={project.dockerLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                                                        aria-label="View on Docker Hub"
                                                        data-tooltip-id="portfolio-tooltip"
                                                        data-tooltip-content="Pull Docker image - Click to view on Docker Hub"
                                                    >
                                                        <FaDocker className="text-base" />
                                                    </motion.a>
                                                )}
                                                {(project.liveDemo || project.screenshot) && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        href={project.liveDemo || project.screenshot}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                                                        aria-label="View Live Project"
                                                        data-tooltip-id="portfolio-tooltip"
                                                        data-tooltip-content={
                                                            project.liveDemo ?
                                                                "Open live demo - Click to visit site"
                                                                : "View project screenshot"
                                                        }
                                                    >
                                                        <FaExternalLinkAlt className="text-base" />
                                                    </motion.a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                            {project.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Technologies - Informative tooltips for skill details */}
                                        {project.technologies &&
                                            Array.isArray(project.technologies) &&
                                            project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-700/50">
                                                    {project.technologies.slice(0, 6).map((tech, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 border border-slate-700 rounded hover:border-cyan-500/50 transition-colors group/tech"
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
                                                            <span className="text-[10px] text-slate-400 group-hover/tech:text-cyan-400">
                                                                {tech.name}
                                                            </span>
                                                            {tech.level && (
                                                                <span className="text-[9px] text-slate-500">
                                                                    Lv{tech.level}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {project.technologies.length > 6 && (
                                                        <span
                                                            className="px-2 py-1 text-[10px] text-slate-500 font-medium cursor-help"
                                                            data-tooltip-id="info-tooltip"
                                                            data-tooltip-content={`More technologies: ${project.technologies.slice(6).map(t => t.name).join(', ')}`}
                                                        >
                                                            +{project.technologies.length - 6}
                                                        </span>
                                                    )}
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-slate-400 py-12"
                    >
                        <FaFolder className="text-6xl text-slate-600 mx-auto mb-4" />
                        {allProjects.length === 0 ?
                            <p className="text-lg">No projects available</p>
                            : <>
                                <p className="text-lg mb-2">
                                    No projects found matching your filters
                                </p>
                                <p className="text-sm text-slate-500 mb-4">
                                    Try adjusting your filter selection
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedType("all");
                                        setSelectedCategory("all");
                                    }}
                                    className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
                                >
                                    Clear All Filters
                                </motion.button>
                            </>
                        }
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
