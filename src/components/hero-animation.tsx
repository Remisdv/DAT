"use client";

import { motion } from "framer-motion";

const dots = Array.from({ length: 12 }, (_, i) => i);

export function HeroAnimation() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {dots.map((i) => (
                <motion.div
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]"
                    initial={{
                        x: `${(i * 53) % 100}%`,
                        y: `${(i * 37) % 100}%`,
                        opacity: 0,
                    }}
                    animate={{
                        y: [`${(i * 37) % 100}%`, `${(i * 37 + 20) % 100}%`, `${(i * 37) % 100}%`],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: 6 + (i % 4),
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
