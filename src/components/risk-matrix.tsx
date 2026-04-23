"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { risks, levelOrder, levelColors, type Risk, type Level } from "@/data/risks";
import { cn } from "@/lib/utils";

type SortKey = "threat" | "impact" | "probability" | "category";

export function RiskMatrix() {
    const [query, setQuery] = useState("");
    const [cat, setCat] = useState<string>("");
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "impact", dir: -1 });
    const [selected, setSelected] = useState<Risk | null>(null);

    const categories = Array.from(new Set(risks.map((r) => r.category)));

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        let list = risks.filter((r) => {
            if (cat && r.category !== cat) return false;
            if (!q) return true;
            return (r.threat + r.prevention + r.response).toLowerCase().includes(q);
        });
        list = [...list].sort((a, b) => {
            let cmp = 0;
            if (sort.key === "impact") cmp = levelOrder[a.impact] - levelOrder[b.impact];
            else if (sort.key === "probability") cmp = levelOrder[a.probability] - levelOrder[b.probability];
            else cmp = (a[sort.key] as string).localeCompare(b[sort.key] as string);
            return cmp * sort.dir;
        });
        return list;
    }, [query, cat, sort]);

    const toggleSort = (key: SortKey) =>
        setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 }));

    return (
        <div className="my-6 space-y-6">
            {/* Heatmap */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
                    Carte de chaleur — Impact × Probabilité
                </div>
                <Heatmap />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Filtrer une menace, une mesure préventive…"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--color-brand)]"
                        />
                    </div>
                    <select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-sm outline-none"
                    >
                        <option value="">Toutes catégories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-elev)] text-left text-[0.65rem] uppercase tracking-wider text-[var(--fg-subtle)]">
                            <tr>
                                <Th label="Menace" onClick={() => toggleSort("threat")} />
                                <Th label="Impact" onClick={() => toggleSort("impact")} />
                                <Th label="Probabilité" onClick={() => toggleSort("probability")} />
                                <Th label="Catégorie" onClick={() => toggleSort("category")} className="hidden md:table-cell" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelected(r)}
                                    className="cursor-pointer border-t border-[var(--border)] transition hover:bg-[var(--color-brand)]/5"
                                >
                                    <td className="px-3 py-2 font-medium">{r.threat}</td>
                                    <td className="px-3 py-2">
                                        <Badge level={r.impact} />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge level={r.probability} />
                                    </td>
                                    <td className="hidden px-3 py-2 text-xs text-[var(--fg-muted)] md:table-cell">{r.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50" onClick={() => setSelected(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-2xl"
                    >
                        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)]">
                            {selected.category}
                        </div>
                        <h3 className="mb-4 text-xl font-semibold">{selected.threat}</h3>
                        <div className="mb-6 flex gap-4 text-xs">
                            <div>
                                <div className="text-[var(--fg-subtle)]">Impact</div>
                                <Badge level={selected.impact} />
                            </div>
                            <div>
                                <div className="text-[var(--fg-subtle)]">Probabilité</div>
                                <Badge level={selected.probability} />
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
                                Mesures préventives
                            </div>
                            <p className="text-sm text-[var(--fg)] leading-relaxed">{selected.prevention}</p>
                        </div>
                        <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
                                Plan de réponse
                            </div>
                            <p className="text-sm text-[var(--fg)] leading-relaxed">{selected.response}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Th({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
    return (
        <th className={cn("px-3 py-2", className)}>
            <button onClick={onClick} className="inline-flex items-center gap-1 font-semibold hover:text-[var(--fg)]">
                {label}
                <ArrowUpDown className="h-3 w-3" />
            </button>
        </th>
    );
}

function Badge({ level }: { level: Level }) {
    return (
        <span className={cn("inline-block rounded border px-2 py-0.5 text-[0.7rem] font-medium", levelColors[level])}>
            {level}
        </span>
    );
}

function Heatmap() {
    const impactLevels: Level[] = ["Critique", "Élevé", "Moyen", "Faible", "Très faible"];
    const probLevels: Level[] = ["Très faible", "Faible", "Moyen", "Élevé", "Critique"];

    const counts: Record<string, Risk[]> = {};
    risks.forEach((r) => {
        const key = `${r.impact}|${r.probability}`;
        counts[key] = [...(counts[key] ?? []), r];
    });

    const heat = (i: number, p: number) => {
        const score = (5 - i) * (p + 1);
        if (score >= 16) return "bg-rose-500/25 border-rose-500/50";
        if (score >= 10) return "bg-orange-500/20 border-orange-500/40";
        if (score >= 6) return "bg-amber-500/15 border-amber-500/30";
        if (score >= 3) return "bg-emerald-500/15 border-emerald-500/30";
        return "bg-emerald-500/8 border-emerald-500/20";
    };

    return (
        <div className="overflow-x-auto">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${probLevels.length}, minmax(72px, 1fr))` }}>
                <div />
                {probLevels.map((p) => (
                    <div key={p} className="text-center text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--fg-subtle)] pb-1">
                        {p}
                    </div>
                ))}
                {impactLevels.map((imp, i) => (
                    <>
                        <div key={imp} className="pr-2 text-right text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--fg-subtle)] self-center">
                            {imp}
                        </div>
                        {probLevels.map((prob, p) => {
                            const items = counts[`${imp}|${prob}`] ?? [];
                            return (
                                <div
                                    key={`${imp}-${prob}`}
                                    className={cn(
                                        "relative flex h-12 items-center justify-center rounded-md border text-sm font-bold transition",
                                        heat(i, p),
                                        items.length > 0 ? "text-[var(--fg)]" : "text-[var(--fg-subtle)]"
                                    )}
                                    title={items.map((x) => x.threat).join(", ")}
                                >
                                    {items.length || ""}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[0.65rem] text-[var(--fg-subtle)]">
                <span>← Probabilité croissante →</span>
            </div>
        </div>
    );
}
