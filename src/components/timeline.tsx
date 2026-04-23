"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type TimelineStep = {
    title: string;
    description: ReactNode;
    actor?: string;
    icon?: ReactNode;
};

export function Timeline({ steps }: { steps: TimelineStep[] }) {
    return (
        <ol className="relative my-8 border-l-2 border-dashed border-[var(--border)] pl-8">
            {steps.map((step, i) => (
                <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative mb-8 last:mb-0"
                >
                    <span
                        className={cn(
                            "absolute -left-[2.35rem] flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-brand)] bg-[var(--bg)] text-sm font-bold text-[var(--color-brand)]",
                            "shadow-lg shadow-[var(--color-brand)]/10"
                        )}
                    >
                        {step.icon ?? i + 1}
                    </span>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--color-brand)]/40">
                        {step.actor && (
                            <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--color-brand)]">
                                {step.actor}
                            </div>
                        )}
                        <h4 className="mb-2 text-base font-semibold">{step.title}</h4>
                        <div className="text-sm text-[var(--fg-muted)] leading-relaxed">{step.description}</div>
                    </div>
                </motion.li>
            ))}
        </ol>
    );
}
