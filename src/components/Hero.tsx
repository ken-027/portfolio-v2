import { motion, Variants, useScroll, useTransform } from "framer-motion";
import {
    FaCode,
    FaReact,
    FaNodeJs,
    FaDocker,
    FaDatabase,
    FaServer,
    FaRobot,
    FaChevronDown,
    FaAward,
    FaBriefcase,
} from "react-icons/fa";
import {
    SiTypescript,
    SiPostgresql,
    SiExpress,
} from "react-icons/si";
import { IconType } from 'react-icons';
import ParallaxBackground from "./ParallaxBackground";

interface TechIcon {
    Icon: IconType;
    color: string;
    name: string;
}

interface Highlight {
    icon: IconType;
    label: string;
    color: string;
}

const Hero = () => {
    // Parallax scroll effect
    const { scrollY } = useScroll();
    const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

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

    // Tech stack container animation with stagger
    const techStackContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3,
            },
        },
    };

    // Individual tech icon animation
    const techIconVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Floating tech icons animation
    const floatingVariants = (delay = 0): Variants => ({
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            },
        },
    });

    // Tech stack icons to display
    const techIcons: TechIcon[] = [
        { Icon: FaReact, color: "text-cyan-400", name: "React" },
        { Icon: FaNodeJs, color: "text-green-400", name: "Node.js" },
        { Icon: SiTypescript, color: "text-blue-400", name: "TypeScript" },
        { Icon: FaDocker, color: "text-blue-500", name: "Docker" },
        { Icon: SiPostgresql, color: "text-blue-300", name: "PostgreSQL" },
        { Icon: FaDatabase, color: "text-purple-400", name: "Databases" },
        { Icon: SiExpress, color: "text-slate-300", name: "Express" },
        { Icon: FaRobot, color: "text-fuchsia-400", name: "AI/LLM" },
    ];

    // Key highlights
    const highlights: Highlight[] = [
        {
            icon: FaBriefcase,
            label: "Backend Specialist",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: FaServer,
            label: "Microservices",
            color: "from-green-500 to-emerald-500",
        },
        {
            icon: FaRobot,
            label: "AI Integration",
            color: "from-purple-500 to-fuchsia-500",
        },
    ];

    return (
        <section
            id="home"
            className="min-h-screen translate-y-2 flex items-center justify-center relative overflow-hidden"
        >
            <ParallaxBackground theme="blue" />

            {/* Floating Tech Icons - Decorative, no tooltips needed */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {techIcons.map((tech, index) => {
                    const positions = [
                        "top-20 left-10",
                        "top-32 right-16",
                        "top-1/4 left-1/4",
                        "top-1/3 right-1/4",
                        "bottom-1/3 left-16",
                        "bottom-1/4 right-20",
                        "top-1/2 left-8",
                        "bottom-20 right-12",
                    ];

                    return (
                        <motion.div
                            key={index}
                            variants={floatingVariants(index * 0.2)}
                            animate="animate"
                            className={`absolute ${positions[index]} hidden lg:block`}
                        >
                            <div className="p-3 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg">
                                <tech.Icon className={`text-2xl ${tech.color} opacity-70`} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ scale, opacity }}
                className="container mx-auto px-4 py-20 relative z-10"
            >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        {/* Name/Title */}
                        <motion.div variants={itemVariants}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                                <span className="text-white block mb-2">Hi, I'm a</span>
                                <span className="text-gradient block">Software Developer</span>
                            </h1>
                        </motion.div>

                        {/* Subtitle with typing effect styling */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                Backend specialist crafting{" "}
                                <span className="text-cyan-400 font-semibold">robust</span>,
                                <span className="text-cyan-400 font-semibold">
                                    {" "}
                                    scalable solutions
                                </span>{" "}
                                with
                                <span className="text-cyan-400 font-semibold">
                                    {" "}
                                    clean code
                                </span>{" "}
                                and
                                <span className="text-cyan-400 font-semibold">
                                    {" "}
                                    modern architecture
                                </span>
                            </p>
                        </motion.div>

                        {/* Key Highlights - Labels visible, no tooltips needed */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center justify-center gap-4 mb-10"
                        >
                            {highlights.map((highlight, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-all"
                                >
                                    <div
                                        className={`p-2 bg-linear-to-r ${highlight.color} bg-opacity-10 rounded-lg`}
                                    >
                                        <highlight.icon
                                            className={`text-lg bg-linear-to-r ${highlight.color} bg-clip-text text-transparent`}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">
                                        {highlight.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center justify-center gap-4 mb-12"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const element = document.getElementById("projects");
                                    element?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="group px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <FaCode className="text-lg" />
                                    View My Work
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const element = document.getElementById("experiences");
                                    element?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all backdrop-blur-sm"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <FaBriefcase className="text-cyan-400" />
                                    Experience
                                </span>
                            </motion.button>

                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                href="#certificates"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById("certificates");
                                    element?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all backdrop-blur-sm flex items-center gap-2"
                            >
                                <FaAward className="text-cyan-400" />
                                Certificates
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* Tech Stack Section */}
                    <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
                        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                                    Tech Stack
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Technologies I work with daily
                                </p>
                            </div>

                            <motion.div
                                variants={techStackContainerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-wrap items-center justify-center gap-6"
                            >
                                {techIcons.map((tech, index) => (
                                    <motion.div
                                        key={index}
                                        variants={techIconVariants}
                                        whileHover={{ scale: 1.08, y: -6 }}
                                        className="relative group cursor-pointer"
                                        data-tooltip-id="info-tooltip"
                                        data-tooltip-content={`${tech.name} - Core technology in my development stack`}
                                    >
                                        <div className="relative p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all shadow-lg overflow-hidden">
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                            />
                                            <tech.Icon
                                                className={`text-3xl ${tech.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator - Self-explanatory, no tooltip needed */}
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
                onClick={() => {
                    const element = document.getElementById("experiences");
                    element?.scrollIntoView({ behavior: "smooth" });
                }}
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
