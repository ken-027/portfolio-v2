import { useState, useEffect } from "react";
import {
    FaCode,
    FaBars,
    FaTimes,
    FaHome,
    FaBriefcase,
    FaTools,
    FaFolder,
    FaAward,
    FaEnvelope,
    FaFileDownload,
    FaGithub,
    FaLinkedin,
} from "react-icons/fa";
import { IconType } from 'react-icons';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import { getPublicProfile } from "../services/api";

interface NavItem {
    id: string;
    label: string;
    icon: IconType;
}

// Navigation items - defined outside component to prevent re-creation
const NAV_ITEMS: NavItem[] = [
    { id: "home", label: "Home", icon: FaHome },
    { id: "experiences", label: "Experience", icon: FaBriefcase },
    { id: "skills", label: "Skills", icon: FaTools },
    { id: "projects", label: "Projects", icon: FaFolder },
    { id: "certificates", label: "Certificates", icon: FaAward },
];

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: publicProfile } = useFetch(getPublicProfile);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const { scrollYProgress } = useScroll();

    // Transform scroll progress for gradient indicator
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Detect active section
            const sections = NAV_ITEMS.map((item) => item.id);
            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                // @ts-ignore
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i] || '');
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 64;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
            setIsMobileMenuOpen(false);
            setActiveSection(sectionId);
        }
    };

    const handleDownloadResume = () => {
        window.open(publicProfile?.resumeLink, '_blank')
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${isScrolled ?
                    "bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/5"
                    : "bg-transparent"
                    }`}
            >
                {/* Multi-color Scroll Progress Indicator */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-cyan-500 via-purple-500 to-fuchsia-500 origin-left"
                    style={{ scaleX }}
                />

                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Enhanced Logo - Self-explanatory, no tooltip needed */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => scrollToSection("home")}
                        >
                            {/* Animated Icon Container */}
                            <div className="relative">
                                {/* Rotating background glow */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute -inset-2 rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"
                                />

                                {/* Icon background */}
                                <div className="relative bg-slate-800/50 backdrop-blur-sm p-2 rounded-xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-colors">
                                    <FaCode className="text-cyan-400 text-xl relative z-10 group-hover:text-cyan-300 transition-colors" />
                                </div>
                            </div>

                            {/* Logo Text with Badge */}
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gradient leading-none">
                                    Portfolio
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                                    Kenneth Andales
                                </span>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;

                                return (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`relative px-4 py-2 rounded-xl font-medium transition-[color,background-color,border-color,box-shadow] duration-300 flex items-center gap-2 group ${isActive ?
                                            "text-white bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                                            : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
                                            }`}
                                    >
                                        <Icon
                                            className={`text-sm ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"} transition-colors`}
                                        />
                                        <span>{item.label}</span>

                                        {/* Active indicator - floating dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navActiveIndicator"
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30,
                                                }}
                                            >
                                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                                <div className="absolute inset-0 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-sm animate-pulse" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}

                            <div className="w-px h-6 bg-slate-700/50 mx-2" />

                            {/* Social Icons */}
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href={publicProfile?.githubLink}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                                data-tooltip-id="portfolio-tooltip"
                                aria-label="GitHub"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaGithub className="text-lg" />
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href={publicProfile?.linkedinLink}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                                data-tooltip-id="portfolio-tooltip"
                                aria-label="LinkedIn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin className="text-lg" />
                            </motion.a>

                            {/* CTA Buttons */}
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection("contact")}
                                className="ml-2 px-4 py-2 rounded-xl font-medium bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow flex items-center gap-2 border border-cyan-400/20"
                                data-tooltip-id="portfolio-tooltip"
                                data-tooltip-content="Get in touch"
                            >
                                <FaEnvelope className="text-sm" />
                                <span>Contact</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-xl font-medium bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-cyan-500/50 transition-colors flex items-center gap-2 backdrop-blur-sm"
                                data-tooltip-id="portfolio-tooltip"
                                data-tooltip-content="Download my resume"
                                onClick={handleDownloadResume}
                            >
                                <FaFileDownload className="text-sm" />
                                <span>Resume</span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-2xl text-slate-300 hover:text-white relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ?
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaTimes />
                                    </motion.div>
                                    : <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaBars />
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Enhanced Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop with blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden z-40"
                            style={{ top: "64px" }}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="fixed top-16 left-0 right-0 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-b border-slate-800/50 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto"
                        >
                            <div className="container mx-auto px-4 py-6 flex flex-col space-y-2">
                                {/* Navigation Items */}
                                {NAV_ITEMS.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`px-4 py-3.5 rounded-xl text-left transition-[color,background-color,border-color,box-shadow] duration-300 flex items-center gap-3 group ${isActive ?
                                                "text-white bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50"
                                                }`}
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${isActive ? "bg-cyan-500/20" : "bg-slate-800/50 group-hover:bg-slate-800"} transition-colors`}
                                            >
                                                <Icon
                                                    className={`text-base ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"} transition-colors`}
                                                />
                                            </div>
                                            <span className="font-medium flex-1">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="relative"
                                                >
                                                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                                    <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })}

                                {/* Social Links */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: NAV_ITEMS.length * 0.05 }}
                                    className="pt-4 border-t border-slate-800 flex gap-2"
                                >
                                    <motion.a
                                        whileTap={{ scale: 0.95 }}
                                        href="#"
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaGithub className="text-base" />
                                        <span>GitHub</span>
                                    </motion.a>

                                    <motion.a
                                        whileTap={{ scale: 0.95 }}
                                        href="#"
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaLinkedin className="text-base" />
                                        <span>LinkedIn</span>
                                    </motion.a>
                                </motion.div>

                                {/* Mobile CTA Buttons */}
                                <div className="space-y-2 pt-2">
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: NAV_ITEMS.length * 0.05 + 0.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => scrollToSection("home")}
                                        className="w-full px-4 py-3.5 rounded-xl font-medium bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 border border-cyan-400/20"
                                    >
                                        <FaEnvelope className="text-base" />
                                        <span>Contact Me</span>
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: NAV_ITEMS.length * 0.05 + 0.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownloadResume}
                                        className="w-full px-4 py-3.5 rounded-xl font-medium bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaFileDownload className="text-base" />
                                        <span>Download Resume</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer */}
            <div className="h-16" />
        </>
    );
};

export default Navigation;
