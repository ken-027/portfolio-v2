import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaRobot, FaGithub, FaCode } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { chatStream } from '../services/api';

import 'highlight.js/styles/github-dark.css';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    agent?: 'portfolio' | 'github';
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [agent, setAgent] = useState<'portfolio' | 'github'>('portfolio');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: 'Hi! I\'m here to help you learn more about this portfolio. You can ask me about experiences, projects, skills, or switch to GitHub mode to explore repositories!',
            timestamp: new Date(),
            agent: 'portfolio'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleAgentSwitch = (newAgent: 'portfolio' | 'github') => {
        setAgent(newAgent);
        const welcomeMessage = newAgent === 'portfolio'
            ? 'Switched to Portfolio mode! Ask me about experiences, projects, skills, or anything related to this portfolio.'
            : 'Switched to GitHub mode! I can help you explore GitHub repositories, check code, and answer development questions.';

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'bot',
            content: welcomeMessage,
            timestamp: new Date(),
            agent: newAgent
        }]);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const reader = await chatStream(inputMessage, agent);
            let botResponse = '';

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: '',
                timestamp: new Date(),
                agent: agent
            };

            setMessages(prev => [...prev, botMessage]);

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botResponse += chunk;

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === botMessage.id
                            ? { ...msg, content: botResponse }
                            : msg
                    )
                );
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
                timestamp: new Date(),
                agent: agent
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-[transform,box-shadow] duration-300 flex items-center justify-center ${isOpen ? 'rotate-180' : ''
                    }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}

                {/* Pulse animation when closed */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ opacity: 0.3 }}
                    />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700/50 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <FaRobot className="text-cyan-400" />
                                    AI Assistant
                                </h3>
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() => handleAgentSwitch('portfolio')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-[color,background-color,box-shadow] ${agent === 'portfolio'
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-400'
                                            }`}
                                    >
                                        <FaCode className="inline mr-1" />
                                        Portfolio
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleAgentSwitch('github')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-[color,background-color,box-shadow] ${agent === 'github'
                                            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
                                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-purple-400'
                                            }`}
                                    >
                                        <FaGithub className="inline mr-1" />
                                        GitHub
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">
                                Currently in <span className={`font-medium ${
                                    agent === 'github' ? 'text-purple-400' : 'text-cyan-400'
                                }`}>{agent}</span> mode
                            </p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {message.type === 'bot' && (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                message.agent === 'github'
                                                    ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                            }`}>
                                                {message.agent === 'github' ? (
                                                    <FaGithub className="text-white text-sm" />
                                                ) : (
                                                    <FaCode className="text-white text-sm" />
                                                )}
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                                : 'bg-slate-700/50 text-slate-100 border border-slate-600/50'
                                                }`}
                                        >
                                            {message.type === 'user' ? (
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            ) : (
                                                <div className="markdown-content">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeHighlight]}
                                                        components={{
                                                            code: ({ inline, className, children, ...props }: any) => {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return !inline && match ? (
                                                                    <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2">
                                                                        <code className={className} {...props}>
                                                                            {children}
                                                                        </code>
                                                                    </pre>
                                                                ) : (
                                                                    <code
                                                                        className="bg-slate-700 px-1 py-0.5 rounded text-cyan-300"
                                                                        {...props}
                                                                    >
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                            p: ({ children }: any) => (
                                                                <p className="mb-2 last:mb-0">{children}</p>
                                                            ),
                                                            ul: ({ children }: any) => (
                                                                <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                                                            ),
                                                            ol: ({ children }: any) => (
                                                                <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                                                            ),
                                                            li: ({ children }: any) => (
                                                                <li className="text-slate-200">{children}</li>
                                                            ),
                                                            h1: ({ children }: any) => (
                                                                <h1 className="text-lg font-bold mb-2 text-cyan-300">{children}</h1>
                                                            ),
                                                            h2: ({ children }: any) => (
                                                                <h2 className="text-md font-bold mb-2 text-cyan-300">{children}</h2>
                                                            ),
                                                            h3: ({ children }: any) => (
                                                                <h3 className="text-sm font-bold mb-2 text-cyan-300">{children}</h3>
                                                            ),
                                                            strong: ({ children }: any) => (
                                                                <strong className="font-bold text-cyan-300">{children}</strong>
                                                            ),
                                                            em: ({ children }: any) => (
                                                                <em className="italic text-cyan-300">{children}</em>
                                                            ),
                                                            blockquote: ({ children }: any) => (
                                                                <blockquote className="border-l-4 border-cyan-500 pl-4 my-2 text-slate-300 italic">
                                                                    {children}
                                                                </blockquote>
                                                            ),
                                                            a: ({ href, children }: any) => (
                                                                <a
                                                                    href={href}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-cyan-400 hover:text-cyan-300 underline"
                                                                >
                                                                    {children}
                                                                </a>
                                                            ),
                                                        }}
                                                    >
                                                        {message.content || ''}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                            <p className="text-xs opacity-60 mt-1">
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {message.type === 'user' && (
                                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaUser className="text-slate-300 text-sm" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        agent === 'github'
                                            ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`}>
                                        {agent === 'github' ? (
                                            <FaGithub className="text-white text-sm" />
                                        ) : (
                                            <FaCode className="text-white text-sm" />
                                        )}
                                    </div>
                                    <div className="bg-slate-700/50 border border-slate-600/50 p-3 rounded-2xl">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${
                                                        agent === 'github' ? 'bg-purple-400' : 'bg-cyan-400'
                                                    }`}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        delay: i * 0.1
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-slate-700/50 p-4">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Ask me about ${agent === 'portfolio' ? 'projects, skills, experience...' : 'GitHub repos, code, development...'}`}
                                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    disabled={isLoading}
                                />
                                <motion.button
                                    onClick={handleSendMessage}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-[opacity,box-shadow] hover:shadow-lg"
                                >
                                    <FaPaperPlane className="text-sm" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
