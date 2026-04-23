"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { PrintButton } from "./print-button";
import { SearchTrigger } from "./search-command";
import { Sidebar } from "./sidebar";
import type { Locale } from "@/i18n/routing";

export function Header() {
    const locale = useLocale() as Locale;
    const t = useTranslations();
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="no-print sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)]/85 px-4 backdrop-blur-md lg:px-8">
                <button
                    type="button"
                    aria-label="Menu"
                    onClick={() => setOpen(true)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] lg:hidden"
                >
                    <Menu className="h-4 w-4" />
                </button>

                <Link href={`/${locale}`} className="flex items-center gap-2.5 font-semibold tracking-tight">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-[#07090f] shadow-lg shadow-[var(--color-brand)]/20">
                        <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span className="hidden sm:inline">CYNA</span>
                    <span className="hidden text-xs font-normal text-[var(--fg-subtle)] sm:inline">· DAT/DCT</span>
                </Link>

                <div className="ml-auto flex items-center gap-2">
                    <SearchTrigger />
                    <div className="hidden md:block">
                        <LocaleSwitcher />
                    </div>
                    <div className="hidden md:block">
                        <PrintButton />
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] px-2">
                        <div className="flex items-center justify-between px-3 py-4">
                            <span className="text-sm font-semibold">Navigation</span>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setOpen(false)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--fg-muted)]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <Sidebar onNavigate={() => setOpen(false)} />
                        <div className="flex items-center gap-2 px-3 pb-6">
                            <LocaleSwitcher />
                            <PrintButton />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
