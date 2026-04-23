"use client";

import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { navSections, buildHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";
import { searchIndex } from "@/data/search-index";

export function SearchTrigger() {
    const [open, setOpen] = useState(false);
    const t = useTranslations();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if ((e.target as HTMLElement)?.tagName === "INPUT") return;
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="no-print inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-xs text-[var(--fg-muted)] transition hover:text-[var(--fg)] hover:border-[var(--color-brand)] min-w-[12rem]"
            >
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{t("search.shortcut")}</span>
                <kbd className="hidden rounded bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--fg-subtle)] md:inline">
                    Ctrl K
                </kbd>
            </button>
            <SearchDialog open={open} onOpenChange={setOpen} />
        </>
    );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    const router = useRouter();
    const locale = useLocale() as Locale;
    const t = useTranslations();
    const [q, setQ] = useState("");

    const results = q
        ? searchIndex
            .filter(
                (item) =>
                    item.title.toLowerCase().includes(q.toLowerCase()) ||
                    item.keywords.some((k) => k.toLowerCase().includes(q.toLowerCase()))
            )
            .slice(0, 15)
        : [];

    const navItems = navSections.flatMap((s) => s.items);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-[15%] z-50 w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                    <Dialog.Title className="sr-only">Recherche</Dialog.Title>
                    <Command shouldFilter={false} className="flex flex-col">
                        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                            <Search className="h-4 w-4 text-[var(--fg-subtle)]" />
                            <Command.Input
                                value={q}
                                onValueChange={setQ}
                                placeholder={t("search.placeholder")}
                                className="flex h-12 w-full border-0 bg-transparent text-sm outline-none placeholder:text-[var(--fg-subtle)]"
                            />
                        </div>
                        <Command.List className="max-h-[60vh] overflow-auto p-2">
                            <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--fg-subtle)]">
                                {t("search.empty")}
                            </Command.Empty>

                            {!q && (
                                <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]">
                                    {navItems.map((item) => (
                                        <Command.Item
                                            key={item.key}
                                            value={item.key}
                                            onSelect={() => {
                                                router.push(buildHref(locale, item.href));
                                                onOpenChange(false);
                                            }}
                                            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-[var(--color-brand)]/12 aria-selected:text-[var(--color-brand)]"
                                        >
                                            <ArrowRight className="h-3.5 w-3.5" />
                                            {t(item.key)}
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}

                            {q && results.length > 0 && (
                                <Command.Group heading="Résultats" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]">
                                    {results.map((r) => (
                                        <Command.Item
                                            key={r.href + r.title}
                                            value={r.title}
                                            onSelect={() => {
                                                router.push(`/${locale}/${r.href}`);
                                                onOpenChange(false);
                                            }}
                                            className="flex cursor-pointer flex-col items-start rounded-md px-3 py-2 text-sm aria-selected:bg-[var(--color-brand)]/12"
                                        >
                                            <span className="font-medium">{r.title}</span>
                                            <span className="text-xs text-[var(--fg-subtle)]">{r.section}</span>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}
                        </Command.List>
                    </Command>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
