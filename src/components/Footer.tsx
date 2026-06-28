import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { contactInformation, socials } from '../config/socials';
import { useFetch } from '../hooks/useFetch';
import { getPublicProfile } from '../services/api';

interface PlatformLink {
  icon: IconType;
  href: string;
  label: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: publicProfile } = useFetch(getPublicProfile);

  const platforms: PlatformLink[] = [
    {
      icon: socials.github.icon,
      href: publicProfile?.githubLink || socials.github.link,
      label: socials.github.name,
    },
    {
      icon: socials.linkedin.icon,
      href: publicProfile?.linkedinLink || socials.linkedin.link,
      label: socials.linkedin.name,
    },
    {
      icon: contactInformation.email.icon,
      href: `mailto:${publicProfile?.email || contactInformation.email.link}`,
      label: contactInformation.email.name,
    },
    {
      icon: socials.npm.icon,
      href: publicProfile?.npmLink || socials.npm.link,
      label: socials.npm.name,
    },
    {
      icon: socials.docker.icon,
      href: publicProfile?.dockerHubLink || socials.docker.link,
      label: socials.docker.name,
    },
    {
      icon: socials.leetcode.icon,
      href: publicProfile?.leetCodeLink || socials.leetcode.link,
      label: socials.leetcode.name,
    },
    {
      icon: socials.hackerrank.icon,
      href: publicProfile?.hackerRankLink || socials.hackerrank.link,
      label: socials.hackerrank.name,
    },
    {
      icon: socials.huggingface.icon,
      href: publicProfile?.huggingFaceLink || socials.huggingface.link,
      label: socials.huggingface.name,
    },
  ];

  return (
    <footer className="relative mt-8">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="bg-slate-900/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-16 max-w-3xl">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
              Kenneth Andales
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
              Building full-stack products & AI-powered web experiences for startups
            </p>
          </motion.div>

          {/* Platform icons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {platforms.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
              >
                <Icon className="text-xl" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-slate-800/60 mb-8" />

          {/* Copyright */}
          <div className="text-center space-y-1.5">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear}</span>
              <span className="text-gradient font-semibold">Kenneth Andales</span>
              <span className="text-slate-600">·</span>
              <span>Made with</span>
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaHeart className="text-red-500 inline" />
              </motion.span>
            </p>
            <p className="text-slate-600 text-xs">
              Built with React · TypeScript · Tailwind CSS · Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
