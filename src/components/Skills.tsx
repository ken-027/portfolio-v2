import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaCode,
  FaDatabase,
  FaTools,
  FaServer,
  FaSpinner,
  FaCloud,
  FaRobot,
  FaLaptopCode,
  FaChevronDown,
  FaFilter,
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useFetch } from '../hooks/useFetch';
import { fetchSkills } from '../services/api';

interface Skill {
  name: string;
  icon?: string;
  proficiency?: string;
}

interface SkillCategory {
  name: string;
  items?: Skill[];
}

interface SkillsData {
  success: boolean;
  data: SkillCategory[];
}

const CATEGORY_PRIORITY: [string, number][] = [
  ['backend', 0],
  ['frontend', 1],
  ['database', 2],
  ['ai', 3],
  ['llm', 3],
  ['cloud', 4],
  ['devops', 4],
  ['architect', 5],
  ['practice', 5],
  ['other', 6],
  ['tool', 6],
];

const getCategoryOrder = (name: string): number => {
  const lc = name.toLowerCase();
  for (const [key, order] of CATEGORY_PRIORITY) {
    if (lc.includes(key)) return order;
  }
  return 999;
};

const Skills = () => {
  const { data, loading, error } = useFetch<SkillsData>(fetchSkills);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const getCategoryIcon = (categoryName?: string): IconType => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('frontend')) return FaCode;
    if (name.includes('backend')) return FaServer;
    if (name.includes('database')) return FaDatabase;
    if (name.includes('cloud') || name.includes('devops')) return FaCloud;
    if (name.includes('ai') || name.includes('llm')) return FaRobot;
    if (name.includes('other') || name.includes('tool')) return FaTools;
    return FaLaptopCode;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const skillCategories = [...(data?.data || [])].sort(
    (a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name),
  );

  useEffect(() => {
    if (!activeCategory && skillCategories.length > 0) {
      // @ts-expect-error @ts-ignore
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(skillCategories[0].name);
    }
  }, [skillCategories, activeCategory]);

  if (loading) {
    return (
      <section id="skills" className="py-12 bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-center h-40">
            <FaSpinner className="text-3xl text-cyan-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-12 bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center text-red-400">
            <p>Error loading skills: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const activeItems = skillCategories.find((c) => c.name === activeCategory)?.items || [];

  return (
    <section id="skills" className="py-12 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-cyan-500/70 mb-2 font-semibold">
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Skills & Technologies</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl">
            From API design to deployment to AI integration — the stack I reach for
          </p>
        </motion.div>

        {skillCategories.length > 0 && (
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
                {activeCategory && (
                  <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                    {activeCategory}
                  </span>
                )}
                <span className="ml-auto text-xs text-slate-500">
                  {activeItems.length}/
                  {skillCategories.reduce((s, c) => s + (c.items?.length || 0), 0)}
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
                  filterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="mt-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                  <p className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillCategories.map((category) => {
                      const Icon = getCategoryIcon(category.name);
                      return (
                        <motion.button
                          key={category.name}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveCategory(category.name)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                            activeCategory === category.name
                              ? 'bg-white/10 border border-white/20 text-white'
                              : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                          }`}
                        >
                          <Icon className="text-[10px]" />
                          {category.name}
                          <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                            {category.items?.length}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: always-visible flat pill row */}
            <div className="hidden md:flex flex-wrap gap-2">
              {skillCategories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                      activeCategory === category.name
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <Icon className="text-[10px]" />
                    {category.name}
                    <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                      {category.items?.length}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
          >
            {activeItems.map((skill, skillIndex) => (
              <motion.div
                key={skillIndex}
                variants={itemVariants}
                className="group cursor-pointer"
                data-tooltip-id="info-tooltip"
                data-tooltip-content={`${skill.name} - ${skill.proficiency} proficiency`}
                data-tooltip-place="top"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-300 h-full flex flex-col items-center justify-center gap-2">
                  {skill.icon && (
                    <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                  <h4 className="font-medium text-white text-[11px] text-center leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {skill.name}
                  </h4>
                  <span className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.12] rounded-full text-[10px] text-slate-400 capitalize">
                    {skill.proficiency}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {skillCategories.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <p>No skills data available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
