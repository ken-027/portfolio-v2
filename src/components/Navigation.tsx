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
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import { getPublicProfile } from "../services/api";

interface NavItem {
    id: string;
    label: string;
    icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
    { id: "home", label: "Home", icon: FaHome },
    { id: "experiences", label: "Experience", icon: FaBriefcase },
    { id: "skills", label: "Skills", icon: FaTools },
    { id: "projects", label: "Projects", icon: FaFolder },
    { id: "certificates", label: "Certificates", icon: FaAward },
];

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const { data: publicProfile } = useFetch(getPublicProfile);
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            const scrollPosition = window.scrollY + 100;
            for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
                const section = document.getElementById(NAV_ITEMS[i]!.id);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(NAV_ITEMS[i]!.id);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 64, behavior: "smooth" });
            setIsMobileMenuOpen(false);
            setActiveSection(sectionId);
        }
    };

    const handleDownloadResume = () => {
        if (publicProfile?.resumeLink) window.open(publicProfile.resumeLink, '_blank');
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
                    isScrolled
                        ? "bg-slate-900/85 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800/60"
                        : "bg-transparent"
                }`}
            >
                {/* Scroll progress bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500 origin-left"
                    style={{ scaleX }}
                />

                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => scrollToSection("home")}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="p-2 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors">
                                <FaCode className="text-cyan-400 text-lg" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold tracking-wide">
                                    <span className="text-white">Kenneth </span>
                                    <span className="text-gradient">Andales</span>
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Full-Stack Developer</span>
                            </div>
                        </motion.div>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                            isActive
                                                ? "text-cyan-400 bg-cyan-500/10"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                        }`}
                                    >
                                        <Icon className="text-xs shrink-0" />
                                        {item.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navDot"
                                                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            {publicProfile?.githubLink && (
                                <motion.a
                                    whileHover={{ scale: 1.1, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={publicProfile.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                                >
                                    <FaGithub className="text-lg" />
                                </motion.a>
                            )}
                            {publicProfile?.linkedinLink && (
                                <motion.a
                                    whileHover={{ scale: 1.1, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={publicProfile.linkedinLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800/60 transition-colors"
                                >
                                    <FaLinkedin className="text-lg" />
                                </motion.a>
                            )}

                            <div className="w-px h-5 bg-slate-700/70 mx-1" />

                            <motion.button
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => scrollToSection("contact")}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2"
                            >
                                <FaEnvelope className="text-xs" />
                                Contact
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={handleDownloadResume}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/70 transition-colors flex items-center gap-2"
                            >
                                <FaFileDownload className="text-xs" />
                                Resume
                            </motion.button>
                        </div>

                        {/* Mobile menu toggle */}
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <FaTimes className="text-xl" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <FaBars className="text-xl" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
                            style={{ top: "64px" }}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="fixed top-16 left-0 right-0 lg:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto"
                        >
                            <div className="container mx-auto px-4 py-4 flex flex-col gap-1.5">
                                {NAV_ITEMS.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-colors ${
                                                isActive
                                                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                                                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                            }`}
                                        >
                                            <Icon className={`text-sm ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                                        </motion.button>
                                    );
                                })}

                                <div className="border-t border-slate-800/60 mt-2 pt-3 flex gap-2">
                                    {publicProfile?.githubLink && (
                                        <motion.a
                                            whileTap={{ scale: 0.96 }}
                                            href={publicProfile.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaGithub />
                                            GitHub
                                        </motion.a>
                                    )}
                                    {publicProfile?.linkedinLink && (
                                        <motion.a
                                            whileTap={{ scale: 0.96 }}
                                            href={publicProfile.linkedinLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-blue-400 border border-slate-700/50 hover:border-blue-600/40 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaLinkedin />
                                            LinkedIn
                                        </motion.a>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pb-2">
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: NAV_ITEMS.length * 0.04 + 0.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => scrollToSection("contact")}
                                        className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <FaEnvelope />
                                        Contact Me
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: NAV_ITEMS.length * 0.04 + 0.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownloadResume}
                                        className="w-full py-3 rounded-xl font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <FaFileDownload />
                                        Download Resume
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="h-16" />
        </>
    );
};

export default Navigation;
