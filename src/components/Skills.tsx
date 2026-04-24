import { motion, Variants } from 'framer-motion';
import { FaCode, FaDatabase, FaTools, FaServer, FaSpinner, FaCloud, FaRobot, FaLaptopCode } from 'react-icons/fa';
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

const Skills = () => {
    const { data, loading, error } = useFetch<SkillsData>(fetchSkills);

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

    const getCategoryColor = (categoryName?: string): string => {
        const name = categoryName?.toLowerCase() || '';
        if (name.includes('frontend')) return 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400';
        if (name.includes('backend')) return 'from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400';
        if (name.includes('database')) return 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400';
        if (name.includes('cloud') || name.includes('devops')) return 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-400';
        if (name.includes('ai') || name.includes('llm')) return 'from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-400';
        return 'from-slate-500/10 to-slate-500/10 border-slate-500/20 text-slate-400';
    };

    const getProficiencyColor = (proficiency?: string): string => {
        const prof = proficiency?.toLowerCase() || 'beginner';
        if (prof === 'expert' || prof === 'advanced') return 'from-green-500 via-emerald-500 to-green-600';
        if (prof === 'intermediate') return 'from-blue-500 via-cyan-500 to-blue-600';
        return 'from-amber-500 via-orange-500 to-amber-600'; // beginner
    };

    const getProficiencyWidth = (proficiency?: string): string => {
        const prof = proficiency?.toLowerCase() || 'beginner';
        if (prof === 'expert') return '100%';
        if (prof === 'advanced') return '85%';
        if (prof === 'intermediate') return '65%';
        return '40%'; // beginner
    };

    const getProficiencyLevel = (proficiency?: string): number => {
        const prof = proficiency?.toLowerCase() || 'beginner';
        if (prof === 'expert') return 10;
        if (prof === 'advanced') return 8;
        if (prof === 'intermediate') return 6;
        return 4; // beginner
    };

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

    // Get skills array from nested structure
    const skillCategories = data?.data || [];

    return (
        <section id="skills" className="py-12 bg-transparent">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="text-gradient">Skills & Technologies</span>
                    </h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        Tools and technologies I work with
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {skillCategories.map((category, categoryIndex) => {
                        const Icon = getCategoryIcon(category.name);
                        const categoryColor = getCategoryColor(category.name);

                        return (
                            <motion.div
                                key={categoryIndex}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                                className="relative"
                            >
                                {/* Category Header */}
                                <div className="relative mb-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: 5 }}
                                            className={`p-2 bg-linear-to-br ${categoryColor} rounded-lg border shadow-lg`}
                                        >
                                            <Icon className="text-xl" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">{category.name}</h3>
                                            <p className="text-xs text-slate-400">{category.items?.length} technologies</p>
                                        </div>
                                    </div>
                                    <div className={`absolute -bottom-1 left-0 right-0 h-px bg-linear-to-r ${categoryColor} opacity-30`}></div>
                                </div>

                                {/* Skills Grid */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
                                >
                                    {category.items?.map((skill, skillIndex) => {
                                        const proficiencyColor = getProficiencyColor(skill.proficiency);
                                        const proficiencyLevel = getProficiencyLevel(skill.proficiency);

                                        return (
                                            <motion.div
                                                key={skillIndex}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.08, y: -6 }}
                                                className="group cursor-pointer"
                                                data-tooltip-id="info-tooltip"
                                                data-tooltip-content={`${skill.name} - ${skill.proficiency} proficiency level`}
                                                data-tooltip-place="top"
                                            >
                                                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 hover:border-cyan-500/50 transition-colors h-full flex flex-col items-center justify-center gap-2 overflow-hidden">
                                                    {/* Animated Background Glow */}
                                                    <motion.div
                                                        className={`absolute inset-0 bg-linear-to-br ${proficiencyColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                                    />

                                                    {/* Proficiency Badge - Top Right */}
                                                    <div className="absolute top-2 right-2 flex items-center gap-1">
                                                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                                            {skill.proficiency?.charAt(0) || 'B'}
                                                        </span>
                                                        <div className="flex flex-col gap-0.5">
                                                            {[...Array(3)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-1 h-0.5 rounded-full transition-colors ${i < Math.ceil(proficiencyLevel / 3.5)
                                                                        ? proficiencyLevel >= 8
                                                                            ? 'bg-green-500'
                                                                            : proficiencyLevel >= 6
                                                                                ? 'bg-blue-500'
                                                                                : 'bg-amber-500'
                                                                        : 'bg-slate-700'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Skill Icon */}
                                                    {skill.icon && (
                                                        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                                                            <img
                                                                src={skill.icon}
                                                                alt={skill.name}
                                                                className="w-full h-full object-contain filter drop-shadow-lg"
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Skill Name */}
                                                    <h4 className="font-semibold text-white text-xs text-center leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2 relative z-10">
                                                        {skill.name}
                                                    </h4>

                                                    {/* Progress Bar - Bottom */}
                                                    <div className="w-full h-1 bg-slate-700/30 rounded-full overflow-hidden relative z-10">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: getProficiencyWidth(skill.proficiency) }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1, delay: skillIndex * 0.03, ease: "easeOut" }}
                                                            className={`h-full bg-linear-to-r ${proficiencyColor} shadow-lg`}
                                                            style={{
                                                                boxShadow: proficiencyLevel >= 8
                                                                    ? '0 0 8px rgba(34, 197, 94, 0.5)'
                                                                    : proficiencyLevel >= 6
                                                                        ? '0 0 8px rgba(6, 182, 212, 0.5)'
                                                                        : '0 0 8px rgba(245, 158, 11, 0.5)'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Proficiency Text - Small */}
                                                    <div className="text-[9px] font-medium text-slate-500 group-hover:text-slate-400 transition-colors capitalize relative z-10">
                                                        {skill.proficiency}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        );
                    })}

                    {/* Empty State */}
                    {skillCategories.length === 0 && (
                        <div className="text-center text-slate-400 py-12">
                            <p>No skills data available</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Skills;
