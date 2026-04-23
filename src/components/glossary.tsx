"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { glossary } from "@/data/glossary";

export function Glossary() {
    const [q, setQ] = useState("");
    const filtered = useMemo(() => {
        const s = q.toLowerCase();
        return glossary.filter((g) => !s || g.term.toLowerCase().includes(s) || g.definition.toLowerCase().includes(s));
    }, [q]);

    return (
        <div className="my-6">
            <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un terme technique…"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--color-brand)]"
                />
            </div>
            <dl className="grid gap-3 md:grid-cols-2">
                {filtered.map((g) => (
                    <div
                        key={g.term}
                        className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-brand)]/50 hover:shadow-lg hover:shadow-[var(--color-brand)]/10"
                    >
                        <dt className="mb-1.5 font-mono text-sm font-bold text-[var(--color-brand)]">{g.term}</dt>
                        <dd className="text-xs text-[var(--fg-muted)] leading-relaxed">{g.definition}</dd>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--fg-subtle)]">
                        Aucun terme trouvé.
                    </div>
                )}
            </dl>
        </div>
    );
}
