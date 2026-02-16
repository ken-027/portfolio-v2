import { useState, useEffect, useRef } from "react";
import {
    FaComments,
    FaTimes,
    FaPaperPlane,
    FaUser,
    FaRobot,
    FaGithub,
    FaCode,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type ChatMode = "personal" | "portfolio" | null;

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getWelcomeMessage = (mode: ChatMode): string => {
        if (mode === "personal") {
            return "Hi! I'm Kenneth's personal assistant. Feel free to ask me about Kenneth's background, interests, hobbies, or anything personal!";
        } else if (mode === "portfolio") {
            return "Hello! I'm here to help you explore Kenneth's portfolio and GitHub projects. Ask me about his technical skills, projects, or code!";
        }
        return "";
    };

    const handleModeSelect = (mode: ChatMode) => {
        setChatMode(mode);
        const welcomeMsg: Message = {
            id: Date.now().toString(),
            text: getWelcomeMessage(mode),
            sender: "bot",
            timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
    };

    const getBotResponse = (userMessage: string, mode: ChatMode): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (mode === "personal") {
            // Personal mode responses
            if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
                return "Hello! I'm here to tell you all about Kenneth. What would you like to know?";
            } else if (lowerMessage.includes("hobby") || lowerMessage.includes("hobbies")) {
                return "Kenneth enjoys coding, learning new technologies, and contributing to open-source projects. He's passionate about problem-solving and building innovative solutions!";
            } else if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
                return "Kenneth is based in Allen, Northern Samar, Philippines. He's open to remote opportunities worldwide!";
            } else if (lowerMessage.includes("contact") || lowerMessage.includes("email")) {
                return "You can reach Kenneth at keanolida7296@gmail.com or connect with him on LinkedIn!";
            } else if (lowerMessage.includes("education") || lowerMessage.includes("study")) {
                return "Kenneth has a strong background in software development and is always learning new technologies to stay current in the field.";
            } else if (lowerMessage.includes("interest") || lowerMessage.includes("passionate")) {
                return "Kenneth is passionate about full-stack development, AI/ML, cloud technologies, and creating impactful software solutions!";
            } else {
                return "That's an interesting question! Kenneth is a dedicated software developer with a passion for technology. Feel free to ask me more specific questions about his background, education, or interests!";
            }
        } else if (mode === "portfolio") {
            // Portfolio/GitHub mode responses
            if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
                return "Hi! Ready to explore Kenneth's technical work? Ask me about his projects, skills, or GitHub repositories!";
            } else if (lowerMessage.includes("skill") || lowerMessage.includes("technology")) {
                return "Kenneth is proficient in React, TypeScript, Node.js, Python, Docker, and many other modern technologies. Check out the Skills section for a complete list!";
            } else if (lowerMessage.includes("project") || lowerMessage.includes("portfolio")) {
                return "Kenneth has worked on various projects including web applications, APIs, and cloud solutions. You can view his projects in the Projects section or visit his GitHub profile!";
            } else if (lowerMessage.includes("github") || lowerMessage.includes("repository")) {
                return "You can find Kenneth's code and projects on GitHub at github.com/ken-027. He actively contributes to open-source and maintains several repositories!";
            } else if (lowerMessage.includes("experience") || lowerMessage.includes("work")) {
                return "Kenneth has experience in full-stack development, DevOps, and cloud technologies. Check the Experience section for detailed information about his professional journey!";
            } else if (lowerMessage.includes("language") || lowerMessage.includes("programming")) {
                return "Kenneth works with JavaScript/TypeScript, Python, Go, and more. He's experienced in both frontend and backend development!";
            } else if (lowerMessage.includes("framework") || lowerMessage.includes("library")) {
                return "Kenneth uses React, Next.js, Express, FastAPI, and other modern frameworks. He's always exploring new technologies to build better solutions!";
            } else {
                return "Great question! Kenneth has extensive experience in software development. You can explore his projects, check his GitHub, or ask me specific questions about his technical skills!";
            }
        }
        return "I'm not sure how to answer that. Could you please rephrase your question?";
    };

    const handleSendMessage = () => {
        if (!inputText.trim() || !chatMode) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputText, chatMode),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset chat after closing animation
        setTimeout(() => {
            setChatMode(null);
            setMessages([]);
        }, 300);
    };

    const handleBack = () => {
        setChatMode(null);
        setMessages([]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
                        aria-label="Open chat"
                    >
                        <FaComments className="text-2xl" />
                        
                        {/* Pulse indicator */}
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Chat Window */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-linear-to-r from-cyan-500 to-blue-500 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {chatMode && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleBack}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            ←
                                        </motion.button>
                                    )}
                                    <FaRobot className="text-2xl text-white" />
                                    <div>
                                        <h3 className="text-white font-bold">
                                            {chatMode === "personal"
                                                ? "Personal Assistant"
                                                : chatMode === "portfolio"
                                                ? "Portfolio Assistant"
                                                : "Kenneth's Assistant"}
                                        </h3>
                                        <p className="text-white/80 text-xs">
                                            {chatMode ? "Online" : "Select a mode"}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </motion.button>
                            </div>

                            {/* Content Area */}
                            {!chatMode ? (
                                // Mode Selection
                                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-center mb-4"
                                    >
                                        <h4 className="text-xl font-bold text-white mb-2">
                                            How can I help you?
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Choose an interaction mode
                                        </p>
                                    </motion.div>

                                    {/* Personal Mode Button */}
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleModeSelect("personal")}
                                        className="w-full p-6 bg-linear-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all">
                                                <FaUser className="text-2xl text-purple-400" />
                                            </div>
                                            <div className="text-left">
                                                <h5 className="text-white font-bold text-lg mb-1">
                                                    Personal
                                                </h5>
                                                <p className="text-slate-400 text-sm">
                                                    Learn about Kenneth's background, interests, and more
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    {/* Portfolio/GitHub Mode Button */}
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleModeSelect("portfolio")}
                                        className="w-full p-6 bg-linear-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-all">
                                                <FaGithub className="text-2xl text-cyan-400" />
                                            </div>
                                            <div className="text-left">
                                                <h5 className="text-white font-bold text-lg mb-1">
                                                    Portfolio / GitHub
                                                </h5>
                                                <p className="text-slate-400 text-sm">
                                                    Explore projects, skills, and technical expertise
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            ) : (
                                // Chat Interface
                                <>
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((message, index) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`flex gap-3 ${
                                                    message.sender === "user"
                                                        ? "flex-row-reverse"
                                                        : "flex-row"
                                                }`}
                                            >
                                                {/* Avatar */}
                                                <div
                                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                        message.sender === "user"
                                                            ? "bg-linear-to-br from-cyan-500 to-blue-500"
                                                            : chatMode === "personal"
                                                            ? "bg-linear-to-br from-purple-500 to-pink-500"
                                                            : "bg-linear-to-br from-cyan-500 to-blue-500"
                                                    }`}
                                                >
                                                    {message.sender === "user" ? (
                                                        <FaUser className="text-white text-xs" />
                                                    ) : chatMode === "personal" ? (
                                                        <FaUser className="text-white text-xs" />
                                                    ) : (
                                                        <FaCode className="text-white text-xs" />
                                                    )}
                                                </div>

                                                {/* Message Bubble */}
                                                <div
                                                    className={`max-w-[75%] p-3 rounded-2xl ${
                                                        message.sender === "user"
                                                            ? "bg-linear-to-br from-cyan-500 to-blue-500 text-white"
                                                            : "bg-slate-800/50 text-slate-200 border border-slate-700/50"
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed">
                                                        {message.text}
                                                    </p>
                                                    <span className="text-xs opacity-60 mt-1 block">
                                                        {message.timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Typing Indicator */}
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                <div
                                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                        chatMode === "personal"
                                                            ? "bg-linear-to-br from-purple-500 to-pink-500"
                                                            : "bg-linear-to-br from-cyan-500 to-blue-500"
                                                    }`}
                                                >
                                                    {chatMode === "personal" ? (
                                                        <FaUser className="text-white text-xs" />
                                                    ) : (
                                                        <FaCode className="text-white text-xs" />
                                                    )}
                                                </div>
                                                <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-2xl">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-slate-800/30 border-t border-slate-800/50">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleSendMessage}
                                                disabled={!inputText.trim()}
                                                className="px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/30"
                                            >
                                                <FaPaperPlane />
                                            </motion.button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
