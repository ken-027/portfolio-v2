import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    spotlightColor?: string;
}

export default function TiltCard({
    children,
    className = "",
    intensity = 6,
    spotlightColor = "rgba(6,182,212,0.08)",
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [spotlight, setSpotlight] = useState<{ x: number; y: number } | null>(null);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 40 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 40 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(x * intensity * 0.6);
        rotateX.set(-y * intensity * 0.6);
        setSpotlight({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        setSpotlight(null);
    };

    return (
        <motion.div
            ref={cardRef}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformPerspective: 700,
                transformStyle: "preserve-3d",
            }}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
                style={{
                    background: spotlight
                        ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${spotlightColor} 0%, transparent 60%)`
                        : "none",
                    opacity: spotlight ? 1 : 0,
                }}
            />
            {children}
        </motion.div>
    );
}
