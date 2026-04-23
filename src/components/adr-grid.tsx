"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { adrs, type ADR } from "@/data/adr";

export function AdrGrid() {
    const [open, setOpen] = useState<ADR | null>(null);
    return (
        <>
            <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {adrs.map((adr, i) => (
                    <motion.button
                        key={adr.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.35, delay: i * 0.04 }}
                        onClick={() => setOpen(adr)}
                        className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-brand)]/5"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded bg-[var(--color-brand)]/10 px-2 py-0.5 font-mono text-xs font-bold text-[var(--color-brand)]">
                                {adr.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" />
                                {adr.status}
                            </span>
                        </div>
                        <h3 className="text-base font-semibold leading-snug text-[var(--fg)]">{adr.title}</h3>
                        <p className="text-xs text-[var(--fg-muted)] line-clamp-3">{adr.decision}</p>
                        <span className="mt-auto text-xs font-medium text-[var(--color-brand)] opacity-0 transition group-hover:opacity-100">
                            Voir le détail →
                        </span>
                    </motion.button>
                ))}
            </div>

            <Dialog.Root open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-2xl">
                        {open && (
                            <>
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded bg-[var(--color-brand)]/15 px-2.5 py-1 font-mono text-sm font-bold text-[var(--color-brand)]">
                                            {open.id}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {open.status}
                                        </span>
                                    </div>
                                    <Dialog.Close className="text-[var(--fg-subtle)] hover:text-[var(--fg)]">
                                        <X className="h-5 w-5" />
                                    </Dialog.Close>
                                </div>
                                <Dialog.Title className="mb-6 text-xl font-semibold">{open.title}</Dialog.Title>
                                <div className="space-y-5 text-sm leading-relaxed">
                                    <Section title="Contexte" text={open.context} accent="--color-brand-2" />
                                    <Section title="Décision" text={open.decision} accent="--color-brand" />
                                    <Section title="Conséquences" text={open.consequences} accent="--color-accent" />
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}

function Section({ title, text, accent }: { title: string; text: string; accent: string }) {
    return (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(${accent})` }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
                    {title}
                </span>
            </div>
            <p className="text-[var(--fg)]">{text}</p>
        </div>
    );
}
