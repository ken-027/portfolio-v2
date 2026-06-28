import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaAward,
  FaExternalLinkAlt,
  FaCalendar,
  FaSpinner,
  FaCloud,
  FaServer,
  FaCode,
  FaDatabase,
  FaDocker,
  FaShieldAlt,
  FaRobot,
  FaChevronDown,
  FaFilter,
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useFetch } from '../hooks/useFetch';
import { fetchCertificates } from '../services/api';

interface Certificate {
  id?: string | number;
  title?: string;
  name?: string;
  platform?: string;
  provider?: string;
  issuer?: string;
  status?: string;
  state?: string;
  issueDate?: string;
  date?: string;
  expiryDate?: string;
  description?: string;
  credentialId?: string;
  certificateImage?: string;
  certificateLink?: string;
  skills?: string[];
  dateCompleted: string;
}

interface CertificatesData {
  data?: Certificate[];
  certificates?: Certificate[];
}

type Domain =
  | 'AI'
  | 'Cloud'
  | 'Backend'
  | 'Frontend'
  | 'Database'
  | 'DevOps'
  | 'Security'
  | 'General';

const DOMAIN_ORDER: Domain[] = [
  'Backend',
  'Frontend',
  'Database',
  'AI',
  'Cloud',
  'DevOps',
  'Security',
  'General',
];

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  AI: [
    'ai',
    'machine learning',
    'ml',
    'deep learning',
    'llm',
    'gpt',
    'openai',
    'langchain',
    'tensorflow',
    'pytorch',
    'neural',
    'nlp',
    'computer vision',
    'generative',
    'prompt',
    'embeddings',
    'vector',
    'anthropic',
    'claude',
    'gemini',
    'hugging face',
    'transformers',
    'stable diffusion',
    'chatbot',
    'rag',
    'fine-tuning',
    'artificial intelligence',
  ],
  Cloud: ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'terraform', 'lambda', 'ec2'],
  DevOps: [
    'docker',
    'kubernetes',
    'ci',
    'cd',
    'jenkins',
    'ansible',
    'devops',
    'linux',
    'bash',
    'pipeline',
    'github actions',
  ],
  Backend: [
    'node',
    'express',
    'django',
    'flask',
    'spring',
    'api',
    'rest',
    'graphql',
    'java',
    'python',
    'golang',
    'rust',
    'microservice',
    'backend',
    'server',
  ],
  Frontend: [
    'react',
    'angular',
    'vue',
    'javascript',
    'typescript',
    'html',
    'css',
    'tailwind',
    'next',
    'svelte',
    'frontend',
    'web',
  ],
  Database: ['sql', 'mysql', 'postgres', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'database'],
  Security: ['security', 'oauth', 'jwt', 'ssl', 'cyber', 'penetration', 'ethical', 'hacking'],
  General: [],
};

const DOMAIN_ICONS: Record<Domain, IconType> = {
  AI: FaRobot,
  Cloud: FaCloud,
  Backend: FaServer,
  Frontend: FaCode,
  Database: FaDatabase,
  DevOps: FaDocker,
  Security: FaShieldAlt,
  General: FaAward,
};

function classifyCert(cert: Certificate): Domain {
  const corpus = [cert.title || cert.name || '', ...(cert.name || [])].join(' ').toLowerCase();
  for (const domain of DOMAIN_ORDER.filter((d) => d !== 'General')) {
    if (DOMAIN_KEYWORDS[domain].some((kw) => corpus.includes(kw))) return domain;
  }
  return 'General';
}

