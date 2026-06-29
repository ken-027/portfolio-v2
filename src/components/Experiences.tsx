import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
  FaBriefcase,
} from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';
import { fetchExperiences } from '../services/api';

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
  techStacks?: Technology[];
}

interface ExperiencesData {
  success: boolean;
  data: Experience[];
}

const formatYear = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

const calculateDuration = (startDate?: string, endDate?: string | null): string => {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' ') : '< 1 mo';
};

const getUniqueTechs = (experience: Experience): Technology[] => {
  if (experience.techStacks && experience.techStacks?.length) return experience.techStacks;
  const seen = new Set<string>();
  const techs: Technology[] = [];
  for (const project of experience.projects || []) {
    for (const tech of project.technologies || []) {
      if (!seen.has(tech.name)) {
        seen.add(tech.name);
        techs.push(tech);
      }
    }
  }
  return techs.slice(0, 6);
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const expandVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Experiences = () => {
  const { data, loading, error } = useFetch<ExperiencesData>(fetchExperiences);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <section id="experiences" className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12 space-y-3">
            <div className="h-3 w-14 bg-white/[0.06] rounded animate-pulse" />
            <div className="h-9 w-72 bg-white/[0.08] rounded animate-pulse" />
            <div className="h-4 w-80 bg-white/[0.05] rounded animate-pulse" />
          </div>
          <div className="space-y-4 sm:pl-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:block w-10 h-10 rounded-xl bg-white/[0.06] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-48 bg-white/[0.08] rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/[0.06] rounded animate-pulse" />
                    <div className="flex gap-2">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div
                          key={j}
                          className="h-6 w-16 bg-white/[0.06] rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experiences" className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center text-red-400">
            <p>Error loading experiences: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const experiences: Experience[] = data?.data || [];

  return (
    <section id="experiences" className="py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-emerald-500/70 mb-2 font-semibold">
            Career
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Professional Experience
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl">
            Startups, agencies, and client products — shipped across the full stack
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line — hidden on mobile */}
          <motion.div
            className="hidden sm:block absolute left-3 top-0 bottom-0 w-px origin-top"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(148,163,184,0.35) 15%, rgba(148,163,184,0.35) 85%, transparent)',
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-4 sm:pl-10"
          >
            {experiences.map((experience, index) => {
              const techs = getUniqueTechs(experience);
              const featuredCount = (experience.projects || []).filter((p) => p.featured).length;
              const startYear = experience.startDate ? formatYear(experience.startDate) : '';
              const endLabel = experience.endDate ? formatYear(experience.endDate) : 'present';
              const duration = calculateDuration(experience.startDate, experience.endDate);
              const isCurrent = !experience.endDate;
              const hasDetails =
                (experience.descriptions?.length ?? 0) > 0 ||
                (experience.projects?.length ?? 0) > 0;
              const isExpanded = expandedIds.has(experience.id || String(index));
              const cardId = experience.id || String(index);

              return (
                <motion.div key={cardId} variants={itemVariants} className="relative">
                  {/* Timeline dot — hidden on mobile */}
                  <div className="hidden sm:block absolute -left-7 top-10 z-10 -translate-x-1/2">
                    <div className="relative flex items-center justify-center w-2.5 h-2.5">
                      {isCurrent && (
                        <motion.div
                          className="absolute w-5 h-5 rounded-full bg-emerald-400/25"
                          animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.2,
                          }}
                        />
                      )}
                      <motion.div
                        className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-emerald-400' : 'bg-slate-600'}`}
                        animate={{ scale: [1, 1.35, 1] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.2,
                        }}
                      />
                    </div>
                  </div>

                  <div className="card-hover-glow bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-white/[0.18] transition-[border-color,background-color] duration-300 group">
                    {/* Card header — always visible */}
                    <div className="p-5 flex items-start gap-4">
                      {/* Company logo or fallback */}
                      <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 items-center justify-center overflow-hidden">
                        {experience.companyLogo ? (
                          <img
                            src={experience.companyLogo}
                            alt={experience.company}
                            loading="lazy"
                            className="w-full h-full object-contain p-1.5 opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                            onError={(e) => {
                              const el = e.currentTarget;
                              el.style.display = 'none';
                              if (el.parentElement) {
                                el.parentElement.innerHTML =
                                  '<span class="text-base font-bold text-slate-600">' +
                                  (experience.company?.charAt(0) || '?') +
                                  '</span>';
                              }
                            }}
                          />
                        ) : (
                          <FaBriefcase className="text-slate-600 text-sm group-hover:text-slate-500 transition-colors duration-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                            {experience.title}
                          </h3>
                          {isCurrent && (
                            <span className="shrink-0 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-semibold">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Company */}
                        <div className="flex items-center gap-2 mb-4">
                          {experience.companyLink ? (
                            <a
                              href={experience.companyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                            >
                              {experience.company}
                              <FaExternalLinkAlt className="text-[9px]" />
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">{experience.company}</span>
                          )}
                          {experience.location && (
                            <>
                              <span className="text-slate-600 text-xs">·</span>
                              <span className="flex items-center gap-1 text-xs text-slate-600">
                                <FaMapMarkerAlt className="text-[9px]" />
                                {experience.location}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Tech pills */}
                        {techs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {techs.map((tech, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] border border-white/[0.1] rounded-full"
                              >
                                {tech.icon && (
                                  <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="w-3 h-3 object-contain"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                  />
                                )}
                                <span className="text-xs text-slate-300 font-medium">
                                  {tech.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Stats row + expand toggle */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            {startYear && (
                              <span className="text-slate-400 font-medium">
                                {startYear} — {endLabel}
                              </span>
                            )}
                            {featuredCount > 0 && (
                              <>
                                <span className="text-slate-700">·</span>
                                <span>
                                  {featuredCount} project{featuredCount > 1 ? 's' : ''} shipped
                                </span>
                              </>
                            )}
                            {duration && (
                              <>
                                <span className="text-slate-700">·</span>
                                <span>{duration} exp</span>
                              </>
                            )}
                          </div>
                          {hasDetails && (
                            <button
                              onClick={() => toggleExpand(cardId)}
                              className="shrink-0 flex items-center gap-1 text-[11px] text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                            >
                              {isExpanded ? 'less' : 'more'}
                              <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaChevronDown className="text-[9px]" />
                              </motion.span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && hasDetails && (
                        <motion.div
                          key="expand"
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-white/[0.07]">
                            {/* Descriptions */}
                            {(experience.descriptions?.length ?? 0) > 0 && (
                              <div className="pt-4 mb-4">
                                <ul className="space-y-1.5">
                                  {experience.descriptions!.map((desc, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed"
                                    >
                                      <FaChevronRight className="text-cyan-500/60 text-[9px] mt-1.5 shrink-0" />
                                      <span>{desc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Projects */}
                            {(experience.projects?.filter((p) => p.featured).length ?? 0) > 0 && (
                              <div
                                className={
                                  (experience.descriptions?.length ?? 0) > 0
                                    ? 'border-t border-white/[0.07] pt-4'
                                    : 'pt-4'
                                }
                              >
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-3">
                                  Featured Projects
                                </p>
                                <div className="space-y-2">
                                  {experience
                                    .projects!.filter((p) => p.featured)
                                    .map((project, pi) => (
                                      <div
                                        key={project.id || pi}
                                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3"
                                      >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <span className="text-sm font-medium text-slate-300">
                                            {project.title}
                                          </span>
                                          {project.featured && (
                                            <span className="shrink-0 px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] text-cyan-400 font-semibold">
                                              Featured
                                            </span>
                                          )}
                                        </div>
                                        {project.description && (
                                          <p className="text-xs text-slate-500 leading-relaxed mb-2">
                                            {project.description}
                                          </p>
                                        )}
                                        {project.technologies &&
                                          project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                              {project.technologies.slice(0, 5).map((tech, ti) => (
                                                <span
                                                  key={ti}
                                                  className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] text-slate-500"
                                                >
                                                  {tech.name}
                                                </span>
                                              ))}
                                              {project.technologies.length > 5 && (
                                                <span
                                                  className="text-[10px] text-slate-600 py-0.5 cursor-default"
                                                  data-tooltip-id="info-tooltip"
                                                  data-tooltip-content={project.technologies
                                                    .slice(5)
                                                    .map((t) => t.name)
                                                    .join(', ')}
                                                  data-tooltip-place="top"
                                                >
                                                  +{project.technologies.length - 5}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
