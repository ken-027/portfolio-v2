import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

const CustomCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [isTouchDevice] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    );

    useEffect(() => {
        if (isTouchDevice) return;

        const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

        const onDown = (e: MouseEvent) => {
            const ripple: Ripple = { id: Date.now(), x: e.clientX, y: e.clientY };
            setRipples((prev) => [...prev, ripple]);
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }, 700);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onDown);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onDown);
        };
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Subtle trailing glow */}
            <motion.div
                className="fixed top-0 left-0 w-20 h-20 pointer-events-none z-[9997]"
                animate={{ x: pos.x - 40, y: pos.y - 40 }}
                transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.3 }}
            >
                <div className="w-full h-full rounded-full bg-radial from-cyan-400/10 via-blue-500/5 to-transparent blur-xl" />
            </motion.div>

            {/* Click ripple */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        className="fixed top-0 left-0 pointer-events-none z-[9996]"
                        initial={{ x: ripple.x - 16, y: ripple.y - 16, scale: 0, opacity: 0.5 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="w-8 h-8 border border-cyan-400/60 rounded-full" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
};

export default CustomCursor;