const getPlatform = (cert: Certificate): string =>
  cert.platform || cert.provider || cert.issuer || 'Unknown';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SkillsCredentials = () => {
  const { data, loading, error } = useFetch<Certificate[] | CertificatesData>(fetchCertificates);
  const [activeTab, setActiveTab] = useState<Domain | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const allCertificates = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      const certData = data as CertificatesData;
      return certData.data || certData.certificates || [];
    }
    return [];
  }, [data]);

  const completedCertificates = useMemo(() => {
    return allCertificates.filter((cert) => {
      const status = (cert.status || cert.state || 'completed').toLowerCase();
      return status === 'completed' || status === 'complete' || status === 'finished';
    });
  }, [allCertificates]);

  const groupedCerts = useMemo(() => {
    const groups: Partial<Record<Domain, Certificate[]>> = {};
    for (const cert of completedCertificates) {
      const domain = classifyCert(cert);
      if (!groups[domain]) groups[domain] = [];
      groups[domain]!.push(cert);
    }
    return groups;
  }, [completedCertificates]);

  const activeDomains = useMemo(
    () => DOMAIN_ORDER.filter((d) => !!groupedCerts[d]?.length),
    [groupedCerts],
  );

  const visibleCerts = activeTab ? groupedCerts[activeTab] || [] : [];

  useEffect(() => {
    if (!activeTab && activeDomains.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(activeDomains[0]!); // Default to Backend if available, else first domain
    }
  }, [activeDomains, activeTab]);

  if (loading) {
    return (
      <section id="certificates" className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="text-4xl text-cyan-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center text-red-400">
            <p>Error loading credentials: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="pt-12 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-blue-500/70 mb-2 font-semibold">
            Credentials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent">
              Certificates
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl">
            Verified across cloud, backend, devops, and security — sorted by domain
          </p>
        </motion.div>

        {activeDomains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                {activeTab && (
                  <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                    {activeTab}
                  </span>
                )}
                <span className="ml-auto text-xs text-slate-500">
                  {visibleCerts.length}/{completedCertificates.length}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    Domain
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeDomains.map((domain) => {
                      const DomainIcon = DOMAIN_ICONS[domain];
                      return (
                        <motion.button
                          key={domain}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(domain)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                            activeTab === domain
                              ? 'bg-white/10 border border-white/20 text-white'
                              : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                          }`}
                        >
                          <DomainIcon className="text-[10px]" />
                          {domain}
                          <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                            {groupedCerts[domain]?.length}
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
              {activeDomains.map((domain) => {
                const DomainIcon = DOMAIN_ICONS[domain];
                return (
                  <motion.button
                    key={domain}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(domain)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full transition-[color,background-color,border-color] duration-300 ${
                      activeTab === domain
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <DomainIcon className="text-[10px]" />
                    {domain}
                    <span className="text-[10px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded-full">
                      {groupedCerts[domain]?.length}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[240px]"
          >
            {visibleCerts.map((cert, index) => {
              const certLink = cert.certificateLink;
              const platform = getPlatform(cert);
              return (
                <motion.div key={cert.id || index} variants={itemVariants}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full hover:bg-white/[0.07] hover:border-white/20 transition-[border-color,background-color] duration-300 group overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative h-32 shrink-0 overflow-hidden">
                      {cert.certificateImage ? (
                        <>
                          <img
                            src={cert.certificateImage}
                            alt={cert.title || cert.name}
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
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                          {(() => {
                            const Icon = DOMAIN_ICONS[classifyCert(cert)];
                            return (
                              <Icon className="text-4xl text-white/10 group-hover:text-white/20 transition-opacity duration-500" />
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {/* Row 1: platform + link */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">{platform}</span>
                        {certLink ? (
                          <motion.a
                            href={certLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                            aria-label="View Certificate"
                          >
                            <FaExternalLinkAlt className="text-[10px]" />
                          </motion.a>
                        ) : (
                          <div className="p-1.5 border border-transparent opacity-0">
                            <FaExternalLinkAlt className="text-[10px]" />
                          </div>
                        )}
                      </div>

                      {/* Row 2: title */}
                      <h3
                        className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300"
                        data-tooltip-id="info-tooltip"
                        data-tooltip-content={cert.title || cert.name}
                        data-tooltip-place="top"
                      >
                        {cert.title || cert.name}
                      </h3>

                      {/* Row 3: date */}
                      {cert.dateCompleted && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <FaCalendar className="text-[10px] shrink-0" />
                          <span>
                            {new Date(cert.dateCompleted).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </span>
                          {cert.expiryDate && (
                            <span className="text-slate-600 ml-1">· expires {cert.expiryDate}</span>
                          )}
                        </div>
                      )}

                      {/* Row 4: skill tags */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {cert.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded-full text-[10px] text-slate-500"
                            >
                              {skill}
                            </span>
                          ))}
                          {cert.skills.length > 3 && (
                            <span
                              className="text-[10px] text-slate-600 py-0.5 cursor-default"
                              data-tooltip-id="info-tooltip"
                              data-tooltip-content={cert.skills.slice(3).join(', ')}
                              data-tooltip-place="top"
                            >
                              +{cert.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Row 5: credential ID */}
                      {cert.credentialId && (
                        <div className="pt-2 border-t border-white/10 mt-auto">
                          <span className="text-[9px] text-slate-600 font-mono break-all">
                            ID: {cert.credentialId}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* /p-4 */}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {activeTab && visibleCerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm mx-auto">
              <FaAward className="text-4xl text-slate-600/60 mx-auto mb-3" />
              <p className="text-base font-medium text-slate-400">No credentials in this domain</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsCredentials;
