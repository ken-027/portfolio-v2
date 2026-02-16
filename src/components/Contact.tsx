import { ChangeEvent, FormEvent, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    FaEnvelope,
    FaUser,
    FaPaperPlane,
    FaCheckCircle,
    FaExclamationCircle,
    FaSpinner,
} from 'react-icons/fa';
import { contactInformation, socials } from '../config/socials';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const Contact = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Replace this with your actual API endpoint
            // const response = await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });

            // Simulating API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setErrors({});

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <section id="contact" className="py-20 bg-slate-900/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Get In Touch</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Have a project in mind or want to collaborate? Feel free to reach out!
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Contact Info Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

                            <div className="space-y-4">
                                {Object.keys(contactInformation).map((contactInfo: any, index: number) => {
                                    const contactInfoData = contactInformation[contactInfo as keyof typeof contactInformation];
                                    const Icon = contactInfoData.icon;

                                    return (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg">
                                                <Icon className="text-white text-lg" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">{contactInfoData.name}</p>
                                                {contactInfoData.link ? (
                                                    <a
                                                        href={contactInfoData.link}
                                                        className="text-white font-medium hover:text-cyan-400 transition-colors"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {contactInfoData.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-white font-medium">{contactInfoData.value}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                    Follow Me
                                </h4>
                                <div className="flex gap-3">
                                    {Object.keys(socials).filter((socialKey: any) => ["github", "linkedin"].includes(socialKey)).map((socialKey: any, index: number) => {
                                        const socialData = socials[socialKey as keyof typeof socials];
                                        const Icon = socialData.icon;

                                        return (
                                            <motion.a
                                                key={index}
                                                whileHover={{ scale: 1.1, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                                href={socialData.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={socialData.name}
                                                className="p-3 bg-slate-700/50 rounded-lg hover:bg-linear-to-br hover:from-cyan-500 hover:to-blue-500 text-slate-300 hover:text-white transition-all"
                                            >
                                                <Icon className="text-xl" />
                                            </motion.a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                            Your Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaUser className="text-slate-500" />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border ${errors.name ? 'border-red-500/50' : 'border-slate-700'
                                                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <FaExclamationCircle className="text-xs" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Your Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaEnvelope className="text-slate-500" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border ${errors.email ? 'border-red-500/50' : 'border-slate-700'
                                                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <FaExclamationCircle className="text-xs" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-slate-900/50 border ${errors.subject ? 'border-red-500/50' : 'border-slate-700'
                                            } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                                        placeholder="What's this about?"
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                            <FaExclamationCircle className="text-xs" />
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className={`w-full px-4 py-3 bg-slate-900/50 border ${errors.message ? 'border-red-500/50' : 'border-slate-700'
                                            } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none`}
                                        placeholder="Tell me about your project..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                            <FaExclamationCircle className="text-xs" />
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-between">
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        className={`px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center gap-2 ${isSubmitting
                                            ? 'bg-slate-700 cursor-not-allowed'
                                            : 'bg-linear-to-r from-blue-500 to-cyan-500 hover:shadow-cyan-500/50'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Send Message
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Success/Error Messages */}
                                    {submitStatus === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 text-green-400"
                                        >
                                            <FaCheckCircle />
                                            <span className="text-sm font-medium">Message sent successfully!</span>
                                        </motion.div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 text-red-400"
                                        >
                                            <FaExclamationCircle />
                                            <span className="text-sm font-medium">Failed to send. Please try again.</span>
                                        </motion.div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
