import { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaAward, FaExternalLinkAlt, FaCalendar, FaSpinner } from 'react-icons/fa';
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

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
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
        <section id="certificates" className="py-12 bg-gradient-to-b from-slate-950/30 to-transparent">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent">
                            Certificates & Achievements
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        Professional certifications that validate expertise and continuous learning
                    </p>
                </motion.div>

                {/* Platform Filter */}
                {platforms.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50">
                            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                                Platform
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map((platform) => (
                                    <motion.button
                                        key={platform}
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedPlatform(platform)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 capitalize ${selectedPlatform === platform
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-blue-500/30 hover:text-white hover:bg-slate-800/80'
                                            }`}
                                    >
                                        {platform === 'all' ? 'All' : platform}
                                        <span className="ml-1.5 text-[10px] opacity-80 bg-black/20 px-1.5 py-0.5 rounded-full">
                                            {platform === 'all'
                                                ? completedCertificates.length
                                                : completedCertificates.filter(cert => getPlatform(cert) === platform).length
                                            }
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    key={selectedPlatform}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    {certificates.map((certificate, index) => {
                        const certificateImage = certificate.certificateImage;
                        const certificateLink = certificate.certificateLink;

                        return (
                            <motion.div
                                key={certificate.id || index}
                                variants={itemVariants}
                                whileHover={{ y: -12, scale: 1.02 }}
                                className="group"
                            >
                                <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-blue-400/40 transition-all duration-500 h-full flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                                    {/* Certificate Image/Badge */}
                                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
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
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-slate-900/70 backdrop-blur-sm">
                                                        <FaExternalLinkAlt className="text-2xl text-white mb-2" />
                                                        <span className="text-white text-xs font-semibold">View Certificate</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <>
                                                    <img
                                                        src={certificateImage}
                                                        alt={certificate.title || certificate.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                                                </>
                                            )
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-15 flex items-center justify-center group-hover:opacity-25 transition-all duration-500">
                                                <FaAward className="text-5xl text-slate-600/40 group-hover:text-slate-500/60 transition-colors duration-500" />
                                            </div>
                                        )}

                                        {/* Platform Badge on Image */}
                                        {(certificate.platform || certificate.provider || certificate.issuer) && (
                                            <div className="absolute top-2 left-2">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg backdrop-blur-sm">
                                                    <FaAward className="text-white text-xs" />
                                                    <span className="text-white text-[10px] font-bold tracking-wide">
                                                        {certificate.platform || certificate.provider || certificate.issuer}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Action Link Row */}


                                        <div className="flex items-center justify-between">
                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 leading-tight">
                                                {certificate.title || certificate.name}
                                            </h3>

                                            <div className="flex items-center justify-end gap-4 mb-3">
                                                {/* Action Link */}
                                                <div className="flex gap-2">
                                                    {certificateLink ? (
                                                        <motion.a
                                                            whileHover={{ scale: 1.1, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={certificateLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/40"
                                                            aria-label="View Certificate"
                                                        >
                                                            <FaExternalLinkAlt className="text-sm" />
                                                        </motion.a>
                                                    ) : (
                                                        <div className="p-2 bg-slate-700/30 rounded-lg opacity-40 border border-slate-700/30">
                                                            <FaExternalLinkAlt className="text-slate-600 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Issuer */}
                                        {certificate.issuer && certificate.issuer !== (certificate.platform || certificate.provider) && (
                                            <p className="text-cyan-400 font-semibold text-sm mb-2">
                                                Issued by {certificate.issuer}
                                            </p>
                                        )}

                                        {/* Date Accomplished */}
                                        {(certificate.dateCompleted) && (
                                            <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
                                                <div className="p-1 bg-cyan-500/10 rounded">
                                                    <FaCalendar className="text-cyan-400 text-xs" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-300 text-xs">
                                                        {new Date(certificate.dateCompleted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    {certificate.expiryDate && (
                                                        <span className="text-slate-500 text-[10px]">
                                                            Expires: {certificate.expiryDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        {certificate.description && (
                                            <p className="text-slate-300 text-sm leading-relaxed mb-3 flex-1 line-clamp-2">
                                                {certificate.description}
                                            </p>
                                        )}

                                        {/* Credential ID and Skills */}
                                        <div className="mt-auto">
                                            {/* Credential ID */}
                                            {certificate.credentialId && (
                                                <div className="pt-3 border-t border-slate-700/30 mb-3">
                                                    {certificateLink ? (
                                                        <a
                                                            href={certificateLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group/id inline-flex items-center gap-1.5 text-xs hover:text-cyan-400 transition-colors duration-300"
                                                        >
                                                            <span className="text-slate-500 font-medium">ID:</span>
                                                            <span className="text-slate-400 font-mono group-hover/id:text-cyan-400 break-all text-[10px] bg-slate-900/30 px-1.5 py-0.5 rounded">{certificate.credentialId}</span>
                                                            <FaExternalLinkAlt className="text-slate-600 group-hover/id:text-cyan-400 text-[10px] shrink-0" />
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <span className="text-slate-500 font-medium">ID:</span>
                                                            <span className="text-slate-400 font-mono break-all text-[10px] bg-slate-900/30 px-1.5 py-0.5 rounded">{certificate.credentialId}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Skills/Tags */}
                                            {certificate.skills && Array.isArray(certificate.skills) && certificate.skills.length > 0 && (
                                                <div className={`${certificate.credentialId ? '' : 'pt-3 border-t border-slate-700/30'}`}>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {certificate.skills.slice(0, 5).map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-slate-900/40 border border-slate-700/40 rounded-full hover:border-cyan-500/40 transition-all duration-300 text-[10px] text-slate-400 font-medium"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {certificate.skills.length > 5 && (
                                                            <span
                                                                className="px-2 py-1 text-[10px] text-slate-500 font-medium cursor-help bg-slate-900/20 rounded-full border border-slate-700/30"
                                                                data-tooltip-id="info-tooltip"
                                                                data-tooltip-content={`More skills: ${certificate.skills.slice(5).join(', ')}`}
                                                            >
                                                                +{certificate.skills.length - 5}
                                                            </span>
                                                        )}
                                                    </div>
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-slate-400 py-8"
                    >
                        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 max-w-sm mx-auto">
                            <FaAward className="text-4xl text-slate-600/60 mx-auto mb-3" />
                            {completedCertificates.length === 0 ? (
                                <p className="text-base font-medium">No certificates available</p>
                            ) : (
                                <>
                                    <p className="text-base font-medium mb-2">
                                        No certificates found
                                    </p>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Try selecting a different platform
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedPlatform('all')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-lg text-white transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 text-sm"
                                    >
                                        View All Certificates
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

export default Certificates;
