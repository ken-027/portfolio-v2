import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MousePosition {
    x: number;
    y: number;
}

interface Ripple {
    id: number;
    x: number;
    y: number;
}

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        const handleMouseDown = (e: MouseEvent) => {
            setIsClicking(true);
            // Create ripple effect on click
            const newRipple: Ripple = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            };
            setRipples((prev) => [...prev, newRipple]);

            // Remove ripple after animation
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 800);
        };

        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Add listeners to all interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, [data-tooltip]'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Main cursor dot with pulsing effect */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9999"
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            >
                <motion.div
                    className="w-3 h-3 rounded-full mix-blend-difference"
                    animate={{
                        scale: isClicking ? 0.6 : isHovering ? 0.8 : 1,
                        backgroundColor: isHovering ? '#06b6d4' : '#22d3ee',
                    }}
                    transition={{ duration: 0.15 }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-400"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 0.3, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Outer cursor ring with rotation */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-9998"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            >
                <motion.div
                    className="w-full h-full border-2 border-cyan-400/50 rounded-full mix-blend-screen"
                    animate={{
                        scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                        opacity: isHovering ? 0.8 : 0.4,
                        rotate: isHovering ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Enhanced trailing glow effect */}
            <motion.div
                className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-9997"
                animate={{
                    x: mousePosition.x - 32,
                    y: mousePosition.y - 32,
                }}
                transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                }}
            >
                <motion.div
                    className="w-full h-full rounded-full blur-2xl"
                    animate={{
                        background: isHovering
                            ? 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)'
                            : 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
                        scale: isClicking ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Click ripple effects */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        className="fixed top-0 left-0 pointer-events-none z-9996"
                        initial={{
                            x: ripple.x - 20,
                            y: ripple.y - 20,
                            scale: 0,
                            opacity: 0.6,
                        }}
                        animate={{
                            scale: 3,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                    >
                        <div className="w-10 h-10 border-2 border-cyan-400 rounded-full" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
};

export default CustomCursor;
