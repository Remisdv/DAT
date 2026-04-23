"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { navSections, buildHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LucideKey = keyof typeof Icons;

function Icon({ name }: { name?: string }) {
    if (!name) return null;
    const key = name
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join("") as LucideKey;
    const Cmp = Icons[key] as React.ComponentType<{ className?: string }> | undefined;
    if (!Cmp) return null;
    return <Cmp className="h-4 w-4" />;
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const locale = useLocale() as Locale;
    const t = useTranslations();

    return (
        <nav className="flex flex-col gap-6 py-6 pr-4 text-sm">
            {navSections.map((section) => (
                <div key={section.titleKey} className="flex flex-col gap-1">
                    <div className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
                        {t(section.titleKey)}
                    </div>
                    {section.items.map((item) => {
                        const href = buildHref(locale, item.href);
                        const isActive =
                            pathname === href ||
                            pathname === href + "/" ||
                            (item.href !== "" && pathname?.startsWith(href + "/"));
                        return (
                            <Link
                                key={item.key}
                                href={href}
                                onClick={onNavigate}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2 transition",
                                    isActive
                                        ? "bg-[var(--color-brand)]/12 text-[var(--color-brand)] font-medium"
                                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elev)]"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-7 w-7 items-center justify-center rounded-md border transition",
                                        isActive
                                            ? "border-[var(--color-brand)]/40 bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                                            : "border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-subtle)] group-hover:text-[var(--fg)]"
                                    )}
                                >
                                    <Icon name={item.icon} />
                                </span>
                                <span className="truncate">{t(item.key)}</span>
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
