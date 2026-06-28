import { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaFolder,
  FaCode,
  FaUsers,
  FaUser,
  FaRobot,
  FaDocker,
  FaLaptopCode,
  FaServer,
  FaLayerGroup,
  FaChevronDown,
  FaFilter,
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useFetch } from '../hooks/useFetch';
import { fetchProjects } from '../services/api';

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
  type: 'personal' | 'professional' | 'open-source';
  category: 'frontend' | 'backend' | 'fullstack';
  projectRole: 'solo' | 'leader' | 'collaborator' | 'contributor';
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
  label: string;
  color: string;
  bg: string;
  border: string;
}

const INFRA_SUBSTRINGS = [
  'docker',
  'kubernetes',
  'k8s',
  'nginx',
  'postgres',
  'redis',
  'mysql',
  'mongodb',
  'rabbitmq',
  'kafka',
  'elasticsearch',
  'grafana',
  'prometheus',
  'terraform',
  'ansible',
  'jenkins',
  'traefik',
  'aws',
  'gcp',
  'google cloud',
  'azure',
  'cloudflare',
  'haproxy',
  'memcached',
  'sqlite',
  'mariadb',
  'cassandra',
  'dynamodb',
  'firebase',
  'supabase',
  'vercel',
  'netlify',
  'heroku',
  'digitalocean',
  'linux',
  'ubuntu',
  'debian',
  's3',
  'ec2',
  'ecs',
  'eks',
  'lambda',
  'cloudwatch',
  'datadog',
  'sentry',
  'kibana',
];

const isInfraTech = (tech: Technology): boolean =>
  INFRA_SUBSTRINGS.some((s) => tech.name.toLowerCase().includes(s));

const getCategoryInfo = (category?: string): CategoryInfo => {
  const lc = category?.toLowerCase() || '';
  if (lc === 'frontend')
    return {
      Icon: FaLaptopCode,
      label: 'Frontend',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    };
  if (lc === 'backend')
    return {
      Icon: FaServer,
      label: 'Backend',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    };
  if (lc === 'fullstack')
    return {
      Icon: FaLayerGroup,
      label: 'Full Stack',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    };
  return {
    Icon: FaCode,
    label: category || 'Other',
    color: 'text-slate-400',
    bg: 'bg-white/[0.04]',
    border: 'border-white/[0.1]',
  };
};

