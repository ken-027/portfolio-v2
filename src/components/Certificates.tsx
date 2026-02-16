import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaExternalLinkAlt, FaCalendar, FaSpinner, FaFilter } from 'react-icons/fa';
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

const Certificates = () => {
    const { data, loading, error } = useFetch<Certificate[] | CertificatesData>(fetchCertificates);
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    // Get all certificates
    const allCertificates = useMemo(() => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object') {
            const certData = data as CertificatesData;
            return certData.data || certData.certificates || [];
        }
        return [];
    }, [data]);

    // Filter: Only show completed certificates
    const completedCertificates = useMemo(() => {
        if (!allCertificates || allCertificates.length === 0) return [];

        return allCertificates.filter(cert => {
            const status = (cert.status || cert.state || 'completed').toLowerCase();
            return status === 'completed' || status === 'complete' || status === 'finished';
        });
    }, [allCertificates]);

    // Helper function to get platform name consistently
    const getPlatform = (cert: Certificate): string => cert.platform || cert.provider || cert.issuer || 'Unknown';

    // Get unique platforms for filter buttons
    const platforms = useMemo(() => {
        if (!completedCertificates || completedCertificates.length === 0) return ['all'];

        const platformSet = new Set<string>();
        completedCertificates.forEach(cert => {
            const platform = getPlatform(cert);
            if (platform && platform !== 'Unknown') {
                platformSet.add(platform);
            }
        });
        return ['all', ...Array.from(platformSet).sort()];
    }, [completedCertificates]);

    // Filter certificates by selected platform
    const certificates = useMemo(() => {
        if (!completedCertificates || completedCertificates.length === 0) return [];

        if (selectedPlatform === 'all') {
            return completedCertificates;
        }

        return completedCertificates.filter(cert => {
            const platform = getPlatform(cert);
            return platform === selectedPlatform;
        });
    }, [completedCertificates, selectedPlatform]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    if (loading) {
        return (
            <section id="certificates" className="py-20 bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <FaSpinner className="text-4xl text-cyan-400 animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="certificates" className="py-20 bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-400">
                        <p>Error loading certificates: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="certificates" className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Certificates & Achievements</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Professional certifications and accomplishments
                    </p>
                </motion.div>

                {/* Platform Filter */}
                {platforms.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-7xl mx-auto mb-12"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FaFilter className="text-cyan-400 text-lg" />
                            <h3 className="text-lg font-semibold text-white">Platform</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {platforms.map((platform) => (
                                <motion.button
                                    key={platform}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPlatform(platform)}
                                    data-tooltip-id="quick-tooltip"
                                    data-tooltip-content={platform === 'all' ? 'Show all certificates' : `Filter: ${platform} certificates only`}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${selectedPlatform === platform
                                        ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-white'
                                        }`}
                                >
                                    {platform === 'all' ? 'All' : platform}
                                    <span className="ml-2 text-xs opacity-70">
                                        (
                                        {platform === 'all'
                                            ? completedCertificates.length
                                            : completedCertificates.filter(cert => getPlatform(cert) === platform).length
                                        }
                                        )
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div
                    key={selectedPlatform}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {certificates.map((certificate, index) => {
                        const certificateImage = certificate.certificateImage;
                        const certificateLink = certificate.certificateLink;

                        return (
                            <motion.div
                                key={certificate.id || index}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all h-full flex flex-col overflow-hidden shadow-lg hover:shadow-cyan-500/20">
                                    {/* Certificate Image/Badge */}
                                    <div className="relative h-48 overflow-hidden bg-slate-900">
                                        {certificateImage ? (
                                            certificateLink ? (
                                                <a
                                                    href={certificateLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full h-full cursor-pointer group/image"
                                                    title="Click to verify certificate"
                                                >
                                                    <img
                                                        src={certificateImage}
                                                        alt={certificate.title || certificate.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm">
                                                        <FaExternalLinkAlt className="text-3xl text-white mb-2" />
                                                        <span className="text-white text-sm font-medium">View Certificate</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <>
                                                    <img
                                                        src={certificateImage}
                                                        alt={certificate.title || certificate.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                                                </>
                                            )
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-blue-500 to-cyan-500 opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity duration-500">
                                                <FaAward className="text-6xl text-slate-700/50" />
                                            </div>
                                        )}

                                        {/* Platform Badge on Image */}
                                        {(certificate.platform || certificate.provider || certificate.issuer) && (
                                            <div className="absolute top-3 left-3">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 shadow-lg">
                                                    <FaAward className="text-white text-sm" />
                                                    <span className="text-white text-xs font-semibold">
                                                        {certificate.platform || certificate.provider || certificate.issuer}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Action Link Row */}
                                        <div className="flex items-center justify-end mb-3">
                                            {/* Action Link */}
                                            <div className="flex gap-2">
                                                {certificateLink ? (
                                                    <motion.a
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        href={certificateLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                                                        aria-label="View Certificate"
                                                        data-tooltip-id="portfolio-tooltip"
                                                        data-tooltip-content="View and verify certificate - Click to open"
                                                    >
                                                        <FaExternalLinkAlt className="text-base" />
                                                    </motion.a>
                                                ) : (
                                                    <div className="p-1.5 bg-slate-700/30 rounded-lg opacity-50">
                                                        <FaExternalLinkAlt className="text-slate-600 text-base" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                            {certificate.title || certificate.name}
                                        </h3>

                                        {/* Issuer */}
                                        {certificate.issuer && certificate.issuer !== (certificate.platform || certificate.provider) && (
                                            <p className="text-cyan-400 font-medium text-sm mb-2">
                                                Issued by {certificate.issuer}
                                            </p>
                                        )}

                                        {/* Date Accomplished */}
                                        {(certificate.dateCompleted) && (
                                            <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
                                                <FaCalendar className="text-cyan-400/70 text-xs" />
                                                <span className="font-medium">
                                                    Accomplished: <span className="text-slate-300">{new Date(certificate.dateCompleted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </span>
                                                {certificate.expiryDate && (
                                                    <span className="text-slate-500 text-xs">
                                                        • Expires: {certificate.expiryDate}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Description */}
                                        {certificate.description && (
                                            <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                                {certificate.description}
                                            </p>
                                        )}

                                        {/* Credential ID and Skills */}
                                        <div className="mt-auto">
                                            {/* Credential ID */}
                                            {certificate.credentialId && (
                                                <div className="pt-3 border-t border-slate-700/50 mb-3">
                                                    {certificateLink ? (
                                                        <a
                                                            href={certificateLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group/id inline-flex items-center gap-2 text-xs hover:text-cyan-400 transition-colors"
                                                        >
                                                            <span className="text-slate-500">Credential ID:</span>
                                                            <span className="text-slate-400 font-mono group-hover/id:text-cyan-400 break-all">{certificate.credentialId}</span>
                                                            <FaExternalLinkAlt className="text-slate-600 group-hover/id:text-cyan-400 text-[10px] shrink-0" />
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs">
                                                            <span className="text-slate-500">Credential ID: </span>
                                                            <span className="text-slate-400 font-mono break-all">{certificate.credentialId}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Skills/Tags */}
                                            {certificate.skills && Array.isArray(certificate.skills) && certificate.skills.length > 0 && (
                                                <div className={`flex flex-wrap gap-1.5 ${certificate.credentialId ? '' : 'pt-3 border-t border-slate-700/50'}`}>
                                                    {certificate.skills.slice(0, 6).map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-slate-900/50 border border-slate-700 rounded hover:border-cyan-500/50 transition-colors text-[10px] text-slate-400"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {certificate.skills.length > 6 && (
                                                        <span
                                                            className="px-2 py-1 text-[10px] text-slate-500 font-medium cursor-help"
                                                            data-tooltip-id="info-tooltip"
                                                            data-tooltip-content={`More skills: ${certificate.skills.slice(6).join(', ')}`}
                                                        >
                                                            +{certificate.skills.length - 6}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {certificates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-slate-400 py-12"
                    >
                        <FaAward className="text-6xl text-slate-600 mx-auto mb-4" />
                        {completedCertificates.length === 0 ? (
                            <p className="text-lg">No certificates available</p>
                        ) : (
                            <>
                                <p className="text-lg mb-2">
                                    No certificates found matching your filter
                                </p>
                                <p className="text-sm text-slate-500 mb-4">
                                    Try selecting a different platform
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPlatform('all')}
                                    className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
                                >
                                    View All Certificates
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
