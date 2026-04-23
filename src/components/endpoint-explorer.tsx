"use client";

import { useMemo, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { endpoints, moduleLabels, type Endpoint, type Method, type AuthLevel } from "@/data/endpoints";
import { cn } from "@/lib/utils";

const methodColors: Record<Method, string> = {
    GET: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    POST: "text-sky-400 bg-sky-400/10 border-sky-400/30",
    PUT: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    PATCH: "text-violet-400 bg-violet-400/10 border-violet-400/30",
    DELETE: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const authColors: Record<AuthLevel, string> = {
    Public: "text-[var(--fg-subtle)] bg-[var(--bg-elev)] border-[var(--border)]",
    Auth: "text-sky-400 bg-sky-400/10 border-sky-400/30",
    Admin: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const allMethods: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const allAuths: AuthLevel[] = ["Public", "Auth", "Admin"];

export function EndpointExplorer() {
    const [query, setQuery] = useState("");
    const [methods, setMethods] = useState<Method[]>([]);
    const [auths, setAuths] = useState<AuthLevel[]>([]);
    const [module, setModule] = useState<string>("");
    const [selected, setSelected] = useState<Endpoint | null>(null);

    const filtered = useMemo(() => {
        return endpoints.filter((e) => {
            if (query && !`${e.method} ${e.path} ${e.description}`.toLowerCase().includes(query.toLowerCase())) return false;
            if (methods.length > 0 && !methods.includes(e.method)) return false;
            if (auths.length > 0 && !auths.includes(e.auth)) return false;
            if (module && e.module !== module) return false;
            return true;
        });
    }, [query, methods, auths, module]);

    const toggle = <T,>(arr: T[], set: (v: T[]) => void, v: T) => {
        set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    };

    const modules = Object.keys(moduleLabels) as Array<keyof typeof moduleLabels>;

    return (
        <div className="my-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
            {/* Search */}
            <div className="mb-4 flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filtrer par chemin, méthode ou description…"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-[var(--fg-subtle)]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Méthodes</span>
                    {allMethods.map((m) => (
                        <button
                            key={m}
                            onClick={() => toggle(methods, setMethods, m)}
                            className={cn(
                                "rounded-md border px-2 py-1 text-xs font-mono font-semibold transition",
                                methods.includes(m) ? methodColors[m] : "border-[var(--border)] text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Accès</span>
                    {allAuths.map((a) => (
                        <button
                            key={a}
                            onClick={() => toggle(auths, setAuths, a)}
                            className={cn(
                                "rounded-md border px-2.5 py-1 text-xs font-medium transition",
                                auths.includes(a) ? authColors[a] : "border-[var(--border)] text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                            )}
                        >
                            @{a}
                        </button>
                    ))}
                    <select
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                        className="ml-auto rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1 text-xs outline-none"
                    >
                        <option value="">Tous les modules</option>
                        {modules.map((m) => (
                            <option key={m} value={m}>
                                {moduleLabels[m]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Count */}
            <div className="mb-2 text-xs text-[var(--fg-subtle)]">
                <span className="font-semibold text-[var(--fg)]">{filtered.length}</span> / {endpoints.length} endpoints
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                    <thead className="bg-[var(--bg-elev)] text-left text-[0.65rem] uppercase tracking-wider text-[var(--fg-subtle)]">
                        <tr>
                            <th className="px-3 py-2 font-semibold">Méthode</th>
                            <th className="px-3 py-2 font-semibold">Route</th>
                            <th className="px-3 py-2 font-semibold">Accès</th>
                            <th className="hidden px-3 py-2 font-semibold md:table-cell">Module</th>
                            <th className="hidden px-3 py-2 font-semibold lg:table-cell">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((e, i) => (
                            <tr
                                key={i}
                                onClick={() => setSelected(e)}
                                className="cursor-pointer border-t border-[var(--border)] transition hover:bg-[var(--color-brand)]/5"
                            >
                                <td className="px-3 py-2">
                                    <span className={cn("inline-block rounded border px-1.5 py-0.5 font-mono text-xs font-bold", methodColors[e.method])}>
                                        {e.method}
                                    </span>
                                </td>
                                <td className="px-3 py-2 font-mono text-xs text-[var(--fg)]">{e.path}</td>
                                <td className="px-3 py-2">
                                    <span className={cn("inline-block rounded border px-1.5 py-0.5 text-[0.7rem] font-medium", authColors[e.auth])}>
                                        @{e.auth}
                                    </span>
                                </td>
                                <td className="hidden px-3 py-2 text-xs text-[var(--fg-muted)] md:table-cell">{moduleLabels[e.module]}</td>
                                <td className="hidden px-3 py-2 text-xs text-[var(--fg-muted)] lg:table-cell">{e.description}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-8 text-center text-sm text-[var(--fg-subtle)]">
                                    Aucun endpoint ne correspond aux filtres actifs.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail drawer */}
            {selected && (
                <div className="fixed inset-0 z-50" onClick={() => setSelected(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-2xl"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <span className={cn("rounded border px-2 py-0.5 font-mono text-sm font-bold", methodColors[selected.method])}>
                                {selected.method}
                            </span>
                            <button onClick={() => setSelected(null)} className="text-[var(--fg-subtle)] hover:text-[var(--fg)]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <h3 className="mb-4 break-all font-mono text-base text-[var(--fg)]">{selected.path}</h3>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Description</dt>
                                <dd className="mt-1 text-[var(--fg)]">{selected.description}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Accès</dt>
                                <dd className="mt-1">
                                    <span className={cn("inline-block rounded border px-2 py-0.5 text-xs font-medium", authColors[selected.auth])}>
                                        @{selected.auth}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Module</dt>
                                <dd className="mt-1 text-[var(--fg-muted)]">{moduleLabels[selected.module]}</dd>
                            </div>
                            {selected.codes && (
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Codes HTTP</dt>
                                    <dd className="mt-1 font-mono text-xs text-[var(--fg-muted)]">{selected.codes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
}
