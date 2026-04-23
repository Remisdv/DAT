"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: ReactNode;
}) {
    return (
        <header className="relative mb-12 border-b border-[var(--border)] pb-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {eyebrow && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--color-brand)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
                        {eyebrow}
                    </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    <span className="bg-gradient-to-br from-[var(--fg)] via-[var(--fg)] to-[var(--color-brand)] bg-clip-text text-transparent">
                        {title}
                    </span>
                </h1>
                {description && (
                    <p className="mt-4 max-w-3xl text-base text-[var(--fg-muted)] leading-relaxed">{description}</p>
                )}
            </motion.div>
        </header>
    );
}