const getRoleIcon = (role?: string): IconType => {
  const lc = role?.toLowerCase() || '';
  if (lc.includes('team') || lc.includes('collaborator')) return FaUsers;
  return FaUser;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Projects = () => {
  const { data, loading, error } = useFetch<ProjectsData>(fetchProjects);
  const [selectedType, setSelectedType] = useState<Project['type'] | 'all'>('professional');
  const [selectedCategory, setSelectedCategory] = useState<Project['category'] | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const allProjects = useMemo(() => {
    return (data?.data || []).filter((project: Project) => project.featured);
  }, [data]);

  const projectTypes = useMemo(() => {
    if (!allProjects.length) return ['all'];
    const types = [...new Set(allProjects.map((p) => p.type?.toLowerCase()).filter(Boolean))];
    return ['all', ...types.sort()];
  }, [allProjects]);

  const projectCategories = useMemo(() => {
    if (!allProjects.length) return ['all'];
    const categories = [
      ...new Set(allProjects.map((p) => p.category?.toLowerCase()).filter(Boolean)),
    ];
    return ['all', ...categories.sort()];
  }, [allProjects]);

  const filteredProjects: Project[] = useMemo(() => {
    return allProjects.filter((project: Project) => {
      const typeMatch = selectedType === 'all' || project.type?.toLowerCase() === selectedType;
      const categoryMatch =
        selectedCategory === 'all' || project.category?.toLowerCase() === selectedCategory;
      return typeMatch && categoryMatch;
    });
  }, [allProjects, selectedType, selectedCategory]);

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10 space-y-3">
            <div className="h-3 w-20 bg-white/[0.06] rounded animate-pulse" />
            <div className="h-9 w-64 bg-white/[0.08] rounded animate-pulse" />
            <div className="h-4 w-96 bg-white/[0.05] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-36 bg-white/[0.06] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-white/[0.08] rounded animate-pulse" />
                  <div className="h-3 w-full bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-white/[0.05] rounded animate-pulse" />
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
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-400">
            <p>Error loading projects: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-purple-500/70 mb-2 font-semibold">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl">
            SaaS products, APIs, and AI tools — selected builds shipped for real users
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          {/* Mobile: collapsible filter panel */}
          <div className="md:hidden">
            <button
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.12] hover:border-white/[0.18] bg-white/[0.02] transition-colors duration-200"
              onClick={() => setFilterOpen((v) => !v)}
            >
              <FaFilter className="text-slate-500 text-xs shrink-0" />
              <span className="text-sm font-medium text-slate-300">Filters</span>
              {selectedType !== 'all' && (
                <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs text-white capitalize">
                  {selectedType}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                  {getCategoryInfo(selectedCategory).label}
                </span>
              )}
              <span className="ml-auto text-xs text-slate-500">
                {filteredProjects.length}/{allProjects.length}
              </span>
              <motion.span
                animate={{ rotate: filterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex text-slate-500"
              >
                <FaChevronDown className="text-xs" />
              </motion.span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                filterOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="mt-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-5">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    Project Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedType(type as Project['type'])}
                        aria-pressed={selectedType === type}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 capitalize ${
                          selectedType === type
                            ? 'bg-white/10 border border-white/20 text-white'
                            : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                        }`}
                      >
                        {type === 'all' ? 'All' : type}
                        <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                          {type === 'all'
                            ? allProjects.length
                            : allProjects.filter((p) => p.type?.toLowerCase() === type).length}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projectCategories.map((category) => {
                      const { Icon, label } = getCategoryInfo(category);
                      return (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category as Project['category'])}
                          aria-pressed={selectedCategory === category}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                            selectedCategory === category
                              ? 'bg-white/10 border border-white/20 text-white'
                              : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                          }`}
                        >
                          {category !== 'all' && <Icon className="text-[10px]" />}
                          {category === 'all' ? 'All' : label}
                          <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                            {category === 'all'
                              ? allProjects.length
                              : allProjects.filter((p) => p.category?.toLowerCase() === category)
                                  .length}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: always-visible flat pill row */}
          <div className="hidden md:flex flex-wrap items-center gap-2">
            {projectTypes.map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type as Project['type'])}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 capitalize ${
                  selectedType === type
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                }`}
              >
                {type === 'all' ? 'All' : type}
                <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                  {type === 'all'
                    ? allProjects.length
                    : allProjects.filter((p) => p.type?.toLowerCase() === type).length}
                </span>
              </motion.button>
            ))}
            <span className="text-slate-700">|</span>
            {projectCategories.map((category) => {
              const { Icon, label } = getCategoryInfo(category);
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category as Project['category'])}
                  aria-pressed={selectedCategory === category}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                    selectedCategory === category
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                  }`}
                >
                  {category !== 'all' && <Icon className="text-[10px]" />}
                  {category === 'all' ? 'All' : label}
                  <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                    {category === 'all'
                      ? allProjects.length
                      : allProjects.filter((p) => p.category?.toLowerCase() === category).length}
                  </span>
                </motion.button>
              );
            })}
          </div>
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
            const {
              Icon: CategoryIcon,
              label: categoryLabel,
              color: categoryColor,
              bg: categoryBg,
              border: categoryBorder,
            } = categoryInfo;
            const lc = project.category?.toLowerCase() || '';
            const cardGlow =
              lc === 'frontend'
                ? 'hover:shadow-blue-500/10'
                : lc === 'backend'
                  ? 'hover:shadow-emerald-500/10'
                  : lc === 'fullstack'
                    ? 'hover:shadow-cyan-500/10'
                    : 'hover:shadow-white/[0.05]';
            const RoleIcon = getRoleIcon(project.projectRole);
            const appTechs = project.technologies.filter((t) => !isInfraTech(t));
            const infraTechs = project.technologies.filter((t) => isInfraTech(t));

            return (
              <motion.div key={project.id || index} variants={itemVariants}>
                <div
                  className={`card-hover-glow bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-300 group overflow-hidden hover:shadow-xl ${cardGlow}`}
                >
                  {/* Thumbnail — real image or category icon fallback */}
                  <div className="relative h-36 shrink-0 overflow-hidden">
                    {project.thumbnailLink ? (
                      <>
                        <img
                          src={project.thumbnailLink}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = 'none';
                            if (el.parentElement) {
                              el.parentElement.classList.add(
                                'bg-white/[0.03]',
                                'flex',
                                'items-center',
                                'justify-center',
                              );
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                      </>
                    ) : (
                      <div
                        className={`w-full h-full ${categoryBg} flex items-center justify-center`}
                      >
                        <CategoryIcon
                          className={`text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${categoryColor}`}
                        />
                      </div>
                    )}
                    {project.aiPowered && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-violet-500/20 backdrop-blur-sm border border-violet-500/30 rounded-lg">
                        <FaRobot className="text-violet-400 text-[10px]" />
                        <span className="text-[10px] text-violet-400 font-medium">AI</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Top row: category + AI badge + action links */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 ${categoryBg} ${categoryBorder} border rounded-lg`}
                        >
                          <CategoryIcon className={`${categoryColor} text-[10px]`} />
                          <span className={`text-[10px] ${categoryColor} font-medium`}>
                            {categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Action links */}
                      <div className="flex gap-1.5">
                        {project.githubRepo && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg text-slate-400 hover:text-white transition-colors duration-200 border border-white/10 hover:border-white/20"
                            aria-label="GitHub"
                          >
                            <FaGithub className="text-xs" />
                          </motion.a>
                        )}
                        {project.dockerLink && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={project.dockerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-colors duration-200 border border-blue-500/20"
                            aria-label="Docker Hub"
                          >
                            <FaDocker className="text-xs" />
                          </motion.a>
                        )}
                        {(project.liveDemo || project.screenshot) && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={project.liveDemo || project.screenshot || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors duration-200 border border-cyan-500/20"
                            aria-label="Live Demo"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 leading-tight"
                      data-tooltip-id="info-tooltip"
                      data-tooltip-content={project.title}
                      data-tooltip-place="top"
                    >
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2"
                      data-tooltip-id="info-tooltip"
                      data-tooltip-content={project.description}
                      data-tooltip-place="top"
                    >
                      {project.description}
                    </p>

                    {/* Meta row: type + role */}
                    <div className="flex items-center gap-2 mb-3">
                      {project.type && (
                        <span className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-[10px] text-slate-500 capitalize">
                          {project.type}
                        </span>
                      )}
                      {project.projectRole && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-[10px] text-slate-500 capitalize">
                          <RoleIcon className="text-[9px]" />
                          {project.projectRole.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Tech rows */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-white/[0.07]">
                        {appTechs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {appTechs.slice(0, 4).map((tech, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.03] border border-white/[0.1] rounded-full"
                              >
                                {tech.icon && (
                                  <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="w-3 h-3 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-[10px] text-slate-300 font-medium">
                                  {tech.name}
                                </span>
                              </div>
                            ))}
                            {appTechs.length > 4 && (
                              <span
                                className="px-2 py-0.5 text-[10px] text-slate-500 bg-white/[0.03] rounded-full border border-white/[0.08] cursor-default"
                                data-tooltip-id="info-tooltip"
                                data-tooltip-content={appTechs
                                  .slice(4)
                                  .map((t) => t.name)
                                  .join(', ')}
                                data-tooltip-place="top"
                              >
                                +{appTechs.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {infraTechs.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <FaServer className="text-slate-600 text-[9px] shrink-0" />
                            {infraTechs.slice(0, 5).map((tech, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.02] border border-white/[0.07] rounded-full"
                              >
                                {tech.icon && (
                                  <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="w-2.5 h-2.5 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-[9px] text-slate-500 font-medium">
                                  {tech.name}
                                </span>
                              </div>
                            ))}
                            {infraTechs.length > 5 && (
                              <span
                                className="text-[9px] text-slate-600 cursor-default"
                                data-tooltip-id="info-tooltip"
                                data-tooltip-content={infraTechs
                                  .slice(5)
                                  .map((t) => t.name)
                                  .join(', ')}
                                data-tooltip-place="top"
                              >
                                +{infraTechs.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* /p-4 */}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm mx-auto">
              <FaFolder className="text-4xl text-slate-600/60 mx-auto mb-3" />
              {allProjects.length === 0 ? (
                <p className="text-base font-medium text-slate-400">No projects available</p>
              ) : (
                <>
                  <p className="text-base font-medium text-slate-400 mb-2">No projects found</p>
                  <p className="text-sm text-slate-500 mb-4">Try adjusting your filters</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] rounded-lg text-white text-sm font-medium transition-colors duration-200"
                  >
                    View All
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
