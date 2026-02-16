import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { contactInformation, socials } from '../config/socials';

interface SocialLink {
    icon: IconType;
    href: string;
    label: string;
}
const Footer = () => {
    const currentYear = new Date().getFullYear();


    const socialLinks: SocialLink[] = [
        { icon: socials.github.icon, href: socials.github.link, label: socials.github.name },
        { icon: socials.linkedin.icon, href: socials.linkedin.link, label: socials.linkedin.name },
        { icon: contactInformation.email.icon, href: contactInformation.email.link, label: contactInformation.email.name },
    ];

    return (
        <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-gradient mb-4">Portfolio</h3>
                        <p className="text-slate-400 text-sm">
                            Crafting elegant solutions with clean code and modern architecture.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Home', 'Experiences', 'Skills', 'Projects', 'Certificates', 'Contact'].map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => {
                                            const element = document.getElementById(item.toLowerCase());
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Developer Platforms */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Developer Platforms</h4>

                        <div className="flex flex-wrap gap-3">
                            {Object.keys(socials).filter((socialKey) => !["github", "linkedin"].includes(socialKey)).map((socialKey) => {
                                const social = socials[socialKey as keyof typeof socials];
                                const Icon = social.icon;

                                return (
                                    <motion.a
                                        key={social.name}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                                        data-tooltip-id="portfolio-tooltip"
                                    >
                                        <Icon className="text-xl" />
                                    </motion.a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                                >
                                    <social.icon className="text-xl" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-slate-800 text-center space-y-2">
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        © {currentYear} Made with{' '}
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <FaHeart className="text-red-500" />
                        </motion.span>
                        by Software Developer
                    </p>
                    <p className="text-slate-500 text-xs">
                        Built with React, TypeScript, Tailwind CSS & Cursor AI
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
